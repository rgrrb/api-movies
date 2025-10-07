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
    //Chama a função do DAO para retornar a lista de filmes     
    let result = await filmeDAO.getSelectAllFilms()

    if(result){
        if(result.length > 0){
            MESSAGE_DEFAULT.MESSAGE_HEADER.status = MESSAGE_DEFAULT.MESSAGE_SUCESS_REQUEST.status
            MESSAGE_DEFAULT.MESSAGE_HEADER.status_code = MESSAGE_DEFAULT.MESSAGE_SUCESS_REQUEST.status_code
            MESSAGE_DEFAULT.MESSAGE_HEADER.response.films = result

            return MESSAGE_DEFAULT.MESSAGE_HEADER
        }
    }
    
}
//Retorna um filme filtrando pelo ID
const buscarFilmePorId = async (id) => {

    
}
//Insere um novo filme
const inserirFilme = async (filme) => {

    
}
//Atualiza um filme filtrando pelo ID
const atualizarFilme = async (id, filme) => {

}
//Apaga um filme filtrando pelo ID
const excluirFilmeId = async (id) => {

}

module.exports = {
    listarFilmes
}