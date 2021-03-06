var router = require('express').Router();
var path = require('path');
var multer  = require('multer');
var uploadSig = multer({ dest: './sigfile/' });
var uploadHeader = multer({ dest: './headers/' });
var bodyParser = require('body-parser');
var fs = require('fs');

var Img = require('../models/Image');
var Sig = require('../models/Sig');
var Letterhead = require('../models/Letterhead');

var Template = require('../models/template');

//var Sig = require('../models/signature');
//var Letterhead = require('../models/letterhead);


router.use(bodyParser.json());


var storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, 'public/photos/');
  // },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg'); //Appending .jpg
    console.log(file.mimetype);
  }
});

var upload = multer({ storage: storage });

router.post('/deletePhoto', function(req, res) {
  console.log('remove req', req.body.id);
  Img.findByIdAndRemove(req.body.id, function(err){
    console.log('boo you suck....at removing pics', err);
  }, function(res){
    console.log('successful remove of stuff', res);

  });
  console.log('trying to delete');
  // console.log('req.body' , req.body._id );
  // var filePath = "public/photos/" + req.body.photo;
  // fs.unlinkSync(filePath);
  // res.sendStatus(200);
});

router.post('/', upload.single('file'), function (req, res) {
  console.log('this is upload req' , req.file.path);
  var image = new Img;
  imgPath = req.file.path;
  image.img.data = fs.readFileSync(imgPath);
  image.img.contentType = 'image/png';
  image.save(function(err, image){
    if(err){
      console.log('error saving image', err);
    }
    else{
      console.log('success saving image to mongdb');
    }
  });
  console.log('file uploaded:', req.file.path);
  res.send(req.file.path);
  // req.file is the `photo` file
  // req.body will hold the text fields, if there were any
});

router.post('/getDbImages/:id', function(req, res, next){
  var base64 = [];
  var id = req.params.id;
  console.log('bleh id', req.params);
  Img.findById(id, function(err, doc){
    if(err){
      return next(err);
    }
    else{
      var photo = {};
      for(var i = 0; i < doc.length; i++){
        photo.photo = 'data:image/jpeg;base64,' + doc.img.data.toString('base64');
        photo.id = doc._id;
      }
      console.log('doc id', photo.id);
      res.contentType(doc.img.contentType);
      res.send(photo);
    }
  });
});

router.post('/getDbSig/:id', function(req, res, next){
  var base64 = [];
  var id = req.params.id;
  console.log('bleh id', req.params);
  signature.findById(id, function(err, doc){
    if(err){
      return next(err);
    }
    else{
      var signature = {};
      for(var i = 0; i < doc.length; i++){
        signature.sig = 'data:image/jpeg;base64,' + doc.img.data.toString('base64');
        signature.id = doc._id;
      }
      console.log('doc id', signature.id);
      res.contentType(doc.img.contentType);
      res.send(signature);
    }
  });
});

router.post('/getDbHeader/:id', function(req, res, next){
  var base64 = [];
  var id = req.params.id;
  console.log('bleh id', req.params);
  Letterhead.findById(id, function(err, doc){
    if(err){
      return next(err);
    }
    else{
      var header = {};
      for(var i = 0; i < doc.length; i++){
        header.header = 'data:image/jpeg;base64,' + doc.img.data.toString('base64');
        header.id = doc._id;
      }
      console.log('doc id', header.id);
      res.contentType(doc.img.contentType);
      res.send(header);
    }
  });
});

router.post('/sigfile', uploadSig.single('file'), function (req, res) {
  var signatures = [];
  var signature = {};
  // Sig.find({}, function(err, doc){
  //   if(err){
  //     return next(err);
  //   }
  //   else{
  //     for(var i = 0; i < doc.length; i++){
  //       signature = {};
  //       signature.id = doc[i]._id;
  //       console.log('sig id of sig to be removed', signature.id);
  //     }
  //   }
  // });
  // Sig.findByIdAndRemove(signature.id, function(response){
  //   console.log('successful remove of old signature', response);
  // }, function(err){
  //   console.log('failed at remove old signature', err);
  // });
  Sig.remove({}, function(err, response){
    if(err){
      return next(err);
    }
    else{
      console.log('success');
    }
  });

  var signature = new Sig;
  imgPath = req.file.path;
  signature.img.data = fs.readFileSync(imgPath);
  signature.img.contentType = 'image/png';
  signature.save(function(err, signature){
    if(err){
      console.log('error saving signature', err);
    }
    else{
      console.log('success saving signature to mongdb', signature._id);
      signature.strung = 'photos/createsignaturearray/' + signature._id;
      Template.update({}, {$set: {sig: signature.strung}}, {multi: true}, function(err){
        if(err){
          console.log('erorororoor', err);
        }
        else{
          res.sendStatus(200);
        }
      });
      // res.sendStatus(200);
    }
  });
  console.log('file uploaded:', req.file.path);

  // res.send(req.file.path);
  // req.file is the `photo` file
  // req.body will hold the text fields, if there were any
});



