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

//Retorna todas as faixa etarias do banco de dados
const getSelectAllAgeGroup = async () => {
    try {

        //Script SQL
        let sql = `select * from tbl_faixa_etaria order by faixa_etaria_id desc;`

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
const getSelectByIdAgeGroup  = async (id) => {

    try {

        //Script SQL
        let sql = `select * from tbl_faixa_etaria where faixa_etaria_id=${id};`

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

const getSelectLastIdAgeGroup  = async () => {
    try {

        //Script SQL
        let sql = `select faixa_etaria_id from tbl_faixa_etaria order by faixa_etaria_id desc limit 1`

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
const setInsertAgeGroup = async (ageGroup) => {

    try {
        let sql = `INSERT INTO tbl_faixa_etaria (nome, classificacao_indicativa, caracteristicas)
                   VALUES (
                    '${ageGroup.nome}',
                    '${ageGroup.classificacao_indicativa}',
                    '${ageGroup.caracteristicas}'
                   );`

        let result = await prisma.$executeRawUnsafe(sql)
        console.log(sql)
        console.log(result)
        if (result) {
            return true
        }
    } catch (error) {
        return false
    }

}

//Atualiza uma faixa etaria existente no banco de dados filtrando pelo ID
const setUpdateAgeGroup  = async (ageGroup) => {

    try {
        let sql = `UPDATE tbl_genero SET 
                        nome              = '${filme.nome}',
                    WHERE genero_id = ${filme.id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        }
    } catch (error) {
        return false
    }

}

//Apaga uma faixa etaria existente no banco de dados filtrando pelo ID
const setDeleteAgeGroup  = async (id) => {

    try {

        //Script SQL
        let sql = `delete from tbl_faixa_etaria where faixa_etaria_id=${id};`

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
    getSelectAllAgeGroup,
    getSelectByIdAgeGroup,
    getSelectLastIdAgeGroup,
    setInsertAgeGroup,
    setUpdateAgeGroup,
    setDeleteAgeGroup
}