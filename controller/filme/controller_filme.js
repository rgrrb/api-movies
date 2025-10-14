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
const filmeDAO = require('../../model/dao/filmeDAO.js')

//Import od arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../module/config_messages.js')

//Retorna uma lista de filmes
const listarFilmes = async () => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    //Chama a função do DAO para retornar a lista de filmes     
    //Realizando uma cópia do objeto message_default, permitindo que as alterações desta função
    //não interfiram em outras funções

    try {

        let result = await filmeDAO.getSelectAllFilms()
        if (result) {
            if (result.length > 0) {
                let filmsAmount = result.length
                MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.Films_Amount = filmsAmount
                MESSAGE.HEADER.response.films = result

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
//Retorna um filme filtrando pelo ID
const buscarFilmePorId = async (id) => {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && id > 0 && !isNaN(id)) {
            //CHAMAR A FUNÇÃO PARA FILTRAR PELO ID
            let result = await filmeDAO.getSelectByIdFilms(parseInt(id))

            if (result) {
                if (result.length > 0) {

                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film = result

                    return MESSAGE.HEADER //200

                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}
//Insere um novo filme
const inserirFilme = async (filme, contentType) => {


    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            if (filme.nome == '' || filme.nome == null || filme.nome == undefined || filme.nome.length > 100) {
                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [NOME] inválido"
                return MESSAGE.ERROR_REQUIRED_FIELDS //400

            } else if (filme.sinopse == undefined) {
                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [SINOPSE] inválido"
                return MESSAGE.ERROR_REQUIRED_FIELDS //400 

            } else if (filme.data_lancamento == undefined || filme.data_lancamento.length != 10) {
                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [DATA_LANCAMENTO] inválido"
                return MESSAGE.ERROR_REQUIRED_FIELDS //400

            } else if (filme.duracao == '' || filme.duracao == null || filme.duracao == undefined || filme.nome.length > 8) {
                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [DURACAO] inválido"
                return MESSAGE.ERROR_REQUIRED_FIELDS //400

            } else if (filme.orcamento == '' || filme.orcamento == null || filme.orcamento == undefined || typeof(filme.orcamento) == 'Number') {
                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [ORCAMENTO] inválido"
                return MESSAGE.ERROR_REQUIRED_FIELDS //400

            } else if (filme.trailer == undefined || filme.trailer.length > 200) {
                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [TRAILER] inválido"
                return MESSAGE.ERROR_REQUIRED_FIELDS //400

            } else if (filme.capa == '' || filme.capa == null || filme.capa == undefined || filme.capa.length > 200) {
                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [CAPA] inválido"
                return MESSAGE.ERROR_REQUIRED_FIELDS //400

            } else {
                //Chama a função do DAO para inserir um novo filme
                let result = await filmeDAO.setInsertFilms(filme)

                if (result) {
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_CREATED_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_CREATED_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCESS_CREATED_ITEM.message

                    return MESSAGE.HEADER

                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
                }
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}
//Atualiza um filme filtrando pelo ID
const atualizarFilme = async (id, filme) => {

}
//Apaga um filme filtrando pelo ID
const excluirFilmeId = async (id) => {

}

module.exports = {
    listarFilmes,
    buscarFilmePorId,
    inserirFilme
}