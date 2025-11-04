const express = require('express')
const router = express.Router()
const controllerPersonagens = require('../controller/personagem/controller.personagem.js')

//Personagem
router.get('/personagens', async (req, res) => {
  const dados = await controllerPersonagens.getAllCharacters()
  res.status(dados.status_code).json(dados)
})

router.get('/personagem/:id', async (req, res) => {
  const dados = await controllerPersonagens.searchCharacterById(req.params.id)
  res.status(dados.status_code).json(dados)
})

router.post('/personagem', async (req, res) => {
  const dados = await controllerPersonagens.insertCharacter(req.body, req.headers['content-type'])
  res.status(dados.status_code).json(dados)
})

router.put('/personagem/:id', async (req, res) => {
  const dados = await controllerPersonagens.updateCharacter(req.body, req.params.id, req.headers['content-type'])
  res.status(dados.status_code).json(dados)
})

router.delete('/personagem/:id', async (req, res) => {
  const dados = await controllerPersonagens.deleteCharacterById(req.params.id)
  res.status(dados.status_code).json(dados)
})
// Personagem
module.exports = router
