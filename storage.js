
//Starts a counter of user's searches, saves date into local storage and displaus message

    document.getElementById('search').onclick = clickCounter;

    function clickCounter() {
        if (typeof(Storage) !== "undefined") {
            if (localStorage.clickcount) {
                localStorage.clickcount = Number(localStorage.clickcount) + 1;
            } else {
                localStorage.clickcount = 1;
            }
            document.getElementById("storageMessage").innerHTML = "You've made " + localStorage.clickcount + " searches in total.";
        } else {
            document.getElementById("storageMessage").innerHTML = "Browser does not support web storage, boo hiss. :(";
        }
    }

    /*
//Clear web storage data - first attempt. Sometimes works, sometimes not.

    document.getElementById("clearAll").onclick = clearSearchHistory;

    function clearSearchHistory() {
        localStorage.clear();
        document.getElementById("storageMessage").innerHTML = "History cleared"
    }
*/


// Take search items and add them into a list

var form = document.querySelector('form');
var ul = document.querySelector('ul');
var button = document.querySelector('button');
var input = document.getElementById('item');


/*
Below is a ternary operator for checking whether local storage has data. Same thing here:
var items;

if (localStorage.getItem('items')) {
  items = JSON.parse(localStorage.getItem('items'));
} else {
  items = [];
}
 */

var itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];


//setting up the localStorage key as 'items', data as the itemsArray list

localStorage.setItem('items', JSON.stringify(itemsArray));
var data = JSON.parse(localStorage.getItem('items'));

var addToList = (text) => {
    var li = document.createElement('li');
    li.textContent = text;
    ul.appendChild(li);
}

/*Then add an event handler for the search and push new data into the list. Default form submit is disabled
because we're not submitting to a server.
Stringify is used, because the items are in a list (object) and local storage only eats strings.
*/

form.addEventListener('submit', function (e) {
    e.preventDefault();

    itemsArray.push(input.value);
    localStorage.setItem('items', JSON.stringify(itemsArray));
    addToList(input.value);
    input.value = "";
});

data.forEach(item => {
    addToList(item);
});

/*
Button to delete locally stored data and clean up the search history. Displays an appropriate message.
 */

var clearStorage = document.getElementById("clearAll");
clearStorage.addEventListener('click', function () {
    localStorage.clear();
    document.getElementById("storageMessage").innerHTML = "History cleared"
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
});