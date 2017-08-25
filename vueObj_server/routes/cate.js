var express=require("express");
var route=express.Router();
var CateControll=require("../controlls/Cate.controll.js");
route.post("/add",CateControll.create);
route.get("/all/:id",CateControll.searchAll);
route.delete("/remove/:id",CateControll.remove);
route.put("/update/:id",CateControll.update);
module.exports=route;