const dateEl = document.querySelector('.cur-date') ;
const timeEl = document.querySelector('.cur-time') ;
const selectEl = document.querySelector('.select-city') ;
const currentweatherEl = document.querySelector('.current-weather');
const toggleButtonEl = document.querySelector('.toggle-button');
const navbarLinksEl = document.querySelector ('.navbar-links') ;

const mainEl = document.querySelector('.main') ;
const apikey = '12e8d9bf6c162d5b2d92bb4fd02f440d' ;
const daysArr = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'] ;
const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];  
var townArr =[] ;
var townLat = 35. ;
var townLon = -79 ;
var map ;
var myhikes=[] ;
var myactivities=[] ;
var activeFlag  ;


Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}




activeFlag = localStorage.getItem ("navactive") ;
console.log(activeFlag);
if (activeFlag==true){
    console.log("in localStorage") ;
    navbarLinksEl.classList.add('active');
}
for (let classy of navbarLinksEl.classList){
    console.log(classy) ;
}
toggleButtonEl.addEventListener('click',()=>{
// function hamburger(){  
    
    classList = navbarLinksEl.classList ;
    // console.log("hello"+) ;
    if (navbarLinksEl.classList.contains('active')){
        navbarLinksEl.classList.remove ('active');
        console.log("in the function: removed") ;
        localStorage.setItem("navactive", false);
    }
    else {
        navbarLinksEl.classList.add('active');
        console.log("in the function: added") ;
        localStorage.setItem("navactive", true);
    }
    console.log(navbarLinksEl.classList.contains('active'));    
});


setInterval(()=>{


    const time = new Date() ;
    const month = time.getMonth() ;
    const year = time.getFullYear() ;
    const date = time.getDate() ;
    const day = time.getDay() ;
    const hour = time.getHours() ;
    const hour12 = hour >=13 ? hour%12 : hour ;
    const minutes = time.getMinutes() ;
    const ampm = hour >= 12 ? 'PM' : 'AM' ;

    dateEl.innerHTML = daysArr[day]+' '+monthArr[month]+' '+date+', '+year ;
    timeEl.innerHTML = hour12 + ':' + minutes.padLeft() +`<span id='am-pm'>${ampm}</span>` ;
},20000);

$ajaxUtils.sendGetRequest('data/towns.csv',function(responseText){
    var lines = responseText.split("\n") ;
    ;
    
    for (var i=0; i<lines.length-1; i++ ){
        var cells = lines[i].split(",") ;
        var selEl = document.createElement("option") ;
        mytown = {
            "name": cells[0],
            "lat" : cells[1],
            "lon" : cells[2],
        } ;
        selEl.value = i ;
        selEl.text = cells[0] ;
        selectEl.appendChild(selEl) ;
        townArr.push(mytown) ;
        if (i==0){
            townLat = cells[1]*1. ;
            townLon = cells[2]*1. ;
            updateWeather (townLat, townLon) ;
        }
    }
    var count=0 ;
    townArr.forEach(arr => {
        
    }) ;
}, false) ;  





