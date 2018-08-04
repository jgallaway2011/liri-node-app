// VARIABLES
//************************************************************************************************************
require("dotenv").config(); // This process is used to reference API KEYS without placing them in code
var keys = require("./keys.js"); // This is saying that a file called keys.js with API linakge is required
var Twitter = require('twitter'); // npm install twitter required
var Spotify = require('node-spotify-api'); // npm install for spotify required
var request = require('request'); // npm install request required
var fs = require("fs"); // fs is required for this javascript
var spotify = new Spotify(keys.spotify); // Link to API keys
var client = new Twitter(keys.twitter); // Link to API keys
var spotifySong = "The Sign"; // Default song for search
var movieURL = "https://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey=trilogy" // Default movie for search
var commandRequest = process.argv[2]; // Save node command in variable

// FUNCTIONS
//************************************************************************************************************

// Function to pull tweets from Twitters and then display in the terminal as well as log.txt
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

// Function to pull song info from Spotify and then display in the terminal as well as log.txt
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

// Function to pull movie info from OMDB and then display in the terminal as well as log.txt
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

// Function called by all functions above (minus Twitter) to push data into console and log.txt
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

// This will read a command saved in the file random.txt and run one fo the functions above to complete the task
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