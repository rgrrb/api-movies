const express = require('express')
const router = express.Router()
const controllerAtor = require('../controller/ator/controller_ator.js')

router.get('/atores', async (request, response) =>{
  let ator = await controllerAtor.getAllActors()

  response.status(ator.status_code)
  response.json(ator)
})

router.get('/ator/:id', async (request, response) =>{
  
  let atorId = request.params.id

  let ator = await controllerAtor.searchActorById(atorId)

  response.status(ator.status_code)
  response.json(ator)

})

router.post('/ator', async (request, response) =>{
  //Recebe o objeto JSON pelo body da requisição
  let dadosBody = request.body

  let contentType = request.headers['content-type']

  let ator = await controllerAtor.insertActor(dadosBody, contentType)

  response.status(ator.status_code)
  response.json(ator)

})

router.put('/ator/:id', async (request, response) =>{
  let atorID = request.params.id

  let atorBody = request.body

  let contentType = request.headers['content-type']

  let ator = await controllerAtor.updateActor(atorBody, atorID, contentType)

  response.status(ator.status_code)
  response.json(ator)
})

router.delete('/ator/:id', async (request, response) =>{
  let atorID = request.params.id

  let ator = await controllerAtor.deleteActorById(atorID)

  response.status(ator.status_code)
  response.json(ator)
})

module.exports = router