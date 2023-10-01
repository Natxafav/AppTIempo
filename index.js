            import apikey from "./config";

            const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
            const searchBox = document.querySelector(".search input");
            const searchBtn = document.querySelector(".search button");           
            const apiUrl_1 ="http://api.openweathermap.org/data/2.5/forecast?units=metric&q=";      
                   

            //Función para obtener los siguientes cuatro días.
            function day(dato) {

                 // Mapear las abreviaturas de los días en inglés a los nombres en español
                const diasSemanaIngles = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                const diasSemanaEspañol = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
                //Separamos los datos, nos interesa el día de la semana
                // "Sun Oct 01 2023 00:12:35 GMT+0100 (hora de verano de Europa occidental)"  
                const diaRecibido = dato.split(" ");
                // Obtener el índice del día de la semana a partir de la abreviatura en inglés
                const indiceDiaIngles = diasSemanaIngles.indexOf(diaRecibido[0]);

                if (indiceDiaIngles !== -1) {
                    //almacenamos los párrafos p1 de los div
                    const divs = document.querySelectorAll('div .p1');
                    for (let i = 0; i < divs.length; i++) {
                        //recorremos para obtener los siguientes 4 días
                        const nombreDia = diasSemanaEspañol[(indiceDiaIngles + i + 1) % 7]; 
                        //asignamos el texto a cada div
                        divs[i].textContent = nombreDia;                        
                    }
                } else {
                    console.error("Abreviatura de día de la semana no válida");
                }
            };   

            //Funcion para cambiar iconos
            function iconos(tiempo, clase){
                const pathimages ="./img/";
                const weatherIcon= document.querySelector(clase);
                const card = document.querySelector(".card");
                //asignamos la imagen según la variable por parámetro    
                switch (tiempo) {
                    case "Clouds":
                        weatherIcon.src = `${pathimages}nubes.png`;
                        break;
                    case "Clear":                                      
                        weatherIcon.src = `${pathimages}sol.png`;
                        break;
                    case "Rain":                        
                        weatherIcon.src = `${pathimages}lluvia.png`;
                        break;
                    case "Drizzle":
                        weatherIcon.src = `${pathimages}llovizna.png`;
                        break;
                    default:
                        console.warn("Descripción de clima no reconocida:", tiempo);
                        break;
            }

            }        
        
        async function checkWeather(city){
            //Consultamos la Api
            const response = await fetch(apiUrl + city + `&appid=${apikey}`);
            //Almacenamos la respuesta
            var data = await response.json();
            //Asignamos los datos según las clases
            document.querySelector(".city").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp)+"°C";
            document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";
            document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
            //Llamamos a la función de los iconos y le pasamos los datos obtenidos en el json
            iconos(data.weather[0].main, ".weather-icon");
            
        }

        async function weatherDays (city){
            //Consultamos la Api
            const response = await fetch(apiUrl_1 + city + `&appid=${apikey}`);
            //Almacenamos la respuesta
            var data_1 = await response.json();
            //Almacenamos la fecha
            const fecha = Date(data_1.list[7].dt_txt);            
            //Llamamos a la función para obtener los 4 días de la semana siguientes
            day(fecha);  
            //almacenamos todos los p2 
            const divs = document.querySelectorAll('div .p2');
            for (let i = 0; i < divs.length; i++) {
                //cada 8 posiciones del json es un día diferente
                const dataIdx = i *8; 
                //almacenamos la descripción del tiempo                
                const weatherMain = data_1.list[dataIdx].weather[0].main;
                //almacenamos el dato de temperatura
                const weatherTemp = Math.round(data_1.list[dataIdx].main.temp)+"°C";
                //asignamos la temperatura a cada div .p2
                divs[i].textContent = weatherTemp;
                //asignamos el icono al llamar a la función
                iconos(weatherMain, `.icono_${i+1 }`);
                                   
                }      
         }
         function myFunctions(){
            checkWeather(searchBox.value);
            weatherDays(searchBox.value);
         }
         searchBox.addEventListener("keydown", (event)=> {
          
            if(event.key ==="Enter"){
                event.preventDefault();
                if(!searchBox.value){
                    return alert(" Introduzca una ciudad");
                } else {
                   myFunctions();
                }


            }
               
        });