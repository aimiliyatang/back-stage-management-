var mongoose=require("mongoose");
var paginate=require("mongoose-paginate");
var Schema=mongoose.Schema;
var CateSchema=new Schema({
	    fieldname: String,
	    originalname: String,
	    filename: String,
	    encoding: String,
	    path: String,
	    size: 0,
	    mimetype: String,
	    date: { type: Date, default: Date.now },
	    destination: String,
	    cateName:String	
});

CateSchema.plugin(paginate);
module.exports=mongoose.model("upload",CateSchema);