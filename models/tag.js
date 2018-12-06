let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let tagSchema = new Schema({
	name: { type: String, required: true, max: 100 }
});

module.exports = mongoose.model('Tag', tagSchema);