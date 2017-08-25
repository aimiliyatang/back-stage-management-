var Log=require("../models/log.model.js");
exports.create=function(req,res,next){
	const log=new Log(req.body);
	log.save().then((data)=>{
		res.json(data);
	});
}

exports.searchAll=function(req,res,next){
	Log.find({},(err,data)=>{
		res.json(data);
	})
}
exports.getById=function(req,res,next){
    var page = (req.body.page) ? req.body.page : 1;
    var limit = (req.body.limit) ? req.body.limit : 5;
    var queryCondition = {};
    if (req.body.title && req.body.title.trim()
        .length > 0) {
       var title = req.body.title;
    }

    if (req.body.cateName && req.body.cateName.trim()
        .length > 0) {
        var cateName = req.body.cateName;
    }

    if(req.body.all&&req.body.all.trim().length>0){
         queryCondition = {
            "title": new RegExp(title, "i")
        }
    }else{
         queryCondition = {
            "title": new RegExp(title, "i"),
            "cateName": cateName
        }
    }

    Log.paginate(queryCondition, { page: page, limit: limit }, function(err, result) {
        if (err) {
            console.log(err)
        } else {
            res.json(result);
        }
    });
}
exports.change=function(req,res,next){
    var obj=new Log(req.body);
    var id=req.params.id;
     Log.findByIdAndUpdate(id,{$set:req.body},{new:false}).then((log)=>{
        res.send({log});
     });   
}


exports.delete=function(req,res,next){
    var id=req.params.id;
    Log.findByIdAndRemove(id,(err,data)=>{
        res.send({"msg":"删除成功"});
    });
}

exports.list=function(req,res,next){
    var limit=req.body.limit ? req.body.limit : 5 ;
    var page =req.body.page ? req.body.page : 1 ;
    var query={};
    if(req.body.name&&req.body.name.trim().length>0){
        var name=req.body.name;
        query={
            "name": new RegExp(name,"i")
        }
    }
    Log.paginate(query,{limit:limit,page:page},(err,data)=>{
        res.json(data);
    });
}

exports.removes=function(req,res,next){
    var ids=req.body.ids;
    if(ids.length>0){
        Log.remove({_id:{$in:ids}}).then(()=>{
             res.json({ "msg": "delete ok" });
        });
    }else{
        res.send({"msg":"请确认要删除的数据"});
    }
}