var Cate=require("../models/cate.model.js");
exports.create=function(req,res,next){
	const cate=new Cate(req.body);
	cate.save().then((data)=>{
		res.json(data);
	});
}
exports.remove=function(req,res,next){
    var ids=[];
    Cate.findOne({_id:req.params.id},function(err,doc){
        if(doc){
            ids.push(doc._id);
            doc.getChildren().then(function(arr){
                for(var i=0;i<arr.length;i++){
                     ids.push(arr[i]._id);   
                }
                Cate.remove({_id:{$in:ids}}).then((deleted)=>{
                    res.send({msg:"删除成功"});
                });
            });
        }
    });
}
exports.update=function(req,res,next){
    const cate=new Cate(req.body);
    const id=req.params.id;
   Cate.findByIdAndUpdate(id,{$set:req.body},{new:false}).then((data)=>{
        res.send(data);
   });
}
function reverseObj(data,pid){
	 var result = [],
        temp;

    var data = JSON.parse(JSON.stringify(data)); // 需要将对象转换才能够进行children子节点的设置，这是因为mongoose的document的返回类型问题
    for (var i in data) {
        if (data[i].parentId == pid) { // null
            result.push(data[i]);

            temp = reverseObj(data, data[i]._id); // 递归，并且把递归返回的内容设置成temp的值
            if (temp.length > 0) {
                data[i].children = temp;
            }
        }
    }
    return result;
}
exports.searchAll=function(req,res,next){
	const type=req.params.id;
	Cate.find({type:type},(err,data)=>{
		var obj=reverseObj(data,null);
		res.json(obj);
	})
}