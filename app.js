const express = require ('express');
const { engine } = require('express-handlebars');
const fileupload = require('express-fileupload');
const app = express();
const rota_produto = require('./rotas/produtos_rota');

app.use(fileupload());
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));

// Configuração do express-handlebars
app.engine('handlebars', engine({
    helpers: {
      // Função auxiliar para verificar igualdade
      condicionalIgualdade: function (parametro1, parametro2, options) {
        return parametro1 === parametro2 ? options.fn(this) : options.inverse(this);
      }
    }
  }));
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use('/css', express.static('./css'));
app.use('/imagens', express.static("./imagens"))

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/', rota_produto);

app.listen(8080);