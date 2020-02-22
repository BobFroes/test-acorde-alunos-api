const { validationResult } = require('express-validator')
const CPF = require('cpf-check')
const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'B0bcharles@123',
  database: 'etag_db',
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
});

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
      let offset = req.query.limit * (req.query.page - 1)

      let [rows, row_fields] = await pool.query(`select * from etag_db.alunos where id like '%${req.query.searchText}%' or nome like '%${req.query.searchText}%' or cpf like '%${req.query.searchText}%' or bairro like '%${req.query.searchText}%' or cidade like '%${req.query.searchText}%' order by ${req.query.sort_by} ${req.query.sort_order} LIMIT  ${offset}, ${req.query.limit}`)

      if (req.query.status !== 'Todos') {
        rows = rows.filter(row => row.status === req.query.status)
      }

      return res.status(200).json({
        message: rows.length === 0 ? 'A consulta não retornou dados.' : 'Consulta realizada com sucesso.',
        current_page: parseInt(req.query.page),
        total: parseInt(rows.length),
        total_pages: Math.ceil(rows.length / req.query.limit),
        data: rows
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
      const [rows, fields] = await pool.query('select * from etag_db.alunos where id = ?', req.params.id)

      if (rows.length === 0) {
        return res.status(404).json({
          errors: [{
            message: 'Aluno não encontrado.',
          }]
        })
      }

      res.status(200).json({
        message: 'Ok! Aluno encontrado.',
        aluno: rows[0]
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

    req.body.cpf = CPF.strip(req.body.cpf);

    if (!CPF.validate(req.body.cpf)) {
      return res.status(409).json({
        errors: [{
          message: 'CPF inválido.'
        }]
      });
    }

    delete req.body.id

    try {
      await pool.query('insert into alunos set ?', req.body)

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

    req.body.cpf = CPF.strip(req.body.cpf);

    if (!CPF.validate(req.body.cpf)) {
      return res.status(409).json({
        errors: [{
          message: 'CPF inválido.'
        }]
      });
    }

    try {
      await pool.query('update etag_db.alunos set ? where id = ?', [req.body, req.body.id])

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
      const [rows, fields] = await pool.query('select * from etag_db.alunos where id = ?', req.params.id)

      if (rows.length === undefined || rows.length === 0) {
        return res.status(404).json({
          message: 'Aluno não encontrado.'
        });
      }

      await pool.query('delete from etag_db.alunos where id = ?', req.params.id)

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

}
