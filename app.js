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
const controllerGenero = require('./controller/genre/controller_genre.js')
const controllerAtor = require('./controller/ator/controller_ator.js')
const controllerDiretor = require('./controller/diretor/controller_director.js')
const controllerEstudio = require('./controller/estudio/controller_estudio.js')
const controllerFaixaEtaria = require('./controller/faixa_etaria/controller_faixa_etaria.js')
const controllerPersonagens = require('./controller/personagem/controller.personagem.js')

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

//genero

app.get('/v1/locadora/generos', cors(), async (request, response) =>{
    let genero = await controllerGenero.getSelectAllGenre()
    response.status(genero.status_code)
    response.json(genero)
})

app.get('/v1/locadora/genero/:id', cors(), async (request, response) =>{
    
    let generoId = request.params.id

    let genero = await controllerGenero.searchGenreById(generoId)

    response.status(genero.status_code)
    response.json(genero)

})

app.post('/v1/locadora/genero', cors(), bodyParserJSON, async (request, response) =>{
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let genero = await controllerGenero.insertGenre(dadosBody, contentType)

    response.status(genero.status_code)
    response.json(genero)

})

app.put('/v1/locadora/genero/:id', cors(), bodyParserJSON, async (request, response) =>{
    let generoID = request.params.id

    let generoBody = request.body

    let contentType = request.headers['content-type']

    let genero = await controllerGenero.updateGenre(generoBody, generoID, contentType)

    response.status(genero.status_code)
    response.json(genero)
})

app.delete('/v1/locadora/genero/:id', cors(), bodyParserJSON, async (request, response) =>{
    let generoID = request.params.id

    let genero = await controllerGenero.deleteGenreById(generoID)

    response.status(genero.status_code)
    response.json(genero)
})
//genero

//ator
app.get('/v1/locadora/atores', cors(), async (request, response) =>{
    let ator = await controllerAtor.getAllActors()

    response.status(ator.status_code)
    response.json(ator)
})

app.get('/v1/locadora/ator/:id', cors(), async (request, response) =>{
    
    let atorId = request.params.id

    let ator = await controllerAtor.searchActorById(atorId)

    response.status(ator.status_code)
    response.json(ator)

})

app.post('/v1/locadora/ator', cors(), bodyParserJSON, async (request, response) =>{
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let ator = await controllerAtor.insertActor(dadosBody, contentType)

    response.status(ator.status_code)
    response.json(ator)

})

app.put('/v1/locadora/ator/:id', cors(), bodyParserJSON, async (request, response) =>{
    let atorID = request.params.id

    let atorBody = request.body

    let contentType = request.headers['content-type']

    let ator = await controllerAtor.updateActor(atorBody, atorID, contentType)

    response.status(ator.status_code)
    response.json(ator)
})

app.delete('/v1/locadora/ator/:id', cors(), bodyParserJSON, async (request, response) =>{
    let atorID = request.params.id

    let ator = await controllerAtor.deleteActorById(atorID)

    response.status(ator.status_code)
    response.json(ator)
})
//ator

//diretor
app.get('/v1/locadora/diretores', cors(), async (request, response) =>{
    let diretor = await controllerDiretor.getAllDirectors()

    response.status(diretor.status_code)
    response.json(diretor)
})

app.get('/v1/locadora/diretor/:id', cors(), async (request, response) =>{
    
    let diretorId = request.params.id

    let diretor = await controllerDiretor.searchDirectorById(diretorId)

    response.status(diretor.status_code)
    response.json(diretor)

})

app.post('/v1/locadora/diretor', cors(), bodyParserJSON, async (request, response) =>{
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let diretor = await controllerDiretor.insertDirector(dadosBody, contentType)

    response.status(diretor.status_code)
    response.json(diretor)

})

