//forkkaustesti

var baseurl= 'https://rata.digitraffic.fi/api/v1/live-trains/station/';
var train;
var opt = {hour: '2-digit',  minute: '2-digit', hour12: false};
var asemat = {HKI: "Helsinki", TKU: "Turku", OL: "Oulu", KAJ: "Kajaani", JNS: "Joensuu"};
var depStat;
var arrStat;
var depTime;
var arrTime;
var table;
var sorry;
var addToStorage = document.getElementById("search");

// Lähtöasemat ja päätepysäkit dropdowneihin:

var departureStations = document.getElementById("departure");
for (var shortcode in asemat) {
    var uusioption = document.createElement("option");
    uusioption.value = shortcode;
    uusioption.innerText = asemat[shortcode];
    departureStations.appendChild(uusioption);
}
var arrivalStations = document.getElementById("arrival");
for (var shortcode in asemat) {
    var uusioption2 = document.createElement("option");
    uusioption2.value = shortcode;
    uusioption2.innerText = asemat[shortcode];
    arrivalStations.appendChild(uusioption2);
}
document.getElementById('search').onclick = addToStorage; //tämä aloitti elämänsä pelkkänä localStorage -nappina, siksi nimi -PO

//Monitoimintainen hakunappi:

addToStorage.addEventListener('click', function () {
    getStations();
    start();
    localStorageStuff()
});

function getStations() {//muokattu 4.10
    depStat = document.getElementById("departure").value;
    arrStat = document.getElementById("arrival").value;
}

//Start()-funktio rakentaa asemien nimien avulla haettavan URL-osoitteen ja hakee datan. Se myös tarkistaa, jos joillekin reiteille ei ole junia.
function start() {
    $.getJSON(baseurl + depStat + "/" + arrStat
    ).done(function (data) {
        console.log(data);
        table = document.getElementById("table");
        sorry = document.getElementById("sorryNoTrains");
        //Alla mahdollisesti aiemmin luotu taulukko tyhjennetään
        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }
        document.getElementById("sorryNoTrains").innerText = "Hakutuloksesi";
        //Alla oleva koodinpätkä blokkaa pois ne reittivalinnat, joille ei löydy hakutuloksia. -pz
        if (data.code == "TRAIN_NOT_FOUND") {
            document.getElementById("sorryNoTrains").innerText = "Pahoittelut, mutta emme löytäneet suoria junia toivomallenne matkalle. Tee uusi haku.";
        } else {
            for (var i = 0; i < data.length; i++) {
                console.log(data[i].trainNumber);
                train = data[i];
                boxCheck();     //tsekkaa, onko yöjunien filtteri käytössä
            }
        }
    })
}

/*Boxcheck-funktio tsekkaa, etsitäänkö pelkkiä yöjunia
*/
function boxCheck() {
    if (document.getElementById("sleepBox").checked) {
        var selectedTrains = trainTypeFilter(train);
        if (selectedTrains == true) {
            console.dir(selectedTrains);
            var lahtoasema = depStat;
            var tuloasema = arrStat
            document.getElementById("sorryNoTrains").innerText = "Hakutuloksesi";
            makeTable(train);
        }
        if (selectedTrains == false) { //
        }
    } else {
        var lahtoasema = depStat;
        var tuloasema = arrStat;
        if (lahtoasema == tuloasema) {      //jos lähtö- ja määräasema ovat samat, tulostetaan seuraavaa:
            document.getElementById("sorryNoTrains").innerText = "Pahoittelut, emme löytäneet suoria junia toivomallenne matkalle. Tee uusi haku.";
        }
        if (lahtoasema !== tuloasema) {     //jos junia ei löytynyt, tuloste:
            document.getElementById("sorryNoTrains").innerText = "Hakutuloksesi";
            makeTable(train);
        }
    }
    //Alla oleva funktio rakentaa taulukon jQuery-kirjastoa käyttäen. -pz
    function makeTable(train) {
        var raw = $("<tr>").appendTo($('#table'));
        console.dir("testi");
        $("<td>").text(lahtoasema).appendTo(raw);
        var aika3 = lahtoAika();
        $("<td>").text(aika3).appendTo(raw);
        $("<td>").text(tuloasema).appendTo(raw);
        var aika4 = tuloAika(train);
        $("<td>").text(aika4).appendTo(raw);
        var maika = matkustusAika();
        $("<td>").text(maika).appendTo(raw);
    }
}
//Funktio filtteröi yhteisestä datasta tietyt junien numerot, jotka ovat makuuvaunullisia junia.
// Makuuvaunullisten junien numerot piti hakea käsin Vr:n sivuilta.
// Funktiota kutsutaan vain jos checkbox on valittu.
// Tämän jälkeen makuuvaunulliset junat listautuvat taulukkoon.-RT
function trainTypeFilter(train) {
    console.dir(train);
    if(train.trainNumber==265||train.trainNumber==263) {
        console.dir("toimiiko");
        return true;
    }
    return false;
}

