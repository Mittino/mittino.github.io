jQuery(document).ready(function($) {
  var API_URL = 'http://api.wunderground.com/api/7db0776e0a64815c';

  // TODO: Remove these
  // getConditions('80302');
  // getForecast('80302');

// TODO: Use location API

  $('#location-form input').focus();

  $('#location-form').submit(function(event){
    event.preventDefault();

    var locationInput = $('#location-input').val();
    console.log(locationInput);
    getConditions(locationInput);
    getForecast(locationInput);
  });

  function getConditions(input) {
    var url;
    // See https://www.wunderground.com/weather/api/d/docs?d=resources/apigee-console
    if (input.match(/\d{5}/)) {
      url = API_URL + "/geolookup/conditions/q/" + input + ".json";
    } else {
      url = API_URL + "/conditions/q/pws:" + input + ".json";
    }

    $.ajax({
      url : url,
      type: 'GET',
      success : function(response) {
        var location = response.current_observation.display_location.full;
        var temp_f = response.current_observation.temp_f;
        var relative_humidity = response.current_observation.relative_humidity;
        var wind_value =  response.current_observation.wind_string;
        var weather = response.current_observation.weather;
        var feels_like=response.current_observation.feelslike_f;
        var icon = response.current_observation.icon;

        $('.wrapper').show();
        $('#current-temp span').html(temp_f + '&deg;');
        $('#location').html(location);
        // $('#current-humidity').html(relative_humidity);
        // $('#wind-value').html(wind_value);
        $('#conditions .icon').html('<i class="wu wu-black wu-128 wu-' + icon + '">');
        $('#conditions .weather').html(weather);
        // $('#feels_like').html(feels_like +'&deg;');
      }
    });
  }

  function getForecast(input) {
    var url;
    // See https://www.wunderground.com/weather/api/d/docs?d=resources/apigee-console
    if (input.match(/\d{5}/)) {
      url = API_URL + "/forecast/q/" + input + ".json";
    } else {
      url = API_URL + "/forecast/q/pws:" + input + ".json";
    }

    $.ajax({
      url : url,
      type: 'GET',
      success : function(response) {
        $(".wrapper").show();
        console.log(response);
        updateForecast(response.forecast.simpleforecast.forecastday);
      }
    });
  };

  function updateForecast(forecast){
    var currentForecast;
    var high;
    var low;
    var conditions;

    for (i=0; i < forecast.length; i++) {
      currentForecast = forecast[i];
      conditions = '<div class="conditions"><i class="wu wu-white wu-64 wu-' + currentForecast.icon + '"></i></div>';
      weekday = '<div class="weekday">' + currentForecast.date.weekday_short + '</div>';
      temps = '<div class="temps">' + currentForecast.high.fahrenheit + ' / ' + currentForecast.low.fahrenheit + '&deg;</div>';

      $('#forecast-' + i).html(conditions + weekday + temps);
    };
  }
});
