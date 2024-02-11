const express = require('express');
const Audio = require('../models/audio');
const PDF = require('../models/pdf');

const router = express.Router();

router.route('/').
get(async (req,res)=>{
    console.log(req.query['id']); 
    const id = req.query['id'];
    
    Audio.find({},(err,foundAudio)=>{
        console.log(id);
        if(!err){
            if(foundAudio){
                PDF.find({},(error,foundPdf)=>{
                   
                    if(!error){
                        if(foundPdf){
                            PDF.findById(id,(err,SfoundPdf)=>{
                                // console.log("=>",SfoundPdf);
                                if(!err){
                                    if(SfoundPdf){
                                        console.log('====================================');
                                        console.log("-------->",SfoundPdf);
                                        console.log('====================================');
                                        res.render("selected_book",{audioList:foundAudio.reverse(),pdfList:foundPdf.reverse(),singlePdf:SfoundPdf});
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