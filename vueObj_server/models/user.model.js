var mongoose=require("mongoose");
var paginate=require("mongoose-paginate");
var Schema=mongoose.Schema;
var CateSchema=new Schema({
	  name: String,
	  password: String,
	  mail: String,
	  city: String,
	  date: { type: Date },
	  gender: String,
	  interest: [],
	  desc: String,
	  time: { type: Date }
});

CateSchema.plugin(paginate);
module.exports=mongoose.model("User",CateSchema);