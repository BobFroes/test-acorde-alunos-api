const express = require('express')
const routes = new express.Router()
const handler = require('../handlers')
const { check } = require('express-validator');

// Students
/**
* @swagger
* definitions:
*   ALUNO:
*     properties:
*       ID_ALUNO:
*         type: integer
*         description: ID do aluno
*         default: 0
*       ID_GRAU_PARENTESCO:
*         type: integer
*         description: ID do grau de parentesco
*         default: 0
*       ID_MEIO_DIVULGACAO:
*         type: integer
*         description: ID do meio de divulgação
*         default: 0
*       DATA_HORA_CRIACAO:
*         type: date
*         default: ""
*         description: Data de criação
*       ATIVO:
*         type: boolean
*         description: Status do aluno
*         default: 1
*       NOME:
*         type: string
*         description: Nome do aluno
*         default: ""
*       ENDERECO:
*         type: string
*         description: Endereço
*         default: ""
*       BAIRRO:
*         type: string
*         description: Bairro
*         default: ""
*       CIDADE:
*         type: string
*         description: Cidade
*         default: ""
*       UF:
*         type: string
*         description: Estado
*         default: ""
*       CEP:
*         type: string
*         description: CEP
*         default: ""
*       TELEFONE_RESIDENCIAL:
*         type: string
*         description: Telefone residencial
*         default: ""
*       TELEFONE_COMERCIAL:
*         type: string
*         description: Telefone comercial
*         default: ""
*       RAMAL_COMERCIAL:
*         type: string
*         description: Ramal comercial
*         default: ""
*       TELEFONE_CELULAR:
*         type: string
*         description: Celular
*         default: ""
*       EMAIL:
*         type: string
*         description: Email
*         default: ""
*       RG:
*         type: string
*         description: RG
*         default: ""
*       CPF:
*         type: string
*         description: CPF
*         default: ""
*       PROFISSAO:
*         type: string
*         description: Profissão
*         default: ""
*       NACIONALIDADE:
*         type: string
*         description: Nacionalidade
*         default: ""
*       ESTADO_CIVIL:
*         type: string
*         description: Estado civil
*         default: ""
*       FILIACAO_1:
*         type: string
*         description: Primeira filiação
*         default: ""
*       FILIACAO_2:
*         type: string
*         description: Segunda filiação
*         default: ""
*       CAMINHO_FOTO:
*         type: string
*         description: Segunda filiação
*         default: ""
*       RESPONSAVEL_NOME:
*         type: string
*         description: Nome do responsável
*         default: ""
*       RESPONSAVEL_RG:
*         type: string
*         description: RG do responsável
*         default: ""
*       RESPONSAVEL_CPF:
*         type: string
*         description: CPF do responsável
*         default: ""
*       RESPONSAVEL_TEL_RESIDENCIAL:
*         type: string
*         description: Contato residencial do responsável
*         default: ""
*       RESPONSAVEL_TEL_COMERCIAL:
*         type: string
*         description: Contato comercial do responsável
*         default: ""
*       RESPONSAVEL_RAMAL_COMERCIAL:
*         type: string
*         description: Ramal comercial do responsável
*         default: ""
*       RESPONSAVEL_CELULAR:
*         type: string
*         description: Celular do responsável
*         default: ""
*       RESPONSAVEL_EMAIL:
*         type: string
*         description: Email do responsável
*         default: ""
*       RESPONSAVEL_DATA_NASCIMENTO:
*         type: date
*         default: ""
*       OBSERVACOES:
*         type: string
*         description: Observações
*         default: ""
*       SEXO:
*         type: string
*         description: Sexo
*         default: ""
*       DATA_NASCIMENTO:
*         type: date
*         default: ""
*         description: Data de nascimento
*       CONJUGE:
*         type: string
*         description: Conjuge
*         default: ""
*       CAMPO_1:
*         type: string
*         description: Campo 1
*         default: ""
*       CAMPO_2:
*         type: string
*         description: Campo 2
*         default: ""
*       CAMPO_3:
*         type: string
*         description: Campo 3
*         default: ""
*       CAMPO_4:
*         type: string
*         description: Campo 4
*         default: ""
*       CAMPO_5:
*         type: string
*         description: Campo 5
*         default: ""
*       SENHA_PORTAL:
*         type: string
*         description: Senha do portal
*         default: ""
*       CODIGO_REFERENCIA:
*         type: string
*         description: Código de referência
*         default: ""
*       PERFIL:
*         type: string
*         description: Perfil do aluno
*         default: ""
*       EMAIL_WHATS_ENVIADO:
*         type: boolean
*         description: Email whats enviado
*         default: 0
*       WHATS_ENVIADO:
*         type: boolean
*         description: Whats enviado
*         default: 0
*     required:
*       - NOME
*   STUDENT_DATA_CONTAINER:
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
*               $ref: '#/definitions/ALUNO'
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
*         name: status
*         description: Filtro por status.
*         enum: [Todos,   Ativos, Inativos]
*         default: "Todos"
*         required: true
*       - in: query
*         name: sortColumn
*         description: Atributo para ordenação.
*         enum: [id, nome, cpf, bairro, cidade, telefone, criado_em, editado_em]
*         default: "nome"
*         required: true
*         schema:
*           type: string
*       - in: query
*         name: sortDirection
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
*           $ref: '#/definitions/STUDENT_DATA_CONTAINER'
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
*           $ref: '#/definitions/ALUNO'
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
*           $ref: '#/definitions/ALUNO'
*     responses:
*       200:
*         schema:
*           $ref: '#/definitions/ALUNO'
*       201:
*         description: aluno criado com sucesso.
*       400:
*         description: Erro de sintaxe JSON no corpo do request.
*       401:
*         description: Informações de autorização ausentes ou inválidas.
*       409:
*         description: <ul>
*                          <li>O nome é obrigatório.</li>
*                          <li>O CPF do aluno é inválido.</li>
*                          <li>O CPF do responsável pelo aluno é inválido.</li>
*                      </ul>
*       5XX:
*         description: Erro inesperado.
*/
routes.post('/v1/alunos', [
  check('NOME')
    .isLength({ min: 1 }).withMessage('O nome é obrigatório.')
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
*           $ref: '#/definitions/ALUNO'
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
  check('NOME')
    .isLength({ min: 1 }).withMessage('O nome é obrigatório.')
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


// Profiles

/**
* @swagger
* definitions:
*   PERFIL:
*     properties:
*       ID_PERFIL:
*         type: integer
*         description: ID do aluno
*         default: 0
*       NOME:
*         type: integer
*         description: ID do grau de parentesco
*         default: 0
*       IDADE_INICIAL:
*         type: integer
*         description: ID do meio de divulgação
*         default: 0
*       IDADE_FINAL:
*         type: integer
*         default: ""
*         description: Idade final do aluno
*     required:
*       - NOME
*   PROFILE_DATA_CONTAINER:
*     properties:
*       message:
*         type: string
*         default: Consulta realizada com sucesso
*         description: Mensagem de retorno
*       data:
*         type: array
*         items:
*               $ref: '#/definitions/PERFIL'
*         description: Lista de perfis retornados
*/

/**
* @swagger
* /v1/perfis:
*   get:
*     tags:
*       - 'Perfis'
*     summary: Retorna uma lista de perfis do aluno.
*     description: Método para listar todos os perfis disponíveis para os alunos.
*     produces:
*       - application/json
*     responses:
*       200:
*         schema:
*           $ref: '#/definitions/PROFILE_DATA_CONTAINER'
*       400:
*         description: Erro de sintaxe JSON no corpo do request.
*       401:
*         description: Informações de autorização ausentes ou inválidas.
*       5XX:
*         description: Erro inesperado.
*/
routes.get('/v1/perfis', handler.getProfiles)

// Relationships

/**
* @swagger
* definitions:
*   GRAU_PARENTESCO:
*     properties:
*       ID_GRAU_PARENTESCO:
*         type: integer
*         description: ID do grau de parentesco
*         default: 0
*       DATA_HORA_CRIACAO:
*         type: date
*         description: Data e hora de criação do parentesco
*         default: 0
*       ATIVO:
*         type: booleam
*         description: Status do parentesco
*         default: 0
*       DESCRICAO:
*         type: string
*         default: ""
*         description: Descrição do parentesco
*     required:
*       - DESCRICAO
*   RELATIONSHIP_DATA_CONTAINER:
*     properties:
*       message:
*         type: string
*         default: Consulta realizada com sucesso
*         description: Mensagem de retorno
*       data:
*         type: array
*         items:
*               $ref: '#/definitions/GRAU_PARENTESCO'
*         description: Lista de graus de parentesco retornados
*/

/**
* @swagger
* /v1/graus_parentesco:
*   get:
*     tags:
*       - 'GrausParentesco'
*     summary: Retorna uma lista de graus de parentesco do aluno.
*     description: Método para listar todos os graus de parentesco disponíveis para os alunos.
*     produces:
*       - application/json
*     responses:
*       200:
*         schema:
*           $ref: '#/definitions/RELATIONSHIP_DATA_CONTAINER'
*       400:
*         description: Erro de sintaxe JSON no corpo do request.
*       401:
*         description: Informações de autorização ausentes ou inválidas.
*       5XX:
*         description: Erro inesperado.
*/
routes.get('/v1/graus_parentesco', handler.getRelationships)


// Means of dissemination

/**
* @swagger
* definitions:
*   MEIO_DIVULGACAO:
*     properties:
*       ID_MEIO_DIVULGACAO:
*         type: integer
*         description: ID do meio de divulgação
*         default: 0
*       DATA_HORA_CRIACAO:
*         type: date
*         description: Data e hora do meio de divulgação
*         default: 0
*       ATIVO:
*         type: booleam
*         description: Status do meio de divulgação
*         default: 0
*       DESCRICAO:
*         type: string
*         default: ""
*         description: Descrição do meio de divulgação
*       OBSERVACOES:
*         type: string
*         default: ""
*         description: Observações do meio de divulgação
*     required:
*       - DESCRICAO
*   DISSEMINATION_DATA_CONTAINER:
*     properties:
*       message:
*         type: string
*         default: Consulta realizada com sucesso
*         description: Mensagem de retorno
*       data:
*         type: array
*         items:
*               $ref: '#/definitions/MEIO_DIVULGACAO'
*         description: Lista de meios de divulgação retornados
*/

/**
* @swagger
* /v1/meios_divulgacao:
*   get:
*     tags:
*       - 'MeiosDivulgacao'
*     summary: Retorna uma lista de meios de divulgação.
*     description: Método para listar todos os meios de divulgação disponíveis.
*     produces:
*       - application/json
*     responses:
*       200:
*         schema:
*           $ref: '#/definitions/DISSEMINATION_DATA_CONTAINER'
*       400:
*         description: Erro de sintaxe JSON no corpo do request.
*       401:
*         description: Informações de autorização ausentes ou inválidas.
*       5XX:
*         description: Erro inesperado.
*/
routes.get('/v1/meios_divulgacao', handler.getDisseminations)

module.exports = routes
