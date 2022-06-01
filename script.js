const container = document.querySelector(".container"),
inputPart = container.querySelector(".input-part"),
inforText = inputPart.querySelector(".infor-text"),
input = inputPart.querySelector("input"),
Button = inputPart.querySelector("button"),
imgWeather = document.querySelector(".weather-part img"),
backIcon = container.querySelector("header i"),
myMap = document.querySelector(".myMap");

let apiURL;

//su dung event keyup
input.addEventListener("keyup" , function(e){
    if(e.key == "Enter" && input.value != ""){
        // console.log(input.value);
        requestApi(input.value);
    }
});

Button.addEventListener("click" , function(){
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
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    
    apiURL =`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=fcc585f794381902eb10d17f3dec53b7`;
    fetchApi();
}

function getMap(lat, lon){
    map = new Microsoft.Maps.Map(myMap, {
        credentials: 'Your Bing Maps Key',
        mapTypeId: Microsoft.Maps.MapTypeId.road,
        center: new Microsoft.Maps.Location(lat, lon),
        zoom: 8
    });
    infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
        visible: true
    });
    infobox.setMap(map);
}

function requestApi(city){
    // console.log(city);
    apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=fcc585f794381902eb10d17f3dec53b7`;
    fetchApi();
}

function fetchApi(){//hàm lấy dữ data từ link api  openweather -> sang -> mảng object qua phuong thuc fetch
    myMap.classList.add('active');
    inforText.innerText = "Getting weather details...";
    inforText.classList.add("pending");
    fetch(apiURL)
        .then(function(response)
        {
           return response.json();
        })
        .then(function(result){
            return weatherDetails(result);
        })
        .catch(function(){
        inforText.innerText = "Something went wrong";
        inforText.classList.replace("pending", "error");
    });
}

function weatherDetails(information){
    inforText.classList.replace("pending","error");
    if(information.cod == "404"){ //neu dữ lieu truyen vào input text ko co trong data lấy tu api (loi)  
        inforText.innerText = `${input.value} ins't not found`;
    }
    else{
        console.log(information);
        const city = information.name;
        const country = information.sys.country;
        const description = information.weather[0].description;
        const id = information.weather[0].id;
        const feels_like = information.main.feels_like;
        const humidity = information.main.humidity;
        const temp = information.main.temp;
        const lat = information.coord.lat;
        const lon = information.coord.lon;


        getMap(lat, lon);
        
        //// sử dụng icon thời tiết tùy theo id mà api cung cấp cho chúng ta
        if(id == 800){
            imgWeather.src = "./icons/clear.gif";
        }else if(id >= 200 && id <= 232){
            imgWeather.src = "./icons/storm.gif";
        }else if((id >= 300 && id <= 321) || (id >= 500 && id <= 531)){
            imgWeather.src = "./icons/rain.gif";
        }else if(id >= 600 && id <= 622){
            imgWeather.src = "./icons/snow.gif";
        }else if(id >= 701 && id <= 781){
            imgWeather.src = "./icons/haze.gif";
        }else if(id >= 801 && id <= 804){
            imgWeather.src = "./icons/cloud.gif";
        }

        container.querySelector(".temp .numb").innerText = temp;
        container.querySelector(".weather").innerText = description;
        container.querySelector(".location span").innerText = `${city},${country}`;
        container.querySelector(".temp .numb-2").innerText = feels_like;
        container.querySelector(".humidity span").innerText = `${humidity}%`;
        // set background thay doi theo city
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?"+city+"')";

        inforText.classList.remove("pending","error");
        inforText.innerText = "";
        input.value = "";
        container.classList.add("active");
    }
}

backIcon.addEventListener("click", function(){
    container.classList.remove("active");
    document.querySelector('.myMap').classList.remove('active');
})


