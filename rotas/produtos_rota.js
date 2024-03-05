// Importar o módulo express
const express = require('express');

// Extraíndo a função Router do módulo express
const router = express.Router();

// Importar módulo de serviços
const servico = require('../servicos/produtos_servico');

// *** ADICIONE SUAS ROTAS AQUI
//rota principal
router.get('/', function (req, res){              
    servico.formularioCadastro(req, res);
});

router.post('/pesquisa', function(req, res){    
    servico.pesquisa(req, res);    
})

// rota principal contendo a situação
router.get('/:situacao', function (req, res){
    servico.formularioCadastroComSituacao(req, res);
});

router.get('/remover/:codigo&:imagem', function(req, res){
   servico.removerProduto(req, res);
});

router.get('/formularioEditar/:codigo', function(req, res){
    servico.formularioEditar(req, res);
})

router.get('/listar/:categoria', function(req, res){
    servico.listagemProdutos(req, res);
});

router.post('/cadastrar', function(req, res){
    servico.cadastrarProduto(req, res);
})

router.post('/editar', function(req, res){
    servico.editarProduto(req, res);
});

// Exportar o router
module.exports = router;