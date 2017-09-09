module.exports = function(app){
	
	const Usuario = app.models.usuario;
    const emailService = require('../services/email-service.js');
    //const md5 = require('md5');

    const usuarioController = {

        tela_adicionar: function(req,res){
            res.render('adicionar.jade');
        },

    	adicionar: function(req,res){
    		const model           = new Usuario();
    		model.nome            = req.body.nome;
    		model.email           = req.body.email;
    		model.data_nascimento = req.body.data_nascimento;
            //model.senha           = md5(req.body.senha + global.SALT_KEY);
    		model.senha           = model.generateHash(req.body.senha);
            const endereco = {cidade_estado: req.body.cidade_estado, rua_numero_bairro: req.body.rua_numero_bairro};
            model.endereco = endereco;
            //model.endereco.push(endereco);

    		Usuario.findOne({email: model.email}, function(err,data){
    			if(data){
    				req.flash('erro', 'Este email já está cadastrado, tente outro!');
    				res.render('adicionar.jade', {usuario: model});
    			}else{
    				model.save(function(err){
    					if(err){
    						req.flash('erro', 'Erro ao Cadastrar: ' + err);
    						res.render('adicionar.jade', {usuario: req.body});
    					}else{
                            //Enviando email de confirmação de cadastro
                            emailService.send(
                                req.body.email,
                                'Bem vindo Garoto ou Garota, huuuuuuuu',
                                global.EMAIL_TMPL.replace('{0}', req.body.nome));

    						req.flash('info', 'Registro cadastrado com sucesso!');
    						res.redirect('/cadastrar');
    					}
    				});
    			}
    		});

    	},

        listar: function(req,res){
            Usuario.find(function(err,data){
                if(!data){
                    req.flash('erro', 'Não á registros no banco de dados')
                    res.redirect('/home');
                }else if(err){
                    req.flash('erro', 'Erro ao listar usuários: ' + err);
                    res.redirect('/listar');
                }else{
                    res.render('listar.jade', {lista: data});
                }
            });
        },

        buscar: function(req,res){
            console.log('Nome: ' + req.body.nome_busca);
            Usuario.findOne(req.body.nome_busca, function(err,data){
                if(!data){
                    req.flash('erro', 'Nenhum registro encontrado!');
                    res.render('buscar.jade');
                }else if(err){
                    req.flash('erro', 'Registro não encontado: ' + err);
                    res.redirect('/home');
                }else{
                    res.render('buscar.jade', {lista: data});
                    console.log(data);
                }
            });
        },

        tela_editar: function(req,res){
            Usuario.findById(req.params.id, function(err,data){
                if(err){
                    req.flash('erro', 'Erro ao editar usuário: ' + err);
                    res.redirect('/listar');
                }else{
                    res.render('editar.jade', {model: data, model2: data.endereco});
                }
            });
        },

        editar: function(req,res){
            const query = {_id: req.params.id};
            const mod = {nome: req.body.nome,
                         email: req.body.email,
                         senha: req.body.senha,
                         endereco: {cidade_estado: req.body.endereco.cidade_estado,
                                    rua_numero_bairro: req.body.endereco.rua_numero_bairro}};
            Usuario.update(query, mod, function(err,data){
                if(err){
                    req.flash('erro', 'Erro ao editar usuário: ' + err);
                    res.render('editar.jade', {model: req.body});
                }else{
                    req.flash('info', 'Usuaŕio atualizado com sucesso!');
                    res.redirect('/listar');
                }
            })
        },

        remover: function(req,res){
            Usuario.remove({_id: req.params.id}, function(err){
                if(err){
                    req.flash('erro', 'Erro ao remover usuário: ' + err);
                    res.redirect('/listar');
                }else{
                    req.flash('info', 'Usuário removido com sucesso!');
                    res.redirect('/listar');
                }
            });
        }
    }

    return usuarioController;
}