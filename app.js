var express = require('express')
var path = require('path')
var swaggerJSDoc = require('swagger-jsdoc')
var routes = require('./routes/index')
var bodyParser = require('body-parser')

var app = express()

var swaggerDefinition = {
  info: {
    title: 'Acorde alunos API',
    version: '1.0.0',
    description: 'Projeto piloto para o módulo da API de alunos.',
    contact: {
      name: 'Criado por Charles M. Fróes',
      email: 'charles.mirandafroes@gmail.com',
    },
  },
  host: process.env.host,
  grouping: 'tags',
  sortEndpoints: 'ordered',
  cors: true,
  basePath: '/',
}

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./routes/*.js'],
}

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options)

app.get('/swagger.json', function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) return res.status(400).json({
    errors: [{
      msg: 'Erro de sintaxe JSON no corpo do request.',
    }]
  })
});

app.use(express.static(path.join(__dirname, 'public')))
app.use('/', routes)


app.listen(3333)