router.post('/headers', uploadHeader.single('file'), function (req, res) {
  Letterhead.remove({}, function(err, response){
    if(err){
      return next(err);
    }
    else{
      console.log('success');
    }
  });

  var header = new Letterhead;
  imgPath = req.file.path;
  header.img.data = fs.readFileSync(imgPath);
  header.img.contentType = 'image/png';
  header.save(function(err, header){
    if(err){
      console.log('error saving header', err);
    }
    else{
      console.log('success saving header to mongdb');
      header.strung = 'photos/createsignaturearray/' + header._id;
      Template.update({}, {$set: {header: header.strung}}, {multi: true}, function(err){
        if(err){
          console.log('erorororoor', err);
        }
        else{
          res.sendStatus(200);
        }
      });
      // res.sendStatus(200);
    }
  });
  console.log('file uploaded: ', req.file.path);


  // res.send(req.file.path);
  // req.file is the `photo` file
  // req.body will hold the text fields, if there were any
});
router.get('/createphotoarray', function(req, res) {
  // fs.readdir('./public/photos', function(err, files){
  //   if(!err){
  //     console.log(files);
  //     res.send(files);
  //   } else {
  //     console.log(err);
  //   }
  // });
  var photos = [];
  var photo = {};
  Img.find({}, function(err, doc){
    if(err){
      return next(err);
    }
    else{
      var photos = [];
      // console.log('doc', doc);
      // photos = doc;
      // if(doc.length == undefined){
      //   console.log('kfjldsa;jklsadf');
      //   return;
      //   res.send('');
      // }
      // if(doc.length == ''){
      //   console.log('stuff');
      //   return;
      //   res.send('');
      // }
      // if(doc.length == null){
      //   console.log('null');
      // }
      for(var i = 0; i < doc.length; i++){
        photo = {};
        // var base64 = doc[i].img.data.toString('base64');
        photo.photo = 'data:image/jpeg;base64,' + doc[i].img.data.toString('base64');
        photo.id = doc[i]._id;
        // photos[i].photo = 'data:image/jpeg;base64,' + doc[i].img.data.toString('base64');
        // photos[i].id = doc[i].id;
        photos.push(photo);
        // console.log('photos.id', photos[i].id);
      }
      for(var i = 0; i < photos.length; i++){
        console.log('photos.id', photos[i].id);
      }
      // console.log('photos', photos);
      res.contentType(doc[0].img.contentType);
      res.send(photos);
    }
  });
});

router.get('/createsignaturearray', function(req, res) {


  // fs.readdir('./public/sigfile', function(err, files){
  //   if(!err){
  //     console.log(files);
  //     res.send(files);
  //   } else {
  //     console.log(err);
  //   }
  // });
  var signatures = [];
  var signature = {};
  Sig.find({}, function(err, doc){
    if(err){
      return next(err);
    }
    else{
      var signatures = [];
      console.log('signatures', doc);
      // photos = doc;
      for(var i = 0; i < doc.length; i++){
        signature = {};
        // var base64 = doc[i].img.data.toString('base64');
        signature.signature = 'data:image/jpeg;base64,' + doc[i].img.data.toString('base64');
        signature.id = doc[i]._id;
        // photos[i].photo = 'data:image/jpeg;base64,' + doc[i].img.data.toString('base64');
        // photos[i].id = doc[i].id;
        signatures.push(signature);
        // console.log('photos.id', photos[i].id);
      }
      for(var i = 0; i < signatures.length; i++){
        console.log('signatures.id', signatures[i].id);
      }
      // console.log('photos', photos);
      res.contentType(doc[0].img.contentType);
      res.send(signatures);
    }
  });
  // var signatures = [];
  // var signature = {};
  // Img.find({}, function(err, doc){
  //   if(err){
  //     return next(err);
  //   }
  //   else{
  //     var signatures = [];
  //     console.log('doc', doc);
  //     // photos = doc;
  //     for(var i = 0; i < doc.length; i++){
  //       signature = {};
  //       // var base64 = doc[i].img.data.toString('base64');
  //       signature.signature = 'data:image/jpeg;base64,' + doc[i].img.data.toString('base64');
  //       signature.id = doc[i]._id;
  //       // photos[i].photo = 'data:image/jpeg;base64,' + doc[i].img.data.toString('base64');
  //       // photos[i].id = doc[i].id;
  //       signatures.push(signature);
  //       // console.log('photos.id', photos[i].id);
  //     }
  //     for(var i = 0; i < signatures.length; i++){
  //       console.log('signatures.id', signatures[i].id);
  //     }
  //     // console.log('photos', photos);
  //     res.contentType(doc[0].img.contentType);
  //     res.send(signatures);
  //   }
  // });
});

