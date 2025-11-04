const express = require('express')
const router = express.Router()
const controllerGenero = require('../controller/genre/controller_genre.js')


// Genero
router.get('/generos', async (req, res) => {
  const dados = await controllerGenero.getSelectAllGenre()
  res.status(dados.status_code).json(dados)
})

router.get('/genero/:id', async (req, res) => {
  const dados = await controllerGenero.searchGenreById(req.params.id)
  res.status(dados.status_code).json(dados)
})

router.post('/genero', async (req, res) => {
  const dados = await controllerGenero.insertGenre(req.body, req.headers['content-type'])
  res.status(dados.status_code).json(dados)
})

router.put('/genero/:id', async (req, res) => {
  const dados = await controllerGenero.updateGenre(req.body, req.params.id, req.headers['content-type'])
  res.status(dados.status_code).json(dados)
})

router.delete('/genero/:id', async (req, res) => {
  const dados = await controllerGenero.deleteGenreById(req.params.id)
  res.status(dados.status_code).json(dados)
})
// Genero
module.exports = router
