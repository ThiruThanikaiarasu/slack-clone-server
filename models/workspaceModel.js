const mongoose = require('mongoose')

const workspaceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is mandatory field'],
        },
        description: {
            type: String,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        admins: {
            type: [mongoose.Schema.Types.ObjectId],
        },
    }, 
    {
        timestamps: true,
    }, 
    {
        collection: 'workspaces'
    }
)


module.exports = mongoose.model.users || mongoose.model('workspaces', workspaceSchema)
