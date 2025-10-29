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

//Retorna todos os personagens do banco de dados
const getSelectAllCharacters = async () => {
    try {

        //Script SQL
        let sql = `select * from tbl_personagem order by personagem_id desc;`

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

//Retorna um personagem filtrando pelo ID do banco de dados
const getSelectByIdCharacter = async (id) => {

    try {

        //Script SQL
        let sql = `select * from tbl_personagem where personagem_id=${id};`

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

const getSelectLastIdCharacter = async () => {
    try {

        //Script SQL
        let sql = `select personagem_id from tbl_personagem order by personagem_id desc limit 1`

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

//Insere um personagem no banco de dados
const setInsertCharacter = async (ageGroup) => {

    try {
        let sql = `INSERT INTO tbl_personagem (nome, data_nascimento, altura, peso, descricao, personalidade, habilidades)
                   VALUES (
                    '${character.nome}',
                    '${character.data_nascimento}',
                    '${character.altura}',
                    '${character.peso}',
                    '${character.descricao}',
                    '${character.personalidade}',
                    '${character.habilidades}'
                   );`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        }
    } catch (error) {
        return false
    }

}

//Atualiza um personagem existente no banco de dados filtrando pelo ID
const setUpdateCharacter  = async (character) => {

    try {
        let sql = `UPDATE tbl_personagem SET 
                        nome                = '${character.nome}',
                        data_nascimento     = '${character.data_nascimento}',
                        altura              = '${character.altura}',
                        peso                = '${character.peso}',
                        descricao           = '${character.descricao}',
                        personalidade       = '${character.personalidade}',
                        habilidades         = '${character.habilidades}'
                    WHERE personagem_id = ${character.id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        }
    } catch (error) {
        return false
    }

}

//Apaga um personagem existente no banco de dados filtrando pelo ID
const setDeleteCharacter  = async (id) => {

    try {

        //Script SQL
        let sql = `delete from tbl_personagem where personagem_id=${id};`

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
    getSelectAllCharacters,
    getSelectByIdCharacter,
    getSelectLastIdCharacter,
    setInsertCharacter,
    setUpdateCharacter,
    setDeleteCharacter
}