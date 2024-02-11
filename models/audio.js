const mongoose = require("mongoose");



const audioSchema =new mongoose.Schema({
    name: String,
    title: String,
    artiste: String,
    yearReleased: String,
    thumbnail: {
        type: String,
        default: process.env.defaultImageAudio
    }
});

const Audio = mongoose.models.Audio || new mongoose.model("Audio",audioSchema);

module.exports = Audio;