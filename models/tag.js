let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = mongoose.Types.ObjectId;
let Bookmark = mongoose.model('Bookmark');

let tagSchema = new Schema({
	name: { type: String, required: true, max: 100 }
});

tagSchema.post('findOneAndDelete', (doc) => {
	console.log('findOneAndDelete hook', doc)
	Bookmark.updateMany(
		{},
		{ $pull: { tags: { _id: ObjectId(doc._id) } } },
		(err, res) => { err ? console.log('Error - findOneAndDelete post hook: ', err) : null; }
	)
});

module.exports = mongoose.model('Tag', tagSchema); 