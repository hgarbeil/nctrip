const tableEl = document.querySelector (".content-table") ;
const mainEl = document.querySelector(".main");
var map = L.map('mapid').setView([35.921, -81], 8);
var hikeFlag = true ;
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var homeIcon = L.icon({
    iconUrl: 'home.png'
}) ;

var marker = L.marker([35.91, -79.06],{icon: homeIcon}) ;
marker.bindPopup("<b>Durham</b><br>Housesit").openPopup();
marker.addTo(map);









function loadActivities() {
    mainEl.innerHTML = `<div class="topdiv">
    <h1>Activities and Hikes</h1>
    <!-- <div class="mapimg"> -->
    <div id="mapid" class="mapdiv"></div>`;
    const mybutton = document.createElement("button") ;
    mybutton.textContent = "heelloo" ;
    mainEl.appendChild (mybutton);
    console.log("in load activities") ;
    
    var mytables = document.querySelectorAll('.content-table') ;
    var mytables_arr = [...mytables] ;
    console.log("HRLLO"+mytables);
    mytables_arr.forEach(table=>{
        console.log("helllo" + table);
    });
    
}

function highlightRow (num){
    
    for (var i=1; i<tableEl.rows.length; i++){
        tableEl.rows[i].classList.remove ('active') ;
    }

    tableEl.rows[num+1].classList.add ('active') ;
    
}

function clickedMarker (num) {
    // console.log(myhikes[num]);
}

myhikes.forEach (arr=>console.log(arr)) ;