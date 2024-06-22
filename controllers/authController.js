const userModel = require('../models/userModel')

const bcrypt = require('bcryptjs')

const signup = async (request, response) => {
    const { email, password } = request.body
    try{
        const existingUser = await userModel.findOne({ email })
        if(existingUser) {
            return response.status(409).send({ message: 'User Already Exist'})
        }

        const newUser = new userModel({
            email,
            password
        })

        await newUser.save()

        let options = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }
        const token = newUser.generateAccessJWT()     
        response.cookie('SessionID', token, options)
        response.status(201).send({ message: 'Signup Successfully'})
    }
    catch(error) {
        response.status(500).send({ message: error.message})
    }
}

const login = async (request, response) => {
  
    const {email} = request.body 
    try{
        const existingUser = await userModel.findOne({ email }).select('+password') 
        if(!existingUser) {
            return response.status(401).send({ message: 'Invalid email address'})
        }

        const validatePassword = await bcrypt.compare(`${request.body.password}`, existingUser.password)
        if(!validatePassword) {
            return response.status(401).send({ message: 'Invalid password'})
        }

        let options = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }
        const {password, ...userData} = existingUser?._doc
        const token = existingUser.generateAccessJWT()     
        response.cookie('SessionID', token, options)
        response.status(200).send({ message: 'Login Successfully'})
    } 
    catch(error) {
        response.status(500).send({ message: error.message})
    }
}

const logout = async (request, response) => {
    const authHeader = request.headers['cookie']
    if(!authHeader){
        return response.status(204).send({ message: 'No Content'})
    }

    const cookie = authHeader.split('=')[1]
    const accessToken = cookie.split(';')[0]

    response.setHeader('Clear-Site-Data', '"cookies"')
    response.status(200).send({ message: "Logged out!"})
}

module.exports = {
    signup,
    login,
    logout
}