module.exports = function(app){
	const login = app.controllers.login;

   app.route('/').get(login.index).post(login.autenticar);
   app.route('/sair').get(login.sair);
}