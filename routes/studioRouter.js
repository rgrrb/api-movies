const express = require('express')
const router = express.Router()
const controllerEstudio = require('../controller/estudio/controller_estudio.js')


// Estudio
router.get('/estudios', async (request, response) =>{
  let estudio = await controllerEstudio.getAllStudios()

  response.status(estudio.status_code)
  response.json(estudio)
})

router.get('/estudio/:id', async (request, response) =>{
  
  let estudioId = request.params.id

  let estudio = await controllerEstudio.searchStudioById(estudioId)

  response.status(estudio.status_code)
  response.json(estudio)

})

router.post('/estudio/', async (request, response) =>{
  //Recebe o objeto JSON pelo body da requisição
  let dadosBody = request.body

  let contentType = request.headers['content-type']

  let estudio = await controllerEstudio.insertStudio(dadosBody, contentType)

  response.status(estudio.status_code)
  response.json(estudio)

})

router.put('/estudio/:id', async (request, response) =>{
  let estudioId = request.params.id

  let estudioBody = request.body

  let contentType = request.headers['content-type']

  let estudio = await controllerEstudio.updateStudio(estudioBody, estudioId, contentType)

  response.status(estudio.status_code)
  response.json(estudio)
})

// Estudio
module.exports = router
