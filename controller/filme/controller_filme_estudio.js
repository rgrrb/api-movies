/********************************************************
 *
 * Objetivo: Arquivo responsável pela manipulação de dados
 *           entre o APP e a Model, para o CRUD de filme e estúdio
 *
 * Data: 15/12/2025
 * Autor: Roger Ribeiro de Oliveira
 * Versão: 1.0
 *
 *******************************************************/
//Import do arquivo DAO para manipular o crud no banco de dados
const filmStudioDAO = require('../../model/dao/filme_estudio.js')

//Import o arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../module/config_messages.js')

//Retorna uma lista de filmes e estúdios
const getSelectAllFilmsStudios = async () => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    //Realizando uma cópia do objeto message_default, permitindo que as alterações desta função
    //não interfiram em outras funções

    try {
        //Chama a função do DAO para retornar a lista de filmes e estúdios
        let result = await filmStudioDAO.getSelectAllFilmsStudios()
        if (result) {
            if (result.length > 0) {
                let filmsStudioAmount = result.length
                MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.films_studios_amount = filmsStudioAmount
                MESSAGE.HEADER.response.films_studios = result

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

//Retorna um filme estúdio filtrando pelo ID
const searchFilmStudioById = async (id) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && id > 0 && !isNaN(id)) {
            //CHAMAR A FUNÇÃO PARA FILTRAR PELO ID
            let result = await filmStudioDAO.getSelectByIdFilmStudio(parseInt(id))

            if (result) {
                if (result.length > 0) {

                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film_studio = result

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

//Retorna os estúdios filtrando pelo id do filme
const listStudiosByIdFilm = async (filmeId) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (filmeId != '' && filmeId != null && filmeId != undefined && filmeId > 0 && !isNaN(filmeId)) {
            //CHAMAR A FUNÇÃO PARA FILTRAR PELO ID
            let result = await filmStudioDAO.getSelectStudiosByIdFilm(parseInt(filmeId))

            if (result) {

                if (result.length > 0) {

                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film_studios = result

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

//Retorna os filmes filtrando pelo id do estúdio
const listFilmsByIdStudio = async (estudioId) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (estudioId != '' && estudioId != null && estudioId != undefined && estudioId > 0 && !isNaN(estudioId)) {
            //CHAMAR A FUNÇÃO PARA FILTRAR PELO ID
            let result = await filmStudioDAO.getSelectFilmsByIdStudio(parseInt(estudioId))

            if (result) {
                if (result.length > 0) {

                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.studio_films = result

                    return MESSAGE.HEADER //200

                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ESTUDIO ID] inválido'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400

        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Insere um novo relacionamento filme-estúdio
const insertFilmStudio = async (filmStudio, contentType) => {


    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validateData = validateFilmStudioData(filmStudio)

            if (!validateData) {

                //Chama a função do DAO para inserir um novo relacionamento
                let result = await filmStudioDAO.setInsertFilmsStudios(filmStudio)

                if (result) {

                    //Chama a função para receber o ID gerado no BD
                    let lastFilmStudioId = await filmStudioDAO.getSelectLastId()

                    if (lastFilmStudioId) {
                        filmStudio.id = lastFilmStudioId
                        MESSAGE.HEADER.status = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = filmStudio

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

//Atualiza um filme estúdio filtrando pelo ID
const updateFilmStudio = async (filmStudio, id, contentType) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validateData = validateFilmStudioData(filmStudio)

            if (!validateData) {

                let validateID = await searchFilmStudioById(id)

                //verifica se o ID existe no BD, caso exista teremos o status 200
                if (validateID.status_code == 200) {

                    filmStudio.id = parseInt(id)
                    //Chama a função do DAO para atualizar um relacionamento
                    let result = await filmStudioDAO.setUpdateFilmStudio(filmStudio)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = filmStudio

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

//Apaga um filme estúdio filtrando pelo ID
const deleteFilmStudioById = async (id) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let validateID = await searchFilmStudioById(id)
        if (validateID.status_code == 200) {
            let result = await filmStudioDAO.setDeleteFilmsStudio(parseInt(id))
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

//Validação dos dados de cadastro do relacionamento filme-estúdio
const validateFilmStudioData = (filmStudio) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (filmStudio.filme_id == '' || filmStudio.filme_id == null || filmStudio.filme_id == undefined || isNaN(filmStudio.filme_id) || filmStudio.filme_id <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [ID do filme] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (filmStudio.estudio_id == '' || filmStudio.estudio_id == null || filmStudio.estudio_id == undefined || isNaN(filmStudio.estudio_id) || filmStudio.estudio_id <= 0){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [ID do estúdio] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    } else if (filmStudio.tipo_producao == '' || filmStudio.tipo_producao == null || filmStudio.tipo_producao == undefined ||
               !['Principal', 'Co-produção', 'Distribuição'].includes(filmStudio.tipo_producao)) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [tipo_producao] inválido. Deve ser: Principal, Co-produção ou Distribuição"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    } else {
        return false
    }
}

module.exports = {
    getSelectAllFilmsStudios,
    searchFilmStudioById,
    listStudiosByIdFilm,
    listFilmsByIdStudio,
    insertFilmStudio,
    updateFilmStudio,
    deleteFilmStudioById
}