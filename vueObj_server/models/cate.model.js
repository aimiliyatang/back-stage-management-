var mongoose=require("mongoose");
var materialiedPlugin=require("mongoose-materialized");
var Schema=mongoose.Schema;
var CateSchema=new Schema({
	  title:{type:String},
	  type:Number
});

CateSchema.plugin(materialiedPlugin);
module.exports=mongoose.model("Cate",CateSchema);