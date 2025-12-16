/********************************************************
 * 
 * Objetivo: Arquivo responsável pela manipulação de dados 
 *           entre o APP e a Model (Validações, tratamento de dados,
 *           tratamento de erros, etc)
 * 
 * Data: 07/10/2025
 * Autor: Roger Ribeiro de Oliveira
 * Versão: 1.0
 * 
 *******************************************************/
//Import do arquivo DAO para manipular o crud no banco de dados
const filmeDAO = require('../../model/dao/filme.js')
const controllerFilmeGenero = require('./controller_filme_genero.js')
const controllerFilmActor = require('./controller_filme_ator.js')
const controllerFilmDirector = require('./controller_filme_diretor.js')
const controllerFilmStudio = require('./controller_filme_estudio.js')
//Import od arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../module/config_messages.js')

//Retorna uma lista de filmes
const listarFilmes = async () => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    //Chama a função do DAO para retornar a lista de filmes     
    //Realizando uma cópia do objeto message_default, permitindo que as alterações desta função
    //não interfiram em outras funções

    try {

        let result = await filmeDAO.getSelectAllFilms()
        if (result) {
            if (result.length > 0) {

                //Processamento para adicionar os generos, atores e diretores em cada filme
                for (filme of result) {
                    // Adicionar gêneros
                    let filmGenres = await controllerFilmeGenero.listGenreIdFilm(filme.filme_id)

                    if (filmGenres.status_code == 200) {
                        filme.genero = filmGenres.response.film_genre
                    } else {
                        filme.genero = MESSAGE.ERROR_NOT_FOUND.message
                    }

                    // Adicionar atores
                    let filmActors = await controllerFilmActor.listActorsByIdFilm(filme.filme_id)

                    if (filmActors.status_code == 200) {
                        filme.atores = filmActors.response.film_actors
                    } else {
                        filme.atores = MESSAGE.ERROR_NOT_FOUND.message
                    }

                    // Adicionar diretores
                    let filmDirectors = await controllerFilmDirector.listDirectorsByIdFilm(filme.filme_id)

                    if (filmDirectors.status_code == 200) {
                        filme.diretores = filmDirectors.response.film_directors
                    } else {
                        filme.diretores = MESSAGE.ERROR_NOT_FOUND.message
                    }

                    // Adicionar estúdios
                    let filmStudios = await controllerFilmStudio.listStudiosByIdFilm(filme.filme_id)

                    if (filmStudios.status_code == 200) {
                        filme.estudios = filmStudios.response.film_studios
                    } else {
                        filme.estudios = MESSAGE.ERROR_NOT_FOUND.message
                    }
                }

                let filmsAmount = result.length
                MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code

                MESSAGE.HEADER.response.films_amount = filmsAmount
                MESSAGE.HEADER.response.films = result

                return MESSAGE.HEADER //200
            }
            else {
                return MESSAGE.ERROR_NOT_FOUND //404
            }
        } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}
