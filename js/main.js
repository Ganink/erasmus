var lat, lng;
var data_ = [];
var features = [];

var jMaps = [];
var map;
var marcadores = [];

window.onload = function () {
    data_ = data;
    myMap();
}

function myMap() {
    var mapProperties = {
        center: new google.maps.LatLng(46.7960227, 10.7006355),
        zoom: 4,
    };
    map = new google.maps.Map(document.getElementById("map"), mapProperties);
}

function generar() {
    var content = document.getElementById("contenido");
    var ventana = document.getElementById("ventana");
    content.innerHTML = "";
    var type = document.getElementById("selectTipoMovilidad");
    var radio = document.querySelector("input[name='radio']:checked");

    if (radio.value == "ciclo") {
        var ar = [];
        var tipobusqueda = type.value;

        data.forEach(element => {
            if (element.tipo == tipobusqueda) {
                ar.push(element);
            }
        });

        var ciclos = [];

        ar.forEach(element => {
            if (ciclos.indexOf(element.ciclo) == -1) {
                ciclos.push(element.ciclo);
            }
        });

        var id = 0;
        var titulo = document.createElement("p");
        titulo.innerHTML = '<h2 class="title is-active">BUSQUEDA POR CICLOS</b>';

        content.appendChild(titulo);

        ciclos.forEach(element => {

            var cbx = document.createElement('input');
            cbx.type = "checkbox";
            cbx.name = "ciclos";
            cbx.value = element;
            cbx.id = "checkbox_" + id;

            var label = document.createElement('label')
            label.htmlFor = "checkbox_" + id;
            label.appendChild(document.createTextNode(element));

            content.appendChild(cbx);
            content.appendChild(label);

            id++;
        });
    }
    if (radio.value == "pais") {
        var ar = [];
        var tipobusqueda = type.value;

        data.forEach(element => {
            if (element.tipo == tipobusqueda) {
                ar.push(element);
            }
        });

        var paises = [];

        ar.forEach(element => {
            if (paises.indexOf(element.pais) == -1) {
                paises.push(element.pais);
            }
        });

        var div = document.createElement("div");
        div.className = "";

        var label = document.createElement("label");
        label.for = "selectPais";
        label.innerText = "Paises";
        label.appendChild(document.createElement("br"));

        var select = document.createElement("select");
        select.className = "btn btn-primary btn-lg btn-block";
        select.id = "selectPais";

        label.appendChild(select);
        div.appendChild(label);
        content.appendChild(div);

        paises.forEach(element => {
            var option = document.createElement('option');
            option.value = element;
            option.innerText = element;
            document.getElementById("selectPais").appendChild(option);
        });
    }

    content.appendChild(document.createElement("br"));
    var button = document.createElement("button");
    button.className = "btn btn-success btn-lg btn-block";
    button.innerText = "Buscar";
    button.addEventListener("click", buscar, false);
    content.appendChild(button);
}

function buscar() {


    marcadores.forEach(element => {
        element.setMap(null);
    });

    var tipo = document.getElementById("selectTipoMovilidad");
    var radio = document.querySelector("input[name='radio']:checked");

    if (radio.value == "ciclo") {
        var ciclosInput = document.querySelectorAll("input[name='ciclos']:checked")
        var ciclos = [];

        ciclosInput.forEach(element => {
            ciclos.push(element.value);
        });

        var array = [];

        data.forEach(element => {
            ciclos.forEach(ciclo => {
                if (element.ciclo == ciclo) {
                    array.push(element);
                }
            });
        });


        jsonMaps = array;
    } else {
        var paisSeleccionado = document.getElementById("selectPais")
        var ciclos = [];

        data.forEach(element => {
            if (element.tipo == tipo.value) {
                ciclos.push(element);
            }
        });

        var array = [];

        ciclos.forEach(element => {
            if (element.pais == paisSeleccionado.value) {
                array.push(element);
            }
        });
        jsonMaps = array;
    }
    console.log(jsonMaps);

    jsonMaps.forEach(element => {
        var geocoder = new google.maps.Geocoder();
        var query = element.ciudad + ", " + element.pais;
        var lat = null;
        var lng = null;


        geocoder.geocode({
            'address': query
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng()),
                    animation: google.maps.Animation.BOUNCE,
                });

                marcadores.push(marker);

                var infowindow = new google.maps.InfoWindow({
                    content: element.ciclo
                });

                marker.addListener('click', function () {
                    infowindow.open(map, marker);
                });
                marker.setMap(map);
            } else {

            }
        });


    });
}

function clean() {
    var content = document.getElementById("contenido");
    content.innerHTML = "";
    var radio = document.querySelectorAll("input[name='radio']");
    radio.forEach(element => {
        element.checked = false;
    });
}