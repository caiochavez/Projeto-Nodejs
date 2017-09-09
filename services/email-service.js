const config = require('../config.js');
const sendgrid = require('sendgrid')(config.sendgridKey);

const send = {
	send: function(to, subject, body) {
		sendgrid.send({
			to: to,
			from: 'caaiochavez@gmail.com',
			subject: subject,
			html: body
		});
	}
}

module.exports = send;
