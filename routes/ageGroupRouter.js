const express = require('express')
const router = express.Router()
const controllerFaixaEtaria = require('../controller/faixa_etaria/controller_faixa_etaria.js')

// Faixa Etaria
router.get('/faixa-etaria', async (request, response) =>{
  let faixaEtaria = await controllerFaixaEtaria.getAllAgeRatings()

  response.status(faixaEtaria.status_code)
  response.json(faixaEtaria)
})

router.get('/faixa-etaria/:id', async (request, response) =>{
  
  let faixaEtariaId = request.params.id

  let faixaEtaria = await controllerFaixaEtaria.searchAgeRatingById(faixaEtariaId)

  response.status(faixaEtaria.status_code)
  response.json(faixaEtaria)

})

router.post('/faixa-etaria', async (request, response) =>{
  //Recebe o objeto JSON pelo body da requisição
  let dadosBody = request.body

  let contentType = request.headers['content-type']

  let faixaEtaria = await controllerFaixaEtaria.insertAgeRating(dadosBody, contentType)

  response.status(faixaEtaria.status_code)
  response.json(faixaEtaria)

})

router.put('/faixa-etaria/:id', async (request, response) =>{
  let estudioId = request.params.id

  let estudioBody = request.body

  let contentType = request.headers['content-type']

  let estudio = await controllerFaixaEtaria.deleteAgeRatingById(estudioBody, estudioId, contentType)

  response.status(estudio.status_code)
  response.json(estudio)
})
// Faixa Etaria

module.exports = router
