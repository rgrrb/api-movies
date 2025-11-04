/**************************************************************************
 * Objetivo: Arquivo principal da API
 * Data: 04/10/2025
 * Autor: Roger Ribeiro
 * Version 1.0
 **************************************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')


const app = express()
const bodyParserJSON = bodyParser.json()
const PORT = process.env.PORT || 3030


app.use(cors())
app.use(bodyParserJSON)

// Importando as rotas
const filmeRouter = require('./routes/filmRouter.js')
const generoRouter = require('./routes/genreRouter.js')
const atorRouter = require('./routes/actorRouter.js')
const diretorRouter = require('./routes/directorRouter.js')
const estudioRouter = require('./routes/studioRouter.js')
const faixaEtariaRouter = require('./routes/ageGroupRouter.js')
const personagemRouter = require('./routes/characterRouter.js')

// Usa as rotas
app.use('/v1/locadora', filmeRouter)
app.use('/v1/locadora', generoRouter)
app.use('/v1/locadora', atorRouter)
app.use('/v1/locadora', diretorRouter)
app.use('/v1/locadora', estudioRouter)
app.use('/v1/locadora', faixaEtariaRouter)
app.use('/v1/locadora', personagemRouter)

// Inicializa o servidor
app.listen(PORT, () => console.log(`conectado`))
