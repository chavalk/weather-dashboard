// Variable for API key
var apiKey = "391826fb0aefc3ce7776fffd2278448a";

// Variables
var city = "";
var lat = 0;
var lon = 0;

// Array to save search history
var searchedItems = [];

// Function to get current weather
function getCurrentWeather(city) {

    var currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;

    $.ajax({
        url: currentURL,
        method: "GET"
    }).then(function (response) {
        $("#city").text(response.name + " (" + moment().format('L') + ")");
        $("#current-temp").text("Temperature: " + response.main.temp + " F");
        $("#current-hum").text("Humidity: " + response.main.humidity + "%");
        $("#wind-speed").text("Wind Speed: " + response.wind.speed + " MPH");
        lat = response.coord.lat;
        lon = response.coord.lon;
        getUVIndex(lat, lon);
        saveSearch(response.name);
    })
}

// Function to get UV index
function getUVIndex(lat, lon) {
    var currentUVURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

    $.ajax({
        url: currentUVURL,
        method: "GET"
    }).then(function (response) {
        $("#uv-index").text("UV Index: " + response.value);
    })
}

// For loop to add dates to forecast
for (var i = 1; i < 6; i++) {
    var date = moment();
    date.add(i, 'days');

    $("#forecast-" + i).text(date.format('L'));
}

// Function to get current forecast
function getForecast(city) {
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;

    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function (response) {
        var arrayPos = 0;
        for (var i = 1; i < 6; i++) {
            $("#temp-" + i).text("Temp: " + response.list[arrayPos].main.temp + " F");
            $("#hum-" + i).text("Humidity: " + response.list[arrayPos].main.humidity + "%");
            arrayPos = arrayPos + 8;
        }
    })
}

// Function to save search history
function saveSearch(city){
    searchedItems.push(city);
    loadSearchHistory();
}

// For loop to add items to search history table
function loadSearchHistory(){
    for(var i = 0; i < searchedItems.length; i++){
        $("#item-" + i).text(searchedItems[i]);
    }
}

// Search button to initiate user's search and trigger functions to get weather
$("#search-btn").on("click", function () {
    city = $("#input").val();
    getCurrentWeather(city);
    getForecast(city);
})

