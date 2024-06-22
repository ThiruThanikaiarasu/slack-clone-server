const channelModel = require("../models/channelModel")
const userModel = require("../models/userModel")
const workspaceModel = require("../models/workspaceModel")

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
            { 
                firstName,
                workspace: newWorkspace._id
            },

        )

        response.status(201).send({ message: 'Workspace created Successfully'})
    }
    catch(error){
        response.status(500).send({ message: error.message})
    }
}

module.exports = {
    authenticateUser,
    createANewWorkspace
}