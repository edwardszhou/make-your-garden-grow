const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const nedb = require('nedb');
const expressSession = require('express-session');
const nedbSessionStore = require('nedb-session-store');
const bcrypt = require('bcrypt');

const upload = multer({dest: 'public/uploads'});
const urlEncodedParser = bodyParser.urlencoded({extended: true});
const nedbInitializedStore = nedbSessionStore(expressSession);
const sessionStore = new nedbInitializedStore({
    filename: "sessions.txt"
})

const app = express();

app.use(express.static('public'));
app.use(urlEncodedParser);
app.use(cookieParser());
app.use(expressSession({
    store: sessionStore,
    cookie: {maxAge: 365 * 24 * 60 * 60 * 1000},
    secret: "supersecret123"
}));
app.set('view engine', 'ejs');

let database = new nedb({
    filename: 'database.txt',
    autoload: true
})

let usersdatabase = new nedb({
    filename: 'userdb.txt',
    autoload: true
})

function requiresAuth(req, res, next) {
    if(req.session.loggedInUser) {
        next();
    } else {
        res.redirect('/login?error=true');
    }
} 
function requiresNoAuth(req, res, next) {
    if(!req.session.loggedInUser) {
        next();
    } else {
        res.redirect('/home');
    }
} 

app.get('/', (req, res)=>{
    res.render('index.ejs');
})
app.get('/home', requiresAuth, (req, res)=> {
    let username = req.session.loggedInUser
    res.render('home.ejs', {user: username});
})
app.get('/login', requiresNoAuth, (req, res)=> {
    res.render('login.ejs');
})
app.get('/register', requiresNoAuth, (req, res)=> {
    res.render('register.ejs');
})
app.get('/customize/:panel', requiresAuth, (req, res)=> {
    // console.log(req.params.panel)
    let query = {
        owner: req.session.loggedInUser,
        panel: req.params.panel
    }
    let sortQuery = {
        name: 1
    }
    database.find(query).sort(sortQuery).exec((error, data)=> {
        res.render('customize.ejs', {images: data, panelNum: req.params.panel});
    })
})
app.get('/prelude', (req, res)=> {
    let volumeToggle = req.query.volume
    res.render('prelude.ejs', {volume: volumeToggle});
})
app.get('/story', (req, res)=> {

    let volumeToggle = req.query.volume
    if(req.session.loggedInUser) {
        let query = {
            owner: req.session.loggedInUser
        }
        database.find(query, (err, results) => {
            res.render('story.ejs', {images:results, volume:volumeToggle})
        })
    } else {
        res.render('story.ejs', {images:[], volume:volumeToggle});
    }
    
})
app.get('/story-2', (req, res)=> {

    let volumeToggle = req.query.volume
    if(req.session.loggedInUser) {
        let query = {
            owner: req.session.loggedInUser
        }
        database.find(query, (err, results) => {
            res.render('story-2.ejs', {images:results, volume:volumeToggle})
        })
    } else {
        res.render('story-2.ejs', {images:[], volume:volumeToggle});
    }
    
})
app.get('/logout', (req, res)=> {
    delete req.session.loggedInUser;
    res.redirect('/');
})
app.get('/middle-garden', (req, res)=> {
    let volumeToggle = req.query.volume
    res.render('middle-garden.ejs', {volume: volumeToggle})
})
app.get('/final-garden', (req, res)=> {
    let volumeToggle = req.query.volume
    res.render('final-garden.ejs', {volume: volumeToggle})
})
app.post('/signup', (req, res) => {

    let searchedQuery = {
        username: req.body.username
    }

    usersdatabase.findOne(searchedQuery, (err, user)=>{
        if(err || user != null || req.body.password != req.body.password2) {
            res.redirect('/register');
        } else {
            let hashedPassword = bcrypt.hashSync(req.body.password, 10);
            let data = {
                username: req.body.username,
                password: hashedPassword
            }

            usersdatabase.insert(data, (err, insertedData) => {
                req.session.loggedInUser = data.username
                res.redirect('/home');
            })
        }
    })

    
})

app.post('/authenticate', (req, res) => {
    let data = {
        username: req.body.username,
        password: req.body.password
    }

    let searchedQuery = {
        username: data.username
    }

    usersdatabase.findOne(searchedQuery, (err, user) => {
        if(err || user == null) {
            res.redirect('/login')
        } else {
            let encPass = user.password
            if(bcrypt.compareSync(data.password, encPass)) {
                let session = req.session
                session.loggedInUser = data.username
                res.redirect('/home');
            } else {
                res.redirect('/login');
            }
        }
    })
})

app.post('/upload', upload.single('image'), (req, res)=>{
    if(!req.file || !req.body.name) {
        res.redirect('/customize/' + req.body.panelnum)
    } else {
        let data = {
            owner: req.session.loggedInUser,
            panel: req.body.panelnum,
            name: req.body.name,
            file: '/uploads/' + req.file.filename
        }

    
        database.insert(data, (error, newData)=>{
            // console.log(newData);
            // data.id = newData._id
            res.redirect('/customize/' + req.body.panelnum);
            
        })
    }
})

app.post('/remove', (req, res)=> {
    let query = {
        name: req.body.imgTitle,
        owner: req.session.loggedInUser
    }
    database.remove(query, (err, numRemoved)=> {
        res.redirect('/customize/'+req.body.panelnum);
    }) 
})
app.get('/test', (req, res)=>{
    res.send('server is working');
})

app.listen(3333, ()=>{
    console.log('server started on port 3333');
})