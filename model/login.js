var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var addressSchema = new Schema({
	pincode: Number,
	address: String,
  landmark: String,
	city: String,
	state: String
},{ _id: false});

var userschema = new Schema({
  email: {type: String, unique: true},
  password: String,
  add_bool: {type: Boolean, default: false},
  address: [addressSchema]
});

var googleschema = new Schema({
  email: {type: String, unique: true},
  add_bool: {type: Boolean, default: false},
  address: [addressSchema]
});

var pincodeschema = new Schema({
  pincode: {type:Number , unique: true}
});

mongoose.model('user',userschema);
mongoose.model('googleuser',googleschema);
mongoose.model('pin',pincodeschema);
mongoose.model('address',addressSchema);
