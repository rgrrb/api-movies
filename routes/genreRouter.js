const express = require('express')
const router = express.Router()
const controllerGenero = require('../controller/genre/controller_genre.js')


// Genero
router.get('/generos', async (request, response) =>{
  let genero = await controllerGenero.getSelectAllGenre()
  response.status(genero.status_code)
  response.json(genero)
})

router.get('/genero/:id', async (request, response) =>{
  
  let generoId = request.params.id

  let genero = await controllerGenero.searchGenreById(generoId)

  response.status(genero.status_code)
  response.json(genero)

})

router.post('/genero', async (request, response) =>{
  //Recebe o objeto JSON pelo body da requisição
  let dadosBody = request.body

  let contentType = request.headers['content-type']

  let genero = await controllerGenero.insertGenre(dadosBody, contentType)

  response.status(genero.status_code)
  response.json(genero)

})

router.put('/genero/:id', async (request, response) =>{
  let generoID = request.params.id

  let generoBody = request.body

  let contentType = request.headers['content-type']

  let genero = await controllerGenero.updateGenre(generoBody, generoID, contentType)

  response.status(genero.status_code)
  response.json(genero)
})

router.delete('/genero/:id', async (request, response) =>{
  let generoID = request.params.id

  let genero = await controllerGenero.deleteGenreById(generoID)

  response.status(genero.status_code)
  response.json(genero)
})
// Genero
module.exports = router
