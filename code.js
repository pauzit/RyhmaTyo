$.getJSON('https://rata.digitraffic.fi/api/v1/live-trains/station/HKI/LH'
).done(function(data) {
    console.dir(data);

    for(var i = 0; i < data.length; i++) {
        console.log(data[i].trainNumber);
        console.log("jee");
        //var train = data[i];
        //var option = {hour: '2-digit', minute:'2-digit', hour12: false};
        //var junanNumero = data[i].trainNumber;
        //var raw = $("<tr>").appendTo($('#table'));
        //$("<td>").text(junanNumero).appendTo(raw);

    }

    }
)
