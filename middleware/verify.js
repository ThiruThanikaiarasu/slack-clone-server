const jwt = require('jsonwebtoken')
const { ACCESS_TOKEN } = require('../configuration/config')
const userModel = require('../models/userModel')

const verifyUser = async (request, response, next) => {
    try {
        const authHeader = request.headers['cookie']
        if(!authHeader){
            return response.status(401).send({status: 'failure', code: 401, message: 'Token not found'})
        }

        const keyValuePairs = authHeader.split(';').map(pair => pair.trim());

        let sessionID = '';
        let workspaceID = '';

        keyValuePairs.forEach(pair => {
            const [key, value] = pair.split('=');
            if (key === 'SessionID') {
                sessionID = value;
            } else if (key === 'Workspace') {
                
                const decodedValue = decodeURIComponent(value);
                if (value.includes('=')) {
                    const parts = value.split('=');
                    if (parts.length === 2 && parts[0] === 'WorkspaceId') {
                        workspaceID = parts[1];
                    }
                } else {
                    workspaceID = value;
                }
            }
        });
        const cookie = sessionID
        jwt.verify(cookie, ACCESS_TOKEN, async (error, decoded) => {
            if(error) {
                return response.status(401).json({code:401 ,message:'Session expired'})
            }           
            const {id} = decoded
            const existingUser = await userModel.findById({_id: id})
            const password = existingUser?._doc?.password
            if(password) {
                const {password, ...data} = existingUser?._doc
                request.user = data
                request.workspace = workspaceID
                next()
            } else {
                request.user = existingUser
                request.workspace = workspaceID
                next()
            }
        })
    }
    catch(error) {
        response.status(500).json({status: 'error', code:500, message: error.message})
    }
}

module.exports = {
    verifyUser,
}