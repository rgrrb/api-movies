/********************************************************
 *
 * Objetivo: Arquivo responsável pela manipulação de dados
 *           entre o APP e a Model, para o CRUD de filme e ator
 *
 * Data: 15/12/2025
 * Autor: Roger Ribeiro de Oliveira
 * Versão: 1.0
 *
 *******************************************************/
//Import do arquivo DAO para manipular o crud no banco de dados
const filmActorDAO = require('../../model/dao/filme_ator.js')

//Import o arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../module/config_messages.js')

//Retorna uma lista de filmes e atores
const getSelectAllFilmsActors = async () => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    //Realizando uma cópia do objeto message_default, permitindo que as alterações desta função
    //não interfiram em outras funções

    try {
        //Chama a função do DAO para retornar a lista de filmes e atores
        let result = await filmActorDAO.getSelectAllFilmsActors()
        if (result) {
            if (result.length > 0) {
                let filmsActorAmount = result.length
                MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.films_actors_amount = filmsActorAmount
                MESSAGE.HEADER.response.films_actors = result

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

//Retorna um filme ator filtrando pelo ID
const searchFilmActorById = async (id) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && id > 0 && !isNaN(id)) {
            //CHAMAR A FUNÇÃO PARA FILTRAR PELO ID
            let result = await filmActorDAO.getSelectByIdFilmActor(parseInt(id))

            if (result) {
                if (result.length > 0) {

                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film_actor = result

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

//Retorna os atores filtrando pelo id do filme
const listActorsByIdFilm = async (filmeId) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (filmeId != '' && filmeId != null && filmeId != undefined && filmeId > 0 && !isNaN(filmeId)) {
            //CHAMAR A FUNÇÃO PARA FILTRAR PELO ID
            let result = await filmActorDAO.getSelectActorsByIdFilm(parseInt(filmeId))

            if (result) {

                if (result.length > 0) {

                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film_actors = result

                    return MESSAGE.HEADER //200

                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [FILME ID] inválido'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400

        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Retorna os filmes filtrando pelo id do ator
const listFilmsByIdActor = async (atorId) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (atorId != '' && atorId != null && atorId != undefined && atorId > 0 && !isNaN(atorId)) {
            //CHAMAR A FUNÇÃO PARA FILTRAR PELO ID
            let result = await filmActorDAO.getSelectFilmsByIdActor(parseInt(atorId))

            if (result) {
                if (result.length > 0) {

                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.actor_films = result

                    return MESSAGE.HEADER //200

                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ATOR ID] inválido'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400

        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Insere um novo relacionamento filme-ator
const insertFilmActor = async (filmActor, contentType) => {


    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validateData = validateFilmActorData(filmActor)

            if (!validateData) {

                //Chama a função do DAO para inserir um novo relacionamento
                let result = await filmActorDAO.setInsertFilmsActors(filmActor)

                if (result) {

                    //Chama a função para receber o ID gerado no BD
                    let lastFilmActorId = await filmActorDAO.getSelectLastId()

                    if (lastFilmActorId) {
                        filmActor.id = lastFilmActorId
                        MESSAGE.HEADER.status = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = filmActor

                        return MESSAGE.HEADER
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL // 500
                    }
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
                }
            } else {
                return validateData //400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

//Atualiza um filme ator filtrando pelo ID
const updateFilmActor = async (filmActor, id, contentType) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validateData = validateFilmActorData(filmActor)

            if (!validateData) {

                let validateID = await searchFilmActorById(id)

                //verifica se o ID existe no BD, caso exista teremos o status 200
                if (validateID.status_code == 200) {

                    filmActor.id = parseInt(id)
                    //Chama a função do DAO para atualizar um relacionamento
                    let result = await filmActorDAO.setUpdateFilmActor(filmActor)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = filmActor

                        return MESSAGE.HEADER //200

                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                } else {
                    return validateID //400, 404 ou 500
                }
            } else {
                return validateData //400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Apaga um filme ator filtrando pelo ID
const deleteFilmActorById = async (id) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let validateID = await searchFilmActorById(id)
        if (validateID.status_code == 200) {
            let result = await filmActorDAO.setDeleteFilmsActor(parseInt(id))
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
            return validateID //400, 404 OU 500
        }
    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

//Validação dos dados de cadastro do relacionamento filme-ator
const validateFilmActorData = (filmActor) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (filmActor.filme_id == '' || filmActor.filme_id == null || filmActor.filme_id == undefined || isNaN(filmActor.filme_id) || filmActor.filme_id <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [ID do filme] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (filmActor.ator_id == '' || filmActor.ator_id == null || filmActor.ator_id == undefined || isNaN(filmActor.ator_id) || filmActor.ator_id <= 0){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [ID do ator] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    } else if (filmActor.papel == '' || filmActor.papel == null || filmActor.papel == undefined || filmActor.papel.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [papel] inválido ou excede 100 caracteres"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    } else {
        return false
    }
}

module.exports = {
    getSelectAllFilmsActors,
    searchFilmActorById,
    listActorsByIdFilm,
    listFilmsByIdActor,
    insertFilmActor,
    updateFilmActor,
    deleteFilmActorById
}