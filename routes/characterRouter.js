const express = require('express')
const router = express.Router()
const controllerPersonagens = require('../controller/personagem/controller.personagem.js')

//Personagem
router.get('/personagens', async (request, response) =>{
  let personagem = await controllerPersonagens.getAllCharacters()

  response.status(personagem.status_code)
  response.json(personagem)
})

router.get('/personagem/:id', async (request, response) =>{
  
  let personagemId = request.params.id

  let personagem = await controllerPersonagens.searchCharacterById(personagemId)

  response.status(personagem.status_code)
  response.json(personagem)

})

router.post('/personagem', async (request, response) =>{
  //Recebe o objeto JSON pelo body da requisição
  let dadosBody = request.body

  let contentType = request.headers['content-type']

  let personagem = await controllerPersonagens.insertCharacter(dadosBody, contentType)

  response.status(personagem.status_code)
  response.json(personagem)

})

router.put('/personagem/:id', async (request, response) =>{
  let personagemId = request.params.id

  let personagemBody = request.body

  let contentType = request.headers['content-type']

  let personagem = await controllerPersonagens.updateCharacter(personagemBody, personagemId, contentType)

  response.status(personagem.status_code)
  response.json(personagem)
})
router.delete('/personagem/:id', async (request, response) =>{
  
  let personagemId = request.params.id

  let personagem = await controllerPersonagens.deleteCharacterById(personagemId)

  response.status(personagem.status_code)
  response.json(personagem)

})
module.exports = router
