require("dotenv").config();
const express = require("express");
const {engine} = require("express-handlebars");
const fileupload = require("express-fileupload");
const conn = require("./db/mongoConnection")
const app = express();
const rota_produto = require("./rotas/produtos_rota");
const {allowInsecurePrototypeAccess} =require("@handlebars/allow-prototype-access")
const Handlebars = require("handlebars")

app.use(fileupload());
app.use("/bootstrap", express.static("./node_modules/bootstrap/dist"));

// Configuração do express-handlebars
app.engine(
  "handlebars",
  engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: {
      // Função auxiliar para verificar igualdade
      condicionalIgualdade: function (parametro1, parametro2, options) {
        return parametro1 === parametro2
          ? options.fn(this)
          : options.inverse(this);
      },
    },
  })
);

app.set("view engine", "handlebars");
app.set("views", "./views");
app.use("/css", express.static("./css"));
app.use("/imagens", express.static("./imagens"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", rota_produto);


conn().then(() => app.listen(process.env.PORT, () =>
console.log(
  `Servidor rodando localmente em http://localhost:${process.env.PORT}`
)
)).catch(e => console.log(e))
