const express = require('express')
const routes = new express.Router()
const handler = require('../handlers')
const { check } = require('express-validator');

// alunos
/**
* @swagger
* definitions:
*   Aluno:
*     properties:
*       id:
*         type: integer
*         description: ID do aluno
*         default: 0
*       nome:
*         type: string
*         description: Nome do aluno
*         default: ""
*       cpf:
*         type: string
*         description: CPF do aluno
*         default: ""
*       bairro:
*         type: string
*         description: Bairro do aluno
*         default: ""
*       cidade:
*         type: string
*         description: Cidade do aluno
*         default: ""
*       telefone:
*         type: string
*         description: Telefone do aluno
*         default: ""
*       status:
*         type: string
*         description: Status do aluno
*         default: ""
*       criado_em:
*         type: date
*         default: ""
*         description: Data de criação
*       editado_em:
*         type: date
*         description: Data de edição
*         default: ""
*     required:
*       - id
*       - nome
*       - cpf
*   DataContainer:
*     properties:
*       message:
*         type: string
*         default: Consulta realizada com sucesso
*         description: Mensagem de retorno
*       current_page:
*         type: integer
*         description: Página atual
*       total:
*         type: integer
*         description: Total de registros
*       total_pages:
*         type: integer
*         description: Total de páginas
*       data:
*         type: array
*         items:
*               $ref: '#/definitions/Aluno'
*         description: Lista de alunos retornados
*/

/**
* @swagger
* /v1/alunos:
*   get:
*     tags:
*       - 'Alunos'
*     summary: Retorna uma lista de alunos.
*     description: Método para listar todos os alunos com paginação e filtro de busca.
*     produces:
*       - application/json
*     parameters:
*       - in: query
*         name: page
*         description: Página de resultados a serem buscados.
*         schema:
*           type: integer
*         default: 1
*       - in: query
*         name: limit
*         description: O número de itens a serem retornados.
*         schema:
*           type: integer
*         default: 10
*       - in: query
*         name: searchText
*         description: Filtro para busca.
*         schema:
*           type: string
*       - in: query
*         name: sort_by
*         description: Atributo para ordenação.
*         enum: [id, nome, cpf, bairro, cidade, status, telefone, criado_em, editado_em]
*         default: "nome"
*         required: true
*         schema:
*           type: string
*       - in: query
*         name: sort_order
*         description: >
*           `asc` - ascendente de A para Z e
*           `desc` - descendente de Z para A.
*         enum: [asc, desc]
*         default: asc
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         schema:
*           $ref: '#/definitions/DataContainer'
*       400:
*         description: Erro de sintaxe JSON no corpo do request.
*       401:
*         description: Informações de autorização ausentes ou inválidas.
*       409:
*         description: <ul>
*                          <li>A página deve ser um número inteiro positivo.</li>
*                          <li>O limite deve ser um número de 5 a 100 registros por página.</li>
*                      </ul>
*       5XX:
*         description: Erro inesperado.
*/
routes.get('/v1/alunos', [check('page')
  .isInt({ gt: 0 }).withMessage('A página deve ser um número inteiro positivo.'),
check('limit')
  .isInt({ gt: 4, lt: 101 }).withMessage('O limite deve ser um número de 5 a 100 registros por página.')
], handler.getStudentsByFilter)

/**
* @swagger
* /v1/alunos/{id}:
*   get:
*     tags:
*       - 'Alunos'
*     summary: Retorna um aluno existente.
*     description: Método para buscar um aluno por ID.
*     produces:
*       - application/json
*     parameters:
*       - name: id
*         description: ID do aluno.
*         in: path
*         required: true
*         type: integer
*     responses:
*       200:
*         description: Ok! aluno retornado.
*         schema:
*           $ref: '#/definitions/Aluno'
*       400:
*         description: Erro de sintaxe JSON no corpo do request.
*       401:
*         description: Informações de autorização ausentes ou inválidas.
*       404:
*         description: aluno não encontrado.
*       5XX:
*         description: Erro inesperado.
*/
routes.get('/v1/alunos/:id', handler.getStudentById)

/**
* @swagger
* /v1/alunos:
*   post:
*     tags:
*       - 'Alunos'
*     summary: Cria um novo aluno.
*     description: Método para criar um novo aluno.
*     produces:
*       - application/json
*     parameters:
*       - name: aluno
*         description: Json com atributos do aluno.
*         in: body
*         required: true
*         schema:
*           $ref: '#/definitions/Aluno'
*     responses:
*       200:
*         schema:
*           $ref: '#/definitions/Aluno'
*       201:
*         description: aluno criado com sucesso.
*       400:
*         description: Erro de sintaxe JSON no corpo do request.
*       401:
*         description: Informações de autorização ausentes ou inválidas.
*       409:
*         description: <ul>
*                          <li>O nome é obrigatório.</li>
*                          <li>O CPF é obrigatório.</li>
*                          <li>CPF inválido.</li>
*                      </ul>
*       5XX:
*         description: Erro inesperado.
*/
routes.post('/v1/alunos', [
  check('nome')
    .isLength({ min: 1 }).withMessage('O nome é obrigatório.'),
  check('cpf')
    .isLength({ min: 1 }).withMessage('O CPF é obrigatório.')
], handler.createStudent)

/**
* @swagger
* /v1/alunos:
*   put:
*     tags:
*       - 'Alunos'
*     summary: Atualiza um aluno existente.
*     description: Método para atualizar um aluno.
*     produces:
*       - application/json
*     parameters:
*       - name: aluno
*         description: Aluno JSON
*         in: body
*         required: true
*         schema:
*           $ref: '#/definitions/Aluno'
*     responses:
*       200:
*         description: aluno atualizado com sucesso
*       400:
*         description: Erro de sintaxe JSON no corpo do request.
*       401:
*         description: Informações de autorização ausentes ou inválidas.
*       409:
*         description: <ul>
*                          <li>O nome é obrigatório.</li>
*                          <li>O CPF é obrigatório.</li>
*                          <li>CPF inválido.</li>
*                      </ul>
*       5XX:
*         description: Erro inesperado.
*/
routes.put('/v1/alunos', [
  check('nome')
    .isLength({ min: 1 }).withMessage('O nome é obrigatório.'),
  check('cpf')
    .isLength({ min: 1 }).withMessage('O CPF é obrigatório.')
], handler.updateStudent)

/**
* @swagger
* /v1/alunos/{id}:
*   delete:
*     tags:
*       - 'Alunos'
*     summary: Remove um aluno existente.
*     description: Método para remover um aluno.
*     produces:
*       - application/json
*     parameters:
*       - name: id
*         description: ID do aluno
*         in: path
*         required: true
*         type: integer
*     responses:
*       200:
*         description: aluno removido com sucesso.
*       400:
*         description: Erro de sintaxe JSON no corpo do request.
*       401:
*         description: Informações de autorização ausentes ou inválidas.
*       404:
*         description: aluno não encontrado.
*       5XX:
*         description: Erro inesperado.
*/
routes.delete('/v1/alunos/:id', handler.removeStudent)


module.exports = routes
