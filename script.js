//*** Variables ***//
let cities = [];

//*** API Requests ***//

$("#find-city").on("click", function(event) {
  event.preventDefault();

  let city = $("#city-input").val();
  getAPIs(city);
});

$("#city-list").on("click", ".city", function(event) {
  event.preventDefault();

  let city = $(this).text();
  getAPIs(city);
});

$("#clear-city-names").on("click", function() {
  // Clear the city names array
  cities = [];
  saveCities();
  renderCities();
})

function getAPIs(city) {
  // Variables
  const APIKey = "c0dc1a9d8fb231df2cf782d516966b2f";
  let fiveDayQueryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city},us&units=imperial&appid=${APIKey}`;
  let mainQueryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city},us&units=imperial&appid=${APIKey}`;

  $.ajax({
      url: fiveDayQueryURL,
      method: "GET"
  }).then(function(response) {
      showFiveDayWeather(response);
  })

  $.ajax({
      url: mainQueryURL,
      method: "GET"
  }).then(function(response) {
    showMainWeather(response);
  })

  // Add city name to array.
  if (cities.indexOf(city) === -1) {
    cities.push(city);
  }

  saveCities();
  renderCities();
};

function init() {
  // Parsing the JSON stsring to an object
  let storedCities = JSON.parse(localStorage.getItem("cities"));

  // If high scores were retrieved from localStorage, update highScores array to it.
  if (storedCities !== null) {
    cities = storedCities;
  }
}

function saveCities() {
  // Save city names.
  localStorage.setItem("cities", JSON.stringify(cities));
}

function showMainWeather(response) {
  // Display main weather report
  let cityName = response.name;
  let cityDate = moment().format('l');
  let cityIcon = response.weather[0].icon;
  let cityTemp = Math.round(response.main.temp);
  let cityHumid = response.main.humidity;
  let cityWind = Math.round(response.wind.speed);
  let cityCondition = response.weather[0].main;
  let cityIconEl = $("<img>").attr("src", `https://openweathermap.org/img/w/${cityIcon}.png`)
  $("#city-name").text(cityName + ' (' + cityDate + ')').append(cityIconEl);
  $("#city-temp").text(cityTemp);
  $("#city-humid").text(cityHumid);
  $("#city-wind").text(cityWind);
  $("#city-condition").text(cityCondition);
}

function showFiveDayWeather(response) {
  // Display 5-day weather report

  // Clear deck before updating
  $("#five-day-deck").empty();
  for (let i = 0; i < 40; i += 8) {
    let cardDate = response.list[i].dt_txt;
    let date = new Date(cardDate).toLocaleDateString('en-US', {
      day : 'numeric',
      month : 'numeric',
      year : 'numeric'
    });
    let cardTemp = Math.round(response.list[i].main.temp);
    let cardHumid = Math.round(response.list[i].main.humidity);
    let iconSource = response.list[i].weather[0].icon;

    let cardEl = $("<div>").attr("class", "card");
    let cardBodyEl = $("<div>").attr("class", "card-body five-card");
    let cardTitleEl = $("<h6>").attr("class", "card-title").text(date);
    let cardIcon = $("<img>").attr("src", `https://openweathermap.org/img/w/${iconSource}.png`);
    let cardTempEl = $("<p>").attr("class", "card-text").text(`Temp: ${cardTemp} °F`);
    let cardHumidEl = $("<p>").attr("class", "card-text").text(`Humidity: ${cardHumid}%`);
    cardEl.append(cardBodyEl);
    cardBodyEl.append(cardTitleEl).append(cardIcon).append(cardTempEl).append(cardHumidEl);
    $("#five-day-deck").append(cardEl);
  }
}

function renderCities() {
  // Clear city names element before updating.
  $("#city-list").empty();

  // Render city names
  cities.forEach(city => {

    let cityCard = $("<div>").attr("class", "card");
    let cityCardBody = $("<div>").attr("class", "card-body city").text(city);
    cityCard.append(cityCardBody);
    $("#city-list").prepend(cityCard);
  })
}

init();