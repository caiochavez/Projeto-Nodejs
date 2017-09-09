module.exports = function(app){

	const homeController = {

		sobre: function(req,res){
			res.render('sobre.jade');
		}
	}

	return homeController;
}