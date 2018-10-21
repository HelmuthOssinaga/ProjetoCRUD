/*
* Arquivo: server.js
* Descrição:
* author: HelmuthOssinaga
* Data de Criação: 21-10-2018
*/

//Configurar o setup da applicação

//Chamadas dos pacotes
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Produto = require('./app/models/produto');

mongoose.Promise = global.Promise;

//URI do mlab
mongoose.connect('mongodb://hossinaga:ossinaga123@ds237713.mlab.com:37713/node-crud-api', {
  useMongoClient:true
});

//Maneira Local:
//mongoose.connect('mongodb://localhost/node-crud-api');

//Configuração da variavel app para usar o 'bodyParser()'
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Definindo uma porta onde será executada a API
var porta = process.env.port || 8000;

//Rotas da nossa API:
//=====================================================

//Criando uma instancia das rotas via express
var router = express.Router();

//Criando uma rota de exemplo
router.use(function(req,res,next){
  console.log('Está havendo algo aqui...');
  next();
});

router.get('/',function(req,res){
    res.json({message: 'Bem vindo'});
});

//API's
//============

//Rotas que terminarem com '/produtos' (servir: GET ALL & POST)
router.route('/produtos')

  /*1 - Criar produto(acessar em POST http:// localhost:8000/api/produtos)*/
  .post(function(req,res){
    var produto = new Produto();

    //aqui nós vamos setar os campos dos produtos (via request):
    produto.nome = req.body.nome;
    produto.preco = req.body.preco;
    produto.descricao = req.body.descricao;

    produto.save(function(error){
      if(error){
        res.send('Erro ao tentar salvar o produto...' + error);
      }
      res.json({message: 'Produto cadastrado com sucesso!!'});
    });
  })

  /*2 - selecionar todos os produtos(acessar em GET http:// localhost:8000/api/produtos)*/
  .get(function(req, res){
    Produto.find(function(error, produtos){
        if(error){
          res.send('Erro ao tentar selecionar todos os produtos...'+error);
        }
        res.json(produtos);
    })
  })

  //Rotas que irão terminar em 'produtos/:produto_id'(servir tanto para GET, PUT & DELETE: id)
  router.route('/produtos/:produto_id')

  /*3 - Selecionar por id (acessar em: GET http://localhost:8000/api/produtos/:produto_id)*/

  //Funcao para selecionar um determinado produto por ID, depois irá verificar, se caso não encontrado, um produto, retornará erro
  .get(function(req, res){
      Produto.findById(req.params.produto_id, function(error, produto){
        if(error){
          res.send('ID do produto não encontrado' + error);
        }
        res.json(produto);
      })
  })

  /* 4 - Atualizar por ID(Acessar em PUT http://localhost:8000/api/produtos/:produtos_id)*/
  .put(function(req, res){

    //Primeiro: achar o ID do produto para atualizar
      Produto.findById(req.params.produto_id,function(error, produto){
        if(error){
          res.send('ID não encontrado!!' + error);
          }
        //Segundo:
        produto.nome = req.body.nome;
        produto.preco = req.body.preco;
        produto.descricao = req.body.descricao;

        //Terceiro: Após a atualização, vamos salvar
        produto.save(function(error){
          if(error){
            res.send('Erro ao atualizar o produto' + error);
          }
          res.json({message : 'Produto atualizado com sucesso!!'});
        })
      })
  })

  /*Deletar o produto por ID (Acessar em DELETE http://localhost:8000/api/produtos/:produtos_id))*/

.delete(function(req, res){
    Produto.remove({

      _id: req.params.produto_id
    },function(error){
      if(error){
        res.send('ID não encontrado!!' + error)
      }
      res.json({message: 'Produto excluido com sucesso!!'});
    }
    );
})

//Definindo um padrao das rotas prefixadas:'\api'
app.use('/api',router);

//Iniciando a aplicação(servidor):
app.listen(porta);
console.log("Iniciando a app na porta"+porta);
