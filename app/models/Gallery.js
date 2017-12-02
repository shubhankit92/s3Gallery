// grab the mongoose module
var mongoose = require('mongoose');

// define our Gallery model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Gallery', {
	etag:  {type : String, default: ''},
	rating:  {type : String, default: '0'},
	Key:  {type : String, default: ''},
});
