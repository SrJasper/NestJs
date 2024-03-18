// Importar o módulo de conexão com banco MySQL
const conexao = require('../db/conexao_mysql');
const Product = require("../models/product")

const fs = require('fs');
const path = require("path")

function formularioCadastro(req, res){
    res.render('formulario');
}

//FEITO MONGO
// Função para realizar o cadastro de produtos
async function cadastrarProduto(req, res) {
    try {
        let nome = req.body.nome;
        let valor = req.body.valor;
        let imagem = req.files.imagem.name;
        let categoria = req.body.categoria;

        if (nome == '' || valor == '' || isNaN(valor) || categoria == '') {
            return res.redirect('/falhaCadastro');
        }

        req.files.imagem.mv(path.join(__dirname,  "..", '/imagens/', req.files.imagem.name));
       
        await Product.create({nome, value: valor, img: imagem, category: categoria})
        return res.redirect('/okCadastro');

/*

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
                
                req.files.imagem.mv(path.join(__dirname,  "..", '/imagens/', req.files.imagem.name));
                console.log(retorno);
                
                res.redirect('/okCadastro');
            });
        }
*/
    } catch(erro) {
        console.log("Erro durante o cadastro do produto:", erro);
        res.redirect('/falhaCadastro');
    }
}
//FEITO
// Função para exibir o formulário para cadastro de produtos e a situação
function formularioCadastroComSituacao(req, res){
    res.render('formulario', {situacao:req.params.situacao});
}
//FEITO
// Função para exibir o formulário para edição de produtos
async function formularioEditar(req, res){
    try {
        const produto = await Product.findById(req.params.id)
        res.render('formularioEditar', {produto});
    } catch (error) {
        console.log("Erro ao cadastrar")
    }
}
// FEITO
// Função para exibir a listagem de produtos
async function listagemProdutos(req, res){
    const categoria = req.params.categoria;
    try {
        if(categoria === 'todos'){
            const produtos = await Product.find()
            return res.render('lista', {produtos})
        }else{
            const produtos = await Product.find({category: categoria})
            return res.render('lista', {produtos})
        }
    } catch (error) {
        console.log("Não foi possivel fazer a lista")
        res.redirect('/formulario')
    }
    /*
    if(categoria == 'todos'){
        sql = 'SELECT * FROM produtos ORDER BY RAND()'
    } else{
        sql = `SELECT * FROM produtos WHERE categoria = '${categoria}'`;
    }
      

    conexao.query(sql, function(erro, retorno){
        if(erro){
            alert("Deu ruim")
        }
        return res.render('lista', {produtos:retorno});
    })
    */
}
//FEITO
// Função para realizar a pesquisa de produtos
async function pesquisa(req, res){
    
    try {
        
        let semRegistros = false  
        const produto = await Product.find({ nome: { $regex: req.body.termo, $options: 'i' } })
        if(!produto || produto.length <= 0) semRegistros = true
        return res.render('lista', {produtos: produto, semRegistros:semRegistros});
        
    } catch (error) {
        return res.render("err")
    }
/*
    let sql = `SELECT * FROM produtos WHERE nome LIKE '%${termo}%'`

    conexao.query(sql, function(erro, retorno){
        let semRegistros = retorno.length == 0 ? true: false;
        res.render('lista', {produtos:retorno, semRegistros:semRegistros});
    })
*/
}
//FEITA
// Função para realizar a remoção de produtos
async function removerProduto(req, res){
    try {        
        const produto = await Product.findById(req.params.id)

        fs.unlink(path.join(__dirname, "..", '/imagens/',produto.img), (e)=>{
            console.log(e)
        })

        await produto.deleteOne()
        console.log("O produto foi deletado")
        res.redirect('/okRemover');
    } catch (error) {
        console.log("Não foi possivel deletar o item")
        res.redirect('/falhaRemover');
    }
/*
    try{        
        let sql = `DELETE FROM produtos WHERE codigo = ${req.params.codigo}`;
        
        conexao.query(sql, function(erro, retorno){
            if(erro) throw erro;
            
            fs.unlink(path.join(__dirname, "..", '/imagens/',req.params.imagem), (erro_imagem)=>{
                console.log('Falha ao remover imagem');
            });
        });
        
        res.redirect('/okRemover');
    }catch (erro){

        res.redirect('/falhaRemover');

    };
*/
}
//FEITA
// Função responsável pela edição de produtos
async function editarProduto(req, res){

    const nome = req.body.nome
    const valor = req.body.valor
    const defaultImg = req.body.nomeImagem
    const newImg = req.files ? req.files.imagem : null
    
    if(nome == '' || valor == '' ||valor == isNaN(valor)){
        return res.redirect('/falhaEdicao')    
    } else {
        try {
            const product = await Product.findById(req.body.id)

            if(newImg) {
                fs.unlink(path.join(__dirname, "..", "/imagens/", product.img), (err) => {
                    if (err) {
                        console.error('Erro ao excluir a imagem:', err);
                    }
                });
                newImg.mv(path.join(__dirname, "..",'/imagens/',newImg.name)); 
            }

            await product.updateOne({ nome, value: valor, img: newImg ? newImg.name : defaultImg })

            return  res.redirect('/okEdicao');   
        } catch (error) {
            console.log(error)     
            return res.redirect('/falhaEdicao')    
        }    
/*
        try{
            let imagem = req.files.imagem;

            let sql = `UPDATE produtos SET nome='${nome}', valor=${valor}, imagem='${imagem.name}' WHERE codigo=${codigo}`;
            
            conexao.query(sql, function(erro, retorno){
                if(erro) throw erro;
                
                fs.unlink(path.join(__dirname, "..",'/imagens/',nomeImagem), (erro_imagem) => {
                    if(erro_imagem) {
                        console.log("Falha ao excluir a imagem:", erro_imagem);
                        res.redirect("/falhaEdicao")
                        return;
                    }
                });
                imagem.mv(path.join(__dirname, "..",'/imagens/',imagem.name));
            });
        } catch {
            let sql = `UPDATE produtos SET nome='${nome}', valor=${valor} WHERE codigo=${codigo}`;
            conexao.query(sql, function(erro, retorno){
                if(erro) throw erro;
            })
        }
*/
    }                
   
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
