const { validationResult } = require('express-validator')
const CPF = require('cpf-check')
const sql = require('mssql')
const config = require('config')
const Moment = require('moment')
module.exports = {

  // Students
  getStudentsByFilter: async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(409).json({ errors: errors.array() });
    }

    if (typeof req.query.searchText === 'undefined') {
      req.query.searchText = ''
    }

    try {
      let pool = await sql.connect(config)

      let offset = req.query.limit * (req.query.page - 1)

      let query = `from dbo.ALUNO where (ID_ALUNO like '%${req.query.searchText}%' or NOME like '%${req.query.searchText}%' or CPF like '%${req.query.searchText}%' or BAIRRO like '%${req.query.searchText}%' or CIDADE like '%${req.query.searchText}%' or PERFIL like '%${req.query.searchText}%')`

      let restrictions = ''

      if (req.query.status != 'Todos') {
        if (req.query.status === 'Ativos') {
          restrictions += ' AND ATIVO = 1'
        } else {
          restrictions += ' AND ATIVO = 0'
        }
      }

      query += restrictions

      let total = await pool.request().query(`select count(*) as count ${query}`)

      let rows = await pool.request().query(`select * ${query} order by ${req.query.sortColumn} ${req.query.sortDirection} OFFSET ${offset} ROWS FETCH FIRST ${req.query.limit} ROWS ONLY`)

      return res.status(200).json({
        message: rows.rowsAffected === 0 ? 'A consulta não retornou dados.' : 'Consulta realizada com sucesso.',
        current_page: parseInt(req.query.page),
        total: parseInt(total.recordset[0].count),
        total_pages: Math.ceil(total.recordset[0].count / req.query.limit),
        data: rows.recordsets
      })
    } catch (error) {
      return next(res.status(500).json({
        errors: [{
          message: 'Erro inesperado.',
          dev_message: error.message,
        }]
      }))
    }
  },

  getStudentById: async (req, res, next) => {
    try {
      let pool = await sql.connect(config)

      const rows = await pool.request().input('id', sql.Int, req.params.id).query('select * from dbo.ALUNO where ID_ALUNO = @id')

      if (rows.rowsAffected[0] === 0) {
        return res.status(404).json({
          errors: [{
            message: 'Aluno não encontrado.',
          }]
        })
      }

      res.status(200).json({
        message: 'Ok! Aluno encontrado.',
        aluno: rows.recordset[0]
      })
    } catch (error) {
      return next(res.status(500).json({
        errors: [{
          message: 'Erro inesperado.',
          dev_message: error.message,
        }]
      }))
    }
  },

  createStudent: async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(409).json({ errors: errors.array() });
    }

    req.body.CPF = CPF.strip(req.body.CPF);
    req.body.RESPONSAVEL_CPF = CPF.strip(req.body.RESPONSAVEL_CPF);

    // if (!CPF.validate(req.body.CPF)) {
    //   return res.status(409).json({
    //     errors: [{
    //       message: 'O CPF do aluno é inválido.'
    //     }]
    //   });
    // }

    // if (!CPF.validate(req.body.RESPONSAVEL_CPF)) {
    //   return res.status(409).json({
    //     errors: [{
    //       message: 'O CPF do responsável pelo aluno é inválido.'
    //     }]
    //   });
    // }

    req.body.DATA_HORA_CRIACAO = Moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    req.body.DATA_NASCIMENTO ? req.body.DATA_NASCIMENTO = Moment(req.body.DATA_NASCIMENTO).format("YYYY-MM-DD HH:mm:ss") : Moment(new Date()).format("YYYY-MM-DD HH:mm:ss");;
    req.body.RESPONSAVEL_DATA_NASCIMENTO ? req.body.RESPONSAVEL_DATA_NASCIMENTO = Moment(req.body.RESPONSAVEL_DATA_NASCIMENTO).format("YYYY-MM-DD HH:mm:ss") : Moment(new Date()).format("YYYY-MM-DD HH:mm:ss");;

    try {
      let pool = await sql.connect(config)

      const transaction = new sql.Transaction(pool)

      await transaction.begin()

      const request = new sql.Request(transaction);

      delete req.body.ID_ALUNO

      let cols = [];
      let inputs = [];

      for (let k in req.body) {
        request.input(k, req.body[k]);
        cols.push(k);
        inputs.push('@' + k);
      }


      let query = `insert into dbo.ALUNO (${cols.toString()}) values (${inputs.toString()})`

      await request.query(query);

      await transaction.commit();

      res.status(201).json({
        message: 'Aluno criado com sucesso.'
      })

    } catch (error) {
      return next(res.status(500).json({
        errors: [{
          message: 'Erro inesperado.',
          dev_message: error.message,
        }]
      }))
    }
  },

  updateStudent: async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(409).json({ errors: errors.array() });
    }

    // req.body.cpf = CPF.strip(req.body.cpf);

    // if (!CPF.validate(req.body.cpf)) {
    //   return res.status(409).json({
    //     errors: [{
    //       message: 'CPF inválido.'
    //     }]
    //   });
    // }

    req.body.DATA_HORA_CRIACAO = Moment(new Date()).format("YYYY-MM-DD HH:mm:ss");;
    req.body.DATA_NASCIMENTO = Moment(req.body.DATA_NASCIMENTO).format("YYYY-MM-DD HH:mm:ss");;
    req.body.RESPONSAVEL_DATA_NASCIMENTO = Moment(req.body.RESPONSAVEL_DATA_NASCIMENTO).format("YYYY-MM-DD HH:mm:ss");;

    try {
      let pool = await sql.connect(config)

      const transaction = new sql.Transaction(pool)

      await transaction.begin()

      const request = new sql.Request(transaction);

      let id = req.body.ID_ALUNO

      delete req.body.ID_ALUNO

      let inputs = [];

      for (let k in req.body) {
        request.input(k, req.body[k]);
        inputs.push(`${k}=@${k}`);
      }

      await request.input('id', sql.Int, id).query(`update dbo.ALUNO set ${inputs.toString()} where ID_ALUNO=@id`)

      await transaction.commit();

      res.status(200).json({
        message: 'Aluno atualizado com sucesso.'
      })

    } catch (error) {
      return next(res.status(500).json({
        errors: [{
          message: 'Erro inesperado.',
          dev_message: error.message,
        }]
      }))
    }
  },

  removeStudent: async (req, res, next) => {

    try {
      let pool = await sql.connect(config)

      const rows = await pool.request().input('id', sql.Int, req.params.id).query('select * from dbo.ALUNO where ID_ALUNO = @id')

      if (rows.rowsAffected[0] === 0) {
        return res.status(404).json({
          errors: [{
            message: 'Aluno não encontrado.',
          }]
        })
      }

      await pool.request().input('ID_ALUNO', sql.Int, req.params.id).query('delete from dbo.ALUNO where ID_ALUNO =@ID_ALUNO', req.params.id)

      res.status(200).json({
        message: 'Aluno removido com sucesso.'
      })

    } catch (error) {
      return next(res.status(500).json({
        errors: [{
          message: 'Erro inesperado.',
          dev_message: error.message,
        }]
      }))
    }
  },

  // Profiles
  getProfiles: async (req, res, next) => {

    try {
      let pool = await sql.connect(config)

      let rows = await pool.request().query(`select * from dbo.PERFIL order by nome`)

      return res.status(200).json({
        message: rows.rowsAffected === 0 ? 'A consulta não retornou dados.' : 'Consulta realizada com sucesso.',
        data: rows.recordsets
      })
    } catch (error) {
      return next(res.status(500).json({
        errors: [{
          message: 'Erro inesperado.',
          dev_message: error.message,
        }]
      }))
    }
  },


  // Relationships
  getRelationships: async (req, res, next) => {

    try {
      let pool = await sql.connect(config)

      let rows = await pool.request().query(`select * from dbo.GRAU_PARENTESCO order by DESCRICAO`)

      return res.status(200).json({
        message: rows.rowsAffected === 0 ? 'A consulta não retornou dados.' : 'Consulta realizada com sucesso.',
        data: rows.recordsets
      })
    } catch (error) {
      return next(res.status(500).json({
        errors: [{
          message: 'Erro inesperado.',
          dev_message: error.message,
        }]
      }))
    }
  },


  // Disseminations
  getDisseminations: async (req, res, next) => {

    try {
      let pool = await sql.connect(config)

      let rows = await pool.request().query(`select * from dbo.MEIO_DIVULGACAO order by DESCRICAO`)

      return res.status(200).json({
        message: rows.rowsAffected === 0 ? 'A consulta não retornou dados.' : 'Consulta realizada com sucesso.',
        data: rows.recordsets
      })
    } catch (error) {
      return next(res.status(500).json({
        errors: [{
          message: 'Erro inesperado.',
          dev_message: error.message,
        }]
      }))
    }
  },
}
