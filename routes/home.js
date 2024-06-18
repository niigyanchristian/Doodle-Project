const express = require('express');
const Audio = require('../models/audio');
const PDF = require('../models/pdf');

const router = express.Router();

router.route('/').
get(async (req,res)=>{
    try {
        const audios =await Audio.find({});
        const pdfs =await PDF.find({});

        res.render("index",{audioList:audios.reverse(),pdfList:pdfs.reverse()});
    
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;