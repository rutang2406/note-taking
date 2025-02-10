const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const fs = require('fs');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    fs.readdir('./Files',(err,files) => {
        if(err){
            console.log(err);
            return;
        }
        res.render('index', {files: files});
        
    })    
})

app.post('/create' , (req, res) => {
    fs.writeFile(`./Files/${req.body.title}.txt`,req.body.content,(err) => {
        if(err){
            console.error(err);
        }
        res.redirect('/');
    })
    
})
app.get('/edit/:filename', (req, res) => {
    const filename = req.params.filename;
    fs.readFile(`./Files/${filename}`,'utf-8', (err, data) => {
        res.render('edit', {filename:filename, data: data});
        fs.unlink(`./Files/${filename}`,(err) => {
            if(err){
                console.error(err);
            }
        }   )
    })
} )

app.post('/update' , (req, res) => {
    fs.writeFile(`./Files/${req.body.title}.txt`,req.body.content,(err) => {
        if(err){
            console.error(err);
        }
        res.redirect('/');
    })
})
app.get('/Files/:filename', (req, res) => {
    const file = req.params.filename;
    fs.readFile('./Files/'+file, 'utf-8', (err,data) => {
        if(err){
            console.error(err);
        }
        fs.readdir('./Files',(err,files) => {
            if(err){
                console.log(err);
                return;
            }
            res.render('file', {file: file, data: data, files: files});
        })
        
    })
})
app.get('/remove/:filename', (req, res) => {
    const file = req.params.filename;
    fs.unlink('./Files/'+file, (err) => {
        if(err){
            console.error(err);
        }
        res.redirect('/');
    })
}) 
app.listen(port ,() => {
    console.log("Listening at "+port);
})