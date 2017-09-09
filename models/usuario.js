const mongoose = require('mongoose'),
      bcrypt   = require('bcrypt-nodejs'),
      moment   = require('moment');

module.exports = function(){

	const schema = mongoose.Schema;

    const enderecoSchema = new schema({
        cidade_estado    : {type: String},
        rua_numero_bairro: {type: String}
    });

    const usuarioSchema = new schema({
    	nome           : {type: String, index: true},
    	email          : {type: String, required: true, unique: true, index: true},
    	data_nascimento: {type: Date, get: getData},
    	senha          : {type: String, required: true},
        endereco       : enderecoSchema
    });

    /*Exemplo1
    enum: ['vendedor', 'administrador'],
    default: 'vendedor'
    */

    /*Exemplo2
    endereco: {type: mongoose.Schema.Types.ObjectId, ref: 'Endereco'}
    */

    /*Exemplo3
    endereco: [{
       cidade_estado: {type: String},
       bairro_rua_numero: {type: String}
    }]
    */

    function getData(value){
        const dt = moment(value);
        return dt.format('DD/MM/YYYY');
    }

    usuarioSchema.methods.generateHash = function(senha){
    	return bcrypt.hashSync(senha, bcrypt.genSaltSync(8), null);
    }

    usuarioSchema.methods.validarSenha = function(senhaBody, senhaDB){
    	return bcrypt.compareSync(senhaBody, senhaDB, null);
    }

    return mongoose.model('pessoas', usuarioSchema);

}