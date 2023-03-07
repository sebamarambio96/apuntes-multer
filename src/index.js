const express = require('express')
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const multer = require('multer')

const storage = multer.diskStorage({
    destination: path.join(__dirname, './public/uploads'),
    filename: (req, file, cb ) => {
        cb(null, uuidv4() + path.extname(file.originalname.toLocaleLowerCase()))
    }
})
//initializations
const app = express()
app.set('port', 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', "ejs")
//Start the server

app.use(multer({
    storage,
    dest: path.join(__dirname, './public/uploads'),
    limits: {fileSize: 10000000},
    fileFilter: (req, file,cb)=>{
        const filetypes = /jpeg|jpg|png|gif/
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname))
        if (mimetype && extname) {
            return cb(null, true)
        }
        cb("error: el archivo debe ser una imagen")
    }
}).single('image'))

//Routes
app.use(require('./routes/index.routes'))

//Static files

app.use(express.static(path.join(__dirname,'public')))

app.listen(app.get('port'), ()=> {
    console.log(`Server on port ${app.get('port')}`)
})