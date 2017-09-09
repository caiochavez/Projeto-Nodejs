module.exports = function(app){

const Usuario = app.models.usuario;

	const indexController = {
		index: function(req,res){
			res.render('login/login.jade');
		},

		autenticar: function(req,res){
			const usuario = new Usuario();
			const email = req.body.email;
			const senha = req.body.senha;
			
			Usuario.findOne({'email': email}, function(err,data){
				if(err){
					req.flash('erro', 'Erro ao entrar no sistema!' + err);
					res.redirect('/');
				}else if(!data){
					req.flash('erro', 'Email não encontrado!');
					res.redirect('/');
				}else if(!usuario.validarSenha(senha, data.senha)){
					req.flash('erro', 'Senha inválida!');
					res.redirect('/');
				}else{
					//Cria uma sessão
					req.session.usuario = data;
					res.redirect('/home');
				}
			});
		},

		sair: function(req,res){
			req.session.destroy();
			res.redirect('/');
		}
	} 

	return indexController;
}