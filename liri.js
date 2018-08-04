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
var spotifySong = "The Sign";
var movieURL = "https://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey=trilogy"
var commandRequest = process.argv[2];

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
                if (i >= 1) {
                    if (i === tweets.length - 1) {
                        dataOutPut = "\nTweet " + (tweets.length - i) + " of " + tweets.length + ": " + tweets[i].text + "\nCreated At: " + tweets[i].created_at +
                            "\n---------------------------------------------------------------------------------------------------------------------------------";
                    } else {
                        dataOutPut = "\nTweet " + (tweets.length - i) + " of " + tweets.length + ": " + tweets[i].text + "\nCreated At: " + tweets[i].created_at + "\n";
                    }
                    logOutPut();
                    console.log(dataOutPut);
                } else {
                    dataOutPut = "\n" + commandRequest + "\n---------------------------------------------------------------------------------------------------------------------------------" +
                        "\nTweet " + (tweets.length - i) + " of " + tweets.length + ": " + tweets[i].text + "\nCreated At: " + tweets[i].created_at + "\n";
                    logOutPut();
                    console.log(dataOutPut);
                }
            }
        }
    });
}

function displaySpotify() {
    if (process.argv[3]) {
        spotifySong = process.argv[3];
    }
    spotify
        .search({ type: 'track', query: spotifySong })
        .then(function (response) {

            dataOutPut = "\n" + commandRequest + "\n---------------------------------------------------------------------------------------------------------------------------------" +
                "\nArtist(s): " + response.tracks.items[0].artists[0].name + "\n" +
                "\nSong: " + response.tracks.items[0].name + "\n" +
                "\nPreview: " + response.tracks.items[0].preview_url + "\n" +
                "\nAlbum: " + response.tracks.items[0].album.name + "\n" +
                "---------------------------------------------------------------------------------------------------------------------------------";
            logOutPut();
        })
        .catch(function (err) {
            console.log(err);
        });
}

function displayOMDB() {
    if (process.argv[3]) {
        movieURL = "https://www.omdbapi.com/?t=" + process.argv[3] + "&y=&plot=short&apikey=trilogy"
    }
    request(movieURL, function (error, response, body) {
        if (error) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        } else {
            dataOutPut = "\n" + commandRequest + "\n---------------------------------------------------------------------------------------------------------------------------------" +
                "\nTitle: " + JSON.parse(body).Title + "\n" +
                "\nYear Released: " + JSON.parse(body).Year + "\n" +
                "\n" + JSON.parse(body).Ratings[0].Source + ": " + JSON.parse(body).Ratings[0].Value + "\n" +
                "\n" + JSON.parse(body).Ratings[1].Source + ": " + JSON.parse(body).Ratings[1].Value + "\n" +
                "\nCountry: " + JSON.parse(body).Country + "\n" +
                "\nLangauge: " + JSON.parse(body).Language + "\n" +
                "\nPlot: " + JSON.parse(body).Plot + "\n" +
                "\nCast: " + JSON.parse(body).Actors + "\n" +
                "---------------------------------------------------------------------------------------------------------------------------------";
            logOutPut();
        }
    });
}

function logOutPut() {
    fs.appendFile("log.txt", dataOutPut, function (err) {
        if (err) {
            console.log(err);
        } else {
            if (commandRequest !== "my-tweets")
                console.log(dataOutPut);
        }
    });
}

// MAIN PROCESS
//************************************************************************************************************
if (commandRequest === "my-tweets") {

    displayTweets();

} else if (commandRequest === "spotify-this-song") {

    displaySpotify();

} else if (commandRequest === "movie-this") {

    displayOMDB();

} else if (commandRequest === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, randomCommand) {
        if (error) {
            return console.log("Error: " + error);
        } else {
            var randomCommandArr = randomCommand.split(",");
            if (randomCommandArr[0] === "my-tweets") {
                displayTweets();
            } else if (randomCommandArr[0] === "spotify-this-song") {
                if (randomCommandArr[1]) {
                    spotifySong = randomCommandArr[1];
                    displaySpotify();
                } else {
                    displaySpotify();
                }
            } else if (randomCommandArr[0] === "movie-this") {
                if (randomCommandArr[1]) {
                    movieURL = "https://www.omdbapi.com/?t=" + randomCommandArr[1] + "&y=&plot=short&apikey=trilogy"
                    displayOMDB();
                } else {
                    displayOMDB();
                }
            } else {
                console.log("Sorry, I don't recognize that command! My developer must be slacking!!")
            }
        }
    });
} else {
    console.log("Sorry, I don't recognize that command! My developer must be slacking!!")
}