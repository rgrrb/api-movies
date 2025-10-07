/********************************************************
 * 
 * Objetivo: Arquivo responsável pela realização do CRUD
 *           No Banco de Dados MySQL
 * 
 * Data: 01/10/2025
 * Autor: Roger Ribeiro de Oliveira
 * Versão: 1.0
 * 
 *******************************************************/

/********************************************************
 * 
 * Dependencias do node para Banco de Dados Relacional 
 *    sequelize  --> Foi uma biblioteca para acesso a banco de dados
 * 
 *    Prisma     --> É uma biblioteca atual para acesso e manipulação de dados,
 *                   utilizando SQL ou ORM (MySQL, PostgreSQL, SQLServer, Oracle)
 * 
 *    Knex       --> É uma biblioteca atual para acesso a manipulação de dados, utilizando
 *                   SQL (MySQL)
 * 
 * Dependencias do node para Banco de Dados NÃO Relacional 
 *    Mongoose   --> É uma biblioteca para acesso a banco de dados não relacional (MongoDB)
 * 
 *    
 * 
 *  Instalação do Prisma 
 *  npm install prisma --save          --> Realiza a conexão com o Banco de Dados
 *  npm install @prisma/client --save  --> Permite executar scripts SQL no Banco de Dados
 *  npx prisma init                    --> Inicializar o prisma no projeto (.env, prisma, etc)
 *  npx prisma migrate dev             --> Permite sincronizar o Prisma com o BD, Modelar o BD
 *                                         conforme as configurações do ORM.
 *                                         CUIDADO: Esse comando faz um reset no BD
 * 
 *  npx prisma migrate reset           --> Realiza o reset do database
 *  npx prisma generate                --> Realiza apenas o sincronismo com o BD
 * 
 *  $queryRawUnsafe()                  --> Permite executar apenas scripts SQL que 
 *                                         retornam dados do bd (SELECT), permite também executar 
 *                                         um script SQL através de uma váriavel
 *  
 *  $executeRawUnsafe()                --> Permite executar apenas scripts SQL que NÃO retornam dados
 *                                         do BD (INSERT, UPDATE, DELETE)
 * 
 *  $queryRaw()                        --> Permite executar apenas scripts SQL que 
 *                                         retornam dados do bd (SELECT), permite APENAS executar 
 *                                         um script SQL através direto no método. Permite também aplicar 
 *                                         segurança contra SQL injection
 *  
 *  $executeRaw()                      --> Permite executar apenas scripts SQL que NÃO retornam dados
 *                                         do BD (INSERT, UPDATE, DELETE), permite APENAS executar 
 *                                         um script SQL através direto no método. Permite também aplicar 
 *                                         segurança contra SQL injection
 * 
 * 
 ********************************************************/

//Import da biblioteca do PrismaClient
//const { PrismaClient } = require('@prisma/client')
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os filmes do banco de dados
const getSelectAllFilms = async () => {
    try {

        //Script SQL
        let sql = `select * from tbl_filme order by filme_id desc;`

        //Executa no Banco de Dados o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        if (result.length > 0)
            return result
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

//Retorna um filme filtrando pelo ID do banco de dados
const getSelectByIdFilms = async (id) => {

}

//Insere um filme no banco de dados
const setInsertFilms = async (filme) => {

}

//Atualiza um filme existente no banco de dados filtrando pelo ID
const setUpdateFilms = async (filme) => {

}

//Apaga um filme existente no banco de dados filtrando pelo ID
const setDeleteFilms = async (id) => {

}

module.exports = {
    getSelectAllFilms
}