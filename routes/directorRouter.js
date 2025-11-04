const express = require('express')
const router = express.Router()
const controllerDiretor = require('../controller/diretor/controller_director.js')

// Diretor
router.get('/diretores', async (req, res) => {
  const dados = await controllerDiretor.getAllDirectors()
  res.status(dados.status_code).json(dados)
})

router.get('/diretor/:id', async (req, res) => {
  const dados = await controllerDiretor.searchDirectorById(req.params.id)
  res.status(dados.status_code).json(dados)
})

router.post('/diretor', async (req, res) => {
  const dados = await controllerDiretor.insertDirector(req.body, req.headers['content-type'])
  res.status(dados.status_code).json(dados)
})

router.put('/diretor/:id', async (req, res) => {
  const dados = await controllerDiretor.updateDirector(req.body, req.params.id, req.headers['content-type'])
  res.status(dados.status_code).json(dados)
})

router.delete('/diretor/:id', async (req, res) => {
  const dados = await controllerDiretor.deleteDirectorById(req.params.id)
  res.status(dados.status_code).json(dados)
})

// Diretor

module.exports = router
