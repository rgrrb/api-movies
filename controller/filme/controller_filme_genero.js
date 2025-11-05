/********************************************************
 * 
 * Objetivo: Arquivo responsável pela manipulação de dados 
 *           entre o APP e a Model, para o CRUD de filme e genero
 * 
 * Data: 05/11/2025
 * Autor: Roger Ribeiro de Oliveira
 * Versão: 1.0
 * 
 *******************************************************/
//Import do arquivo DAO para manipular o crud no banco de dados
const filmGenreDAO = require('../../model/dao/filme_genero.js')

//Import o arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../module/config_messages.js')

//Retorna uma lista de filmes e generos
const getSelectAllFilmsGenres = async () => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
     
    //Realizando uma cópia do objeto message_default, permitindo que as alterações desta função
    //não interfiram em outras funções

    try {
        //Chama a função do DAO para retornar a lista de filmes e generos   
        let result = await filmGenreDAO.getSelectAllFilmsGenres()
        if (result) {
            if (result.length > 0) {
                let filmsGenreAmount = result.length
                MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.films_genres_amount = filmsGenreAmount
                MESSAGE.HEADER.response.films_genre = result

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
//Retorna um filme genero filtrando pelo ID
const searchFilmGenreById = async (id) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && id > 0 && !isNaN(id)) {
            //CHAMAR A FUNÇÃO PARA FILTRAR PELO ID
            let result = await filmGenreDAO.getSelectByIdFilmGenre(parseInt(id))

            if (result) {
                if (result.length > 0) {

                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film_genre = result

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
//Retorna os generos filtrando pelo id do filme
const listGenreIdFilm = async (filmeId) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (filmeId != '' && filmeId != null && filmeId != undefined && filmeId > 0 && !isNaN(filmeId)) {
            //CHAMAR A FUNÇÃO PARA FILTRAR PELO ID
            let result = await filmGenreDAO.getSelectGenreByIdFilm(parseInt(filmeId))

            if (result) {
                if (result.length > 0) {

                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film_genre = result

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
//Retorna os filmes filtrando pelo id do genero
const listFilmIdGenre = async (genreId) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (genreId != '' && genreId != null && genreId != undefined && genreId > 0 && !isNaN(genreId)) {
            //CHAMAR A FUNÇÃO PARA FILTRAR PELO ID
            let result = await filmGenreDAO.getSelectFilmsByIdGenre(parseInt(genreId))

            if (result) {
                if (result.length > 0) {

                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film_genre = result

                    return MESSAGE.HEADER //200

                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [GENERO ID] inválido'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400

        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}
//Insere um novo genre
const insertFilmGenre = async (filmGenre, contentType) => {


    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validateData = validateFilmGenreData(filmGenre)

            if (!validateData) {

                //Chama a função do DAO para inserir um novo genero
                let result = await filmGenreDAO.setInsertFilmsGenres(filmGenre)
                
                if (result) {

                    //Chama a função para receber o ID gerado no BD
                    let lastFilmGenreId = await filmGenreDAO.getSelectLastId()

                    if (lastFilmGenreId) {
                        filmGenre.id = lastFilmGenreId
                        MESSAGE.HEADER.status = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = filmGenre

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
//Atualiza um filme genero filtrando pelo ID
const updateFilmGenre = async (filmGenre, id, contentType) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validateData = validateFilmGenreData(filmGenre)

            if (!validateData) {

                let validateID = await searchFilmGenreById(id)

                //verifica se o ID existe no BD, caso exista teremos o status 200
                if (validateID.status_code == 200) {

                    filmGenre.id = parseInt(id)
                    //Chama a função do DAO para atualizar um novo genero
                    let result = await filmGenreDAO.setUpdateFilmGenre(filmGenre)
                    
                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = filmGenre

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
//Apaga um filme genero filtrando pelo ID
const deleteGenreById = async (id) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let validateID = await searchFilmGenreById(id)
        if (validateID.status_code == 200) {
            let result = await filmGenreDAO.setDeleteFilmsGenre(parseInt(id))
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
//Validação dos dados de cadastro do genero
const validateFilmGenreData = (filmGenre) => {
    console.log("entrou")
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (filmGenre.filme_id == '' || filmGenre.filme_id == null || filmGenre.filme_id == undefined || isNaN(filmGenre.filme_id) || filmGenre.filme_id <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [ID do filme] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (filmGenre.genero_id == '' || filmGenre.genero_id == null || filmGenre.genero_id == undefined || isNaN(filmGenre.genero_id) || filmGenre.genero_id <= 0){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [ID do genero] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    } else {
        return false
    }
}
module.exports = {
    getSelectAllFilmsGenres,
    searchFilmGenreById,
    listFilmIdGenre,
    listGenreIdFilm,
    insertFilmGenre,
    updateFilmGenre,
    deleteGenreById
}