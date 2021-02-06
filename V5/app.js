//hide all boxHide elements
$(".boxHide").hide();
//hide all hideRow elements
    $(".hideRow").hide();
    //set the css property 
    $(".boxHide").css("display","");
    $(".hideRow").css("display","");
    //function to get API,loop through and get pollutant data  
        function searchWeather(city,lat,lon)
    {
        // $.getJSON("//api.waqi.info/feed/"+city+"/?token=3b8933facee479ca77345764f2d45b078f9fc2cb",
        $.getJSON("//api.breezometer.com/air-quality/v2/current-conditions?lat="+lat+"&lon="+lon+"&key=e2df0b746770457d8b860ec0ff24eb79&features=breezometer_aqi,pollutants_concentrations",
        function (result) {
            console.log(result);
            //get city name
            $("#cityName").html(city);
            var obj=result["data"]["pollutants"];


            var output2="<table border='2'>";
            if(obj.hasOwnProperty("o3"))
            {
                output2+="<tr><td>Ozone (O3)</td><td> "+obj["o3"]["concentration"]["value"].toFixed(2)+" ppb</td></tr>";
            }
            if(obj.hasOwnProperty("pm25") && !obj.hasOwnProperty("pm10"))
            {
                output2+="<tr><td>Particle Pollution (PM25)</td><td> "+obj["pm25"]["concentration"]["value"].toFixed(2)+" micro</td></tr>";
            }
            else if(!obj.hasOwnProperty("pm25") && obj.hasOwnProperty("pm10"))
            {
                output2+="<tr><td>Particle Pollution (PM10)</td><td> "+obj["pm10"]["concentration"]["value"].toFixed(2)+" micro</td></tr>";
            }
            else if(obj.hasOwnProperty("pm25") && obj.hasOwnProperty("pm10"))
            {
                output2+="<tr><td>Particle Pollution (PM25 and PM10)</td><td> "+(parseFloat(obj["pm25"]["concentration"]["value"])+parseFloat(obj["pm10"]["concentration"]["value"])).toFixed(2)+" micro</td></tr>";
            }
            if(obj.hasOwnProperty("co"))
            {
                output2+="<tr><td>Carbon Monoxide (CO)</td><td> "+obj["co"]["concentration"]["value"].toFixed(2)+" ppb</td></tr>";
            }
            if(obj.hasOwnProperty("so2"))
            {
                output2+="<tr><td>Sulfur dioxide (SO2)</td><td> "+obj["so2"]["concentration"]["value"].toFixed(2)+" ppb</td></tr>";
            }
            if(obj.hasOwnProperty("no2"))
            {
                output2+="<tr><td>Nitrogen dioxide (NO2)</td><td> "+obj["no2"]["concentration"]["value"].toFixed(2)+" ppb</td></tr>";
            }
            output2+="</table>";

            $("#mp").html(output2);
            $("#aqiIndex").html(result["data"]["indexes"]["baqi"]["aqi"]);
            var aqi=parseInt(result["data"]["indexes"]["baqi"]["aqi"]);
            $(".boxHide").hide();

            if(aqi>70 && aqi<=100)
            {var data7 = [{
                domain: {x: [0,1],y:[0,1]},
                value: aqi,
                title:{text:"Air Quality Index"},
                type: "indicator",
                mode: "gauge+number",
                gauge:{axis:{range:[null,100],tickwidth: 1, tickcolor: "green"},
                bar: { color: "green" }
                }
            }                
            ];
            var layout = { width: 300, height: 200, margin: { t: 0, b: 0 }};
            Plotly.newPlot('goodBox', data7, layout);
                $(".goodBox").show();
                $("#status").html("Excellent");
            }
            else if(aqi>50 && aqi<=70)
            {var data7 = [{
                domain: {x: [0,1],y:[0,1]},
                value: aqi,
                title:{text:"Air Quality Index"},
                type: "indicator",
                mode: "gauge+number",
                gauge: {axis:{range:[null,100],tickwidth: 1, tickcolor: "yellow"},
                bar: { color: "yellow" }
             }    
          }            
            ];
            var layout = { width: 300, height: 200, margin: { t: 0, b: 0 }};
            Plotly.newPlot('moderateBox', data7, layout);
               $(".moderateBox").show();
               $("#status").html("Good");
            }
            else if(aqi>30 && aqi<=50)
            {var data7 = [{
                domain: {x: [0,1],y:[0,1]},
                value: aqi,
                title:{text:"Air Quality Index"},
                type: "indicator",
                mode: "gauge+number",
                gauge: {axis:{range:[null,100]}},
                bar: { color: "orange" } 
            }                
            ];
            var layout = { width: 300, height: 200, margin: { t: 0, b: 0 }};
            Plotly.newPlot('unhealthBox', data7, layout);
                $(".unhealthBox").show();
                $("#status").html("Moderate");
            }
            else if(aqi>10 && aqi<=30)
            {var data7 = [{
                domain: {x: [0,1],y:[0,1]},
                value: aqi,
                title:{text:"Air Quality Index"},
                type: "indicator",
                mode: "gauge+number",
                gauge: {axis:{range:[null,100]}},
                bar: { color: "red" }
            }                
            ];
            var layout = { width: 300, height: 200, margin: { t: 0, b: 0 }};
            Plotly.newPlot('unhealth2Box', data7, layout);
               $(".unhealth2Box").show();
               $("#status").html("Low");
            }
            else if(aqi<=10)
            {var data7 = [{
                domain: {x: [0,1],y:[0,1]},
                value: aqi,
                title:{text:"Air Quality Index"},
                type: "indicator",
                mode: "gauge+number",
                gauge: {axis:{range:[null,100]}},
                bar: { color: "maroon" }
            }                
            ];
            var layout = { width: 300, height: 200, margin: { t: 0, b: 0 }};
            Plotly.newPlot('hazardousBox', data7, layout);
                $(".hazardousBox").show();
                $("#status").html("Poor");
            }
        });
        var d=new Date();
        var ldate=d.toLocaleString('en-US');
        var dateS=ldate.split(",")[0];
        var time=ldate.split(",")[1];
        var dateSArr=dateS.split("/");
        var disDate = new Date(dateS);
        disDate=disDate.toString().substring(0,15).replace(new Date().getFullYear().toString(), "");
        $("#dateTime").html(disDate + time);
        $(".hideRow").show();
    }
    $("#searchBtn").click(function(){
        var srcVal=$("#city").val();
        $.ajax({
            url:"ajax.php",
            method:"POST",
            data: {city:srcVal},
            dataType:'json',
            success:function(data){
                // console.log(data);
                if(data[0]==null || data=="")
                {
                    alert("City not found!");
                }
                else
                {
                    $("#latLog").html("<p style='padding-right:60px;'>Lat long</p><p>("+data[0]+", "+data[1]+")</p>");
                    searchWeather(srcVal,data[0],data[1]);
                }
            }
         });
        // searchWeather(srcVal,"34.0536909","-118.242766");
    });

    $("#city").on("keydown",function(e){
        if(e.keyCode==13)
        {
            e.preventDefault();
            $("#searchBtn").click();
        }
    });