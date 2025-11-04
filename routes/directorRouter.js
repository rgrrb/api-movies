const express = require('express')
const router = express.Router()
const controllerDiretor = require('../controller/diretor/controller_director.js')

router.get('/diretores', async (request, response) =>{
  let diretor = await controllerDiretor.getAllDirectors()

  response.status(diretor.status_code)
  response.json(diretor)
})

router.get('/diretor/:id', async (request, response) =>{
  
  let diretorId = request.params.id

  let diretor = await controllerDiretor.searchDirectorById(diretorId)

  response.status(diretor.status_code)
  response.json(diretor)

})

router.post('/diretor', async (request, response) =>{
  //Recebe o objeto JSON pelo body da requisição
  let dadosBody = request.body

  let contentType = request.headers['content-type']

  let diretor = await controllerDiretor.insertDirector(dadosBody, contentType)

  response.status(diretor.status_code)
  response.json(diretor)

})

router.put('/diretor/:id', async (request, response) =>{
  let diretorID = request.params.id

  let diretorBody = request.body

  let contentType = request.headers['content-type']

  let diretor = await controllerDiretor.updateDirector(diretorBody, diretorID, contentType)

  response.status(diretor.status_code)
  response.json(diretor)
})

router.delete('/diretor/:id', async (request, response) =>{
  
  let diretorId = request.params.id

  let diretor = await controllerDiretor.deleteDirectorById(diretorId)

  response.status(diretor.status_code)
  response.json(diretor)

})
//diretor

module.exports = router
