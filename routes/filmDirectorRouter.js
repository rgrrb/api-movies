const express = require('express')
const router = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const controllerFilmDirector = require('../controller/filme/controller_filme_diretor.js')

const bodyParserJSON = bodyParser.json()

// Filme - Diretores
router.get('/filmes-diretores', cors(), async (request, response) => {
    let filmeDiretor = await controllerFilmDirector.getSelectAllFilmsDirectors()
    response.status(filmeDiretor.status_code)
    response.json(filmeDiretor)
})

router.get('/filme-diretor/:id', cors(), async (request, response) => {
    let filmeDiretorId = request.params.id

    let filmeDiretor = await controllerFilmDirector.searchFilmDirectorById(filmeDiretorId)

    response.status(filmeDiretor.status_code)
    response.json(filmeDiretor)
})

router.get('/filme/:filmeId/diretores', cors(), async (request, response) => {
    let filmeId = request.params.filmeId

    let diretores = await controllerFilmDirector.listDirectorsByIdFilm(filmeId)

    response.status(diretores.status_code)
    response.json(diretores)
})

router.get('/diretor/:diretorId/filmes', cors(), async (request, response) => {
    let diretorId = request.params.diretorId

    let filmes = await controllerFilmDirector.listFilmsByIdDirector(diretorId)

    response.status(filmes.status_code)
    response.json(filmes)
})

router.post('/filme-diretor', cors(), async (request, response) => {
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let filmeDiretor = await controllerFilmDirector.insertFilmDirector(dadosBody, contentType)

    response.status(filmeDiretor.status_code)
    response.json(filmeDiretor)
})

router.put('/filme-diretor/:id', cors(), async (request, response) => {
    let filmeDiretorID = request.params.id

    let filmeDiretorBody = request.body

    let contentType = request.headers['content-type']

    let filmeDiretor = await controllerFilmDirector.updateFilmDirector(filmeDiretorBody, filmeDiretorID, contentType)

    response.status(filmeDiretor.status_code)
    response.json(filmeDiretor)
})

router.delete('/filme-diretor/:id', cors(), async (request, response) => {
    let filmeDiretorID = request.params.id

    let filmeDiretor = await controllerFilmDirector.deleteFilmDirectorById(filmeDiretorID)

    response.status(filmeDiretor.status_code)
    response.json(filmeDiretor)
})

module.exports = router