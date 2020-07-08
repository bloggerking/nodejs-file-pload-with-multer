var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var Path = require('path');
var FsExtra = require('fs-extra');
var Multer  = require('multer');

//define storage for file
let storage = Multer.diskStorage({
  destination: function (req, file, callback) {
      //making directory for file upload
      FsExtra.mkdirsSync('./public/uploads');
      //return destination path
      callback(null, './public/uploads');
  },
  //set the file name in this function
  filename: function (req, file, callback) {
    //set new filename
      let imageName = Date.now();
      callback(null, imageName + Path.extname(file.originalname));
  }
});
let upload = Multer({
  //loading storage variable 
  storage: storage,
  //specifying file size
  limits: {
      fileSize: 1000000 //set value in bytes
  },
  fileFilter: function (req, file, cb) {
      //types of files allowed are written in array
      let filetype = ['.jpeg', '.png', '.jpg'];
      if (filetype.indexOf(Path.extname(file.originalname).toLowerCase()) < '0') {
          //if file type is not from array it will return following error
          return cb(new Error('File must be jpg, jpeg and png.'))
      }
      cb(null, true)
  }
  //arrays of field name
}).fields([{
  name: 'upload_file'
}]);

router.post('/', function(req, res, next) {
  upload(req, res, async function (error) {
    if(error){
      req.flash('error', error.message);
    } else {
      console.log(req.files); //uploaded files details
      req.flash('success', 'Success flash message');
    }
    res.redirect('/')
  })
});


module.exports = router;
