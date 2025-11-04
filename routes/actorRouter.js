const express = require('express')
const router = express.Router()
const controllerAtor = require('../controller/ator/controller_ator.js')

// Ator
router.get('/atores', async (req, res) => {
  const dados = await controllerAtor.getAllActors()
  res.status(dados.status_code).json(dados)
})

router.get('/ator/:id', async (req, res) => {
  const dados = await controllerAtor.searchActorById(req.params.id)
  res.status(dados.status_code).json(dados)
})

router.post('/ator', async (req, res) => {
  const dados = await controllerAtor.insertActor(req.body, req.headers['content-type'])
  res.status(dados.status_code).json(dados)
})

router.put('/ator/:id', async (req, res) => {
  const dados = await controllerAtor.updateActor(req.body, req.params.id, req.headers['content-type'])
  res.status(dados.status_code).json(dados)
})

router.delete('/ator/:id', async (req, res) => {
  const dados = await controllerAtor.deleteActorById(req.params.id)
  res.status(dados.status_code).json(dados)
})
// Ator

module.exports = router
