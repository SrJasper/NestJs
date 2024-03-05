// Importar o módulo de conexão com banco MySQL
const conexao = require('../db/conexao_mysql');

// Importar o módulo file system
const fs = require('fs');
console.log("serviço de formulario de cadastro iniciando");
// Função para exibir o formulário para cadastro de produtos
function formularioCadastro(req, res){
    res.render('formulario');
}
console.log("serviço de formulario de cadastro criado com sucesso");

console.log("serviço de cadastramento de produto iniciado");
// Função para realizar o cadastro de produtos
function cadastrarProduto(req, res) {
    try {
        let nome = req.body.nome;
        let valor = req.body.valor;
        let categoria = req.body.categoria;
        let imagem = req.files.imagem.name;

        if (nome == '' || valor == '' || isNaN(valor) || categoria == '') {
            return res.redirect('/falhaCadastro');
        }

        let menorCodigo = 0; // Começa com o menor código possível

        // Consulta SQL para verificar se o código já está em uso
        let sqlVerificarCodigo = `SELECT COUNT(*) AS total FROM produtos WHERE codigo = ?`;
        
        // Executar a consulta para verificar se o código já está em uso
        conexao.query(sqlVerificarCodigo, [menorCodigo], function(erro, resultado) {
            if (erro) {
                console.log("Erro ao verificar o código:", erro);
                return res.redirect('/falhaCadastro');
            }

            if (resultado[0].total > 0) {
                // Se o código já estiver em uso, procurar o próximo disponível
                proximoCodigoDisponivel();
            } else {
                // Se o código estiver disponível, usar esse código para inserção
                inserirProduto(menorCodigo);
            }
        });

        function proximoCodigoDisponivel() {
            // Função para encontrar o próximo código disponível
            menorCodigo++;
            
            // Consulta SQL para verificar se o próximo código já está em uso
            conexao.query(sqlVerificarCodigo, [menorCodigo], function(erro, resultado) {
                if (erro) {
                    console.log("Erro ao verificar o próximo código:", erro);
                    return res.redirect('/falhaCadastro');
                }

                if (resultado[0].total > 0) {
                    // Se o próximo código também estiver em uso, chamar a função recursivamente para encontrar o próximo
                    proximoCodigoDisponivel();
                } else {
                    // Se o próximo código estiver disponível, usar esse código para inserção
                    inserirProduto(menorCodigo);
                }
            });
        }

        function inserirProduto(codigo) {
            // SQL para inserir o produto com o código disponível
            let sqlInsert = `INSERT INTO produtos (codigo, nome, valor, imagem, categoria) 
                             VALUES (${codigo}, '${nome}', ${valor}, '${imagem}', '${categoria}')`;
            
            // Executar comando SQL para inserção
            conexao.query(sqlInsert, function(erro, retorno) {
                if (erro) {
                    console.log("Erro ao inserir o produto:", erro);
                    return res.redirect('/falhaCadastro');
                }
                
                req.files.imagem.mv(__dirname + '../../imagens/' + req.files.imagem.name);
                console.log(retorno);
                
                res.redirect('/okCadastro');
            });
        }
    } catch(erro) {
        console.log("Erro durante o cadastro do produto:", erro);
        res.redirect('/falhaCadastro');
    }
}
console.log("serviço de cadastramento de produto criado com sucesso");

console.log("serviço de formulário de cadastro com situação iniciado");
// Função para exibir o formulário para cadastro de produtos e a situação
function formularioCadastroComSituacao(req, res){
    res.render('formulario', {situacao:req.params.situacao});
}
console.log("serviço de formulário de cadastro com situação criado com sucesso");

console.log("serviço de formulário de edição iniciado");
// Função para exibir o formulário para edição de produtos
function formularioEditar(req, res){
    let codigo = req.params.codigo;

    let sql = `SELECT * FROM produtos WHERE codigo = ${codigo}`;

    conexao.query(sql, function(erro, retorno){
        if(erro) throw erro;

        res.render('formularioEditar', {produto:retorno[0]});
    })
}
console.log("serviço de formulário de edição criado com sucesso");

console.log("serviço de listagem de produto iniciado");
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
console.log("serviço de listagem de produto criado com sucesso");

console.log("serviço de pesquisa iniciado");
// Função para realizar a pesquisa de produtos
function pesquisa(req, res){
    let termo = req.body.termo;

    let sql = `SELECT * FROM produtos WHERE nome LIKE '%${termo}%'`

    conexao.query(sql, function(erro, retorno){
        let semRegistros = retorno.length == 0 ? true: false;
        res.render('lista', {produtos:retorno, semRegistros:semRegistros});
    })
}
console.log("serviço de pesquisa criado com sucesso");

console.log("serviço de remoção de produto iniciado");
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
console.log("serviço de remoção de produto criado com sucesso");

console.log("serviço de edição de produto iniciado");
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
console.log("serviço de edição de produto criado com sucesso");

console.log("exportação dos módulos de serviço iniciada");
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
console.log("exportação dos modulos de serviço finalizadas");