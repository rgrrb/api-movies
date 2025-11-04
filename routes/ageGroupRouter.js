const express = require('express')
const router = express.Router()
const controllerFaixaEtaria = require('../controller/faixa_etaria/controller_faixa_etaria.js')

// Faixa Etaria
router.get('/faixa-etaria', async (req, res) => {
  const dados = await controllerFaixaEtaria.getAllAgeRatings()
  res.status(dados.status_code).json(dados)
})

router.get('/faixa-etaria/:id', async (req, res) => {
  const dados = await controllerFaixaEtaria.searchAgeRatingById(req.params.id)
  res.status(dados.status_code).json(dados)
})

router.post('/faixa-etaria', async (req, res) => {
  const dados = await controllerFaixaEtaria.insertAgeRating(req.body, req.headers['content-type'])
  res.status(dados.status_code).json(dados)
})

router.put('/faixa-etaria/:id', async (req, res) => {
  const dados = await controllerFaixaEtaria.updateAgeRating(req.body, req.params.id, req.headers['content-type'])
  res.status(dados.status_code).json(dados)
})

// Faixa Etaria

module.exports = router
