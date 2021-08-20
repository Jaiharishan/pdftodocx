const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const libre = require('libreoffice-convert');
const fs = require('fs');

let outputFilePath;

router.use(express.static('public'));


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });

const docxtopdf = (req, file, callback) => {
    let ext = path.extname(file.originalname);
    if (ext !== '.docx' && ext !== '.doc') {
        return callback('this extension is not valid');
    }

    callback(null, true)
}

const docxtopdfUpload = multer({storage: storage, fileFilter: docxtopdf});

router.get('/', (req, res) => {
    res.render('index');
})


// for word to pdf
router.post('/topdf', docxtopdfUpload.single('word'), (req, res) => {
    console.log(req.file.path);
    // const wordFile = req.body.word;
    console.log('post working');

    if(req.file) {

        const word = fs.readFileSync(req.file.path);

        outputFilePath = Date.now() + "output.pdf" 

        libre.convert(word, ".pdf", undefined, (error, done) => {

            console.log('libre working')
            if(error){
                fs.unlinkSync(req.file.path)
                fs.unlinkSync(outputFilePath)
                console.log('libre error')

                res.send("some error taken place in conversion process")
            }

            fs.writeFileSync(outputFilePath, done);

            res.download(outputFilePath, (err) => {
                console.log('download started')
                if(err){
                    fs.unlinkSync(req.file.path);
                    fs.unlinkSync(outputFilePath);

                    res.send("cannot download the file");
                }

                fs.unlinkSync(req.file.path);
                fs.unlinkSync(outputFilePath);
                console.log('download finished');
            })

        })
    }else {
        console.log('else happened');
    }
})


// for pdf to word

module.exports = router;