var baseurl= 'https://rata.digitraffic.fi/api/v1/live-trains/station/';
var lahtoURL ="HKI" + "/";
var saapumisURL ="OL";
var train;
var option = {hour: '2-digit', minute: '2-digit', hour12: false};
var asemat = {HKI: "Helsinki", TKU: "Turku", OL: "Oulu", KAJ: "Kajaani", JNS: "Joensuu"};


//function haedata() {
  //  nykyinenasema = document.getElementById("asema").value;


$.getJSON(baseurl + lahtoURL + saapumisURL
).done(function(data) {
    console.dir(data);

    for (var i = 0; i < data.length; i++) {
        console.log(data[i].trainNumber);
        train = data[i];
        var raw = $("<tr>").appendTo($('#table'));

        var lahtoasema = lahtoasemaHki();
        $("<td>").text(lahtoasema).appendTo(raw);
        var lahtohki = lahtoHelsingista();
        $("<td>").text(lahtohki).appendTo(raw);
        console.log(data[i].departureDate);
        var tuloasema = asemaOulu(train);
        $("<td>").text(tuloasema).appendTo(raw);

        console.log("lähes läpi");

    }

    function lahtoasemaHki() {
        var lahtoasemahki = data[i].timeTableRows[0].stationShortCode;
        return lahtoasemahki;
    }
    function lahtoHelsingista() {
        var aika1 = train.timeTableRows[0].scheduledTime;
        var aika2 = new Date(aika1);
        var lahtoaikaLokal = aika2.toLocaleString("fi", option);
        return lahtoaikaLokal;
    }


    function asemaOulu(train) {
        console.dir("alkup.testi");
        console.dir(train.departureDate);

        for (var t = 0; t < train.timeTableRows.length; ++t) {
            console.dir(train.timeTableRows.length);
            if (train.timeTableRows[t].stationShortCode === "OL") {
                console.dir(train.timeTableRows[t].stationShortCode);
                var aika5 = train.timeTableRows[t].scheduledTime;
                var aika6 = new Date(aika5);
                var lahtoaikaLokal = aika6.toLocaleString("fi", option);
                return lahtoaikaLokal;
            }

        }
    }


})

