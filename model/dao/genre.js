/********************************************************
 * 
 * Objetivo: Arquivo responsável pela realização do CRUD
 *           No Banco de Dados MySQL
 * 
 * Data: 21/10/2025
 * Autor: Roger Ribeiro de Oliveira
 * Versão: 1.0
 * 
 *******************************************************/

const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os filmes do banco de dados
const getSelectAllGenre = async () => {
    try {

        //Script SQL
        let sql = `select * from tbl_genero order by genero_id desc;`
        
        //Executa no Banco de Dados o script SQL
        let result = await prisma.$queryRawUnsafe(sql)
        console.log(result)
        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}
console.log(getSelectAllGenre())
//Retorna um genero filtrando pelo ID do banco de dados
const getSelectByIdGenre = async (id) => {

    try {

        //Script SQL
        let sql = `select * from tbl_genero where genero_id=${id};`

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

const getSelectLastIdGenre = async () => {
    try {

        //Script SQL
        let sql = `select genero_id from tbl_genero order by genero_id desc limit 1`

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

//Insere um genero no banco de dados
const setInsertGenre = async (genre) => {

    try {
        let sql = `INSERT INTO tbl_genero (nome)
                   VALUES (
                    '${filme.nome}'
                   );`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        }
    } catch (error) {
        return false
    }

}

//Atualiza um genre existente no banco de dados filtrando pelo ID
const setUpdateGenre = async (genre) => {

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

//Apaga um genre existente no banco de dados filtrando pelo ID
const setDeleteGenre = async (id) => {

    try {

        //Script SQL
        let sql = `delete from tbl_genero where genero_id=${id};`

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
    getSelectAllGenre,
    getSelectByIdGenre,
    getSelectLastIdGenre,
    setInsertGenre,
    setUpdateGenre,
    setDeleteGenre
}