//Retorna um filme filtrando pelo ID
const buscarFilmePorId = async (id) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && id > 0 && !isNaN(id)) {
            //CHAMAR A FUNÇÃO PARA FILTRAR PELO ID
            let result = await filmeDAO.getSelectByIdFilms(parseInt(id))

            if (result) {
                if (result.length > 0) {

                    for (filme of result) {
                        // Adicionar gêneros
                        let filmGenres = await controllerFilmeGenero.listGenreIdFilm(filme.filme_id)

                        if (filmGenres.status_code == 200) {
                            filme.genero = filmGenres.response.film_genre
                        } else {
                            filme.genero = MESSAGE.ERROR_NOT_FOUND.message
                        }

                        // Adicionar atores
                        let filmActors = await controllerFilmActor.listActorsByIdFilm(filme.filme_id)

                        if (filmActors.status_code == 200) {
                            filme.atores = filmActors.response.film_actors
                        } else {
                            filme.atores = MESSAGE.ERROR_NOT_FOUND.message
                        }

                        // Adicionar diretores
                        let filmDirectors = await controllerFilmDirector.listDirectorsByIdFilm(filme.filme_id)

                        if (filmDirectors.status_code == 200) {
                            filme.diretores = filmDirectors.response.film_directors
                        } else {
                            filme.diretores = MESSAGE.ERROR_NOT_FOUND.message
                        }

                        // Adicionar estúdios
                        let filmStudios = await controllerFilmStudio.listStudiosByIdFilm(filme.filme_id)

                        if (filmStudios.status_code == 200) {
                            filme.estudios = filmStudios.response.film_studios
                        } else {
                            filme.estudios = MESSAGE.ERROR_NOT_FOUND.message
                        }
                    }

                    

                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film = result

                    return MESSAGE.HEADER //200

                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400

        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}
//Insere um novo filme
const inserirFilme = async (filme, contentType) => {


    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = validarDadosFilme(filme)

            if (!validarDados) {

                //Chama a função do DAO para inserir um novo filme
                let result = await filmeDAO.setInsertFilms(filme)

                if (result) {


                    //Chama a função para receber o ID gerado no BD
                    let lastIdFilme = await filmeDAO.getSelectLastIdFilm()

                    if (lastIdFilme) {

                        //Processamento para inserir dados na tabela de relação
                        //Relação entre filme e genero

                        // Repetição para pegar cada genero e enviar para o
                        // DAO do filmeGenero

                        //filme.genero.forEach(async (genero) => {
                        for (genero of filme.genero) {
                            let filmeGenero = {
                                filme_id: lastIdFilme,
                                genero_id: genero.id
                            }

                            let resultFilmeGenero = await controllerFilmeGenero.insertFilmGenre(filmeGenero, contentType)

                            if (resultFilmeGenero.status_code != 201) {
                                return MESSAGE.ERROR_RELATION_TABLE
                            }
                        }

                        // Inserir atores se existirem
                        if (filme.atores && filme.atores.length > 0) {
                            for (ator of filme.atores) {
                                let filmeAtor = {
                                    filme_id: lastIdFilme,
                                    ator_id: ator.ator_id,
                                    papel: ator.papel
                                }

                                let resultFilmeAtor = await controllerFilmActor.insertFilmActor(filmeAtor, contentType)

                                if (resultFilmeAtor.status_code != 201) {
                                    return MESSAGE.ERROR_RELATION_TABLE
                                }
                            }
                        }

                        // Inserir diretores se existirem
                        if (filme.diretores && filme.diretores.length > 0) {
                            for (diretor of filme.diretores) {
                                let filmeDiretor = {
                                    filme_id: lastIdFilme,
                                    diretor_id: diretor.diretor_id
                                }

                                let resultFilmeDiretor = await controllerFilmDirector.insertFilmDirector(filmeDiretor, contentType)

                                if (resultFilmeDiretor.status_code != 201) {
                                    return MESSAGE.ERROR_RELATION_TABLE
                                }
                            }
                        }

                        // Inserir estúdios se existirem
                        if (filme.estudios && filme.estudios.length > 0) {
                            for (estudio of filme.estudios) {
                                let filmeEstudio = {
                                    filme_id: lastIdFilme,
                                    estudio_id: estudio.estudio_id,
                                    tipo_producao: estudio.tipo_producao || 'Principal'
                                }

                                let resultFilmeEstudio = await controllerFilmStudio.insertFilmStudio(filmeEstudio, contentType)

                                if (resultFilmeEstudio.status_code != 201) {
                                    return MESSAGE.ERROR_RELATION_TABLE
                                }
                            }
                        }


                        filme.filme_id = lastIdFilme
                        MESSAGE.HEADER.status = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_CREATED_ITEM.message


                        //Processamento para trazer dados dos generos cadastrados na tabela de relação
                        //Apaga o atributo genero que chegou no POST com apenas os ID's
                        delete filme.genero

                        //Pesquisa no banco de dados quais os generos e os seus dados que foram inseridos na tabela de relação
                        let resultGenerosFilme = await controllerFilmeGenero.listGenreIdFilm(lastIdFilme)

                        //Adiciona novamente o atributo genero com todas as informações do genero (ID, Nome)
                        filme.genero = resultGenerosFilme.response.film_genre

                        MESSAGE.HEADER.response = filme

                        return MESSAGE.HEADER
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL // 500
                    }
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
                }
            } else {
                return validarDados //400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}
//Atualiza um filme filtrando pelo ID
const atualizarFilme = async (filme, id, contentType) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = await validarDadosFilme(filme)

            if (!validarDados) {

                let validarID = await buscarFilmePorId(id)

                //verifica se o ID existe no BD, caso exista teremos o status 200
                if (validarID.status_code == 200) {

                    filme.id = parseInt(id)
                    //Chama a função do DAO para atualizar um novo filme
                    let result = await filmeDAO.setUpdateFilms(filme)

                    if (result) {

                        for (genero of filme.genero) {
                            let filmeGenero = {
                                filme_id: filme.id,
                                genero_id: genero.id
                            }

                            let resultFilmeGenero = await controllerFilmeGenero.insertFilmGenre(filmeGenero, contentType)

                            if (resultFilmeGenero.status_code != 201) {
                                return MESSAGE.ERROR_RELATION_TABLE
                            }

                        }

                        // Inserir atores se existirem
                        if (filme.atores && filme.atores.length > 0) {
                            for (ator of filme.atores) {
                                let filmeAtor = {
                                    filme_id: filme.id,
                                    ator_id: ator.ator_id,
                                    papel: ator.papel
                                }

                                let resultFilmeAtor = await controllerFilmActor.insertFilmActor(filmeAtor, contentType)

                                if (resultFilmeAtor.status_code != 201) {
                                    return MESSAGE.ERROR_RELATION_TABLE
                                }
                            }
                        }

                        // Inserir diretores se existirem
                        if (filme.diretores && filme.diretores.length > 0) {
                            for (diretor of filme.diretores) {
                                let filmeDiretor = {
                                    filme_id: filme.id,
                                    diretor_id: diretor.diretor_id
                                }

                                let resultFilmeDiretor = await controllerFilmDirector.insertFilmDirector(filmeDiretor, contentType)

                                if (resultFilmeDiretor.status_code != 201) {
                                    return MESSAGE.ERROR_RELATION_TABLE
                                }
                            }
                        }

                        // Inserir estúdios se existirem
                        if (filme.estudios && filme.estudios.length > 0) {
                            for (estudio of filme.estudios) {
                                let filmeEstudio = {
                                    filme_id: filme.id,
                                    estudio_id: estudio.estudio_id,
                                    tipo_producao: estudio.tipo_producao || 'Principal'
                                }

                                let resultFilmeEstudio = await controllerFilmStudio.insertFilmStudio(filmeEstudio, contentType)

                                if (resultFilmeEstudio.status_code != 201) {
                                    return MESSAGE.ERROR_RELATION_TABLE
                                }
                            }
                        }

                        MESSAGE.HEADER.status = MESSAGE.SUCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_UPDATED_ITEM.message

                        //Processamento para trazer dados dos generos cadastrados na tabela de relação
                        //Apaga o atributo genero que chegou no POST com apenas os ID's
                        delete filme.genero

                        //Pesquisa no banco de dados quais os generos e os seus dados que foram inseridos na tabela de relação
                        let resultGenerosFilme = await controllerFilmeGenero.listGenreIdFilm(id)

                        //Adiciona novamente o atributo genero com todas as informações do genero (ID, Nome)
                        filme.genero = resultGenerosFilme.response.film_genre

                        MESSAGE.HEADER.response = filme

                        return MESSAGE.HEADER //200

                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                } else {
                    return validarID //400, 404 ou 500
                }
            } else {
                return validarDados //400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}
//Apaga um filme filtrando pelo ID
const excluirFilmeId = async (id) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let validarID = await buscarFilmePorId(id)
        if (validarID.status_code == 200) {
            let result = await filmeDAO.setDeleteFilms(parseInt(id))
            if (result) {
                MESSAGE.HEADER.status = MESSAGE.SUCESS_DELETED_ITEM.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCESS_DELETED_ITEM.status_code
                MESSAGE.HEADER.message = MESSAGE.SUCESS_DELETED_ITEM.message
                delete MESSAGE.HEADER.response

                return MESSAGE.HEADER //200
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            return validarID //400, 404 OU 500
        }
    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}
//Validação dos dados de cadastro do filme
const validarDadosFilme = (filme) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (filme.nome == '' || filme.nome == null || filme.nome == undefined || filme.nome.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [NOME] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (filme.sinopse == undefined) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [SINOPSE] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400 

    } else if (filme.data_lancamento == undefined || filme.data_lancamento.length != 10) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [DATA_LANCAMENTO] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (filme.duracao == '' || filme.duracao == null || filme.duracao == undefined || filme.duracao.length > 8) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [DURACAO] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (filme.orcamento == '' || filme.orcamento == null || filme.orcamento == undefined || typeof (filme.orcamento) != 'number') {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [ORCAMENTO] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (filme.trailer == undefined || filme.trailer.length > 200) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [TRAILER] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (filme.capa == '' || filme.capa == null || filme.capa == undefined || filme.capa.length > 200) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [CAPA] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else {
        return false
    }
}
module.exports = {
    listarFilmes,
    buscarFilmePorId,
    validarDadosFilme,
    inserirFilme,
    atualizarFilme,
    excluirFilmeId
}