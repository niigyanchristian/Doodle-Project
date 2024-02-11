const express = require('express');
const Audio = require('../models/audio');
const PDF = require('../models/pdf');

const router = express.Router();

router.route('/').
get(async (req,res)=>{
    Audio.find({},(err,foundAudio)=>{
        // console.log(foundAudio);
        if(!err){
            if(foundAudio){
                PDF.find({},(error,foundPdf)=>{
                    // console.log('Home');
                    if(!error){
                        if(foundPdf){
                            res.render("index",{audioList:foundAudio.reverse(),pdfList:foundPdf.reverse()});
                        }
                    }
                })
            }
        }
    })
});

module.exports = router;