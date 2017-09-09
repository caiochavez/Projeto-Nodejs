const mongoose = require('mongoose');

const conexao = mongoose.connect('mongodb://localhost/pessoas', function(err){
	if(err){
		throw err;
	}else{
		console.log('Conexão com o MongoDB efetuada com sucesso!');
	}
});