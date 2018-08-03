// VARIABLES
//************************************************************************************************************
require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// FUNCTIONS
//************************************************************************************************************

function displayTweets() {
    var params = { screen_name: "ClassJpg" };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) {
            console.log(error);
            console.log(response);
        } else {
            for (i = 0; i < tweets.length; i++) {
                console.log("-----------------------------------------------------------------------");
                console.log("Tweet " + (tweets.length - i) + " of " + tweets.length + ": " + tweets[i].text + "\nCreated At: " + tweets[i].created_at);
            }
            console.log("-----------------------------------------------------------------------");
        }
    });
}

function displaySpotify() {
    spotify
        .search({ type: 'track', query: spotifySong })
        .then(function (response) {
            // console.log(JSON.stringify(response));
            console.log(response.tracks.items[0]);
        })
        .catch(function (err) {
            console.log(err);
        });
}

// MAIN PROCESS
//************************************************************************************************************
if (process.argv[2] === "my-tweets") {

    displayTweets();

} else if (process.argv[2] === "spotify-this-song") {

    if (process.argv[3]) {
        var spotifySong = process.argv[3];
        displaySpotify();
    } else {
        var spotifySong = "The Sign";
        displaySpotify();
    }
    
} else if (process.argv[2] === "movie-this") {
    if (process.argv[3]) {
        var movieURL = "https://www.omdbapi.com/?t=" + process.argv[3] + "&y=&plot=short&apikey=trilogy"
        request(movieURL, function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            } else {
                console.log(
                    "\n" + "Title: " + JSON.parse(body).Title + "\n" +
                    "\nYear Released: " + JSON.parse(body).Year + "\n" +
                    "\n" + JSON.parse(body).Ratings[0].Source + ": " + JSON.parse(body).Ratings[0].Value + "\n" +
                    "\n" + JSON.parse(body).Ratings[1].Source + ": " + JSON.parse(body).Ratings[1].Value + "\n" +
                    "\nCountry: " + JSON.parse(body).Country + "\n" +
                    "\nLangauge: " + JSON.parse(body).Language + "\n" +
                    "\nPlot: " + JSON.parse(body).Plot + "\n" +
                    "\nCast: " + JSON.parse(body).Actors
                );
            }
        });
    } else {
        request("https://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey=trilogy", function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            } else {
                console.log(
                    "\n" + "Title: " + JSON.parse(body).Title + "\n" +
                    "\nYear Released: " + JSON.parse(body).Year + "\n" +
                    "\n" + JSON.parse(body).Ratings[0].Source + ": " + JSON.parse(body).Ratings[0].Value + "\n" +
                    "\n" + JSON.parse(body).Ratings[1].Source + ": " + JSON.parse(body).Ratings[1].Value + "\n" +
                    "\nCountry: " + JSON.parse(body).Country + "\n" +
                    "\nLangauge: " + JSON.parse(body).Language + "\n" +
                    "\nPlot: " + JSON.parse(body).Plot + "\n" +
                    "\nCast: " + JSON.parse(body).Actors
                );
            }
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
            console.log("Sorry, I don't recognize that command! My developer must be slacking!!")
        }
    });
} else {
    console.log("Sorry, I don't recognize that command! My developer must be slacking!!")
}