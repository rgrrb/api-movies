const express = require('express')
const router = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const controllerFilmActor = require('../controller/filme/controller_filme_ator.js')

const bodyParserJSON = bodyParser.json()

// Filme - Atores
router.get('/filmes-atores', cors(), async (request, response) => {
    let filmeAtor = await controllerFilmActor.getSelectAllFilmsActors()
    response.status(filmeAtor.status_code)
    response.json(filmeAtor)
})

router.get('/filme-ator/:id', cors(), async (request, response) => {
    let filmeAtorId = request.params.id

    let filmeAtor = await controllerFilmActor.searchFilmActorById(filmeAtorId)

    response.status(filmeAtor.status_code)
    response.json(filmeAtor)
})

router.get('/filme/:filmeId/atores', cors(), async (request, response) => {
    let filmeId = request.params.filmeId

    let atores = await controllerFilmActor.listActorsByIdFilm(filmeId)

    response.status(atores.status_code)
    response.json(atores)
})

router.get('/ator/:atorId/filmes', cors(), async (request, response) => {
    let atorId = request.params.atorId

    let filmes = await controllerFilmActor.listFilmsByIdActor(atorId)

    response.status(filmes.status_code)
    response.json(filmes)
})

router.post('/filme-ator', cors(), async (request, response) => {
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let filmeAtor = await controllerFilmActor.insertFilmActor(dadosBody, contentType)

    response.status(filmeAtor.status_code)
    response.json(filmeAtor)
})

router.put('/filme-ator/:id', cors(), async (request, response) => {
    let filmeAtorID = request.params.id

    let filmeAtorBody = request.body

    let contentType = request.headers['content-type']

    let filmeAtor = await controllerFilmActor.updateFilmActor(filmeAtorBody, filmeAtorID, contentType)

    response.status(filmeAtor.status_code)
    response.json(filmeAtor)
})

router.delete('/filme-ator/:id', cors(), async (request, response) => {
    let filmeAtorID = request.params.id

    let filmeAtor = await controllerFilmActor.deleteFilmActorById(filmeAtorID)

    response.status(filmeAtor.status_code)
    response.json(filmeAtor)
})

module.exports = router