const express = require ('express');
const mysql = require('mysql2');
const { engine } = require('express-handlebars');
const fileupload = require('express-fileupload');
const fs = require('fs');
const app = express();

app.use(fileupload());
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));
const conexao = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '12345',
    database: 'projeto',
});
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use('/css', express.static('./css'));
app.use('/imagens', express.static("./imagens"))

app.use(express.json());
app.use(express.urlencoded({extended: false}));

//teste de conexão
conexao.connect(function(erro){
    if(erro) throw erro;
    console.log('Conexão criada')
})

app.get('/', function (req, res){
    let sql = 'SELECT * FROM produtos';

    conexao.query(sql, function(erro, retorno){
            
        res.render('formulario', {produtos: retorno});
    });
});

app.get('/remover/:codigo&:imagem', function(req, res){
    let sql = `DELETE FROM produtos WHERE codigo = ${req.params.codigo}`;

    conexao.query(sql, function(erro, retorno){
        if(erro) throw erro;

        fs.unlink(__dirname+'/imagens/'+req.params.imagem, (erro_imagem)=>{
            console.log('Falha ao remover imagem');
        });
    });

    res.redirect('/');
})

app.get('/formularioEditar/:codigo', function(req, res){
    let codigo = req.params.codigo;

    let sql = `SELECT * FROM produtos WHERE codigo = ${codigo}`;

    conexao.query(sql, function(erro, retorno){
        if(erro) throw erro;

        res.render('formularioEditar', {produto:retorno[0]});
    })

})

app.post('/cadastrar', function(req, res){
    
    let nome = req.body.nome;
    let valor = req.body.valor;
    let imagem = req.files.imagem.name;

    //SQL
    let sql = `INSERT INTO produtos (nome, valor, imagem) VALUES ('${nome}', ${valor}, '${imagem}')`;
    //Executar comando SQL
    conexao.query(sql, function(erro, retorno){
        if(erro) throw erro;

        req.files.imagem.mv(__dirname+'/imagens/'+req.files.imagem.name);
        console.log(retorno);
    });

    res.redirect('/');
})

app.listen(8080);