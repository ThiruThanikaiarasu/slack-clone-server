const mongoose = require("mongoose");
const channelModel = require("../models/channelModel")
const userModel = require("../models/userModel")
const workspaceModel = require("../models/workspaceModel")

const { ObjectId } = mongoose.Types;

const authenticateUser = (request, response) => {
    response.status(200).send({ message: 'Authenticated'})
}

const createANewWorkspace = async (request, response) => {
    const { companyName, firstName, firstChannel } = request.body
    const user = request.user._id
    try{
        const newWorkspace = new workspaceModel({
            title: companyName,
            createdBy: user,
            admins: user,
        })

        const newChannel = new channelModel({
            title: firstChannel,
            workspace: newWorkspace._id,
            createdBy: user,
            admins: user,
            members: user
        })

        const generalChannel = new channelModel({
            title: 'general',
            workspace: newWorkspace._id,
            createdBy: user,
            admins: user,
            members: user
        })

        const randomChannel = new channelModel({
            title: 'random',
            workspace: newWorkspace._id,
            createdBy: user,
            admins: user,
            members: user
        })

        const channelsToSave = [newChannel, generalChannel, randomChannel]

        await newWorkspace.save()

        await channelModel.insertMany(channelsToSave)

        await userModel.findByIdAndUpdate(
            user,
            { $push: { workspace: newWorkspace._id} },
            { new: true } // This option returns the modified document
        )

        response.cookie('Workspace', newWorkspace._id)
        response.status(201).send({ message: 'Workspace created Successfully'})
    }
    catch(error){
        response.status(500).send({ message: error.message})
    }
}

const getAllChannelDetails = async (request, response) => {
    const { workspace } = request
    try{
        const channels = await channelModel.find({workspace})
        console.log(channels)

        response.status(200).send({ data: channels, message: 'All channels are fetched'})
    }
    catch(error){
        response.status(500).send({ message: error.message})
    }

}

const getAllWorkspaces = async (request, response) => {
    const user = request.user._id
    try{
        

        const workspace = await userModel.aggregate([
            { 
              $match: { _id: new ObjectId(user) } 
            },
            { 
              $unwind: '$workspace' 
            },
            { 
              $lookup: {
                from: 'workspaces', // The collection name for workspaces
                localField: 'workspace',
                foreignField: '_id',
                as: 'workspaceDetails'
              }
            },
            { 
              $unwind: '$workspaceDetails' 
            },
            { 
              $group: {
                _id: '$_id',
                workspace: { $push: '$workspaceDetails' }
              }
            }
          ])

          console.log(workspace.length)
          
          response.status(200).send({ data: workspace, message: 'Fetched all workspace'})

    }
    catch(error) {
        response.status(500).send({ message: error.message})
    }
}

const getWorkspace = async (request, response) => {
    const {workspaceId} = request.body
    console.log(workspaceId)
    try{
        response.cookie('Workspace', workspaceId)
        response.status(200).send({message: 'Workspace chosen'})
    }
    catch(error){
        response.status(500).send({ message: error.message})
    }
}

const createANewChannel = async (request, response) => {
    const { channelName, visibility } = request.body
    const workspace = request.workspace
    console.log(workspace)
    const user = request.user._id

    try{
        const existingChannel = await channelModel.findOne({workspace: workspace, title: channelName})
        if(existingChannel) {
            response.status(409).send({ message: 'Channel with this name already exist'})
        }
        const newChannel = new channelModel({
            title: channelName,
            workspace,
            createdBy: user,
            admins: user,
            members: user,
            visibility
        })

        newChannel.save()

        response.status(201).send({ message: 'Channel Created Successfully'})
    }
    catch(error) {
        response.status(500).send({ message: error.message})
    }
}

const addAMemberToGroup = async (request, response) => {
    const channel = request.body.channelId
    const newUser = request.body.newUser
    try{
        const existingChannel = await channelModel.findOne(channel)

        if(existingChannel.members.includes(newUser)) {
            response.status(409).send({ message: "User already in the channel"})
        }

        await channelModel.findByIdAndUpdate(
            channel,
            {
                $push: {members: newUser}
            }
        )
    }
    catch(error) {
        response.status(500).send({ message: error.message})
    }
}

module.exports = {
    authenticateUser,
    createANewWorkspace,
    getAllChannelDetails,
    getAllWorkspaces,
    getWorkspace,
    createANewChannel,
    addAMemberToGroup
}