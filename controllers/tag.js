const tag = require('../models/tag.js');

exports.tag_list = (req, res) => {

	tag.find({ name: /.*/i }, (err, results) => {
	  	if(err) { res.send(err) }
	  	res.send(results);
  	});
};

exports.tag_details = (req, res) => {

	tag.find({ _id: req.params.id }, (err, results) => {
	  	if(err) { res.send(err) }
	  	res.send(results);
  	});
};

exports.tag_create = (req, res) => {

	tag.create({
		name: req.body.name,
	}, (err, results) => {
		err ? res.send(err.message) : res.send(results);
	});
};

exports.tag_update = (req, res) => {

	res.send('TODO: Update tag code.');
};

exports.tag_delete = (req, res) => {

	tag.findOneAndDelete({ _id: req.params.id }, (err, results) => {
		if(err) { res.send(err) }
		res.send(results);
	});
};