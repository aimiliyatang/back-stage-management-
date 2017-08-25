var mongoose=require("mongoose");
var paginate=require("mongoose-paginate");
var Schema=mongoose.Schema;
var CateSchema=new Schema({
	  cateName: String,
	  title: String,
	  date: { type: Date },
	  desc: String,
	  author: String,
	  content:String
});

CateSchema.plugin(paginate);
module.exports=mongoose.model("log",CateSchema);