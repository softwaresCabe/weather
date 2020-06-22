
// My api key
var APIKey = "f0f966d5ceb39402c51425703a815a8c";

var searchCity = "";

var weatherIconURL = "";

var city = "los angeles";

var searchHistory = [];



// Here we are building the URL we need to query the database for icon data
var forcastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid="+ APIKey;


  $(document).ready(function(){
    getCurrentData();
    get5DayForecast();

    $("#searchbtn").on("click", function(){
      city = $("#cityinput").val();
      $("#cityinput").val('');
      searchHistory.push(city);
      updateSearchHistory();
      getCurrentData();
      get5DayForecast();
    })

    $("#mybtn").on("click", function(){
      console.log('here');
      var tempText = $(this).text();
      city = tempText;
      getCurrentData();
      get5DayForecast();
    })

  });

  function updateSearchHistory(){
    $("#recentsearchBTns").empty();
    for(var i = 0; i < searchHistory.length; i++){
      $("#recentsearchBTns").prepend('<button class="col-12 citybtn" >'+ searchHistory[i] +'</button>')
    }

  }



  function get5DayForecast(){
    var d = new Date();
    var startDateOfForcast = d.getDate();

    // Here we are building the URL we need to query the database for icon data
    var forcastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid="+ APIKey;

    $.ajax({
      url: forcastURL,
      method: "GET"
      })
      // We store all of the retrieved data inside of an object called "response"
      .then(function(response) {

        var dayIndex = 0 ;
        var iconJPG;

        for(var i =0; i< response.list.length; i++){

          if (response.list[i].dt_txt.indexOf("15:00:00") !== -1){
            //build URL to get weather icon
            var weatherIconURL = "http://openweathermap.org/img/wn/"+ response.list[i].weather[0].icon +"@2x.png";
              $('[index='+ dayIndex +']').find('img').attr("src", weatherIconURL);

            //set date for each forcast card
            d.setDate(startDateOfForcast += 1);
            $('[index='+ dayIndex +']').find('h5').text( d.getMonth() + 1 +'/'+ d.getDate() +'/'+ d.getFullYear() );

            //set temp for each card
            var tempF = (response.list[i].main.temp - 273.15) * 1.80 + 32;
            $('[index='+ dayIndex +']').find('#temp').text("Temp : " + tempF.toFixed(0) + '\u00B0' + "F");
            
            //set humidity for each card
            $('[index='+ dayIndex +']').find('#humidity').text( "Humidity : " + response.list[i].main.humidity + " % ");
            
            dayIndex++;
          }
        }
      });


  }


  function getCurrentData(){
    // Here we are building the URL we need to query the database for weather data
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
    "q=" + city + "&appid=" + APIKey;



    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
      url: queryURL,
      method: "GET"
      })
      // We store all of the retrieved data inside of an object called "response"
      .then(function(response) {

          //city name to html
          $("#cityname").text( response.name);

          // Convert the temp to fahrenheit
          var tempF = (response.main.temp - 273.15) * 1.80 + 32;
          // City temperature to html
          $("#citytemp").text("Temperature : " + tempF.toFixed(0) + '\u00B0' + "F");

          //humidity to html
          $("#cityhum").text( "Humidity : " + response.main.humidity + " % " );

          //wind speed to html
          $("#citywind").text("Wind Speed : " + response.wind.speed );

          //get lon ant lat for UVindex
          var lat = response.coord.lat;
          var lon = response.coord.lon;

          // Build URL for uv index api call
          var urlUV = 'https://api.openweathermap.org/data/2.5/uvi?appid='+ APIKey +'&lat=' + lat +'&lon=' + lon;

          // get UV index
          $.ajax({
              url: urlUV,
              method: "GET"
              })
              // store all of the retrieved data inside of an object called "UVresponse"
              .then(function(UVresponse) {
                //display UV idex
                $("#cityuvdata").text( UVresponse.value );

                //change color of background based on UV index
                if(UVresponse.value >= 11){
                  $("#cityuvdata").css("background-color", "rgb(248, 4, 78)");
                }else if ( UVresponse.value >= 8 && UVresponse.value < 11 ){
                  $("#cityuvdata").css("background-color", "red");
                }else if ( UVresponse.value >= 6 && UVresponse.value < 8 ){
                  $("#cityuvdata").css("background-color", "orange");
                }else if ( UVresponse.value >= 3 && UVresponse.value < 6 ){
                  $("#cityuvdata").css("background-color", "yellow");
                }else if ( UVresponse.value >= 1 && UVresponse.value < 3 ){
                  $("#cityuvdata").css("background-color", "lightgreen");
                }

              });
        });

  }