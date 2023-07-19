
const express = require('express')
const app = express()
const port = 3000
const sqlite3 = require('sqlite3').verbose();
// const posts = require('./data/posts.json')
const db = new sqlite3.Database('./data/falaqueteescuto.db');

app.use(express.static('public'))
app.set('view engine', 'ejs')

//localhost:3000 -> meusite.com (raiz)
app.get('/', function (req, res) {
    res.render('index')
});

//localhost:3000/home -> meusite.com/home
app.get('/home', async function (req, res) {
    const posts = await db_all('SELECT * FROM post')

    const data = {
        user: {
            id: 10,
            name: 'Janilson',
            imagePicture: '/midia/perfil-1.png',
        },
        posts: posts
    };

    res.render('home', data)
});

app.get('/migrate', function(req,res ) {
    db.serialize(function() {
        db.run('CREATE TABLE post (author TEXT, authorPic TEXT, text TEXT, date TEXT)');
    });
})

app.get('/salvar', function(req,res) {
    const { text, userName, userPic } = req.query;

    const currentDate = new Date()
        .toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});

    db.serialize(function() {
        var stmt = db.prepare('INSERT INTO post (author, authorPic, text, date) VALUES (?,?,?,?)');
      
        stmt.run(
            userName,
            userPic,
            text,
            currentDate
        );
      
        stmt.finalize();
    });

    res.redirect('/home');
});

app.get('/pegar', async function (req, res) {
    const lorems = await db_all('SELECT * FROM post')

    res.send(lorems);
}) 

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


async function db_all(query){
    return new Promise(function(resolve,reject){
        db.all(query, function(err,rows){
           if(err){return reject(err);}
           resolve(rows);
         });
    });
}