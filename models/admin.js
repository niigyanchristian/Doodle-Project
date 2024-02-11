const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    username : String,
    password : String
});

const Admin = mongoose.models.Admin || new mongoose.model("Admin",adminSchema);

module.exports = Admin;