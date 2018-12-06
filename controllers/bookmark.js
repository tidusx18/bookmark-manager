const bookmark = require('../models/bookmark.js');
const tag = require('../models/tag.js');

exports.bookmark_list = (req, res) => {

	bookmark.find({ title: /.*/i }, (err, results) => {
	  	if(err) { res.send(err) }
	  	res.send(results);
  	});
};

exports.bookmark_details = (req, res) => {

	bookmark.find({ [req.query.prop]: req.query.value }, null, { lean: true }, (err, results) => {
		console.log(req.query)
	  	if(err) { res.send(err) }
	  	res.send(results);
  	});
};

exports.bookmark_create = (req, res) => {

	console.log('The Request Body: ', req.body);

	let query = tag.find({_id: req.body.tag});
	let promise = query.exec();

	promise.then( (results, err) => {

		bookmark.create({
			tags: req.body.tags,
			title: req.body.title,
			url: req.body.url
		}, (err, results) => {
			err ? res.send(err.message) : res.send(results);
		});
	})
	.catch(err => console.log('\n\r\n\rTHERE WAS AN ERROR:', err) );

};

exports.bookmark_update = (req, res) => {

	console.log('Req Info', req.params, req.body)

	bookmark.findOneAndUpdate({_id: req.params.id}, {
		tags: req.body.tags,
		title: req.body.title,
		url: req.body.url
	}, (err, updates) => { res.send(updates) });
};

exports.bookmark_delete = (req, res) => {

	bookmark.findOneAndDelete({ _id: req.params.id }, (err, results) => {
		if(err) { res.send(err) }
		res.send(results);
	});
};