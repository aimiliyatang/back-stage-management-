var User=require("../models/user.model.js");
exports.create=function(req,res,next){
	const user=new User(req.body);
	user.save().then((data)=>{
		res.json(data);
	});
}

exports.searchAll=function(req,res,next){
	User.find({},(err,data)=>{
		res.json(data);
	})
}
exports.login=function(req,res,next){
    User.find({name:req.body.name,password:req.body.password},(err,data)=>{
        console.log(data);
        res.json(data);
    })
}
exports.change=function(req,res,next){
    var obj=new User(req.body);
    var id=req.params.id;
     User.findByIdAndUpdate(id,{$set:req.body},{new:false}).then((user)=>{
        res.send({user});
     });   
}


exports.delete=function(req,res,next){
    var id=req.params.id;
    User.findByIdAndRemove(id,(err,data)=>{
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
    User.paginate(query,{limit:limit,page:page},(err,data)=>{
        res.json(data);
    });
}

exports.removes=function(req,res,next){
    var ids=req.body.ids;
    if(ids.length>0){
        User.remove({_id:{$in:ids}}).then(()=>{
             res.json({ "msg": "delete ok" });
        });
    }else{
        res.send({"msg":"请确认要删除的数据"});
    }
}