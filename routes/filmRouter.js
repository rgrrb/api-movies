


const express = require('express')
const router = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const controllerFilme = require('../controller/filme/controller_filme.js')

const bodyParserJSON = bodyParser.json()

// Filme
router.get('/filmes', cors(), async (request, response) =>{
    let filme = await controllerFilme.listarFilmes()
    response.status(filme.status_code)
    response.json(filme)
})

router.get('/filme/:id', cors(), async (request, response) =>{
    
    let filmeId = request.params.id

    let filme = await controllerFilme.buscarFilmePorId(filmeId)

    response.status(filme.status_code)
    response.json(filme)

})

router.post('/filme', async (request, response) =>{
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let filme = await controllerFilme.inserirFilme(dadosBody, contentType)

    response.status(filme.status_code)
    response.json(filme)

})

router.put('/filme/:id', async (request, response) =>{
    let filmeID = request.params.id

    let filmeBody = request.body

    let contentType = request.headers['content-type']

    let filme = await controllerFilme.atualizarFilme(filmeBody, filmeID, contentType)

    response.status(filme.status_code)
    response.json(filme)
})

router.delete('/filme/:id', async (request, response) =>{
    let filmeID = request.params.id

    let filme = await controllerFilme.excluirFilmeId(filmeID)

    response.status(filme.status_code)
    response.json(filme)
})

// Filme
module.exports = router
