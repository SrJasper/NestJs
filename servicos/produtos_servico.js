// Importar o módulo de conexão com banco
const Product = require("../models/product")

const fs = require('fs')
const path = require("path")

function formularioCadastro(req, res){
    res.render('formulario')
}

// Função para realizar o cadastro de produtos
async function cadastrarProduto(req, res) {
    try {
        let nome = req.body.nome
        let valor = req.body.valor
        let imagem = req.files.imagem.name
        let categoria = req.body.categoria

        if (nome == '' || valor == '' || isNaN(valor) || categoria == '') {
            return res.redirect('/falhaCadastro')
        }

        req.files.imagem.mv(path.join(__dirname,  "..", '/imagens/', req.files.imagem.name))
       
        await Product.create({nome, value: valor, img: imagem, category: categoria})
        return res.redirect('/okCadastro')
    } catch(erro) {
        console.log("Erro durante o cadastro do produto:", erro)
        return res.redirect('/falhaCadastro')
    }
}

// Função para exibir o formulário para cadastro de produtos e a situação
function formularioCadastroComSituacao(req, res){
    res.render('formulario', {situacao:req.params.situacao})
}

// Função para exibir o formulário para edição de produtos
async function formularioEditar(req, res){
    try {
        const produto = await Product.findById(req.params.id)
        res.render('formularioEditar', {produto})
    } catch (error) {
        console.log("Erro ao cadastrar")
    }
}
// FEITO
// Função para exibir a listagem de produtos
async function listagemProdutos(req, res){
    const categoria = req.params.categoria
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
}

// Função para realizar a pesquisa de produtos
async function pesquisa(req, res){
    
    try {
        
        let semRegistros = false  
        const produto = await Product.find({ nome: { $regex: req.body.termo, $options: 'i' } })
        if(!produto || produto.length <= 0) semRegistros = true
        return res.render('lista', {produtos: produto, semRegistros:semRegistros})
        
    } catch (error) {
        return res.render("err")
    }

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
        res.redirect('/okRemover')
    } catch (error) {
        console.log("Não foi possivel deletar o item")
        res.redirect('/falhaRemover')
    }
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
                        console.error('Erro ao excluir a imagem:', err)
                    }
                })
                newImg.mv(path.join(__dirname, "..",'/imagens/',newImg.name)) 
            }

            await product.updateOne({ nome, value: valor, img: newImg ? newImg.name : defaultImg })

            return  res.redirect('/okEdicao')   
        } catch (error) {
            console.log(error)     
            return res.redirect('/falhaEdicao')    
        }    
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
}
