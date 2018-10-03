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

        var juna = data[i];
        var optiot = {hour: '2-digit', minute:'2-digit', hour12: false};
        var junanNumero = data[i].trainNumber;
        var rivi = $("<tr>").appendTo($('#taulu'));
        $("<td>").text(junanNumero).appendTo(rivi);
        var lahtoasema = data[i].timeTableRows[0].stationShortCode;
        $("<td>").text(lahtoasema).appendTo(rivi);
        var aika1 = juna.timeTableRows[0].scheduledTime;
        var aika2 = new Date(aika1);
        var lahtoaikaLokal = aika2.toLocaleString("fi", optiot);
        $("<td>").text(lahtoaikaLokal).appendTo(rivi);
        var maaraasema = juna.timeTableRows[juna.timeTableRows.length-1].stationShortCode;
        $("<td>").text(maaraasema).appendTo(rivi);
        var aika3 = juna.timeTableRows[juna.timeTableRows.length-1].scheduledTime;
        var optiot = {hour: '2-digit', minute:'2-digit', hour12: false};
        var aika4 = new Date(aika3);
        var lahtoaikaLokal = aika4.toLocaleString("fi", optiot);
        $("<td>").text(lahtoaikaLokal).appendTo(rivi);

    }

    }
    )
