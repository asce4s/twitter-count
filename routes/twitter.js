var express = require('express');
var router = express.Router();
var twitter=require('../twitter');

//rout for handle post data
router.post('/', function(req, res, next) {

    //get post body
    var reqData=req.body;

    //check if count is valid
    if(reqData.handle && reqData.count) {

        if(reqData.count <0 || reqData.count>200){
            return res.json({
                error:true,
                errorMsg:'Count should be between 0 and 200'
            })
        }

        //processing time start
        var begin=Date.now();

        //processing the tweets
        twitter.process(reqData.handle, reqData.count, function (result) {
            //processing time end
            var end= Date.now();

            //calculate the processing time
            var timeSpent=(end-begin)/1000+" secs";

            //render the index layout
            return res.render('index', {
                title:'Twitter stats',
                wordcount: result,
                processTime:timeSpent,
                handle:reqData.handle})
        });
    }else{
        return res.render({
            error:true,
            errorMsg:'All fields are required'
        })
    }

});


router.get('/',function (req,res,next) {
    res.redirect('/')
});

module.exports = router;
