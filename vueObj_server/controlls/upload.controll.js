const mongoose = require('mongoose');
var Upload=require("../models/upload.model.js");
var multer = require('multer');
var path = require('path');
var fs=require("fs");
var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads')
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// var upload = multer({ storage: storage })

exports.uploadFile = function(req, res, next) {
    var name = req.params.name;
    if (name !== 'null') {
        var upload = multer({
                storage: storage,
                fileFilter: function(req, file, callback) {
                    var ext = path.extname(file.originalname)
                    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                        return callback(res.end('Only images are allowed'), null)
                    }
                    callback(null, true)
                }
            })
            .single('avatar');
        upload(req, res, function(err) {
            var uploads = new Upload(req.file)
            uploads.cateName = name;
            uploads.save().then(data => {
                res.json(data)
            })
        })
    } else {
        res.status(400).send({ "errorCode": 101, "message": "请选择分类" });
    }
}



exports.change=function(req,res,next){
    var obj=new Upload(req.body);
    var id=req.params.id;
     Upload.findByIdAndUpdate(id,{$set:req.body},{new:false}).then((upload)=>{
        res.send({upload});
     });   
}


exports.delete=function(req,res,next){
    var id=req.params.id;
    Upload.findByIdAndRemove(id,(err,data)=>{
        fs.unlink('./uploads/'+data.filename, (err) => {
          if (err) throw err;
           console.log('成功删除!!!');
           res.send({"msg":"删除成功"});
        });
    });
}

exports.getCateImg=function(req,res,next){
    var limit=req.body.limit ? req.body.limit : 5 ;
    var page =req.body.page ? req.body.page : 1 ;
    var query={};
    if(req.body.cateName&&req.body.cateName.trim().length>0){
        var cateName=req.body.cateName;
        query={
            "cateName": new RegExp(cateName,"i")
        }
    }

    if(req.body.originalname&&req.body.originalname.trim().length>0){
        var originalname=req.body.originalname;
        query={
            "originalname": new RegExp(originalname,"i")
        }
    }
    Upload.paginate(query,{limit:limit,page:page},(err,data)=>{
        res.json(data);
    });
}

exports.removes=function(req,res,next){
    var ids=req.body.ids;
    if(ids.length>0){
        for(var i=0;i<ids.length;i++){
            (function(index){
                 Upload.findByIdAndRemove(ids[index],(err,data)=>{
                    fs.unlink('./uploads/'+data.filename, (err) => {
                      // if (err) throw err;
                       console.log('成功删除!!!');
                    });
                });  
            })(i);    
         }
        res.send({"msg":"删除成功"});
    }else{
        res.send({"msg":"请确认要删除的数据"});
    }
}