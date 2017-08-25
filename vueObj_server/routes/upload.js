var express=require("express");
var route=express.Router();
var UploadControll=require("../controlls/upload.controll.js");
route.post("/uploadFile/:name",UploadControll.uploadFile);
route.post("/getCateImg",UploadControll.getCateImg);
route.delete("/delete/:id",UploadControll.delete);
route.put("/change/:id",UploadControll.change);
route.post("/removes",UploadControll.removes);
module.exports=route;