module.exports = {
  user: 'sa',
  password: 'B0bcharles@123',
  server: '127.0.7.1',
  database: 'teste_db',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    enableArithAbort: true,
  },
};