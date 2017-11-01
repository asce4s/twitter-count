var express = require('express');
var router = express.Router();
var twitter=require('../twitter');


router.post('/', function(req, res, next) {
    var reqData=req.body

    if(reqData.handle && reqData.count) {
        var begin=Date.now();
        twitter.process(reqData.handle, reqData.count, function (result) {
            var end= Date.now();

            var timeSpent=(end-begin)/1000+"secs";

            return res.render('index', {wordcount: result,processTime:timeSpent,handle:reqData.handle})
        });
    }else{
        return res.render({
            error:true,
            errorMsg:'All fields are required'
        })
    }

});

module.exports = router;
