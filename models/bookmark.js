const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookmarkSchema = new Schema({
	tags: [{
		_id: { type: Schema.Types.ObjectId, default: undefined, ref: 'Tag' },
		name: { type: String, default: undefined}
	}],
	title: { type: String, required: true, max: 100 },
	url: { type: String, required: true }
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);