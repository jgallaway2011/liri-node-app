// VARIABLES
//************************************************************************************************************
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
// var client = new Twitter(keys.twitter);

// FUNCTIONS
//************************************************************************************************************



// MAIN PROCESS
//************************************************************************************************************
if (process.argv[2] === "my-tweets") {
    var params = { screen_name: "jpg_class_account" };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            console.log(tweets);
            console.log(response);
        }
    });
} else if (process.argv[2] === "spotify-this-song") {
    if (process.argv[3]) {
        var spotifySong = process.argv[3];
        spotify
            .search({ type: 'track', query: spotifySong })
            .then(function (response) {
                console.log(JSON.stringify(response));
            })
            .catch(function (err) {
                console.log(err);
            });
    } else {
        spotify
            .search({ type: "track", query: "The Sign" })
            .then(function (response) {
                console.log(JSON.stringify(response));
            })
            .catch(function (err) {
                console.log(err);
            });
    }
} else if (process.argv[2] === "movie-this") {
    if (process.argv[3]) {
        var movieURL = "https://www.omdbapi.com/?t=" + process.argv[3] + "&y=&plot=short&apikey=trilogy"
        request(movieURL, function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
            } else {
                console.log(response.body.Title);
                console.log('body:', body); // Print the HTML for the Google homepage.
            }
        });
    } else {
        request("https://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey=trilogy", function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body.Title);
        });
    }

} else if (process.argv[2] === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, randomCommand) {
        if (error) {
            return console.log(error);
        }
        console.log(randomCommand);
        var randomCommandArr = randomCommand.split(",");
        console.log(randomCommandArr);
        if (randomCommandArr[0] === "spotify-this-song") {
            spotify
                .search({ type: "track", query: randomCommandArr[1] })
                .then(function (response) {
                    console.log(JSON.stringify(response.tracks.items));
                })
                .catch(function (err) {
                    console.log(err);
                });
        } else {
            console.log("Sorry, I don't recognize that command!  Maybe my developer should code me some more!!")
        }
    });
} else {
    console.log("Sorry, I don't recognize that command!  Maybe my developer should code me some more!!")
}