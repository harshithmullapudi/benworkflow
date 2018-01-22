/**
 * Created by harsh on 27-06-2017.
 */
// const WindowsToaster = require('node-notifier').WindowsToaster;
//
// var notifier = new WindowsToaster({
//     withFallback: false, // Fallback to Growl or Balloons?
//     customPath: void 0 // Relative/Absolute path if you want to use your fork of SnoreToast.exe
// });

var express = require('express');
var router = express();
var multer  =   require('multer');
var ObjectID = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;
var urls = "mongodb://heroku_22267dqw:vmqqps3vmjbuinhsclijfit066@ds121456.mlab.com:21456/heroku_22267dqw";
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
var imgaddress = ''
var geterror = false
var fetchAction =  require('node-fetch');
var url = "https://data.cranial91.hasura-app.io/v1/query";

var requestOptions = {
    "method": "POST",
    "aysnc": false,
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer 986c1f58d1b36410d67fc723c2a5bc59d924418055a698ae"
    }
};
/* GET home page. */
router.get('/', function(req, res, next) {
    if(!req.session.email)
    {
        res.redirect(["../"])
    }
    // notifier.notify({
    //     title: 'Foo',
    //     message: 'Hello World',
    //     sound:true,
    //     // icon: fs.readFileSync(__dirname + '/file-1498848425081.jpg'),
    //     wait: false, // Wait for User Action against Notification
    //
    //     // and other growl options like sticky etc.
    //
    //     label: ['True','False']
    //
    // },function (error,response) {
    //     console.log(response)
    // });
    var body = {
        "type":"select",
        "args":{
            "table":"people",
            "columns": ["id", "name","designation","imgaddress"]

        }
    };
    requestOptions.body = JSON.stringify(body);
    try {
        fetchAction(url, requestOptions)
            .then(function (response) {
                response.json().then(function (resp) {
                    var body1 = {
                        "type":"select",
                        "args":{
                            "table":"peoplework",
                            "columns": ["id", "skill","peoplename","peopleimg","title","startdate","enddate","progress"]

                        }
                    };
                    requestOptions.body = JSON.stringify(body1);
                    try {
                        fetchAction(url, requestOptions)
                            .then(function (response1) {
                                response1.json().then(function (resp1) {
                                    res.render('home',{people:resp,work:resp1,
                                        geterror:geterror
                                    });
                                })

                            })
                            .then(function (result) {
                                console.log(result);
                            })
                            .catch(function (error) {
                                console.log('Request Failed:' + error);
                            });
                    }
                    catch(err)
                    {
                        console.log(err)
                    }

                })

            })
            .then(function (result) {
                console.log(result);
            })
            .catch(function (error) {
                console.log('Request Failed:' + error);
            });
    }
    catch(err)
    {
        console.log(err)
    }





});
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/images');
    },
    filename: function (req, file, callback) {
        console.log(file)
        imgaddress = file.fieldname + '-' + Date.now()+'.jpg'
        callback(null, imgaddress);
    }
});
var upload = multer({ storage : storage}).single('file');
router.post('/updatework',function (req,res,next) {

    var body1 = {
        "type":"update",
        "args":{
            "table":"peoplework",

            "$set": {"progress": req.body.update},
            "where": {
                    "id": parseInt(req.body.id)
                }


        }
    };
    requestOptions.body = JSON.stringify(body1);
    try {
        fetchAction(url, requestOptions)
            .then(function (response) {

                                 res.redirect(["/home"])
            })
            .then(function (result) {
                console.log(result);
            })
            .catch(function (error) {
                console.log('Request Failed:' + error);
            });
    }
    catch(err)
    {
        console.log(err)
    }
})
router.post('/peoplework',function (req,res,next) {

    var body = {
        "type":"insert",
        "args":{
            "table":"peoplework",
            "objects":[
                req.body
            ],
            "returning":["id"]
        }
    };
    requestOptions.body = JSON.stringify(body);
    try {
        fetchAction(url, requestOptions)
            .then(function (response) {
                console.log(response)
                res.redirect(["/home"])
            })
            .then(function (result) {
                console.log(result);
            })
            .catch(function (error) {
                console.log('Request Failed:' + error);
            });
    }
    catch(err)
    {
        console.log(err)
    }


})




////////////// Upload //////////////




router.post('/upload',function (req,res,next) {
    upload(req, res, function (err) {
        if (err) {
            console.log(err)
            return res.end("Error uploading file.");
        }
        else {
                 if(req.body.name && req.body.designation) {
                var body = {
                    "type":"insert",
                    "args":{
                        "table":"people",
                        "objects":[
                            {
                                "name": req.body.name,
                                "designation": req.body.designation,
                                "imgaddress": imgaddress
                            }
                        ],
                        "returning":["id"]
                    }
                };
                     requestOptions.body = JSON.stringify(body);
                try {
                    fetchAction(url, requestOptions)
                        .then(function (response) {
                            res.redirect('/home')
                        })
                        .then(function (result) {
                            console.log(result);
                        })
                        .catch(function (error) {
                            console.log('Request Failed:' + error);
                        });
                }
                catch(err)
                {
                    console.log(err)
                }

            }


            else
            {
                geterror = true;
                setTimeout(function () {
                    geterror = false

                },5000)
                res.redirect("/home")
            }
        }


    });


})
module.exports = router;
