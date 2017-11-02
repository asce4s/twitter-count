var Twitter = require('twitter');
var filterWords=require('./filterwords').words

var client = new Twitter({
    consumer_key: 'AT9Ni1QFHRlyz2Icizra8nIlt',
    consumer_secret: 'OVBIEBErQHjzLnqlyMg5LPjtDaZfh4PQ0YJ45k37ukqZxfWBTL',
    access_token_key: '69322767-HVD4J0XnD7vR1NShmOz50hlJEFHAYJcksA9K6pOxi',
    access_token_secret: 'tuaulloADVWMjxahs56EQdZXYyt2CVXUfIFP5y2VkJGOD'
});


var TwitterHandler = function () {


    this.process = function (handle, count, callback) {

        //initialize the params for twitter
        var params = {
            screen_name: handle,
            count: count,
            exclude_replies:true,
            include_rts:true,
            trim_user:true

        };

        client.get('statuses/user_timeline', params, function (error, tweets, response) {

            if (!error) {

                var wordCount = {};

                //looping through each tweet
                tweets.forEach(function (v) {

                    //splitting each tweet into word array
                    var words = v.text.split(' ');

                    words.forEach(function (word) {
                        word = word.toLowerCase()
                            .replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '') //strip any unicode characters
                            .replace(/['"#:;]+/g,''); //strip any quotes,hashes, colons
                        if (
                            isNaN(word) && //check if not a number
                            word.length > 2 &&
                            !word.startsWith('http') && //check if it's not a url
                            !word.startsWith('@') && //check if it's not a mentioned username
                            filterWords.indexOf(word) === -1 //check if the word is not in the filter word list

                        ) {
                            wordCount[word] = (wordCount[word] || 0) + 1  //increment count for each word
                        }
                    });

                });
                var sorted = Object.keys(wordCount).map(function (key) {
                    return {
                        word: key,
                        count: wordCount[key]
                    }
                }).sort(function (a, b) {
                    return b.count - a.count;
                }).slice(0,10);

                var result = {
                    error: false,
                    data: sorted,
                    errorMsg:null

                };

                callback(result)


            } else {
                if(response.statusCode && response.statusCode===401)
                    var message='You don\'t have sufficient access to retrieve tweets from this user'
                else
                    message=error[0].message ? error[0].message :'Something went wrong..Please try again'

                result = {
                    error: true,
                    data: error,
                    errorMsg:message
                };
                callback(result)
            }

        });

    };


};


module.exports = new TwitterHandler();
