var express=require("express");
var route=express.Router();
var LogControll=require("../controlls/log.controll.js");
route.post("/add",LogControll.create);
route.post("/getById",LogControll.getById);
route.post("/removes",LogControll.removes);
route.post("/removeOne/:id",LogControll.delete);
route.put("/update/:id",LogControll.change);
module.exports=route;