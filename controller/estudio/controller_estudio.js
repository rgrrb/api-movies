/********************************************************
 * * Objetivo: Arquivo responsável pela manipulação de dados 
 *             entre o APP e a Model (Validações, tratamento de dados,
 *             tratamento de erros, etc)
 * Data: 29/10/2025
 * Autor: Roger Ribeiro de Oliveira
 * Versão: 1.0
 * *******************************************************/
//Import do arquivo DAO para manipular o crud no banco de dados
const studioDAO = require('../../model/dao/studio.js')

//Import od arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../module/config_messages.js')

//Retorna uma lista de estudios
const getAllStudios = async () => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
     
    //Realizando uma cópia do objeto message_default, permitindo que as alterações desta função
    //não interfiram em outras funções

    try {
        //Chama a função do DAO para retornar a lista de estudios  
        let result = await studioDAO.getSelectAllStudios()
        if (result) {
            if (result.length > 0) {
                let studiosAmount = result.length
                MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.studios_Amount = studiosAmount
                MESSAGE.HEADER.response.studios = result

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
//Retorna um estudio filtrando pelo ID
const searchStudioById = async (id) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && id > 0 && !isNaN(id)) {
            //CHAMAR A FUNÇÃO PARA FILTRAR PELO ID
            let result = await studioDAO.getSelectByIdStudio(parseInt(id))

            if (result) {
                if (result.length > 0) {

                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.studio = result

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
//Insere um novo estudio
const insertStudio = async (estudio, contentType) => {


    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = await validateStudioData(estudio)

            if (!validarDados) {

                //Chama a função do DAO para inserir um novo estudio
                let result = await studioDAO.setInsertStudio(estudio)

                if (result) {

                    //Chama a função para receber o ID gerado no BD
                    let lastIdStudio = await studioDAO.getSelectLastIdStudio()

                    if (lastIdStudio) {
                        estudio.id = lastIdStudio
                        MESSAGE.HEADER.status = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = estudio

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
//Atualiza um estudio filtrando pelo ID
const updateStudio = async (estudio, id, contentType) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = await validarDadosEstudio(estudio)

            if (!validarDados) {

                let validarID = await buscarEstudioPorId(id)

                //verifica se o ID existe no BD, caso exista teremos o status 200
                if (validarID.status_code == 200) {

                    estudio.id = parseInt(id)
                    //Chama a função do DAO para atualizar um novo estudio
                    let result = await studioDAO.setUpdateStudio(estudio)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = estudio

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
//Apaga um estudio filtrando pelo ID
const deleteStudioById = async (id) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let validarID = await buscarEstudioPorId(id)
        if (validarID.status_code == 200) {
            let result = await studioDAO.setDeleteStudio(parseInt(id))
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
//Validação dos dados de cadastro do estudio
const validateStudioDate = async (estudio) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (!estudio.nome || typeof estudio.nome !== 'string' || estudio.nome.trim().length === 0 || estudio.nome.trim().length > 120) {
    MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [NOME] inválido"
    return MESSAGE.ERROR_REQUIRED_FIELDS //400

} else if (!estudio.cnpj || typeof estudio.cnpj !== 'string' || !CNPJ_REGEX.test(estudio.cnpj.trim())) {
    MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [CNPJ] inválido"
    return MESSAGE.ERROR_REQUIRED_FIELDS //400

} else if (!estudio.logradouro || typeof estudio.logradouro !== 'string' || estudio.logradouro.trim().length === 0 || estudio.logradouro.trim().length > 120) {
    MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [LOGRADOURO] inválido"
    return MESSAGE.ERROR_REQUIRED_FIELDS //400

} else if (!estudio.bairro || typeof estudio.bairro !== 'string' || estudio.bairro.trim().length === 0 || estudio.bairro.trim().length > 50) {
    MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [BAIRRO] inválido"
    return MESSAGE.ERROR_REQUIRED_FIELDS //400

} else if (!estudio.cidade || typeof estudio.cidade !== 'string' || estudio.cidade.trim().length === 0 || estudio.cidade.trim().length > 50) {
    MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [CIDADE] inválido"
    return MESSAGE.ERROR_REQUIRED_FIELDS //400

} else if (estudio.complemento && (typeof estudio.complemento !== 'string' || estudio.complemento.trim().length > 100)) {
    MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [COMPLEMENTO] inválido"
    return MESSAGE.ERROR_REQUIRED_FIELDS //400

} else {
        return false
    }
}
module.exports = {
    getAllStudios,
    searchStudioById,
    insertStudio,
    updateStudio,
    deleteStudioById
}