/********************************************************
 *
 * Objetivo: Arquivo responsável pela realização do CRUD de dados no MySQL referente
 *           ao relacionamento entre filme e estúdio
 *
 * Data: 15/12/2025
 * Autor: Roger Ribeiro de Oliveira
 * Versão: 1.0
 *
 *******************************************************/

const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os filmes e estúdios relacionados do banco de dados
const getSelectAllFilmsStudios = async () => {
    try {

        //Script SQL
        let sql = `select * from tbl_filme_estudio order by filme_estudio_id desc;`

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

//Retorna os estúdios filtrando pelo ID do relacionamento do banco de dados
const getSelectByIdFilmStudio = async (id) => {

    try {

        //Script SQL
        let sql = `select * from tbl_filme_estudio where filme_estudio_id=${id};`

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

//Retorna os estúdios filtrando pelo ID do filme do banco de dados
const getSelectStudiosByIdFilm = async (filmeId) => {

    try {

        //Script SQL
        let sql = `select tbl_estudio.estudio_id, tbl_estudio.nome, tbl_estudio.cnpj, tbl_estudio.logradouro, tbl_estudio.bairro, tbl_estudio.cidade, tbl_estudio.complemento, tbl_filme_estudio.tipo_producao
        from tbl_filme
            inner join tbl_filme_estudio
        on tbl_filme.filme_id = tbl_filme_estudio.filme_id
            inner join tbl_estudio
                on tbl_estudio.estudio_id = tbl_filme_estudio.estudio_id
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

//Retorna os filmes filtrando pelo ID do estúdio do banco de dados
const getSelectFilmsByIdStudio = async (estudioId) => {

    try {

        //Script SQL
        let sql = `select tbl_filme.filme_id, tbl_filme.nome, tbl_filme.data_lancamento, tbl_filme.sinopse, tbl_filme_estudio.tipo_producao
        from tbl_filme
            inner join tbl_filme_estudio
        on tbl_filme.filme_id = tbl_filme_estudio.filme_id
            inner join tbl_estudio
                on tbl_estudio.estudio_id = tbl_filme_estudio.estudio_id
        where tbl_estudio.estudio_id=${estudioId};`

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
        let sql = `select filme_estudio_id from tbl_filme_estudio order by filme_estudio_id desc limit 1`

        //Executa no Banco de Dados o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return Number(result[0].filme_estudio_id)
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

//Insere um relacionamento entre filme e estúdio no banco de dados
const setInsertFilmsStudios = async (filmStudio) => {

    try {
        let sql = `INSERT INTO tbl_filme_estudio (filme_id, estudio_id, tipo_producao)
                   VALUES (
                    ${filmStudio.filme_id},
                    ${filmStudio.estudio_id},
                    '${filmStudio.tipo_producao}'
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
const setUpdateFilmStudio = async (filmStudio) => {

    try {
        let sql = `UPDATE tbl_filme_estudio SET
                        filme_id              = ${filmStudio.filme_id},
                        estudio_id            = ${filmStudio.estudio_id},
                        tipo_producao         = '${filmStudio.tipo_producao}'
                    WHERE filme_estudio_id = ${filmStudio.filme_estudio_id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        }
    } catch (error) {
        return false
    }

}

//Apaga um relacionamento existente no banco de dados filtrando pelo ID
const setDeleteFilmsStudio = async (id) => {

    try {

        //Script SQL
        let sql = `delete from tbl_filme_estudio where filme_estudio_id=${id};`

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
    getSelectAllFilmsStudios,
    getSelectByIdFilmStudio,
    getSelectStudiosByIdFilm,
    getSelectFilmsByIdStudio,
    getSelectLastId,
    setInsertFilmsStudios,
    setUpdateFilmStudio,
    setDeleteFilmsStudio
}