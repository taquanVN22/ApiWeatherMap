const container = document.querySelector(".container"),
inputPart = container.querySelector(".input-part"),
inforText = inputPart.querySelector(".infor-text"),
input = inputPart.querySelector("input"),
Button = inputPart.querySelector("button"),
icon = document.querySelector(".weather-part img"),
backIcon = container.querySelector("header i"),
myMap = document.querySelector(".myMap");

let api;

input.addEventListener("keyup" , e =>{
    if(e.key == "Enter" && input.value != ""){
        // console.log(input.value);
        requestApi(input.value);
    }
});

Button.addEventListener("click" , () => {
    if(navigator.geolocation){
       navigator.geolocation.getCurrentPosition(onSuccess,onError) 
    }
    else
    {
        alert("Your browser not support geolocation api");
    }
});

function onError(error){
    // console.log(error);
    inforText.innerText = error.message;
    inforText.classList.add("error");
}

function onSuccess(position){
    // console.log(position);
    const {latitude,longitude} = position.coords;
    api =`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=fcc585f794381902eb10d17f3dec53b7`;
    fetchApi();
}

function getMap(lat, lon){
    map = new Microsoft.Maps.Map(myMap, {
        credentials: 'Your Bing Maps Key',
        mapTypeId: Microsoft.Maps.MapTypeId.aerial,
        center: new Microsoft.Maps.Location(lat, lon),
        zoom: 10
    });
    infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
        visible: true
    });
    infobox.setMap(map);
}

function requestApi(city){
    // console.log(city);
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=fcc585f794381902eb10d17f3dec53b7`;
    fetchApi();
}

function fetchApi(){
    myMap.classList.add('active');
    inforText.innerText = "Getting weather details...";
    inforText.classList.add("pending");
    fetch(api)
        .then(response => response.json())
        .then(result => weatherDetails(result));
}

function weatherDetails(information){
    inforText.classList.replace("pending","error");
    if(information.cod == "404"){
        inforText.innerText = `${input.value} ins't not found`;
    }
    else{
        const city = information.name;
        const country = information.sys.country;
        const {description, id} = information.weather[0];
        const {feels_like, humidity, temp} = information.main;
        const {lat, lon} = information.coord;

        getMap(lat, lon);
        
        //// sử dụng icon thời tiết tùy theo id mà api cung cấp cho chúng ta
        if(id == 800){
            icon.src = "./icons/clear.gif";
        }else if(id >= 200 && id <= 232){
            icon.src = "./icons/storm.gif";
        }else if((id >= 300 && id <= 321) || (id >= 500 && id <= 531)){
            icon.src = "./icons/rain.gif";
        }else if(id >= 600 && id <= 622){
            icon.src = "./icons/snow.gif";
        }else if(id >= 701 && id <= 781){
            icon.src = "./icons/haze.gif";
        }else if(id >= 801 && id <= 804){
            icon.src = "./icons/cloud.gif";
        }

        container.querySelector(".temp .numb").innerText = temp;
        container.querySelector(".weather").innerText = description;
        container.querySelector(".location span").innerText = `${city},${country}`;
        container.querySelector(".temp .numb-2").innerText = Math.floor(temp);
        container.querySelector(".humidity span").innerText = `${humidity}%`;
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?"+city+"')";

        inforText.classList.remove("pending","error");
        container.classList.add("active");
        console.log(information);
    }
    console.log(information);
}

backIcon.addEventListener("click", () => {
    container.classList.remove("active");
    document.querySelector('.myMap').classList.remove('active');
})

