const express = require('express');
const Audio = require('../models/audio');
const PDF = require('../models/pdf');

const router = express.Router();

router.route('/').
get(async (req,res)=>{
    console.log(req.query['id']); 
    const id = req.query['id'];
    Audio.find({},(err,AudioList)=>{
        console.log(id);
        if(!err){
            if(AudioList){
                PDF.find({},(error,PDFList)=>{
                    
                    if(!error){
                        if(PDFList){
                            PDF.findById(id,(err,SfoundAudio)=>{
                                console.log("=>",SfoundAudio);
                                if(!err){
                                    if(SfoundAudio){
                                        console.log("Found!");
                                        res.render("selected_book",{audioList:AudioList.reverse(),pdfList:PDFList.reverse(),singlePdf:SfoundAudio});
                                    }
                                }
                            })
                            
                        }
                    }
                })
            }
        }
    })
});

module.exports = router;