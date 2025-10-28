/********************************************************
 * 
 * Objetivo: Arquivo responsável pela realização do CRUD
 *           No Banco de Dados MySQL
 * 
 * Data: 28/10/2025
 * Autor: Roger Ribeiro de Oliveira
 * Versão: 1.0
 * 
 *******************************************************/

const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos as faixa etarias do banco de dados
const getSelectAllStudios = async () => {
    try {

        //Script SQL
        let sql = `select * from tbl_estudio order by estudio_id desc;`

        //Executa no Banco de Dados o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

//Retorna uma faixa etaria filtrando pelo ID do banco de dados
const getSelectByIdStudio  = async (id) => {

    try {

        //Script SQL
        let sql = `select * from tbl_estudio where estudio_id=${id};`

        //Executa no Banco de Dados o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

const getSelectLastIdStudio  = async () => {
    try {

        //Script SQL
        let sql = `select estudio_id from tbl_estudio order by estudio_id desc limit 1`

        //Executa no Banco de Dados o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return Number(result[0].filme_id)
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

//Insere uma faixa etaria no banco de dados
const setInsertStudio = async (studio) => {

    try {
        let sql = `INSERT INTO tbl_estudio (nome, cnpj, logradouro, bairro, cidade, complemento)
                   VALUES (
                    '${studio.nome}',
                    '${studio.cnpj}',
                    '${studio.logradouro}'
                    '${studio.bairro}'
                    '${studio.cidade}'
                    '${studio.complemento}'
                   );`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        }
    } catch (error) {
        return false
    }

}

//Atualiza uma faixa etaria existente no banco de dados filtrando pelo ID
const setUpdateStudio  = async (studio) => {

    try {
        let sql = `UPDATE tbl_estudio
                   SET 
                       nome                 = '${studio.nome}',
                       cnpj                 = '${studio.cnpj}',
                       logradouro           = '${studio.logradouro}',
                       bairro               = '${studio.bairro}',
                       cidade               = '${studio.cidade}',
                       complemento          = '${studio.complemento}'
                   WHERE estudio_id         = ${studio.id};`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        }
    } catch (error) {
        return false
    }

}

//Apaga uma faixa etaria existente no banco de dados filtrando pelo ID
const setDeleteStudio  = async (id) => {

    try {

        //Script SQL
        let sql = `delete from tbl_estudio where estudio_id=${id};`

        //Executa no Banco de Dados o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    getSelectAllStudios,
    getSelectByIdStudio,
    getSelectLastIdStudio,
    setInsertStudio,
    setUpdateStudio,
    setDeleteStudio
}