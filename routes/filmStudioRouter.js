const express = require('express')
const router = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const controllerFilmStudio = require('../controller/filme/controller_filme_estudio.js')

const bodyParserJSON = bodyParser.json()

// Filme - Estúdios
router.get('/filmes-estudios', cors(), async (request, response) => {
    let filmeEstudio = await controllerFilmStudio.getSelectAllFilmsStudios()
    response.status(filmeEstudio.status_code)
    response.json(filmeEstudio)
})

router.get('/filme-estudio/:id', cors(), async (request, response) => {
    let filmeEstudioId = request.params.id

    let filmeEstudio = await controllerFilmStudio.searchFilmStudioById(filmeEstudioId)

    response.status(filmeEstudio.status_code)
    response.json(filmeEstudio)
})

router.get('/filme/:filmeId/estudios', cors(), async (request, response) => {
    let filmeId = request.params.filmeId

    let estudios = await controllerFilmStudio.listStudiosByIdFilm(filmeId)

    response.status(estudios.status_code)
    response.json(estudios)
})

router.get('/estudio/:estudioId/filmes', cors(), async (request, response) => {
    let estudioId = request.params.estudioId

    let filmes = await controllerFilmStudio.listFilmsByIdStudio(estudioId)

    response.status(filmes.status_code)
    response.json(filmes)
})

router.post('/filme-estudio', cors(), async (request, response) => {
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let filmeEstudio = await controllerFilmStudio.insertFilmStudio(dadosBody, contentType)

    response.status(filmeEstudio.status_code)
    response.json(filmeEstudio)
})

router.put('/filme-estudio/:id', cors(), async (request, response) => {
    let filmeEstudioID = request.params.id

    let filmeEstudioBody = request.body

    let contentType = request.headers['content-type']

    let filmeEstudio = await controllerFilmStudio.updateFilmStudio(filmeEstudioBody, filmeEstudioID, contentType)

    response.status(filmeEstudio.status_code)
    response.json(filmeEstudio)
})

router.delete('/filme-estudio/:id', cors(), async (request, response) => {
    let filmeEstudioID = request.params.id

    let filmeEstudio = await controllerFilmStudio.deleteFilmStudioById(filmeEstudioID)

    response.status(filmeEstudio.status_code)
    response.json(filmeEstudio)
})

module.exports = router