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
const genreDAO = require('../../model/dao/genre.js')

//Import o arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../module/config_messages.js')

//Retorna uma lista de generos
const getSelectAllGenre = async () => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
     
    //Realizando uma cópia do objeto message_default, permitindo que as alterações desta função
    //não interfiram em outras funções

    try {
        //Chama a função do DAO para retornar a lista de generos   
        let result = await genreDAO.getSelectAllGenre()
        if (result) {
            if (result.length > 0) {
                let genresAmount = result.length
                MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.genres_Amount = genresAmount
                MESSAGE.HEADER.response.genres = result

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
//Retorna um genero filtrando pelo ID
const searchGenreById = async (id) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && id > 0 && !isNaN(id)) {
            //CHAMAR A FUNÇÃO PARA FILTRAR PELO ID
            let result = await genreDAO.getSelectByIdGenre(parseInt(id))

            if (result) {
                if (result.length > 0) {

                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.genero = result

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
//Insere um novo genre
const insertGenre = async (genre, contentType) => {


    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = await validateGenreData(genre)

            if (!validarDados) {

                //Chama a função do DAO para inserir um novo genero
                let result = await genreDAO.setInsertGenre(genre)
                
                if (result) {

                    //Chama a função para receber o ID gerado no BD
                    let lastIdGenre = await genreDAO.getSelectLastIdGenre()

                    if (lastIdGenre) {
                        genre.id = lastIdGenre
                        MESSAGE.HEADER.status = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = genre

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
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}
//Atualiza um genero filtrando pelo ID
const updateGenre = async (genre, id, contentType) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = await validateGenreData(genre)

            if (!validarDados) {

                let validarID = await searchGenreById(id)

                //verifica se o ID existe no BD, caso exista teremos o status 200
                if (validarID.status_code == 200) {

                    genre.id = parseInt(id)
                    //Chama a função do DAO para atualizar um novo genero
                    let result = await genreDAO.setUpdateGenre(genre)
                    
                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = genre

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
//Apaga um genero filtrando pelo ID
const deleteGenreById = async (id) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let validarID = await searchGenreById(id)
        if (validarID.status_code == 200) {
            let result = await genreDAO.setDeleteGenre(parseInt(id))
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
//Validação dos dados de cadastro do genero
const validateGenreData = async (genre) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (genre.nome == '' || genre.nome == null || genre.nome == undefined || genre.nome.length > 35) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [NOME] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else {
        return false
    }
}
module.exports = {
    getSelectAllGenre,
    searchGenreById,
    insertGenre,
    updateGenre,
    deleteGenreById
}