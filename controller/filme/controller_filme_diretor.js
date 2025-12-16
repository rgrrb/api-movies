/********************************************************
 *
 * Objetivo: Arquivo responsável pela manipulação de dados
 *           entre o APP e a Model, para o CRUD de filme e diretor
 *
 * Data: 15/12/2025
 * Autor: Roger Ribeiro de Oliveira
 * Versão: 1.0
 *
 *******************************************************/
//Import do arquivo DAO para manipular o crud no banco de dados
const filmDirectorDAO = require('../../model/dao/filme_diretor.js')

//Import o arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../module/config_messages.js')

//Retorna uma lista de filmes e diretores
const getSelectAllFilmsDirectors = async () => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    //Realizando uma cópia do objeto message_default, permitindo que as alterações desta função
    //não interfiram em outras funções

    try {
        //Chama a função do DAO para retornar a lista de filmes e diretores
        let result = await filmDirectorDAO.getSelectAllFilmsDirectors()
        if (result) {
            if (result.length > 0) {
                let filmsDirectorAmount = result.length
                MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.films_directors_amount = filmsDirectorAmount
                MESSAGE.HEADER.response.films_directors = result

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

//Retorna um filme diretor filtrando pelo ID
const searchFilmDirectorById = async (id) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && id > 0 && !isNaN(id)) {
            //CHAMAR A FUNÇÃO PARA FILTRAR PELO ID
            let result = await filmDirectorDAO.getSelectByIdFilmDirector(parseInt(id))

            if (result) {
                if (result.length > 0) {

                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film_director = result

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

//Retorna os diretores filtrando pelo id do filme
const listDirectorsByIdFilm = async (filmeId) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (filmeId != '' && filmeId != null && filmeId != undefined && filmeId > 0 && !isNaN(filmeId)) {
            //CHAMAR A FUNÇÃO PARA FILTRAR PELO ID
            let result = await filmDirectorDAO.getSelectDirectorsByIdFilm(parseInt(filmeId))

            if (result) {

                if (result.length > 0) {

                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film_directors = result

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

//Retorna os filmes filtrando pelo id do diretor
const listFilmsByIdDirector = async (diretorId) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (diretorId != '' && diretorId != null && diretorId != undefined && diretorId > 0 && !isNaN(diretorId)) {
            //CHAMAR A FUNÇÃO PARA FILTRAR PELO ID
            let result = await filmDirectorDAO.getSelectFilmsByIdDirector(parseInt(diretorId))

            if (result) {
                if (result.length > 0) {

                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.director_films = result

                    return MESSAGE.HEADER //200

                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [DIRETOR ID] inválido'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400

        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Insere um novo relacionamento filme-diretor
const insertFilmDirector = async (filmDirector, contentType) => {


    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validateData = validateFilmDirectorData(filmDirector)

            if (!validateData) {

                //Chama a função do DAO para inserir um novo relacionamento
                let result = await filmDirectorDAO.setInsertFilmsDirectors(filmDirector)

                if (result) {

                    //Chama a função para receber o ID gerado no BD
                    let lastFilmDirectorId = await filmDirectorDAO.getSelectLastId()

                    if (lastFilmDirectorId) {
                        filmDirector.id = lastFilmDirectorId
                        MESSAGE.HEADER.status = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = filmDirector

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

//Atualiza um filme diretor filtrando pelo ID
const updateFilmDirector = async (filmDirector, id, contentType) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validateData = validateFilmDirectorData(filmDirector)

            if (!validateData) {

                let validateID = await searchFilmDirectorById(id)

                //verifica se o ID existe no BD, caso exista teremos o status 200
                if (validateID.status_code == 200) {

                    filmDirector.id = parseInt(id)
                    //Chama a função do DAO para atualizar um relacionamento
                    let result = await filmDirectorDAO.setUpdateFilmDirector(filmDirector)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = filmDirector

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

//Apaga um filme diretor filtrando pelo ID
const deleteFilmDirectorById = async (id) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let validateID = await searchFilmDirectorById(id)
        if (validateID.status_code == 200) {
            let result = await filmDirectorDAO.setDeleteFilmsDirector(parseInt(id))
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

//Validação dos dados de cadastro do relacionamento filme-diretor
const validateFilmDirectorData = (filmDirector) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (filmDirector.filme_id == '' || filmDirector.filme_id == null || filmDirector.filme_id == undefined || isNaN(filmDirector.filme_id) || filmDirector.filme_id <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [ID do filme] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (filmDirector.diretor_id == '' || filmDirector.diretor_id == null || filmDirector.diretor_id == undefined || isNaN(filmDirector.diretor_id) || filmDirector.diretor_id <= 0){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [ID do diretor] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    } else {
        return false
    }
}

module.exports = {
    getSelectAllFilmsDirectors,
    searchFilmDirectorById,
    listDirectorsByIdFilm,
    listFilmsByIdDirector,
    insertFilmDirector,
    updateFilmDirector,
    deleteFilmDirectorById
}