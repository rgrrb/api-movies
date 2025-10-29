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

//Retorna todos os diretores do banco de dados
const getSelectAllDirectors = async () => {
    try {

        //Script SQL
        let sql = `select * from tbl_diretor order by diretor_id desc;`

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

//Retorna um diretor filtrando pelo ID do banco de dados
const getSelectByIdDirector  = async (id) => {

    try {

        //Script SQL
        let sql = `select * from tbl_diretor where diretor_id=${id};`

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

const getSelectLastIdDirector  = async () => {
    try {

        //Script SQL
        let sql = `select diretor_id from tbl_diretor order by diretor_id desc limit 1`

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

//Insere um diretor no banco de dados
const setInsertDirector = async (director) => {

    try {
        let sql = `INSERT INTO tbl_diretor (nome, data_nascimento, altura, peso)
                   VALUES (
                    '${director.nome}',
                    '${director.data_nascimento}',
                    '${director.altura}',
                    '${director.peso}'
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

//Atualiza um diretor existente no banco de dados filtrando pelo ID
const setUpdateDirector  = async (director) => {

    try {
        let sql = `UPDATE tbl_diretor
                   SET 
                       nome = '${director.nome}',
                       data_nascimento = '${director.data_nascimento}',
                       altura = '${director.altura}',
                       peso = '${director.peso}'
                   WHERE diretor_id = ${director.id};`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        }
    } catch (error) {
        return false
    }

}

//Apaga um diretor existente no banco de dados filtrando pelo ID
const setDeleteDirector  = async (id) => {

    try {

        //Script SQL
        let sql = `delete from tbl_diretor where diretor_id=${id};`

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
    getSelectAllDirectors,
    getSelectByIdDirector,
    getSelectLastIdDirector,
    setInsertDirector,
    setUpdateDirector,
    setDeleteDirector
}