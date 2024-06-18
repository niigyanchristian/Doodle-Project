const express = require('express');
const Admin = require('../models/admin');

const router = express.Router();


router.route('/').
get((req,res)=>{
    res.render("login");
})
.post(async(req,res)=>{
    const {username,password} = req.body;
  
    const user = await Admin.findOne({username:username,password:password});
    if(user){
        req.session.user = user;
        res.redirect("/admin");
    }else{
        res.send("wrong crendentials");
    }
        
});


module.exports = router;