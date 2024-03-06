
const mysql = require('mysql2');

const conexao = mysql.createConnection({
    host: 'projeto.c9eqkuess1zv.us-east-1.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: '12345678',
    database: 'projeto_schema' 
});


conexao.connect(function(erro){
    if(erro) throw erro;
    console.log('Conexão criada');
})

module.exports = conexao;