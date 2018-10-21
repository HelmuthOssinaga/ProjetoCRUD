/*
Arquivo: produto.js
author: HelmuthOssinaga
Descrição: Arquivo responsavel onde trataremos o modelo da classe produto
Data: 21-10-2018
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
Produto:

Id:int
Nome : String
Preco: Number
Descrição: String

*/

var ProdutoSchema = new Schema({
nome:String,
preco: Number,
descricao: String
});

module.exports = mongoose.model('Produto',ProdutoSchema);
