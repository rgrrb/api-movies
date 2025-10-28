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

//Retorna todos os atores do banco de dados
const getSelectAllActors = async () => {
    try {

        //Script SQL
        let sql = `select * from tbl_ator order by ator_id desc;`

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

//Retorna um ator filtrando pelo ID do banco de dados
const getSelectByIdActor = async (id) => {

    try {

        //Script SQL
        let sql = `select * from tbl_ator where ator_id=${id};`

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

const getSelectLastIdActor = async () => {
    try {

        //Script SQL
        let sql = `select ator_id from tbl_ator order by ator_id desc limit 1`

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
const setInsertActor = async (actor) => {

    try {
        let sql = `INSERT INTO tbl_ator(nome, data_nascimento, altura, peso)
                   VALUES (
                    '${actor.nome}',
                    '${actor.data_nascimento}',
                    '${actor.altura}',
                    '${actor.peso}'
                   );`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        }
    } catch (error) {
        return false
    }

}

//Atualiza um ator existente no banco de dados filtrando pelo ID
const setUpdateActor = async (actor) => {

    try {
        let sql = `UPDATE tbl_ator SET 
                        nome                = '${actor.nome}',
                        data_nascimento     = '${actor.data_nascimento}',
                        altura              = '${actor.altura}',
                        peso                = '${actor.peso}',
                    WHERE ator_id = ${actor.id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        }
    } catch (error) {
        return false
    }

}

//Apaga um ator existente no banco de dados filtrando pelo ID
const setDeleteActor  = async (id) => {

    try {

        //Script SQL
        let sql = `delete from tbl_ator where ator_id=${id};`

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
    getSelectAllActors,
    getSelectByIdActor,
    getSelectLastIdActor,
    setInsertActor,
    setUpdateActor,
    setDeleteActor
}