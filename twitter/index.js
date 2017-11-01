var Twitter = require('twitter');
var WordPOS = require('wordpos'),
    wordpos = new WordPOS();
var async = require("async");
var client = new Twitter({
    consumer_key: 'AT9Ni1QFHRlyz2Icizra8nIlt',
    consumer_secret: 'OVBIEBErQHjzLnqlyMg5LPjtDaZfh4PQ0YJ45k37ukqZxfWBTL',
    access_token_key: '69322767-HVD4J0XnD7vR1NShmOz50hlJEFHAYJcksA9K6pOxi',
    access_token_secret: 'tuaulloADVWMjxahs56EQdZXYyt2CVXUfIFP5y2VkJGOD'
});


var TwitterHandler = function () {
    var self = this;

    this.process = function (handle, count, callback) {
        var params = {
            screen_name: handle,
            count: count

        };

        client.get('statuses/user_timeline', params, function (error, tweets, response) {
            if (!error) {

                var wordCount = {};
                tweets.forEach(function (v) {

                    var words = v.text.split(' ');
                    var len = words.length;
                    words.forEach(function (word) {
                       // console.log(word)
                        word = word.toLowerCase().replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '');
                        if (
                            isNaN(word) && word.length > 1 &&
                            !word.startsWith('http') &&
                            word !== 'to' &&
                            word !== 'for' &&
                            word !== 'a' &&
                            word !== 'have' &&
                            word !== 'having' &&
                            word !== 'had' &&
                            word !== 'and' &&
                            word !== 'the' &&
                            word!=='or' &&
                            word!=='how' &&
                            word!=='you' &&
                            word!=='an' &&
                            word!=='in' &&
                            word!=='on' &&
                            word!=='of' &&
                            word!=='is' &&
                            word!=='are' &&
                            word!=='its' &&
                            word!=='this' &&
                            word!=='&amp;' &&
                            word!=='at'
                        ) {
                            wordCount[word] = (wordCount[word] || 0) + 1
                        }


                        // wordpos.isNoun(word, function (e) {
                        //     if (isNaN(word) && word.length > 0 && !word.startsWith('http')) {
                        //         wordCount[word] = (wordCount[word] || 0) + 1
                        //     }
                        // })
                    })


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
                result = {
                    error: true,
                    data: error,
                    errorMsg:error[0].message
                };
                callback(result)
            }

        });

    };


};


module.exports = new TwitterHandler();
