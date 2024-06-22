const mongoose = require('mongoose')

const channelSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is mandatory field'],
        },
        description: {
            type: String,
        },
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'workspaces' 
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        admins: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'users'
        },
        members: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'users'
        },
        visibility: {
            type: String,
            enum: ['public', 'private'],
            default: 'public',
        }

    }, 
    {
        timestamps: true,
    }, 
    {
        collection: 'channels'
    }
)


module.exports = mongoose.model.users || mongoose.model('channels', channelSchema)
