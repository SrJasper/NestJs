// Importar o módulo de conexão com banco MySQL
const conexao = require('../db/conexao_mysql');

// Importar o módulo file system
const fs = require('fs');

// Função para exibir o formulário para cadastro de produtos
function formularioCadastro(req, res){
    res.render('formulario');
}

// Função para realizar o cadastro de produtos
function cadastrarProduto(req, res){
    
    try{
        let nome = req.body.nome;
        let valor = req.body.valor;
        let categoria = req.body.categoria;
        let imagem = req.files.imagem.name;


        
        if(nome == '' || valor == '' ||valor == isNaN(valor) || categoria == ''){
            res.redirect('/falhaCadastro')
    
        } else {
            //SQL
            let sql = `INSERT INTO produtos (nome, valor, imagem, categoria) VALUES ('${nome}', ${valor}, '${imagem}', '${categoria}')`;
    
            //Executar comando SQL
            conexao.query(sql, function(erro, retorno){
                if(erro) {
            
                    res.redirect('/falhaCadastro');
                    throw erro; // Adicionado para evitar que a execução continue
                }
                
                req.files.imagem.mv(__dirname+'../../imagens/'+req.files.imagem.name);
                console.log(retorno);
                
                res.redirect('/okCadastro'); // Redirecionamento aqui
            });

        }
    } catch(erro) {
        res.redirect('/falhaCadastro')
    }
}

// Função para exibir o formulário para cadastro de produtos e a situação
function formularioCadastroComSituacao(req, res){
    res.render('formulario', {situacao:req.params.situacao});
}

// Função para exibir o formulário para edição de produtos
function formularioEditar(req, res){
    let codigo = req.params.codigo;

    let sql = `SELECT * FROM produtos WHERE codigo = ${codigo}`;

    conexao.query(sql, function(erro, retorno){
        if(erro) throw erro;

        res.render('formularioEditar', {produto:retorno[0]});
    })
}

// Função para exibir a listagem de produtos
function listagemProdutos(req, res){
    let categoria = req.params.categoria;

    let sql = '';

    if(categoria == 'todos'){
        sql = 'SELECT * FROM produtos ORDER BY RAND()'
    } else{
        sql = `SELECT * FROM produtos WHERE categoria = '${categoria}'`;
    }

    conexao.query(sql, function(erro, retorno){
        res.render('lista', {produtos:retorno});
    })
}

// Função para realizar a pesquisa de produtos
function pesquisa(req, res){
    let termo = req.body.termo;

    let sql = `SELECT * FROM produtos WHERE nome LIKE '%${termo}%'`

    conexao.query(sql, function(erro, retorno){
        let semRegistros = retorno.length == 0 ? true: false;
        res.render('lista', {produtos:retorno, semRegistros:semRegistros});
    })
}

// Função para realizar a remoção de produtos
function removerProduto(req, res){
    try{        
        let sql = `DELETE FROM produtos WHERE codigo = ${req.params.codigo}`;
        
        conexao.query(sql, function(erro, retorno){
            if(erro) throw erro;
            
            fs.unlink(__dirname+'/imagens/'+req.params.imagem, (erro_imagem)=>{
                console.log('Falha ao remover imagem');
            });
        });
        
        res.redirect('/okRemover');
    }catch (erro){

        res.redirect('/falhaRemover');

    };
}

// Função responsável pela edição de produtos
function editarProduto(req, res){
    
    let nome = req.body.nome;
    let valor = req.body.valor;
    let codigo = req.body.codigo;    
    let nomeImagem = req.body.nomeImagem;
    
    if(nome == '' || valor == '' ||valor == isNaN(valor)){
        res.redirect('/falhaEdicao')
    } else {
        try{
            let imagem = req.files.imagem;
            let sql = `UPDATE produtos SET nome='${nome}', valor=${valor}, imagem='${imagem.name}' WHERE codigo=${codigo}`;
            
            conexao.query(sql, function(erro, retorno){
                if(erro) throw erro;
                
                fs.unlink(__dirname+'/imagens/'+nomeImagem, (erro_imagem) => {
                    if(erro_imagem) {
                        console.log("Falha ao excluir a imagem:", erro_imagem);
                        res.redirect("/falhaEdicao")
                        return;
                    }
                });
                imagem.mv(__dirname+'/imagens/'+imagem.name);
            });
        } catch {
            let sql = `UPDATE produtos SET nome='${nome}', valor=${valor} WHERE codigo=${codigo}`;
            conexao.query(sql, function(erro, retorno){
                if(erro) throw erro;
            })
        }
    }
                
    res.redirect('/okEdicao');
}

// Exportar funções
module.exports = {
    formularioCadastro,
    formularioCadastroComSituacao,
    formularioEditar,
    listagemProdutos,
    pesquisa,
    cadastrarProduto,
    removerProduto,
    editarProduto
};