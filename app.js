const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require('path');
const fs = require("fs");
const multer = require("multer");
const mongoose = require("mongoose");
const imageModel = require('./model/model');

app.use(bodyParser.urlencoded(
      { extended:true }
))

app.set("view engine","ejs");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })

var upload = multer({ storage: storage })

app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/index.html");
})

app.post("/uploadphoto", upload.single('myImage'), (req,res)=>{

    var img = fs.readFileSync(req.file.path);
    var encode_img = img.toString('base64');
    var final_img = {
        contentType:req.file.mimetype,
        image:new Buffer(encode_img,'base64')
    };

    imageModel.create(final_img, function(err,result){
        if(err){
            console.log(err);
        }else{
            console.log(result.img.Buffer);
            console.log("Saved To database");
            res.contentType(final_img.contentType);
            res.send(final_img.image);
        }
    })
})

app.listen(3000,function () {
      console.log("Server Started at PORT 3000");
})