router.get('/createheaderarray', function(req, res) {
  // fs.readdir('./public/headers', function(err, files){
  //   if(!err){
  //     console.log(files);
  //     res.send(files);
  //   } else {
  //     console.log(err);
  //   }
  // });
  var headers = [];
  var header = {};
  Letterhead.find({}, function(err, doc){
    if(err){
      return next(err);
    }
    else{
      var header = [];
      console.log('doc', doc);
      // photos = doc;
      for(var i = 0; i < doc.length; i++){
        header = {};
        // var base64 = doc[i].img.data.toString('base64');
        header.header = 'data:image/jpeg;base64,' + doc[i].img.data.toString('base64');
        header.id = doc[i]._id;
        // photos[i].photo = 'data:image/jpeg;base64,' + doc[i].img.data.toString('base64');
        // photos[i].id = doc[i].id;
        headers.push(header);
        // console.log('photos.id', photos[i].id);
      }
      for(var i = 0; i < headers.length; i++){
        console.log('headers.id', headers[i].id);
      }
      // console.log('photos', photos);
      res.contentType(doc[0].img.contentType);
      res.send(headers);
    }
  });
  // var headers = [];
  // var header = {};
  // Img.find({}, function(err, doc){
  //   if(err){
  //     return next(err);
  //   }
  //   else{
  //     var header = [];
  //     console.log('doc', doc);
  //     // photos = doc;
  //     for(var i = 0; i < doc.length; i++){
  //       header = {};
  //       // var base64 = doc[i].img.data.toString('base64');
  //       header.header = 'data:image/jpeg;base64,' + doc[i].img.data.toString('base64');
  //       header.id = doc[i]._id;
  //       // photos[i].photo = 'data:image/jpeg;base64,' + doc[i].img.data.toString('base64');
  //       // photos[i].id = doc[i].id;
  //       headers.push(header);
  //       // console.log('photos.id', photos[i].id);
  //     }
  //     for(var i = 0; i < headers.length; i++){
  //       console.log('headers.id', headers[i].id);
  //     }
  //     // console.log('photos', photos);
  //     res.contentType(doc[0].img.contentType);
  //     res.send(headers);
  //   }
  // });
});

router.get('/:photoId', function(req, res, next){
  var emailImage = req.params.photoId;
  console.log('This is the photo requested from email' , req.params.photoId);
  Img.findById(emailImage, function(err, img){
    if(err) {
      console.log("search photo err" , err);
      res.sendStatus(500);
    }else {
      console.log('mongo photo response????');
      var photo = "data:image/jpeg;base64," + img.img.data.toString('base64');
      console.log('photo');
      res.contentType('jpeg');
      res.end(img.img.data, 'binary');
      // res.send(photo);
  // function(req, res) {
  // var id = req.param('id')
  // fs.exists('/private/img/'+id, function(exists) {
  //   if(exists) res.sendfile('/private/img/'+id)
  //   else res.end('err')
  // })
    }
  })
});

router.get('/header/:photoId', function(req, res, next){
  var headerImage = req.params.photoId;
  console.log('This is the header requested from email' , req.params.photoId);
  Letterhead.findById(headerImage, function(err, img){
    if(err) {
      console.log("search photo err" , err);
      res.sendStatus(500);
    }else {
      console.log('mongo photo response????');
      var photo = "data:image/jpeg;base64," + img.img.data.toString('base64');
      console.log('photo');
      res.contentType('jpeg');
      res.end(img.img.data, 'binary');
      // res.send(photo);
  // function(req, res) {
  // var id = req.param('id')
  // fs.exists('/private/img/'+id, function(exists) {
  //   if(exists) res.sendfile('/private/img/'+id)
  //   else res.end('err')
  // })
    }
  })
});
router.get('/sig/:photoId', function(req, res, next){
  var sigImage = req.params.photoId;
  console.log('This is the signature requested from email' , req.params.photoId);
  Sig.findById(sigImage, function(err, img){
    if(err) {
      console.log("search photo err" , err);
      res.sendStatus(500);
    }else {
      console.log('mongo photo response????');
    
      res.contentType('jpeg');
      res.end(img.img.data, 'binary');
      // res.send(photo);
  // function(req, res) {
  // var id = req.param('id')
  // fs.exists('/private/img/'+id, function(exists) {
  //   if(exists) res.sendfile('/private/img/'+id)
  //   else res.end('err')
  // })
    }
  })
});






module.exports = router;
