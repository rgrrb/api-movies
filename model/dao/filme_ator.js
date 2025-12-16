/********************************************************
 *
 * Objetivo: Arquivo responsável pela realização do CRUD de dados no MySQL referente
 *           ao relacionamento entre filme e ator
 *
 * Data: 15/12/2025
 * Autor: Roger Ribeiro de Oliveira
 * Versão: 1.0
 *
 *******************************************************/

const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os filmes e atores relacionados do banco de dados
const getSelectAllFilmsActors = async () => {
    try {

        //Script SQL
        let sql = `select * from tbl_filme_ator order by filme_ator_id desc;`

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

//Retorna os atores filtrando pelo ID do relacionamento do banco de dados
const getSelectByIdFilmActor = async (id) => {

    try {

        //Script SQL
        let sql = `select * from tbl_filme_ator where filme_ator_id=${id};`

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

//Retorna os atores filtrando pelo ID do filme do banco de dados
const getSelectActorsByIdFilm = async (filmeId) => {

    try {

        //Script SQL
        let sql = `select tbl_ator.ator_id, tbl_ator.nome, tbl_ator.data_nascimento, tbl_ator.altura, tbl_ator.peso, tbl_filme_ator.papel
        from tbl_filme
            inner join tbl_filme_ator
        on tbl_filme.filme_id = tbl_filme_ator.filme_id
            inner join tbl_ator
                on tbl_ator.ator_id = tbl_filme_ator.ator_id
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

//Retorna os filmes filtrando pelo ID do ator do banco de dados
const getSelectFilmsByIdActor = async (actorId) => {

    try {

        //Script SQL
        let sql = `select tbl_filme.filme_id, tbl_filme.nome, tbl_filme.data_lancamento, tbl_filme_ator.papel
        from tbl_filme
            inner join tbl_filme_ator
        on tbl_filme.filme_id = tbl_filme_ator.filme_id
            inner join tbl_ator
                on tbl_ator.ator_id = tbl_filme_ator.ator_id
        where tbl_ator.ator_id=${actorId};`

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
        let sql = `select filme_ator_id from tbl_filme_ator order by filme_ator_id desc limit 1`

        //Executa no Banco de Dados o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return Number(result[0].filme_ator_id)
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

//Insere um relacionamento entre filme e ator no banco de dados
const setInsertFilmsActors = async (filmActor) => {

    try {
        let sql = `INSERT INTO tbl_filme_ator (filme_id, ator_id, papel)
                   VALUES (
                    ${filmActor.filme_id},
                    ${filmActor.ator_id},
                    '${filmActor.papel}'
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
const setUpdateFilmActor = async (filmActor) => {

    try {
        let sql = `UPDATE tbl_filme_ator SET
                        filme_id              = ${filmActor.filme_id},
                        ator_id               = ${filmActor.ator_id},
                        papel                 = '${filmActor.papel}'
                    WHERE filme_ator_id = ${filmActor.filme_ator_id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        }
    } catch (error) {
        return false
    }

}

//Apaga um relacionamento existente no banco de dados filtrando pelo ID
const setDeleteFilmsActor = async (id) => {

    try {

        //Script SQL
        let sql = `delete from tbl_filme_ator where filme_ator_id=${id};`

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
    getSelectAllFilmsActors,
    getSelectByIdFilmActor,
    getSelectActorsByIdFilm,
    getSelectFilmsByIdActor,
    getSelectLastId,
    setInsertFilmsActors,
    setUpdateFilmActor,
    setDeleteFilmsActor
}