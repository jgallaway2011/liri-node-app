require("dotenv").config();

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


// 10. Make it so liri.js can take in one of the following commands:
if (process.argv[2] === "my-tweets") {
    // Add code to be executed
} else if (process.argv[2] === "spotify-this-song") {
    // Add code to be executed
} else if (process.argv[2] === "movie-this") {
    // Add code to be executed
} else if (process.argv[2] === "do-what-it-says") {
    // Add code to be executed
}