var updateWeather = function getWeather (latitude, longitude){
// var loc = navigator.geolocation.getCurrentPosition((success)=>{
//     let {latitude,longitude} = success.coords ;
    // console.log ("0  "+latitude+" "+longitude)
    // latitude = 42.4501 ;
    // longitude = -73.2454 ;
    latitude = latitude * 1. ;
    longitude = longitude * 1. ;
    // console.log (latitude+ "  "+ longitude )
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude=hourly,minutely&appid=${apikey}`)
    .then(res =>res.json()).then (data=> {
        // console.log(data) ;
            showWeatherData(data) ;
            
        }) 
    //console.log (wdata) ;
};

function showWeatherData(data){ 
    // extract current conditions from data.current
    let {humidity, pressure, sunrise, sunset, wind_speed, temp} = data.current ;
    // const sunrise_convert = window.moment((sunrise-data.timezone_offset)*1000).format('HH:MM a') ;
    // const dt = new Date((sunrise+data.timezone_offset+43200)*1000);
    // const day = dt.toLocaleDateString() ;
    // const hr = dt.getHours() ;
    // const minute =dt.getMinutes() ;
    // console.log (day+"  ??? Hrs:Min "+hr+":"+minute) ;


    // const sunset_convert = window.moment.utc(sunset,'X').add(data.timezone,'seconds').format('HH:MM a') ;
    const sunrise_convert = getHHMM(sunrise, data.timezone_offset) ;
    const sunset_convert = getHHMM(sunset, data.timezone_offset) ;
    const iconName = "http://openweathermap.org/img/w/" +data.current.weather[0].icon+".png" ;
    const curdesc = "Currently: "+data.current.weather[0].description;
        // console.log("icon is " + iconName) ;
    

    
    currentweatherEl.innerHTML =
    `<div class="weather-item">
    <img src=${iconName}  class="weather-icon" alt='Icon depicting current weather.'>
    <div class="weather-desc">${curdesc}</div>
    </div>
    <div class="weather-item">
    <div>Temp</div>
    <div>${temp} &#176;F</div>
    </div>
    <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure} MBars</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed} MPH</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        
        <div>${sunrise_convert}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${sunset_convert}</div>
    </div>`

}


function newcity () {
    let index = selectEl.value ;
    // console.log ("index is "+index);
    // console.log ("town arr lat is "+townArr[index].lat);
    townLat= townArr[index].lat ;
    townLon = townArr[index].lon ;
    updateWeather (townLat, townLon) ;

}

function getHHMM(time, tzoff) {
    const dt = new Date(time*1000);
    const hr = dt.getHours() ;
    const minute =dt.getMinutes() ;
    outstring= hr+":"+minute.padLeft() ;
    return outstring ;

}

updateWeather (townLat, townLon) ;

function loadMap (){
    map = L.map('mapid').setView([35.921, -81], 8);
    var hikeFlag = true ;
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    // return map() ;
}

function loadHikes () {

    
    mainEl.innerHTML = `<div class="topdiv">
    <h1>Activities and Hikes</h1>
    <!-- <div class="mapimg"> -->
    <div id="mapid" class="mapdiv"></div>`;
    loadMap () ;
    var tableEl = document.createElement('table') ;
    tableEl.classList.add ('content-table') ;
    var theadEl = document.createElement("thead");
    var tbodyEl = document.createElement("tbody");
    mainEl.appendChild (tableEl) ;
    tableEl.appendChild (theadEl) ;
        var markerOptions = {
            title: "1",
            clickable : true ,
            draggable: false ,
    
        };
    
    

$ajaxUtils.sendGetRequest ('data/hike.csv', function(responseText){
    
    var lines = responseText.split('\n');
    const firstline = lines.shift () ;
    // console.log[lines];
    var heads = firstline.split(",");
    var myTr = document.createElement ("tr") ;
    myTr.classList.add ('tr-head') ;
    for (var i=0; i<heads.length; i++) {
        var myTh = document.createElement ("th") ;
        if (i==1 || i==4 || i==5){
            myTh.classList.add("priority-low") ;
        }
        myTh.innerHTML = heads[i] ;
        myTr.appendChild (myTh) ;
    }
    theadEl.appendChild (myTr) ;
    
    // console.log("number of hikes is "+lines.length);
    
    //for (var iline =0; iline<lines.length-1; iline++){
    for (var iline =0; iline<lines.length-1; iline++){
        myTr = document.createElement ("tr") ;
        var cells = lines[iline].split(",") ;
        // console.log(cells[0]);
        // create object and add to myhikes
        let hike={
            "id" : iline ,
            "name" : cells[0] ,
            "latitude" : cells[8],
            "longitude" : cells[9] ,

        }
        // console.log(iline + "  " + hike.name+ "  "+cells[8]) ;
        markerOptions.title = iline ;
        var marker = L.marker([cells[8],cells[9]],markerOptions)
        marker.bindPopup("<b>"+cells[0]+"</b>").openPopup();
        marker.addTo(map) ;
        
        marker.on ("click",function(event){
            clickedMarker (event.target.options.title);
            
            highlightRow (event.target.options.title) ;
        }); 
        myhikes.push (hike) ;
        

        for (i=0; i<8; i++) {
            // console.log(heads[i]);
            var myTd = document.createElement ("td") ;
            if (i==1 || i==4 || i==5){
                myTd.classList.add("priority-low") ;
            }
            if (i==6){
                // console.log(cells[i]);
                var link = '<a target="_blank" href='+cells[i]+'>Website</a>' ;
                myTd.innerHTML = link ;
            }
            else if (i==7){
                var link = '<a target="_blank" href='+cells[i]+'>Map</a>' ;
                myTd.innerHTML = link ;
            }
            else {
                myTd.innerHTML = cells[i] ;
            }
            myTr.appendChild (myTd) ;

        }
        tbodyEl.appendChild (myTr) ;

    }
    tableEl.appendChild(tbodyEl) ;
//    myhikes = lines ;


    
    
    
},false);

}

function loadActivities() {

    
    mainEl.innerHTML = `<div class="topdiv">
    <h1>Selected Activities</h1>
    <!-- <div class="mapimg"> -->
    <div id="mapid" class="mapdiv"></div>`;
    loadMap () ;
    var tableEl = document.createElement('table') ;
    tableEl.classList.add ('content-table') ;
    var theadEl = document.createElement("thead");
    var tbodyEl = document.createElement("tbody");
    mainEl.appendChild (tableEl) ;
    tableEl.appendChild (theadEl) ;
    
    var markerOptions = {
        title: "1",            
        clickable : true ,
        draggable: false ,
    
    };

    $ajaxUtils.sendGetRequest ('data/activities.csv', function(responseText){
    
        var lines = responseText.split('\n');
        const firstline = lines.shift () ;
        // console.log[lines];
        var heads = firstline.split(",");
        var myTr = document.createElement ("tr") ;
        myTr.classList.add ('tr-head') ;
        for (var i=0; i<4; i++) {
            var myTh = document.createElement ("th") ;
            myTh.innerHTML = heads[i] ;
            myTr.appendChild (myTh) ;
        }
        theadEl.appendChild (myTr) ;
        
        // console.log("number of hikes is "+lines.length);
        
        //for (var iline =0; iline<lines.length-1; iline++){
        for (var iline =0; iline<lines.length-1; iline++){
            myTr = document.createElement ("tr") ;
            var cells = lines[iline].split(",") ;
            // console.log(cells[0]);
            // create object and add to myhikes
            let acts={
                "id" : iline ,
                "name" : cells[0] ,
                "latitude" : cells[4],
                "longitude" : cells[5] ,
    
            }
            // console.log(iline + "  " + hike.name+ "  "+cells[8]) ;
            markerOptions.title = iline ;
            var marker = L.marker([cells[4],cells[5]],markerOptions);
            marker.bindPopup("<b>"+cells[0]+"</b>").openPopup();
            marker.addTo(map) ;
            
            marker.on ("click",function(event){
                clickedMarker (event.target.options.title);
                
                highlightRow (event.target.options.title) ;
            }); 
            myactivities.push (acts) ;
            
    
            for (i=0; i<4; i++) {
                // console.log(heads[i]);
                var myTd = document.createElement ("td") ;
                if (i==3){
                    // console.log(cells[i]);
                    var link = '<a target="_blank" href='+cells[i]+'>Website</a>' ;
                    myTd.innerHTML = link ;
                }
                /*
                else if (i==7){
                    var link = '<a target="_blank" href='+cells[i]+'>Map</a>' ;
                    myTd.innerHTML = link ;
                }
                */
                else {
                    myTd.innerHTML = cells[i] ;
                }
                myTr.appendChild (myTd) ;
    
            }
            tbodyEl.appendChild (myTr) ;
    
        }
        tableEl.appendChild(tbodyEl) ;
    //    myhikes = lines ;
    
    
        
        
        
    },false);

} ;

function highlightRow (num){
    tableEl = document.querySelector (".content-table" ) ;
    for (var i=1; i<tableEl.rows.length; i++){
        tableEl.rows[i].classList.remove ('active') ;
    }

    tableEl.rows[num+1].classList.add ('active') ;
    
}

function clickedMarker (num) {
    // console.log(myhikes[num]);
}
