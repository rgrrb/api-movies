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
const characterDAO = require('../../model/dao/character.js')

//Import od arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../module/config_messages.js')

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

//Retorna uma lista de personagens
const getAllCharacters = async () => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    //Realizando uma cópia do objeto message_default, permitindo que as alterações desta função
    //não interfiram em outras funções

    try {
        //Chama a função do DAO para retornar a lista de personagens  
        let result = await characterDAO.getSelectAllCharacters()
        if (result) {
            if (result.length > 0) {
                let characterAmount = result.length
                MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.characters_amount = characterAmount
                MESSAGE.HEADER.response.characters = result

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
//Retorna um personagem filtrando pelo ID
const searchCharacterById = async (id) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && id > 0 && !isNaN(id)) {
            //CHAMAR A FUNÇÃO PARA FILTRAR PELO ID
            let result = await characterDAO.getSelectByIdCharacter(parseInt(id))

            if (result) {
                if (result.length > 0) {

                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.character = result

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
//Insere um novo personagem
const insertCharacter = async (character, contentType) => {


    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = validateCharacterData(character)

            console.log("entrou")
            if (!validarDados) {

                //Chama a função do DAO para inserir um novo personagem
                let result = await characterDAO.setInsertCharacter(character)

                if (result) {

                    //Chama a função para receber o ID gerado no BD
                    let lastIdCharacter = await characterDAO.getSelectLastIdCharacter()

                    if (lastIdCharacter) {
                        character.id = lastIdCharacter
                        MESSAGE.HEADER.status = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = character

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

//Atualiza um personagem filtrando pelo ID
const updateCharacter = async (character, id, contentType) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = validateCharacterData(character)

            if (!validarDados) {

                let validarID = await buscarDiretorPorId(id)

                //verifica se o ID existe no BD, caso exista teremos o status 200
                if (validarID.status_code == 200) {

                    character.id = parseInt(id)
                    //Chama a função do DAO para atualizar um novo personagem
                    let result = await characterDAO.setUpdateDirector(character)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = character

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
//Apaga um personagem filtrando pelo ID
const deleteCharacterById = async (id) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let validarID = await searchCharacterById(id)
        if (validarID.status_code == 200) {
            let result = await characterDAO.setDeleteCharacter(parseInt(id))
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
//Validação dos dados de cadastro do personagem
const validateCharacterData = (character) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (character.nome == '' || character.nome == null || character.nome == undefined || character.nome.trim().length > 120 || typeof character.nome !== 'string') {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [NOME] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (character.data_nascimento == undefined || typeof character.data_nascimento !== 'string' || character.data_nascimento.trim().length !== 10 || !DATE_REGEX.test(character.data_nascimento.trim())) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [DATA_NASCIMENTO] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (character.altura == '' || character.altura == null || character.altura == undefined || character.altura.length > 8) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [ALTURA] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (character.peso == '' || character.peso == null || character.peso == undefined || character.peso <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [PESO] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (character.descricao == '' || character.descricao == null || character.descricao == undefined || character.descricao.length > 255) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [DESCRIÇÃO] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (character.personalidade == '' || character.personalidade == null || character.personalidade == undefined || character.personalidade.length > 150) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [PERSONALIDADE] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (character.habilidades == '' || character.habilidades == null || character.habilidades == undefined || character.habilidades.length > 150) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [HABILIDADES] inválido"
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }
    else {
        return false
    }
}
module.exports = {
    getAllCharacters,
    searchCharacterById,
    insertCharacter,
    updateCharacter,
    deleteCharacterById
}