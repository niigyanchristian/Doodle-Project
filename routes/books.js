const express = require('express');
const PDF = require('../models/pdf');
const Audio = require('../models/audio');


const router = express.Router();

router.route('/')
.get((req,res)=>{
    Audio.find({},(err,foundAudio)=>{
        // console.log(foundAudio);
        if(!err){
            if(foundAudio){
                PDF.find({},(error,foundPdf)=>{
                    // console.log(foundPdf);
                    if(!error){
                        if(foundPdf){
                            res.render("books",{audioList:foundAudio.reverse(),pdfList:foundPdf.reverse()});
                        }
                    }
                })
            }
        }
    })
});

router.route('/:id').
get(async (req,res)=>{
    // console.log(req.query['id']); 
    const id = req.params.id;
    try {
        const audios = await Audio.find({}); 
        const pdfs = await PDF.find({}); 
        const SfoundAudio = await PDF.findById(id); 

        res.render("selected_book",{audioList:audios.reverse(),pdfList:pdfs.reverse(),singlePdf:SfoundAudio});
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;