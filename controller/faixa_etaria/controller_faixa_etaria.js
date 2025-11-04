/********************************************************
 * * Objetivo: Arquivo responsável pela manipulação de dados 
 *             entre o APP e a Model (Validações, tratamento de dados,
 *             tratamento de erros, etc)
 * Data: 29/10/2025
 * Autor: Roger Ribeiro de Oliveira
 * Versão: 1.0
 * *******************************************************/
//Import do arquivo DAO para manipular o crud no banco de dados
const ageGroupDAO = require('../../model/dao/age_rating.js')

//Import od arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../module/config_messages.js')

//Retorna uma lista de faixa etárias
const getAllAgeRatings = async () => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    
    //Realizando uma cópia do objeto message_default, permitindo que as alterações desta função
    //não interfiram em outras funções

    try {

        //Chama a função do DAO para retornar a lista de faixa etárias  
        let result = await ageGroupDAO.getSelectAllAgeGroup()
        if (result) {
            if (result.length > 0) {
                let ageGroupAmount = result.length
                MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.age_group_amount = ageGroupAmount
                MESSAGE.HEADER.response.age_group = result

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
//Retorna uma faixa etária filtrando pelo ID
const searchAgeRatingById = async (id) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && id > 0 && !isNaN(id)) {
            //CHAMAR A FUNÇÃO PARA FILTRAR PELO ID
            let result = await ageGroupDAO.getSelectByIdAgeGroup(parseInt(id))

            if (result) {
                if (result.length > 0) {

                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.age_group = result

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
//Insere uma nova faixa etária
const insertAgeRating = async (ageGroup, contentType) => {


    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = validateAgeGroupData(ageGroup)

            if (!validarDados) {

                //Chama a função do DAO para inserir uma nova faixa etária
                let result = await ageGroupDAO.setInsertAgeGroup(ageGroup)

                if (result) {

                    //Chama a função para receber o ID gerado no BD
                    let lastIdAgeGroup = await ageGroupDAO.getSelectLastIdAgeGroup()

                    if (lastIdAgeGroup) {
                        ageGroup.id = lastIdAgeGroup
                        MESSAGE.HEADER.status = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = ageGroup

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
//Atualiza uma faixa etária filtrando pelo ID
const updateAgeRating = async (ageGroup, id, contentType) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = validateAgeGroupData(ageGroup)

            if (!validarDados) {

                let validarID = await searchAgeGroupById(id)

                //verifica se o ID existe no BD, caso exista teremos o status 200
                if (validarID.status_code == 200) {

                    ageGroup.id = parseInt(id)
                    //Chama a função do DAO para atualizar um novo faixa etaria
                    let result = await ageGroupDAO.setUpdateAgeGroup(ageGroup)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = ageGroup

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
//Apaga uma faixa etaria filtrando pelo ID
const deleteAgeRatingById = async (id) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let validarID = await searchAgeGroupById(id)
        if (validarID.status_code == 200) {
            let result = await ageGroupDAO.setDeleteAgeGroup(parseInt(id))
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
//Validação dos dados de cadastro da faixa etária
const validateAgeGroupData = (ageGroup) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (ageGroup.nome == '' || ageGroup.nome == null || ageGroup.nome == undefined || ageGroup.nome.trim().length > 50 || typeof ageGroup.nome !== 'string') {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [NOME] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (ageGroup.classificacao_indicativa == undefined || typeof ageGroup.classificacao_indicativa !== 'string' || ageGroup.classificacao_indicativa.trim().length < 150 || ageGroup.classificacao_indicativa == '') {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [CLASSIFICACAO INDICATIVA] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    } else {
        return false
    }
}
module.exports = {
    getAllAgeRatings,
    searchAgeRatingById,
    validateAgeGroupData,
    insertAgeRating,
    updateAgeRating,
    deleteAgeRatingById
}