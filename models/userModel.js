const mongoose = require('mongoose')

const userModel = new mongoose.Schema(
    {
        user_id : {
            type : String,
            required : true,
            unique : true
        },

        firstName :{
            type : String,
            required : true
        },

        lastName :{
            type : String,
            required : true
        },

        email :{
            type : String,
            required : true,
            unique : true
        },

        password : {
            type : String,
            required : true
        }
    },
    {
        collection:'users'
    }
)

module.exports = mongoose.model('users',userModel)