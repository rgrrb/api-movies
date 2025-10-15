/* *********************************************************************
* Objetivo: Arquivo responsável pela criação de endpoints da API
* Data: 07/10/2025  
* Autor: Roger Ribeiro
*
* Observações: Instalar dependencias para criar a API
*      express     - npm install express     --save Instala as dependencias para criar uma API
*      cors        - npm install cors        --save Instala as dependencias para configurar as permissões para uma api
*      body-parser - npm install body-parser --save Instala as dependencias para receber os tipos de dados via POST ou PUT
* 
* **********************************************************************/

//Import das dependencias do app
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')


//Cria um objeto especialista no formato JSON para receber os dados do body (POST E PUT)
const bodyParserJSON = bodyParser.json()

const PORT =  process.PORT || 3030

//Instancia na classe do express
const app = express()

//configurações do CORS
app.use((request, response, next) => {
    response.header('Acess-Control-Allow-Origin', '*') //IP de origem 
    response.header('Acess-Control-Allow-Methods', 'GET') // Meodos do (Verbos) protocolo http 

    app.use(cors())
    next() //Proximo
})

//Import das controllers da API
const controllerFilme = require('./controller/filme/controller_filme.js')


app.get('/v1/locadora/filmes', cors(), async (request, response) =>{
    let filme = await controllerFilme.listarFilmes()
    response.status(filme.status_code)
    response.json(filme)
})

app.get('/v1/locadora/filme/:id', cors(), async (request, response) =>{
    
    let filmeId = request.params.id

    let filme = await controllerFilme.buscarFilmePorId(filmeId)

    response.status(filme.status_code)
    response.json(filme)

})

app.post('/v1/locadora/filme', cors(), bodyParserJSON, async (request, response) =>{
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let filme = await controllerFilme.inserirFilme(dadosBody, contentType)

    response.status(filme.status_code)
    response.json(filme)

})

app.put('/v1/locadora/filme/:id', cors(), bodyParserJSON, async (request, response) =>{
    let filmeID = request.params.id

    let filmeBody = request.body

    let contentType = request.headers['content-type']

    let filme = await controllerFilme.atualizarFilme(filmeBody, filmeID, contentType)

    response.status(filme.status_code)
    response.json(filme)
})

app.delete('/v1/locadora/filme/:id', cors(), bodyParserJSON, async (request, response) =>{
    let filmeID = request.params.id

    let filme = await controllerFilme.excluirFilmeId(filmeID)

    response.status(filme.status_code)
    response.json(filme)
})

app.listen(PORT, function(){
    console.log('conectado')
})