/********************************************************
 *
 * Objetivo: Arquivo responsável pela realização do CRUD de dados no MySQL referente
 *           ao relacionamento entre filme e diretor
 *
 * Data: 15/12/2025
 * Autor: Roger Ribeiro de Oliveira
 * Versão: 1.0
 *
 *******************************************************/

const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os filmes e diretores relacionados do banco de dados
const getSelectAllFilmsDirectors = async () => {
    try {

        //Script SQL
        let sql = `select * from tbl_filme_diretor order by filme_diretor_id desc;`

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

//Retorna os diretores filtrando pelo ID do relacionamento do banco de dados
const getSelectByIdFilmDirector = async (id) => {

    try {

        //Script SQL
        let sql = `select * from tbl_filme_diretor where filme_diretor_id=${id};`

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

//Retorna os diretores filtrando pelo ID do filme do banco de dados
const getSelectDirectorsByIdFilm = async (filmeId) => {

    try {

        //Script SQL
        let sql = `select tbl_diretor.diretor_id, tbl_diretor.nome, tbl_diretor.data_nascimento, tbl_diretor.altura, tbl_diretor.peso
        from tbl_filme
            inner join tbl_filme_diretor
        on tbl_filme.filme_id = tbl_filme_diretor.filme_id
            inner join tbl_diretor
                on tbl_diretor.diretor_id = tbl_filme_diretor.diretor_id
        where tbl_filme.filme_id=${filmeId};`

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

//Retorna os filmes filtrando pelo ID do diretor do banco de dados
const getSelectFilmsByIdDirector = async (directorId) => {

    try {

        //Script SQL
        let sql = `select tbl_filme.filme_id, tbl_filme.nome, tbl_filme.data_lancamento, tbl_filme.sinopse
        from tbl_filme
            inner join tbl_filme_diretor
        on tbl_filme.filme_id = tbl_filme_diretor.filme_id
            inner join tbl_diretor
                on tbl_diretor.diretor_id = tbl_filme_diretor.diretor_id
        where tbl_diretor.diretor_id=${directorId};`

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

//Retorna o último ID inserido
const getSelectLastId = async () => {
    try {

        //Script SQL
        let sql = `select filme_diretor_id from tbl_filme_diretor order by filme_diretor_id desc limit 1`

        //Executa no Banco de Dados o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return Number(result[0].filme_diretor_id)
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

//Insere um relacionamento entre filme e diretor no banco de dados
const setInsertFilmsDirectors = async (filmDirector) => {

    try {
        let sql = `INSERT INTO tbl_filme_diretor (filme_id, diretor_id)
                   VALUES (
                    ${filmDirector.filme_id},
                    ${filmDirector.diretor_id}
                   );`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        }
    } catch (error) {
        return false
    }

}

//Atualiza um relacionamento existente no banco de dados filtrando pelo ID
const setUpdateFilmDirector = async (filmDirector) => {

    try {
        let sql = `UPDATE tbl_filme_diretor SET
                        filme_id              = ${filmDirector.filme_id},
                        diretor_id            = ${filmDirector.diretor_id}
                    WHERE filme_diretor_id = ${filmDirector.filme_diretor_id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        }
    } catch (error) {
        return false
    }

}

//Apaga um relacionamento existente no banco de dados filtrando pelo ID
const setDeleteFilmsDirector = async (id) => {

    try {

        //Script SQL
        let sql = `delete from tbl_filme_diretor where filme_diretor_id=${id};`

        //Executa no Banco de Dados o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

module.exports = {
    getSelectAllFilmsDirectors,
    getSelectByIdFilmDirector,
    getSelectDirectorsByIdFilm,
    getSelectFilmsByIdDirector,
    getSelectLastId,
    setInsertFilmsDirectors,
    setUpdateFilmDirector,
    setDeleteFilmsDirector
}