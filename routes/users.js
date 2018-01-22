var express = require('express');
var router = express.Router();
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
var fetchAction =  require('node-fetch');

var url = "https://auth.cranial91.hasura-app.io/v1/login";
var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json"
    }
};

var sess;

router.get('/', function(req,res,next) {
    if(req.session)
    {
        res.redirect(["/home"])
    }
  res.send('respond with a resource');
});
router.post('/login',function (req,res,next) {

   sess = req.session
  name = req.body.name
    password = req.body.password


    var body = {
        "provider": "email",
        "data": {
            "email": req.body.name,
            "password": req.body.password
        }
    };


    requestOptions.body = JSON.stringify(body);
try {
    fetchAction(url, requestOptions)
        .then(function (response) {
           if(response.status == 200) {
               sess.email = req.body.name
               res.send(200)
           }
           else
           {
                res.send("error")
           }
        })
        .then(function (result) {
            res.send(result)
        })
        .catch(function (error) {
            res.send(error)
        });
}
catch(err)
{
    console.log(err)
}

})


/////////////////// logout //////////////////////
router.post('/logout',function (req,res,next) {

    req.session.email = ""
    res.send(200)
})

module.exports = router;
