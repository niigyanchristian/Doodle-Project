const express = require('express');
const Audio = require('../models/audio');
const PDF = require('../models/pdf');

const router = express.Router();

router.route('/:id').
get(async (req,res)=>{
    const id = req.params.id;

    const audios =await Audio.find({});
    const pdfs =await PDF.find({});
    const selectedAudio =await Audio.findById(id);
    res.render("selected",{audioList:audios.reverse(),pdfList:pdfs.reverse(),singleAudio:selectedAudio,singlePdf:[]});
});

module.exports = router;