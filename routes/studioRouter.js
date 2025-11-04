const express = require('express')
const router = express.Router()
const controllerEstudio = require('../controller/estudio/controller_estudio.js')


// Estudio
router.get('/estudios', async (req, res) => {
  const dados = await controllerEstudio.getAllStudios()
  res.status(dados.status_code).json(dados)
})

router.get('/estudio/:id', async (req, res) => {
  const dados = await controllerEstudio.searchStudioById(req.params.id)
  res.status(dados.status_code).json(dados)
})

router.post('/estudio', async (req, res) => {
  const dados = await controllerEstudio.insertStudio(req.body, req.headers['content-type'])
  res.status(dados.status_code).json(dados)
})

router.put('/estudio/:id', async (req, res) => {
  const dados = await controllerEstudio.updateStudio(req.body, req.params.id, req.headers['content-type'])
  res.status(dados.status_code).json(dados)
})

router.delete('/estudio/:id', async (req, res) => {
  const dados = await controllerEstudio.deleteStudioById(req.params.id)
  res.status(dados.status_code).json(dados)
})

// Estudio
module.exports = router
