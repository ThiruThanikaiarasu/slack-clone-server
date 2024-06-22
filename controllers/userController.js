const createANewWorkspace = (request, response) => {
    const { companyName, firstName, firstChannel } = request.body
    try{
        
    }catch(error){
        response.status(500).send({ message: error.message})
    }
}

module.exports = {
    createANewWorkspace
}