//Seuraavat kaksi funktiota hakevat ajat, jona valitulta lähtöasemalta lähdetään ja jona valitulle asemalle saavutaan.
//Lisäksi funktiot lokalisoivat saadun ajan kooditiedoston alussa määriteltyjen opt-toiveiden mukaan.
function lahtoAika() {
    var aika1 = train.timeTableRows[0].scheduledTime;
    depTime = new Date(aika1);
    var lahtoaikaLokal = depTime.toLocaleString("fi", opt);
    return lahtoaikaLokal;
}
function tuloAika(train) {
    for (var t = 0; t < train.timeTableRows.length; ++t) {
        if (train.timeTableRows[t].stationShortCode === arrStat) {
            var aika5 = train.timeTableRows[t].scheduledTime;
            arrTime = new Date(aika5);
            var tuloaikaLokal = arrTime.toLocaleString("fi", opt);
            return tuloaikaLokal;
        }
    }
}
//Seuraava funktio muuttaa nanosekuntteina annetun matkustusajan tunneiksi ja minuuteiksi. -pz
function matkustusAika() {
    var timeNanoS = arrTime - depTime;
    var timeS = timeNanoS / 1000;
    var timeM = timeS / 60;
    var minutes = timeM % 60;
    var hours = (timeM - minutes) / 60;
    console.dir(minutes + "min");
    return hours + " h " + minutes + " min";
}

//Käyttäjä voi tyhjentää local storagen. Samalla tyhjennetään myös aiempien hakujen ul-lista sivulta ja näytetään viesti tapahtuneesta -PO

var clearStorage = document.getElementById("clearAll");
clearStorage.addEventListener('click', function () {
    localStorage.clear();
    document.getElementById("sMessage").innerHTML = "Hakuhistoria nollattu";

    var valilista = document.getElementById("lista");
    while (valilista.firstChild) {
        valilista.removeChild(valilista.firstChild);
    }
});

//Hakunapin local storage -ominaisuudet: junahaun lisäksi nappi tsekkaa, tukeeko selain web storagea ja näyttää viestin jos ei.
//Storageen tallennetaan hakujen määrä, näytetään sivulla se ja käyttäjän edellinen haku ja lisätään se aiempien hakujen bullet point -listaan.
// Näitä voi myöhemmin käyttää esim. niin, että käyttäjälle annetaan useimmiten haetut asemat valmiiksi dropdowneihin tms. (-PO)

function localStorageStuff() {
    if (typeof(Storage) !== "undefined") {
        if (localStorage.clickcount) {
            localStorage.clickcount = Number(localStorage.clickcount) + 1;
        } else {
            localStorage.clickcount = 1;
        }
        var prevSearch1 = document.getElementById('departure');
        localStorage.setItem("depStationH", prevSearch1.value);
        var prevSearch2 = document.getElementById('arrival');
        localStorage.setItem("destStationH", prevSearch2.value);
        var newLiElem = document.createElement("li");
        var tempstring=localStorage.getItem("depStationH") + " - " +localStorage.getItem("destStationH");
        console.log(tempstring);    //testaus
        var liText = document.createTextNode(tempstring);
        newLiElem.appendChild(liText);
        document.getElementById("lista").appendChild(newLiElem);
        document.getElementById("sMessage").innerHTML = "Edellinen hakusi: " + localStorage.getItem("depStationH") + " - " + localStorage.getItem("destStationH") +". " + "<br>Olet tehnyt yhteensä " + localStorage.clickcount + " hakua.";
    } else {
        document.getElementById("sMessage").innerHTML = "Selaimesi ei tue web storagea. Harmin paikka. :(";
    }
}m