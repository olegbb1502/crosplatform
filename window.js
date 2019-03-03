/* global $ */
const request = require('request')

// Run this function after the page has loaded

let base, currency;
let todayDate = new Date(), weekDate = new Date(), today, week;

$(document).ready(function () {
    $('#base').on('change', function () {
        base = $(this).val().toUpperCase();
    })
    $('#currency').on('change', function () {
        currency = $(this).val().toUpperCase();
    })

    weekDate.setTime(todayDate.getTime()-(10*24*3600000));
    today = todayDate.toJSON().replace(/ *\T[^)]*\ */g, "");
    week = weekDate.toJSON().replace(/ *\T[^)]*\ */g, "");


})


let result = ()=>{

    currency = $('#currency').val().toUpperCase();
    base = $('#base').val().toUpperCase();

    if(base != '' && currency != ''){
        let url = `https://api.exchangeratesapi.io/latest?base=${base}`
        request({
            url: url,
            json: true
        }, (error, response, data)=>{
            if (!error && response.statusCode === 200) {
                $('#result').removeClass('error');
                if(data.rates[currency] === undefined || base === undefined)
                  $('#result').addClass('error').html('Sorry we don`t have information about your currency');
                else
                  $('#result').html(base + ' to ' + currency + ' : ' + data.rates[currency])
            }
            else{
                console.error(error)
            }
        })
    }
    else{
        $('#result').addClass('error').html("Please, choose your currency");
    }

    graph(currency, base);

}

let graph = (currency, base)=>{
  let url = `https://api.exchangeratesapi.io/history?start_at=${week}&end_at=${today}&base=${base}`

  let date, rate = [], chartData;

    request({
        url: url,
        json: true
    }, (error, response, data)=>{
        if (!error && response.statusCode === 200) {
            date = Object.keys(data.rates);
            for(var i in data.rates) {
              rate.push(data.rates[i][currency])
            }
            // console.log(date, rate)
        }
        else{
            console.error(error)
        }


        chartData = {
            labels: date,
            series: [rate]
        };

        let options = {
            // Don't draw the line chart points
            showPoint: true,
            // Disable line smoothing
            lineSmooth: false,
            plugins: [
                Chartist.plugins.tooltip()
            ],
            // X-Axis specific configuration
            axisX: {
                // We can disable the grid for this axis
                showGrid: true,
                // and also don't show the label
                showLabel: true,
                labelInterpolationFnc: function(value) {
                    return value;
                }
            },
            // Y-Axis specific configuration
            axisY: {
                offset: 60,
            },

        };

        new Chartist.Line('#chart', chartData, options);

        setTimeout(()=>{
          let line = document.querySelector('.ct-series-a')
          let path = document.querySelector('.ct-series-a path');
          let length = path.getTotalLength();
          line.style.strokeDasharray = length;
          line.style.strokeDashoffset = length;
        }, 0)
        // console.log(date, rate)
    })

}