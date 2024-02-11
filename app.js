require('dotenv').config();
var fs = require('fs');
const multer = require('multer');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Audio = require('./models/audio');
const PDF = require('./models/pdf');
const Admin = require('./models/admin');


const homeRoute = require('./routes/home');
const selectedRoute = require('./routes/selected');
const selectedBookRoute = require('./routes/selected_book');

const app = express(); 

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("public"));
app.use("/uploads",express.static('uploads'));
mongoose.connect(process.env.URL,{useNewUrlParser:true});








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

//END POINTS
app.use('/',homeRoute);
app.use('/selected',selectedRoute);
app.use('/selected_book',selectedBookRoute);


app.get('/books',(req,res)=>{
    Audio.find({},(err,foundAudio)=>{
        // console.log(foundAudio);
        if(!err){
            if(foundAudio){
                PDF.find({},(error,foundPdf)=>{
                    console.log(foundPdf);
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

app.get('/add',(req,res)=>{
        res.render("add");
});
app.get('/admin',(req,res)=>{
    const id = req.query['id'];
    if(id == "1don"){
    Audio.find({},(err,foundAudio)=>{
        // console.log(foundAudio);
        if(!err){
            if(foundAudio){
                PDF.find({},(error,foundPdf)=>{
                    console.log(foundPdf);
                    if(!error){
                        if(foundPdf){
                            res.render("admin_index",{audioList:foundAudio.reverse(),pdfList:foundPdf.reverse()});
                        }
                    }
                })
            }
        }
    })
    }else{
        res.redirect("/");
    }
});
app.get('/admin_selected_book',(req,res)=>{
    console.log(req.query['id']); 
    const id = req.query['id'];
    console.log("id=>",id);
    Audio.find({},(err,foundAudio)=>{
        console.log(id);
        if(!err){
            if(foundAudio){
                PDF.find({},(error,foundPdf)=>{
                    if(!error){
                        if(foundPdf){
                            PDF.findById(id,(err,SfoundPdf)=>{
                                console.log("=>",SfoundPdf);
                                if(!err){
                                    if(SfoundPdf){
                                        console.log("Found!");
                                        res.render("admin_selected_book",{audioList:foundAudio.reverse(),pdfList:foundPdf.reverse(),singlePdf:SfoundPdf});
                                    }
                                }else{
                                    res.send(err.message);
                                }
                            })
                            
                        }
                    }
                })
            }
        }
    })
});
app.get('/admin_selected',(req,res)=>{
    console.log(req.query['id']); 
    const id = req.query['id'];
    Audio.find({},(err,foundAudio)=>{
        console.log(id);
        if(!err){
            if(foundAudio){
                PDF.find({},(error,foundPdf)=>{
                    
                    if(!error){
                        if(foundPdf){
                            Audio.findById(id,(err,SfoundAudio)=>{
                                console.log("=>",SfoundAudio);
                                if(!err){
                                    if(SfoundAudio){
                                        console.log("Found!");
                                        res.render("selected",{audioList:foundAudio.reverse(),pdfList:foundPdf.reverse(),singleAudio:SfoundAudio});
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
app.get('/login',(req,res)=>{
        res.render("login");
});
app.post('/login',(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const token = "1don";
    var id ="62fa6f079e5b296a4ea12f15";
    Admin.find({},(err,find)=>{
        if(find){
            id=find._id;
        }
    })
    Admin.findById(id,(err,found)=>{
        if(!err){
            if(found){
                if(found.username == username && found.password == password){
                    res.redirect("/admin?id="+token);
                }else{
                    res.send("wrong crendentials");
                }
                
            }
        }
    })
        
});
app.post('/audio',upload.single('audio'),(req,res)=>{
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
                res.redirect("/admin?id=1don");
            }
        });
    }
        
});
app.post('/addpdf',upload.single('pdf'),(req,res)=>{
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
                res.redirect("/admin?id=1don");
            }
        });
    }
    
});

app.post('/changeaudio',(req,res)=>{
   const title = req.body.title;
   const id = req.body.id;
   const artiste = req.body.artiste;
   console.log("id=>",id);
   console.log("title=>",title);
   console.log("artiste=>",artiste);
   Audio.findByIdAndUpdate(id, {artiste:artiste,title:title}, (err)=>{
    if(!err){
        res.redirect("/admin_selected?id="+id);
    }
   })
// res.redirect("")
});
app.post('/changepdf',(req,res)=>{
   const title = req.body.title;
   const id = req.body.id;
   const author = req.body.author;
   const snippet = req.body.snippet;
   const description = req.body.description;


   PDF.findByIdAndUpdate(id, {title:title,author:author,snippet:snippet,description:description}, (err)=>{
    if(!err){
        console.log("done!");
        res.redirect("/admin_selected_book?id="+id);
    }
   })

});
app.post('/changeaudiocover',upload.single("shopImage"),(req,res)=>{
   const id = req.body.id;
   const thumbnail= req.file.filename;
  
   
   
   Audio.findById(id,(err,found)=>{
    const linkUrl = './public/'+found.thumbnail;
    console.log("linkUrl=>",linkUrl);
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
                    res.redirect("/admin_selected?id="+id);
                }
               })
        }
    }
   });

   
});
app.post('/changepdfcover',upload.single("pdfimage"),(req,res)=>{
   const id = req.body.id;
   const thumbnail= req.file.filename;
  console.log("thumbnail=>",thumbnail);
   PDF.findById(id,(err,found)=>{
    const linkUrl = './public/'+found.thumbnail;
    console.log("linkUrl=>",linkUrl);
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
                    res.redirect("/admin_selected_book?id="+id);
                }
               })
        }
    }
   });

   
});
app.post('/deleteaudio',(req,res)=>{
    const id = req.body.id;
    const name = req.body.name;
    const linkUrl = './public/'+name;
    console.log(linkUrl);
// console.log(id);

try{
    fs.unlinkSync(linkUrl);
    console.log("Deleted successfuly");
   
}catch(error){
    console.log("Error in deleting file");
    console.log(error.message);
} Audio.findByIdAndDelete(id,(err)=>{
    if(!err){
        res.redirect("/admin");
    }
})
    
});
app.post('/deletepdf',(req,res)=>{
    const id = req.body.id;
    const name = req.body.name;
    const linkUrl = './public/'+name;
    console.log(linkUrl);

try{
    fs.unlinkSync(linkUrl);
    console.log("Deleted successfuly");
}catch(error){
    console.log("Error in deleting file");
    console.log(error.message);
}PDF.findByIdAndDelete(id,(err)=>{
    if(!err){
        res.redirect("/admin");
    }
})
    
});

app.listen(process.env.PORT ||3000,()=>{
    console.log("Music Website Is Running On Port 3000");
});

