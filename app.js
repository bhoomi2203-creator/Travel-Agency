// MAP
let map = L.map("map").setView([20.59, 78.96], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {}).addTo(map);

let userMarker;

// GEOLOCATION
document.getElementById("locBtn").onclick = () => {
  navigator.geolocation.getCurrentPosition(success, () => alert("Denied!"));
};

function success(pos){
  let lat = pos.coords.latitude;
  let lng = pos.coords.longitude;

  if(userMarker) map.removeLayer(userMarker);

  userMarker = L.marker([lat,lng]).addTo(map).bindPopup("You are here");
  document.getElementById("userLocation").innerText =
    `Lat: ${lat.toFixed(2)}, Lng:${lng.toFixed(2)}`;

  map.setView([lat,lng],13);
  getWeather(lat,lng);
}

// WEATHER API
async function getWeather(lat,lng){
  let api =
`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=YOUR_API_KEY_HERE&units=metric`;

  let res = await fetch(api);
  let d = await res.json();

  document.getElementById("weather").innerText =
    `${d.main.temp}°C | ${d.weather[0].description}`;
}

// TOURIST SPOTS DB
const spots=[
  {name:"Taj Mahal",lat:27.175,lng:78.042,type:"historical",img:"https://picsum.photos/200?1"},
  {name:"Manali Hills",lat:32.23,lng:77.19,type:"nature",img:"https://picsum.photos/200?2"},
  {name:"Goa Beach",lat:15.29,lng:73.91,type:"adventure",img:"https://picsum.photos/200?3"},
  {name:"Jaipur Market",lat:26.91,lng:75.79,type:"shopping",img:"https://picsum.photos/200?4"},
];

// RECOMMENDATION
document.getElementById("suggestBtn").onclick = () => {
  let interest=document.getElementById("interest").value;

  let result=spots.filter(s=>s.type===interest);

  let gallery=document.getElementById("galleryBox");
  gallery.innerHTML="";

  let list=document.getElementById("popularList");
  list.innerHTML="";

  result.forEach(p=>{
    L.marker([p.lat,p.lng]).addTo(map).bindPopup(p.name);

    let img=document.createElement("img");
    img.src=p.img;
    gallery.appendChild(img);

    let card=document.createElement("div");
    card.className="place";
    card.innerHTML=`<h4>${p.name}</h4> ⭐⭐⭐⭐☆`;
    list.appendChild(card);
  });

  fillItinerary(result);
  speak(`${result.length} destinations found`);
};

// ITINERARY
function fillItinerary(arr){
  let ul=document.getElementById("itineraryList");
  ul.innerHTML="";
  arr.forEach(p=>{
    let li=document.createElement("li");
    li.innerText=p.name;
    ul.appendChild(li);
  })
}

// SAVE TRIP
document.getElementById("saveTrip").onclick=()=>{
  localStorage.setItem("trip",document.getElementById("itineraryList").innerText);
  alert("Trip saved offline!");
};

// SPEECH
function speak(t){
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(t));
}
document.getElementById("voiceGuide").onclick=()=>{
  speak("Welcome to Smart Tourist Guide Website. Your travel assistant is ready.");
};

// RIPPLES ON CLICK
document.querySelectorAll("button").forEach(btn=>{
  btn.addEventListener("click", function(e){
    let circle=document.createElement("span");
    circle.classList.add("ripple");
    this.appendChild(circle);

    setTimeout(()=>circle.remove(),400);
  });
});
