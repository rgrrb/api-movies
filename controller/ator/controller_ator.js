/********************************************************
 * * Objetivo: Arquivo responsável pela manipulação de dados 
 *             entre o APP e a Model (Validações, tratamento de dados,
 *             tratamento de erros, etc)
 * Data: 29/10/2025
 * Autor: Roger Ribeiro de Oliveira
 * Versão: 1.0
 * *******************************************************/
//Import do arquivo DAO para manipular o crud no banco de dados
const actorDAO = require('../../model/dao/actor.js')

//Import od arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../module/config_messages.js')

//Retorna uma lista de atores
const getAllActors = async () => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    //Chama a função do DAO para retornar a lista de atores   
    //Realizando uma cópia do objeto message_default, permitindo que as alterações desta função
    //não interfiram em outras funções

    try {

        let result = await actorDAO.getSelectAllActors()
        if (result) {
            if (result.length > 0) {
                let actorsAmount = result.length
                MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.actors_Amount = actorsAmount
                MESSAGE.HEADER.response.actors = result

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
//Retorna um ator filtrando pelo ID
const searchActorById = async (id) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && id > 0 && !isNaN(id)) {
            //CHAMAR A FUNÇÃO PARA FILTRAR PELO ID
            let result = await actorDAO.getSelectByIdActor(parseInt(id))

            if (result) {
                if (result.length > 0) {

                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.actor = result

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
//Insere um novo ator
const insertActor = async (ator, contentType) => {


    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = await validateActorData(ator)

            if (!validarDados) {

                //Chama a função do DAO para inserir um novo ator
                let result = await actorDAO.setInsertActor(ator)

                if (result) {

                    //Chama a função para receber o ID gerado no BD
                    let lastIdActor = await actorDAO.getSelectLastIdActor()

                    if (lastIdActor) {
                        ator.id = lastIdActor
                        MESSAGE.HEADER.status = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = ator

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
//Atualiza um ator filtrando pelo ID
const updateActor = async (ator, id, contentType) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = await validarDadosAtor(ator)

            if (!validarDados) {

                let validarID = await buscarAtorPorId(id)

                //verifica se o ID existe no BD, caso exista teremos o status 200
                if (validarID.status_code == 200) {

                    ator.id = parseInt(id)
                    //Chama a função do DAO para atualizar um novo ator
                    let result = await actorDAO.setUpdateActor(ator)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = ator

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
//Apaga um ator filtrando pelo ID
const deleteActorById = async (id) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let validarID = await buscarAtorPorId(id)
        if (validarID.status_code == 200) {
            let result = await actorDAO.setDeleteActor(parseInt(id))
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
//Validação dos dados de cadastro do ator
const validateActorData = async (ator) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (!ator.nome || typeof ator.nome !== 'string' || ator.nome.trim().length === 0 || ator.nome.trim().length > 120) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [NOME] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (!ator.data_nascimento || typeof ator.data_nascimento !== 'string' || !DATE_REGEX.test(ator.data_nascimento.trim())) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [DATA_NASCIMENTO] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (!ator.altura || isNaN(Number(ator.altura)) || Number(ator.altura) <= 0 || Number(ator.altura) > 3.0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [ALTURA] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (!ator.peso || isNaN(Number(ator.peso)) || Number(ator.peso) <= 0 || Number(ator.peso) > 500) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [PESO] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else {
        return false
    }
}
module.exports = {
    getAllActors,
    searchActorById,
    validateActorData,
    insertActor,
    updateActor,
    deleteActorById
}