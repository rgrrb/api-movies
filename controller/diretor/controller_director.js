/********************************************************
 * 
 * Objetivo: Arquivo responsável pela manipulação de dados 
 *           entre o APP e a Model (Validações, tratamento de dados,
 *           tratamento de erros, etc)
 * 
 * Data: 29/10/2025
 * Autor: Roger Ribeiro de Oliveira
 * Versão: 1.0
 * 
 *******************************************************/
//Import do arquivo DAO para manipular o crud no banco de dados
const directorDAO = require('../../model/dao/director.js')

//Import od arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../module/config_messages.js')

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

//Retorna uma lista de diretores
const getAllDirectors = async () => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    //Chama a função do DAO para retornar a lista de diretores   
    //Realizando uma cópia do objeto message_default, permitindo que as alterações desta função
    //não interfiram em outras funções

    try {

        let result = await directorDAO.getSelectAllDirectors()
        if (result) {
            if (result.length > 0) {
                let directorsAmount = result.length
                MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.directors_Amount = directorsAmount
                MESSAGE.HEADER.response.directors = result

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
//Retorna um diretor filtrando pelo ID
const searchDirectorById = async (id) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && id > 0 && !isNaN(id)) {
            //CHAMAR A FUNÇÃO PARA FILTRAR PELO ID
            let result = await directorDAO.getSelectByIdDirector(parseInt(id))

            if (result) {
                if (result.length > 0) {

                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.director = result

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
//Insere um novo diretor
const insertDirector = async (diretor, contentType) => {


    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = validateDirectorData(diretor)

            if (!validarDados) {

                //Chama a função do DAO para inserir um novo diretor
                let result = await directorDAO.setInsertDirector(diretor)

                if (result) {

                    //Chama a função para receber o ID gerado no BD
                    let lastIdDirector = await directorDAO.getSelectLastIdDirector()

                    if (lastIdDirector) {
                        diretor.id = lastIdDirector
                        MESSAGE.HEADER.status = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = diretor

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
//Atualiza um diretor filtrando pelo ID
const updateDirector = async (diretor, id, contentType) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = validateDirectorData(diretor)

            if (!validarDados) {

                let validarID = await searchDirectorById(id)

                //verifica se o ID existe no BD, caso exista teremos o status 200
                if (validarID.status_code == 200) {

                    diretor.id = parseInt(id)
                    //Chama a função do DAO para atualizar um novo diretor
                    let result = await directorDAO.setUpdateDirector(diretor)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = diretor

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
//Apaga um diretor filtrando pelo ID
const deleteDirectorById = async (id) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let validarID = await searchDirectorById(id)
        if (validarID.status_code == 200) {
            let result = await directorDAO.setDeleteDirector(parseInt(id))
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
//Validação dos dados de cadastro do diretor
const validateDirectorData = (diretor) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (!diretor.nome || typeof diretor.nome !== 'string' || diretor.nome.trim().length === 0 || diretor.nome.trim().length > 120) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [NOME] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (!diretor.data_nascimento || typeof diretor.data_nascimento !== 'string' || !DATE_REGEX.test(diretor.data_nascimento.trim())) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [DATA_NASCIMENTO] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (!diretor.altura || isNaN(Number(diretor.altura)) || Number(diretor.altura) <= 0 || Number(diretor.altura) > 3.0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [ALTURA] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (!diretor.peso || isNaN(Number(diretor.peso)) || Number(diretor.peso) <= 0 || Number(diretor.peso) > 500) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [PESO] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else {
        return false
    }
}
module.exports = {
    getAllDirectors,
    searchDirectorById,
    validateDirectorData,
    insertDirector,
    updateDirector,
    deleteDirectorById
}