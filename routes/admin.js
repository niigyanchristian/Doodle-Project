const express = require("express");
const Audio =require('../models/audio');
const PDF = require("../models/pdf");
var fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./public/")
    },
    filename: function(req, file, cb){
        cb(null, new Date().toDateString()+file.originalname);
    }
});

const fileFilter = (req, file, cb)=>{
    console.log("file->",file);
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype ==="audio/mpeg" ||file.mimetype ==="application/pdf"){
        //recieve file
        cb(null,true);
    }else{
        //reject file
        cb(null, false);
    }
};

const upload = multer({
    storage: storage, 
    fileFilter: fileFilter
});

const router = express.Router();


router.route('/').
get(async(req,res)=>{
    try {
        const audios =await Audio.find({});
        const pdfs =await PDF.find({});
        res.render("admin_index",{audioList:audios.reverse(),pdfList:pdfs.reverse()});
    } catch (error) {
        console.log(error.message);
    }
});

router.route('/selected_book/:id').
get(async(req,res)=>{
    
    const id = req.params.id;
    try {
        const audios = await Audio.find({});
        const pds = await PDF.find({});
        const SfoundPdf = await PDF.findById(id);
        res.render("admin_selected_book",{audioList:audios.reverse(),pdfList:pds.reverse(),singlePdf:SfoundPdf});
    } catch (error) {
        console.log(error.message)
    }
});

router.route('/selected_audio/:id').
get(async(req,res)=>{
    const id = req.params.id;
    try {
        console.log(id); 
        const audios = await Audio.find({});
        const pds = await PDF.find({});
        const SfoundAudio = await Audio.findById(id)
        res.render("admin_selected",{audioList:audios.reverse(),pdfList:pds.reverse(),singleAudio:SfoundAudio});
    } catch (error) {
        console.log(error.message)
    }
});

router.route('/add').
get((req,res)=>{
    res.render("add");
});

router.route('/delete/pdf').
post(async(req,res)=>{
    const id = req.body.id;
    const name = req.body.name;
    const linkUrl = './public/'+name;
    console.log(linkUrl);

    try{
        fs.unlinkSync(linkUrl);
        await PDF.findByIdAndDelete(id,(err)=>{
            if(!err){
                res.redirect("/admin");
            }
        })
        console.log("Deleted successfuly");
    }catch(error){
        console.log("Error in deleting file");
        console.log(error.message);
    }
    
});

router.route('/delete/audio').
post(async(req,res)=>{
    const id = req.body.id;
    const name = req.body.name;
    const linkUrl = './public/'+name;

    try{
        fs.unlinkSync(linkUrl);
        await Audio.findByIdAndDelete(id,(err)=>{
            if(!err){
                res.redirect("/admin");
            }
        })
        console.log("Deleted successfuly");
    
    }catch(error){
        console.log("Error in deleting file");
        console.log(error.message);
    }
});

router.route('/change/audio').
post(async(req,res)=>{
    const {title,id,artiste}=req.body
    try {
        await Audio.findByIdAndUpdate(id, {artiste:artiste,title:title});
        res.redirect("/admin/selected_audio/"+id);
    } catch (error) {
        console.log(error.message);
    }
});

router.route('/change/pdf').
post((req,res)=>{
    const {title,id,author,snippet,description}=req.body;

    PDF.findByIdAndUpdate(id, {title:title,author:author,snippet:snippet,description:description}, (err)=>{
        if(!err){
            console.log("done!");
            res.redirect("/selected_book/"+id);
        }
    });
});

router.route('/change/audiocover').
post(upload.single("shopImage"),(req,res)=>{
    const id = req.body.id;
    const thumbnail= req.file.filename;
   
    
    
    Audio.findById(id,(err,found)=>{
     const linkUrl = './public/'+found.thumbnail;
     if(!err){
         if(found){
             try{
                 fs.unlinkSync(linkUrl);
                 console.log("Deleted successfuly");
             }catch(error){
                 console.log("Error in deleting file");
                 console.log(error.message);
             }
             Audio.findByIdAndUpdate(id, {thumbnail:thumbnail}, (err)=>{
                 if(!err){
                     res.redirect("/admin/selected_book/"+id);
                 }
                })
         }
     }
    });
 
    
});

router.route('/change/pdfcover').
post(upload.single("pdfimage"),(req,res)=>{
    const id = req.body.id;
    const thumbnail= req.file.filename;
   
    PDF.findById(id,(err,found)=>{
     const linkUrl = './public/'+found.thumbnail;
     if(!err){
         if(found){
             try{
                 fs.unlinkSync(linkUrl);
                 console.log("Deleted successfuly");
                 
             }catch(error){
                 console.log("Error in deleting file");
                 console.log(error.message);
             }
             PDF.findByIdAndUpdate(id, {thumbnail:thumbnail}, (err)=>{
                 if(!err){
                     res.redirect("/admin/selected_book/"+id);
                 }
                })
         }
     }
    });
 
    
});

router.route('/audio').
post(upload.single('audio'),(req,res)=>{
    const title = req.body.songTitle;
    const artiste = req.body.artiste;
    const yearReleased = req.body.year_released;
    const Name = req.file.filename;
    
    const fileType = req.file.mimetype;

    if(fileType ==="audio/mpeg"){
        const item = new Audio({
           name: Name,
            title: title,
            artiste: artiste,
            yearReleased: yearReleased,
        });
        item.save((err)=>{
            if(!err){
                console.log("sent");
                res.redirect("/admin");
            }
        });
    }
        
});

router.route('/addpdf').
post(upload.single('pdf'),(req,res)=>{
    const title = req.body.pdfTitle;
    const snippet = req.body.book_snippet;
    const author = req.body.author;
    const description = req.body.book_description;
    const yearWritten = req.body.yearWritten;
    const pages = req.body.pages;
    const Name = req.file.filename;
    const fileType = req.file.mimetype;
    console.log(req.file);

    console.log("title->",title);
    
    if(fileType ==="application/pdf"){
        const item = new PDF({
            name: Name,
            title: title,
            snippet: snippet,
            author: author,
            description: description,
            yearWritten: yearWritten,
            pages: pages,
        });
        item.save((err)=>{
            if(!err){
                console.log("sent");
                res.redirect("/admin");
            }
        });
    }
    
});

module.exports = router;