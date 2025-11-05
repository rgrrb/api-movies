/********************************************************
 * 
 * Objetivo: Arquivo responsável pela realização do CRUD de dads no MySQL referente
 *           ao relacionamento entre filme e gênero
 * 
 * Data: 05/11/2025
 * Autor: Roger Ribeiro de Oliveira
 * Versão: 1.0
 * 
 *******************************************************/

const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os filmes e generos relacionados do banco de dados
const getSelectAllFilmsGenres = async () => {
    try {

        //Script SQL
        let sql = `select * from tbl_filme_genero order by filme_genero_id desc;`

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

//Retorna os generos filtrando pelo ID do filme do banco de dados
const getSelectByIdFilmGenre = async (id) => {

    try {

        //Script SQL
        let sql = `select * from tbl_filme_genero where filme_genero_id=${id};`

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
const getSelectGenreByIdFilm = async (filmeId) => {

    try {

        //Script SQL
        let sql = `select tbl_genero.genero_id, tbl_genero.nome
        from tbl_filme
            inner join tbl_filme_genero
        on tbl_filme.filme_id = tbl_filme_genero.filme_id
            inner join tbl_genero
                on tbl_genero.genero_id = tbl_filme_genero.genero_id
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
const getSelectFilmsByIdGenre = async (genreId) => {

    try {

        //Script SQL
        let sql = `select tbl_filme.filme_id, tbl_genero.nome
        from tbl_filme
            inner join tbl_filme_genero
        on tbl_filme.filme_id = tbl_filme_genero.filme_id
            inner join tbl_genero
                on tbl_genero.genero_id = tbl_filme_genero.genero_id
        where tbl_genero.genero_id=${genreId};`

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
const getSelectLastId = async () => {
    try {

        //Script SQL
        let sql = `select filme_genero_id from tbl_filme_genero order by filme_genero_id desc limit 1`

        //Executa no Banco de Dados o script SQL
        let result = await prisma.$queryRawUnsafe(sql)
        console.log(result)
        if (Array.isArray(result))
            return Number(result[0].filme_genero_id)
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

//Insere um genero no banco de dados
const setInsertFilmsGenres = async (filmGenre) => {

    try {
        let sql = `INSERT INTO tbl_filme_genero (filme_id, genero_id)
                   VALUES (
                    ${filmGenre.filme_id},
                    ${filmGenre.genero_id}
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
const setUpdateFilmGenre = async (filmGenre) => {

    try {
        let sql = `UPDATE tbl_filme_genero SET 
                        filme_id              = ${filmGenre.filme_id},
                        genero_id          = ${filmGenre.genero_id}
                    WHERE filme_genero_id = ${filmGenre.filme_genero_id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        }
    } catch (error) {
        return false
    }

}

//Apaga um genre existente no banco de dados filtrando pelo ID
const setDeleteFilmsGenre = async (id) => {

    try {

        //Script SQL
        let sql = `delete from tbl_filme_genero where filme_genero_id=${id};`

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
    getSelectAllFilmsGenres,
    getSelectByIdFilmGenre,
    getSelectGenreByIdFilm,
    getSelectFilmsByIdGenre,
    getSelectLastId,
    setInsertFilmsGenres,
    setUpdateFilmGenre,
    setDeleteFilmsGenre
}