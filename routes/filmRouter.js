


const express = require('express')
const router = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const controllerFilme = require('../controller/filme/controller_filme.js')

const bodyParserJSON = bodyParser.json()

// Filme
router.get('/filmes', cors(), async (req, res) => {
    let dados = await controllerFilme.listarFilmes()
    res.status(dados.status_code).json(dados)
})

router.get('/filme/:id', cors(), async (req, res) => {
    let id = req.params.id
    let dados = await controllerFilme.buscarFilmePorId(id)
    res.status(dados.status_code).json(dados)
})

router.post('/filme', cors(), bodyParserJSON, async (req, res) => {
    let dadosBody = req.body
    let contentType = req.headers['content-type']
    let dados = await controllerFilme.inserirFilme(dadosBody, contentType)
    res.status(dados.status_code).json(dados)
})

router.put('/filme/:id', cors(), bodyParserJSON, async (req, res) => {
    let id = req.params.id
    let dadosBody = req.body
    let contentType = req.headers['content-type']
    let dados = await controllerFilme.atualizarFilme(dadosBody, id, contentType)
    res.status(dados.status_code).json(dados)
})

router.delete('/filme/:id', cors(), async (req, res) => {
    let id = req.params.id
    let dados = await controllerFilme.excluirFilmeId(id)
    res.status(dados.status_code).json(dados)
})
// Filme
module.exports = router