app.put('/v1/locadora/diretor/:id', cors(), bodyParserJSON, async (request, response) =>{
    let diretorID = request.params.id

    let diretorBody = request.body

    let contentType = request.headers['content-type']

    let diretor = await controllerAtor.updateActor(diretorBody, diretorID, contentType)

    response.status(diretor.status_code)
    response.json(diretor)
})

//diretor

//estudio
app.get('/v1/locadora/estudios', cors(), async (request, response) =>{
    let estudio = await controllerEstudio.getAllStudios()

    response.status(estudio.status_code)
    response.json(estudio)
})

app.get('/v1/locadora/estudios/:id', cors(), async (request, response) =>{
    
    let estudioId = request.params.id

    let estudio = await controllerEstudio.searchStudioById(estudioId)

    response.status(estudio.status_code)
    response.json(estudio)

})

app.post('/v1/locadora/estudio', cors(), bodyParserJSON, async (request, response) =>{
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let estudio = await controllerEstudio.insertStudio(dadosBody, contentType)

    response.status(estudio.status_code)
    response.json(estudio)

})

app.put('/v1/locadora/estudio/:id', cors(), bodyParserJSON, async (request, response) =>{
    let estudioId = request.params.id

    let estudioBody = request.body

    let contentType = request.headers['content-type']

    let estudio = await controllerAtor.updateActor(estudioBody, estudioId, contentType)

    response.status(estudio.status_code)
    response.json(estudio)
})
//estudio

//Faixa etária
app.get('/v1/locadora/faixa-etaria', cors(), async (request, response) =>{
    let faixaEtaria = await controllerFaixaEtaria.getAllAgeRatings()

    response.status(faixaEtaria.status_code)
    response.json(faixaEtaria)
})

app.get('/v1/locadora/faixa-etaria/:id', cors(), async (request, response) =>{
    
    let faixaEtariaId = request.params.id

    let faixaEtaria = await controllerFaixaEtaria.searchAgeRatingById(faixaEtariaId)

    response.status(faixaEtaria.status_code)
    response.json(faixaEtaria)

})

app.post('/v1/locadora/faixa-etaria', cors(), bodyParserJSON, async (request, response) =>{
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let faixaEtaria = await controllerFaixaEtaria.insertAgeRating(dadosBody, contentType)

    response.status(faixaEtaria.status_code)
    response.json(faixaEtaria)

})

app.put('/v1/locadora/faixa-etaria/:id', cors(), bodyParserJSON, async (request, response) =>{
    let estudioId = request.params.id

    let estudioBody = request.body

    let contentType = request.headers['content-type']

    let estudio = await controllerFaixaEtaria.deleteAgeRatingById(estudioBody, estudioId, contentType)

    response.status(estudio.status_code)
    response.json(estudio)
})
//Faixa etária

//Personagem
app.get('/v1/locadora/personagens', cors(), async (request, response) =>{
    let personagem = await controllerPersonagens.getAllCharacters()

    response.status(personagem.status_code)
    response.json(personagem)
})

app.get('/v1/locadora/personagem/:id', cors(), async (request, response) =>{
    
    let personagemId = request.params.id

    let personagem = await controllerFaixaEtaria.searchAgeRatingById(personagemId)

    response.status(personagem.status_code)
    response.json(personagem)

})

app.post('/v1/locadora/personagem', cors(), bodyParserJSON, async (request, response) =>{
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let personagem = await controllerPersonagens.insertCharacter(dadosBody, contentType)

    response.status(personagem.status_code)
    response.json(personagem)

})

app.put('/v1/locadora/personagem/:id', cors(), bodyParserJSON, async (request, response) =>{
    let personagemId = request.params.id

    let personagemBody = request.body

    let contentType = request.headers['content-type']

    let personagem = await controllerFaixaEtaria.deleteAgeRatingById(personagemBody, personagemId, contentType)

    response.status(personagem.status_code)
    response.json(personagem)
})
//Personagem


app.listen(PORT, function(){
    console.log('conectado')
})