// Importar o módulo express
const express = require('express');

// Extraíndo a função Router do módulo express
const router = express.Router();

// Importar módulo de serviços
const servico = require('../servicos/produtos_servico');

// *** ADICIONE SUAS ROTAS AQUI
//rota principal
console.log("rota principal iniciando");
router.get('/', function (req, res){              
    servico.formularioCadastro(req, res);
});
console.log("rota principal criada com sucesso");

console.log("rota de pesquisa iniciando");
router.post('/pesquisa', function(req, res){    
    servico.pesquisa(req, res);    
})
console.log("rota de pesquisa criada com sucesso");

console.log("rota de cadastro com situação iniciando");
// rota principal contendo a situação
router.get('/:situacao', function (req, res){
    servico.formularioCadastroComSituacao(req, res);
});
console.log("rota de cadastro com situação criada com sucesso");

console.log("rota de remoção iniciando");
router.get('/remover/:codigo&:imagem', function(req, res){
    servico.removerProduto(req, res);
});
console.log("rota de remoção criada com sucesso");

console.log("rota de formulário de edição iniciando");
router.get('/formularioEditar/:codigo', function(req, res){
    servico.formularioEditar(req, res);
})
console.log("rota de formulário de edição criada com sucesso");

console.log("rota de listagem iniciando");
router.get('/listar/:categoria', function(req, res){
    servico.listagemProdutos(req, res);
});
console.log("rota de listagem criada com sucesso");

console.log("rota de cadastro iniciando");
router.post('/cadastrar', function(req, res){
    servico.cadastrarProduto(req, res);
})
console.log("rota de cadastro criada com sucesso");

console.log("rota de edição iniciando");
router.post('/editar', function(req, res){
    servico.editarProduto(req, res);
});
console.log("rota de edição criada com sucesso");
// Exportar o router
module.exports = router;