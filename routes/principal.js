module.exports = function(app){

	const principal = app.controllers.principal;
	const usuario   = app.controllers.usuario;
	const autenticar = require('../middleware/autenticar.js');

	app.route('/home').get(autenticar, usuario.tela_adicionar);
	app.route('/cadastrar').get(autenticar, usuario.tela_adicionar).post(usuario.adicionar);
	app.route('/listar').get(autenticar, usuario.listar);
	app.route('/sobre').get(autenticar, principal.sobre);
	app.route('/buscar').get(autenticar, usuario.buscar);
	app.route('/editar/:id').get(autenticar, usuario.tela_editar).post(usuario.editar);
	app.route('/remover/:id').get(autenticar, usuario.remover);
}