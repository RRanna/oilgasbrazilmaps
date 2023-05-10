//inicializar com barra de progresso
function atualizarBarraDeProgresso() {
  let progresso = document.getElementById("progresso");
  let largura = 0;
  let intervalo = setInterval(function () {
    if (largura >= 100) {
      clearInterval(intervalo);
      document.getElementById("carregando-progresso").style.display = "none";
    } else {
      largura++;
      progresso.style.width = largura + "%";
    }
  }, 50);
}

window.addEventListener("load", function () {
  atualizarBarraDeProgresso();
});

//menu "barra lateral"
var veri = 1;
var trigger = document.getElementById('menu-trigger').addEventListener("click", function () {
  var menu = document.getElementById('menu-hidde');
  if (veri == 1) {
    menu.style.left = "0px";
    veri = 0;
  } else {
    menu.style.left = "-100%";
    veri = 1;
  }
});

//botões do menu "barra lateral"
const itens = [];
const setaMenu = [];

setaMenu[0] = document.getElementById("maiorque0");
setaMenu[1] = document.getElementById("maiorque1");
setaMenu[2] = document.getElementById("maiorque2");
setaMenu[3] = document.getElementById("maiorque3");

//setaMenu[2] = document.getElementById("maiorque3");

itens[0] = document.getElementById("item0");
itens[1] = document.getElementById("item1");
itens[2] = document.getElementById("item2");
itens[3] = document.getElementById("item3");

//itens[2] = document.getElementById("item3");

for (var i = 0; i < itens.length; i++) {
  //alert("teste " + i);
  openSubitens(itens[i], i);
  
};

var openSub = false;
function openSubitens(item, maiorque) {

  let subitens = item.querySelector(".subitens");
  
  item.addEventListener("click", () => {
    if (openSub == false) {
      setaMenu[maiorque].classList.add("rotate");
      subitens.style.display = "block";
      subitens.style.opacity = "1";
      subitens.style.transition = "opacity 1s ease-in-out";
      openSub = true;
    } else {
      openSub = false;
    }

  });

    //item.addEventListener("mouseout", () => {
    //  setaMenu[maiorque].classList.remove("rotate");
    //  subitens.style.opacity = "0";
    //  subitens.style.display = "none";
    //  openSubitens = false;
    //});
  
    subitens.addEventListener("mouseleave", () => {
      setaMenu[maiorque].classList.remove("rotate");
      subitens.style.opacity = "0";
      subitens.style.display = "none";
      openSubitens = false;
    });
};



// Exibir a tooltip próximo ao texto da ferramenta "Modo de seleção espacial"
var text = document.querySelector('.hover-text');
var tooltip = document.querySelector('.tooltip');
text.addEventListener('mouseover', function () {
  tooltip.style.display = 'block';
  tooltip.style.top = (text.offsetTop + text.offsetHeight + 10) + 'px';
  tooltip.style.left = text.offsetLeft + 'px';
});
text.addEventListener('mouseout', function () {
  tooltip.style.display = 'none';
});


//--------------------------------------------
//-------JANELA DE VISUALIZAÇÂO DO MAPA-------
//--------------------------------------------

var map = L.map('map').setView([-15.788497, -50.879873], 4);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18
}).addTo(map);
L.control.scale({ position: 'bottomright', metric: true }).addTo(map);


//responsividade do mapa

L.Map.TouchExtend = L.Handler.extend({
  addHooks: function () {
    L.DomEvent.on(this._map._container, 'touchstart', this._onTouchStart, this);
  },
  removeHooks: function () {
    L.DomEvent.off(this._map._container, 'touchstart', this._onTouchStart, this);
  },
  _onTouchStart: function (e) {
    if (!this._map._loaded) { return; }
    var type = 'touchstart', containerPoint = this._map.mouseEventToContainerPoint(e);

    if (e.touches.length === 1) {
      this._map._handleDOMEvent(e);
    }
  }
});

//----------------------------------------------------
//-----------FERRAMENTAS DE DESENHO DO MAPA-----------
//----------------------------------------------------

var drawnItems = L.featureGroup();
var wellsClusterGroup = L.markerClusterGroup();
drawnItems.addTo(map);
var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems,
    poly: {
      allowIntersection: false
    }
  },
  draw: {
    polygon: {
      allowIntersection: false,
      showArea: true,
      metric: true,
      drawError: {
        color: '#e1e100', // cor da linha de erro
        timeout: 1000 // tempo de exibição da mensagem de erro em milissegundos
      }
    },
    polyline: true,
    circle: true,
    marker: true,
    rectangle: {
      shapeOptions: {
        color: '#ff0000'
      },
      repeatMode: true
    }
  }
}).addTo(map);
//const overlays = {
//      'drawnItems': drawnItems;
//};

//criando o controle de layers
function addTitleToControl(control, title) {
  // Crie um elemento de título e defina o texto do título
  var titleElement = document.createElement('div');
  titleElement.className = 'leaflet-control-layers-title';
  titleElement.innerHTML = title;

  // Adicione o elemento de título ao controle
  control.getContainer().prepend(titleElement);
}

const layerControl = L.control.layers().addTo(map);
addTitleToControl(layerControl, 'Camadas do Mapa');
layerControl.addOverlay(drawnItems, '<input type="color" id="colorDrawings" style="height: 16px; width: 25px; margin-top: 4px;" value="#3388ff"></input> Desenhos (0)');
map.removeLayer(drawnItems);
let colorDrawings = document.getElementById('colorDrawings');
colorDrawings.addEventListener('change', function() {
   drawnItems.setAttribute("color",colorDrawings.value);
   
  });
//layerControl.addEventListener('change', function () {
//  var LayerColor = document.querySelector('.leaflet-control-layers-selector:last-child');
//  LayerColor.innerHTML = '<input type="color" id="color" value="#3388ff"></input>';
//})
//var LayerColor = document.querySelector('.leaflet-control-layers-selector:last-child');


//LayerColor.innerText = 'desenhos (0)';

//layerControl.addOverlay(wellsClusterGroup, 'Poços (0)');

//addTitleToControl(layerControl, 'Camadas do Mapa');

//----------------------------------------
//---------CHAMADA DE DADOS DA BASE-------
//----------------------------------------
//criando a array que vai pegar os nomes de cada layer do mapa
var newLayer = [];
//chamando a base de pocos em
//./utils/campos/pocos_coords.js
//  ./utils/campos/pocos_info.js

var pocosArray = [];
var haDadosReate;
var haGeoq;
//Visualizar os campos
for (var i = 0; i < pocos.length - 1; i++) {
  if (pocosInfo[i].link === '') {
    haDadosReate = "Não há dados geológicos ou geofísicos disponíveis no REATE para este poço."
  } else {
    haDadosReate = "<a href='https://reate.cprm.gov.br/arquivos/index.php/s/" + pocosInfo[i].link + "' target='_blank'>Acesse aqui os dados do REATE</a>";
  };
  if (pocosInfo[i].geoq === '') {
    haGeoq = "Não há dados geoquímicos disponíveis no REATE para este poço."
  } else {
    haGeoq = "<a href='https://reate.cprm.gov.br/arquivos/index.php/s/" + pocosInfo[i].geoq + "' target='_blank'>Acesse aqui os dados do REATE</a>";
  };
  pocos[i]
    //.bindPopup('Nome do poço: ' + pocosInfo[i].nome + '<br>Cadastro ANP: ' + pocosInfo[i].contrato + '<br> Operadora: ' + pocosInfo[i].operadora + '<br> Fluido Principal: ' + pocosInfo[i].fluido);
    .bindTooltip(pocosInfo[i].nome, {
      permanent: false,
      direction: "center",
    }).openTooltip();
  pocos[i]
    .bindPopup('Nome do campo: ' + pocosInfo[i].nome + '<br>Cadastro ANP: ' + pocosInfo[i].cad + '<br> Operadora: ' + pocosInfo[i].oper + '<br> Bacia: ' + pocosInfo[i].bac + '<br> Dados técnicos e operacionais (REATE): ' + haDadosReate + '<br> Dados geoquímicos (REATE): ' + haGeoq);
  pocosArray.push(pocos[i]);
};

const fixedPixelRadius = 10;
newLayer.push('pocos');
var pocosCluster = L.markerClusterGroup();
const pocosTudo = L.featureGroup(pocosArray);
pocosTudo.eachLayer(function (layer) {
  pocosCluster.addLayer(layer);
});
map.on('zoomend', () => {
  pocosCluster.eachLayer(circle => {
    circle.setRadius(fixedPixelRadius);
  });
});
layerControl.addOverlay(pocosCluster, '<div class="color-picker-wrapper"><input class="color-picker" type="color" id="colorPocos" value="#ff0033"; onchange="newColorPocos()"></input></div> Poços (' + pocos.length + ')');

function newColorPocos() {
  let newColor = document.getElementById("colorPocos");
  pocosCluster.eachLayer(circle =>{
    circle.setStyle({fillColor: newColor.value, fillOpacity: 0.9});
});
};

//============================
var blocosArray = [];

//Visualizar os campos
for (var i = 0; i < bloco.length - 1; i++) {

  bloco[i]
    //.bindPopup('Nome do campo: ' + camposInfo[i].nome + '<br>Contrato: ' + camposInfo[i].contrato + '<br> Operadora: ' + camposInfo[i].operadora + '<br> Fluido Principal: ' + camposInfo[i].fluido);
    .bindTooltip(blocosInfo[i].nome, {
      permanent: false,
      direction: "center",
    }).openTooltip();
  bloco[i]
    .bindPopup('Nome do campo: ' + blocosInfo[i].nome + '<br> Operadora: ' + blocosInfo[i].operador + '<br> Bacia: ' + blocosInfo[i].bacia + '<br>Contrato: ' + blocosInfo[i].contrato + '<br>Ambiente: ' + blocosInfo[i].ambiente + '<br>Rodada: ' + blocosInfo[i].rodada);

  blocosArray.push(bloco[i]);

};
newLayer.push('blocos');
const blocosTudo = L.featureGroup(blocosArray).addTo(map);
layerControl.addOverlay(blocosTudo, '<input type="color" id="colorBlocos" style="height: 16px; width: 25px; margin-top: 4px;" value="#febe1d" onchange="newColorBlocos()"></input> Blocos (' + blocosInfo.length + ')');

function newColorBlocos() {
  let newColor = document.getElementById("colorBlocos");
  blocosTudo.setStyle({
    color: newColor.value
});
};
map.removeLayer(blocosTudo);



//map.removeLayer(pocosCluster);
//chamando a base de campos em
//./utils/campos/campos_coords.js
//  ./utils/campos/campos_info.js

var camposArray = [];

//Visualizar os campos
for (var i = 0; i < campo.length - 1; i++) {

  campo[i]
    //.bindPopup('Nome do campo: ' + camposInfo[i].nome + '<br>Contrato: ' + camposInfo[i].contrato + '<br> Operadora: ' + camposInfo[i].operadora + '<br> Fluido Principal: ' + camposInfo[i].fluido);
    .bindTooltip(camposInfo[i].nome, {
      permanent: false,
      direction: "center",
    }).openTooltip();
  campo[i]
    .bindPopup('Nome do campo: ' + camposInfo[i].nome + '<br>Contrato: ' + camposInfo[i].contrato + '<br> Operadora: ' + camposInfo[i].operador + '<br> Fluido Principal: ' + camposInfo[i].fluido);

  camposArray.push(campo[i]);

};
newLayer.push('campos');
const camposTudo = L.featureGroup(camposArray).addTo(map);
layerControl.addOverlay(camposTudo, '<input type="color" id="colorCampos" style="height: 16px; width: 25px; margin-top: 4px;" value="#06b853" onchange="newColorCampos()"></input> Campos (452)');
function newColorCampos() {
  let newColor = document.getElementById("colorCampos");
  camposTudo.setStyle({
    color: newColor.value
});
};
map.removeLayer(camposTudo);
//document.querySelector('#camposTudo').setAttribute('disabled');
//chamando a base de bacias sedimentares em
//./utils/bacias/bacias_coords.js
//  ./utils/bacias/bacias_info.js
var baciasArray = [];

//Visualizar as bacias

for (var i = 0; i < bacia.length - 1; i++) {
  if (baciasInfo[i].link === '') {
    haDadosReate = "Não há dados disponíveis no REATE para esta bacia."
  } else {
    haDadosReate = "<a href='" + baciasInfo[i].link + "' target='_blank'>Acesse aqui os dados do REATE</a>";
  };
  bacia[i]

    .bindTooltip(baciasInfo[i].nome, {
      permanent: false,
      direction: "center",
    }).openTooltip();
  bacia[i]
    .bindPopup('Nome da bacia: ' + baciasInfo[i].nome + '<br>Ambiente: ' + baciasInfo[i].amb + '<br>Dados: ' + haDadosReate);

  baciasArray.push(bacia[i]);

};
newLayer.push('bacias');
const baciasTudo = L.featureGroup(baciasArray).addTo(map);
layerControl.addOverlay(baciasTudo, '<input type="color" id="colorBacias" style="height: 16px; width: 25px; margin-top: 4px;" value="#a87532" onchange="newColorBacias()"></input> Bacias (50)');
function newColorBacias() {
  let newColor = document.getElementById("colorBacias");
  baciasTudo.setStyle({
    color: newColor.value
});
};
//chamando a base do polígono do Pré-Sal em
//./utils/presal/presal_coords.js
//  ./utils/presal/presal_info.js
var presalArray = [];

//Visulaizar o polígono do Pré-Sal

presal[0]
  .bindTooltip(presalInfo[0].nome, {
    permanent: false,
    direction: "center",
  }).openTooltip();
presal[0]
  .bindPopup(presalInfo[0].nome);

presalArray.push(presal[0]);

newLayer.push('presal');
const presalTudo = L.featureGroup(presalArray).addTo(map);
layerControl.addOverlay(presalTudo, '<input type="color" id="colorPresal" style="height: 16px; width: 25px; margin-top: 4px;" value="#4fade8" onchange="newColorPresal()"></input> Polígono do Pré-Sal ');
function newColorPresal() {
  let newColor = document.getElementById("colorPresal");
  presalTudo.setStyle({
    color: newColor.value
});
};
//Declarando variáveis compartilhadas pelas ferramentas

var wells = [];
var layersResults = [];
let row;
let openedWindow = false;

//===============================================
//========CHAMADA DE CAMADAS ADICIONAIS==========
//===============================================

//essa função ativa os botões de chamada de dados mais pesados, como nmas símicas;
function InsertLayer(but) {
  //criar um elemento script para cahamr as bases de dados coords e info
  var scriptCoords = document.createElement("script");
  scriptCoords.src = './utils/sismica/' + but + '/sis' + but + '_coords.js';
  document.body.appendChild(scriptCoords);

  scriptCoords.addEventListener('load', function() {
    var scriptInfo = document.createElement("script");
    scriptInfo.src = './utils/sismica/' + but + '/sis' + but + '_info.js';
    document.body.appendChild(scriptInfo);
    
    scriptInfo.addEventListener('load', function() {
      setTimeout(function() {
        // Código a ser executado após 3 segundos
        ShowNewLayer(but);
      }, 1000);
      
    });
  }); 
  
};
 var sis2DPreArray = [];
 var sis2DPosArray = [];
 var sis3DPreArray = [];
 var sis3DPosArray = [];
 let sis2DPreLayers;
 let sis2DPosLayers;
 let sis3DPreLayers;
 let sis3DPosLayers;
//depois de adicionado o novo script, devemos chamas os dados para aaparecer no mapa
function ShowNewLayer(but) {
  var newLayerArray = [];
  //let newLayerCoords = [];
  //let newLayerInfo = [];
  newLayer.push(but);
  
  //Visualizar as sísmicas 3D Pré-Stack
  let butCoords = 'sis' + but;
  const newLayerCoords = window[butCoords];
  
  let butInfo = 'sis' + but + 'Info';
  let butArray = 'sis' + but + 'Array';
  let newLayerInfo = [];
  let newLayerLabel;
  if (but == "2DPre") {
    sis2DPreInfo.forEach((item) => {
      newLayerInfo.push(item);
    });
    newLayerLabel = "Sísmica 2D Pré-Stack";
  } else if (but == "2DPos") {
    sis2DPosInfo.forEach((item) => {
      newLayerInfo.push(item);
    });
    newLayerLabel = "Sísmica 2D Pós-Stack";

  } else if (but == "3DPre") {
    sis3DPreInfo.forEach((item) => {
      newLayerInfo.push(item);
    });
    newLayerLabel = "Sísmica 3D Pré-Stack";
  } else if (but == "3DPos") {
    sis3DPosInfo.forEach((item) => {
      newLayerInfo.push(item);
    });
    newLayerLabel = "Sísmica 3D Pós-Stack";
  };

  alert("o resultado deu " + newLayerInfo.length);

for (var i = 0; i < newLayerCoords.length - 1; i++) {
  
  newLayerCoords[i]
    .bindTooltip(newLayerInfo[i].nome, {
      permanent: false,
      direction: "center",
    }).openTooltip();
    newLayerCoords[i]
    .bindPopup(`Nome: ${newLayerInfo[i].nome}<br>Método: ${newLayerInfo[i].metodo}<br>Base: ${newLayerInfo[i].base}<br>Conclusão: ${newLayerInfo[i].conclusao}<br>EAD: ${newLayerInfo[i].ead}<br>Sigilo: ${newLayerInfo[i].sigilo}`);
    
    newLayerArray.push(newLayerCoords[i]);
    window[butArray] = newLayerArray;
};
var newLayerName = document.getElementById("InsertLayer" + but);
const newLayerTudo = L.featureGroup(newLayerArray).addTo(map);
layerControl.addOverlay(newLayerTudo, '<input type="color" id="color'+ but +'" style="height: 16px; width: 25px; margin-top: 4px;" value="#06b853" onchange="newColor'+ but +'()"></input> ' + newLayerLabel + ' (' + newLayerTudo.getLayers().length + ")");
if (but == '2DPre') {
  sis2DPreLayers = newLayerTudo;
} else if (but == '2DPos') {
  sis2DPosLayers = newLayerTudo;
} else if (but == '3DPre') {
  sis3DPreLayers = newLayerTudo;
} else if (but == '3DPos') {
  sis3DPosLayers = newLayerTudo;
};
//map.removeLayer(NewLayerTudo);
}

function newColor2DPre() {
  let newColor = document.getElementById("color2DPre");
  sis2DPreLayers.setStyle({
    color: newColor.value
});
};

function newColor2DPos() {
  let newColor = document.getElementById("color2DPos");
  sis2DPosLayers.setStyle({
    color: newColor.value
});
};
function newColor3DPre() {
  let newColor = document.getElementById("color3DPre");
  sis3DPreLayers.setStyle({
    color: newColor.value
});
};

function newColor3DPos() {
  let newColor = document.getElementById("color3DPos");
  sis3DPosLayers.setStyle({
    color: newColor.value
});
};
//----FUNCIONALIDADES FILTRO-----------
//layersCoords = arquivos coords JS
//layersInfo = arquivo Info JS


function LateralLateralFilter() {

  var layersCoords = [];
  var layersInfo = [];
  var layersArray = [];
  const layersType = document.getElementById("comboFeicao");
  const layersAttr = document.getElementById("comboColuna");
  const layersOpLogico = document.getElementById("comboOperLogico");
  const layersTextFilter = document.getElementById("textFilter");

  layersType.addEventListener("change", function () {
    const selectedOption = this.options[this.selectedIndex].value;
    if (selectedOption !== "") {
      layersAttr.disabled = false;
      //alert(selectedOption);
    } else {

      layersAttr.disabled = true;
    };
    // Do something with the selected option

  });

  layersAttr.addEventListener("change", function () {
    const selectedOption = this.options[this.selectedIndex].value;
    if (selectedOption !== "") {
      layersOpLogico.disabled = false;
      //alert(selectedOption);
    } else {

      layersOpLogico.disabled = true;
    };
    // Do something with the selected option

  });

  layersOpLogico.addEventListener("change", function () {
    const selectedOption = this.options[this.selectedIndex].value;
    if (selectedOption !== "") {
      layersTextFilter.disabled = false;
    } else {

      layersTextFilter.disabled = true;
    };
    // Do something with the selected option

  });


  var LayerAttrSel;
  var layersOpLogicoSel;

  if (layersType.options[layersType.selectedIndex].value == 1) {
    layersCoords = pocos;
    layersInfo = pocosInfo;
  } else if (layersType.options[layersType.selectedIndex].value == 2) {
    layersCoords = sis2DPre;
    layersInfo = sis2DPreInfo;
  } else if (layersType.options[layersType.selectedIndex].value == 3) {
    // layersCoords = sis2DPos;
    //  layersInfo = sis2DPosInfo;
  } else if (layersType.options[layersType.selectedIndex].value == 4) {
    layersCoords = sis3DPre;
    layersInfo = sis3DPreInfo;
  } else if (layersType.options[layersType.selectedIndex].value == 5) {
    layersCoords = sis3DPos;
    layersInfo = sis3DPosInfo;
  } else if (layersType.options[layersType.selectedIndex].value == 6) {
    layersCoords = bloco;
    layersInfo = blocosInfo;
  } else if (layersType.options[layersType.selectedIndex].value == 7) {
    layersCoords = campo;
    layersInfo = camposInfo;
  }
  
  var keys = Object.keys(layersInfo[0]);

  var propertyNames2 = "";

  let layerInfoKeys;
  var ordemStr;
  var contemStr;
  for (var i = 0; i < layersInfo.length; i++) {
    for (var j = 0; j < keys.length; j++) {
      layerInfoKeys = String(layersInfo[i][keys[j]]);
      if ([keys[j]] == "link") {
        if (layersInfo[i][keys[j]] != "") {
          propertyNames2 += String(keys[j]) + ": " + "<a href='https://reate.cprm.gov.br/arquivos/index.php/s/" + String(layersInfo[i][keys[j]]) + "' target='_blank'>Acesse aqui os dados do REATE</a>" + "<br>";
        } else {
          propertyNames2 += String(keys[j]) + ": " + "Não há dados do REATE para este poço."
        }
      } else {
        propertyNames2 += String(keys[j]) + ": " + String(layersInfo[i][keys[j]]) + "<br>";
      };
    };
    
    layersCoords[i]
      .bindTooltip(layersInfo[i].nome, {
        permanent: false,
        direction: "center",
      }).openTooltip();
    layersCoords[i]
      .bindPopup(propertyNames2);
      
    LayerAttrSel = layersAttr.options[layersAttr.selectedIndex].value;
    layersOpLogicoSel = layersOpLogico.options[layersOpLogico.selectedIndex].value
    propertyNames2 = "";
    //alert("teste");
    if (LayerAttrSel == 1) {
      ordemStr = String(String(layersInfo[i].nome).toLowerCase()).localeCompare(String(layersTextFilter.value).toLowerCase());
      contemStr = String(String(layersInfo[i].nome).toLowerCase()).indexOf(String(layersTextFilter.value).toLowerCase());
    } else if (LayerAttrSel == 2) {
      ordemStr = String(String(layersInfo[i].operador).toLowerCase()).localeCompare(String(layersTextFilter.value).toLowerCase());
      contemStr = String(String(layersInfo[i].operador).toLowerCase()).indexOf(String(layersTextFilter.value).toLowerCase());
    }
    else if (LayerAttrSel == 3) {
      ordemStr = String(String(layersInfo[i].bacia).toLowerCase()).localeCompare(String(layersTextFilter.value).toLowerCase());
      contemStr = String(String(layersInfo[i].bacia).toLowerCase()).indexOf(String(layersTextFilter.value).toLowerCase());
    }

    //for (var j = 0; j < layersCoords.length; j++) {
    if (layersOpLogicoSel == 1) {
      if (ordemStr == 0) {
        layersArray.push(layersCoords[i]);
      }
    } else if (layersOpLogicoSel == 2) {
      if (String(layersInfo[i].nome).toLowerCase() != String(layersTextFilter.value).toLowerCase()) {
        layersArray.push(layersCoords[i]);
      }
    } else if (layersOpLogicoSel == 3) {
      if (ordemStr == 1) {
        layersArray.push(layersCoords[i]);
      }
    } else if (layersOpLogicoSel == 4) {
      if (ordemStr == 1 || ordemStr == 0) {
        //alert( "testando " + String(String(layersInfo[i].bacia).toLowerCase()).localeCompare(String(layersTextFilter.value).toLowerCase()));
        layersArray.push(layersCoords[i]);
      }
    } else if (layersOpLogicoSel == 5) {

      if (ordemStr == -1) {
        layersArray.push(layersCoords[i]);
      }
    } else if (layersOpLogicoSel == 6) {
      if (ordemStr == -1 || ordemStr == 0) {
        layersArray.push(layersCoords[i]);
      }
    } else if (layersOpLogicoSel == 7) {
      if (contemStr != -1) {
        layersArray.push(layersCoords[i]);
      }
    }
    //};

  };


  //alert("layersArray.length: " + layersArray.length);

  if (layersType.value == 1) {
    var layersCluster = L.markerClusterGroup().addTo(map);
    const layersTudo = L.featureGroup(layersArray);

    layersTudo.eachLayer(function (layer) {
      layersCluster.addLayer(layer);
    });
    layerControl.addOverlay(layersCluster, 'filtro (' + layersTudo.getLayers().length + ')');
    alert (layersTudo.getLayers().length + " feições foram adicionadas ao seu mapa.")
  } else {
    const layersTudo = L.featureGroup(layersArray).addTo(map);
    layerControl.addOverlay(layersTudo, 'filtro (' + layersTudo.getLayers().length + ')');
    
    //map.removeLayer(layersTudo);
  };
  if (layersTudo.getLayers().length > 0) {
    var bounds = layersTudo.getBounds();
    map.fitBounds(bounds);
    alert (layersTudo.getLayers().length + " feições foram adicionadas ao seu mapa.");
  } else {
    alert ("Não foram encontradas feições para o filtro selecionado.");
  }
};


//-------------------------------------------
//------BOTÃO "LIMPAR SELEÇÃO"---------
//-------------------------------------------

//clearSelection.addEventListener('click', function () {
//  clearSelectedWells();
//});

function clearSelectedWells() {

  var tableResults2 = document.getElementById("tableResults2");

  var countRows = wellsClusterGroup.getLayers().length;

  for (let i = countRows; i > 0; i--) {

    if (tableResults2) {
      if (tableResults2.rows.length > 1) {
        tableResults2.deleteRow(i);
      };
    };
    layersResults.pop();
    wells.pop();
  };
  //map.removeLayer(wellsClusterGroup);
  wellsClusterGroup.clearLayers();
  let wellsClean = [];
  wellsClusterGroup.addLayers(wellsClean);
  wellsClusterGroup.addTo(map);
  layerControl.removeLayer(wellsClusterGroup);
  layerControl.addOverlay(wellsClusterGroup, `Poços (${wellsClusterGroup.getLayers().length})`);
};
//mostrando informações dos desenhos - ainda inoperante
var drawnShape = null;

map.on('draw:drawstart', function (e) {
  var type = e.layerType;
  var tooltipText = '';

  if (type === 'rectangle') {
    drawnShape = L.rectangle([e.latlng], {
      weight: 2,
      color: 'red',
      fillColor: 'red',
      fillOpacity: 0.5
    }).addTo(map);
    drawnShape.bindTooltip('Largura: 0 m<br>Comprimento: 0 m', { permanent: true, direction: 'center' });

  } else if (type === 'circle') {
    drawnShape = L.circle([e.latlng], {
      radius: 0,
      weight: 2,
      color: 'red',
      fillColor: 'red',
      fillOpacity: 0.5
    }).addTo(map);
    drawnShape.bindTooltip('Raio: 0 m', { permanent: true, direction: 'center' });

  } else if (type === 'polyline') {
    drawnShape = L.polyline([e.latlng], {
      weight: 2,
      color: 'red'
    }).addTo(map);

    drawnShape.bindTooltip('Comprimento: 0 m', { permanent: true, direction: 'center' });
  }

  map.on('mousemove', function (e) {
    if (drawnShape !== null) {
      var latLngs = drawnShape.getLatLngs();

      if (type === 'rectangle') {
        var bounds = L.latLngBounds(latLngs[0], e.latlng);
        var width = bounds.getWest() - bounds.getEast();
        var height = bounds.getNorth() - bounds.getSouth();

        drawnShape.setBounds(bounds);
        drawnShape.setTooltipContent('Largura: ' + Math.abs(width).toFixed(2) + ' m<br>Altura: ' + Math.abs(height).toFixed(2) + ' m');
      } else if (type === 'circle') {
        var radius = e.latlng.distanceTo(drawnShape.getLatLng());

        drawnShape.setRadius(radius);
        drawnShape.setTooltipContent('Raio: ' + radius.toFixed(2) + ' m');
      } else if (type === 'polyline') {
        var distance = 0;

        for (var i = 0; i < latLngs.length - 1; i++) {
          distance += latLngs[i].distanceTo(latLngs[i + 1]);
        };

        drawnShape.setLatLngs(latLngs.concat([e.latlng]));
        drawnShape.setTooltipContent('Comprimento: ' + distance.toFixed(2) + ' m');

      };
    };
  });
});
// quando deletar os desenhos, o valor volta a ser (0)
map.on('draw:deleted', function (e) {
  layerControl.removeLayer(drawnItems);
  layerControl.addOverlay(drawnItems, `desenhos (0)`);
});

//-------------------------------------------
//--------FERRAMENTA SELEÇÃO ESPACIAL--------
//-------------------------------------------
let countSelectedWells = 0;
let countSelectedWells2 = 0;
let CountlayersResults = 0;
let selectedWellsClusterGroup = [];
let selectedWellsClusterGroup2 = [];
let selectedWells = new L.markerClusterGroup();
let latLong;
let findVirgula;
map.on('draw:created', function (e) {
  var type = e.layerType;
  var layer = e.layer;
  drawnItems.addLayer(layer);

  if (type === 'polygon') {
    var area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]); // calculando a área do polígono em metros quadrados
    alert('Área do polígono desenhado: ' + Math.floor(area.toFixed(2) / 1000000) + ' km²');
  }

  // count the markers inside the drawn shape
  if (document.getElementById('select-mode').checked) {

    if (document.querySelector('.draggable-window') !== null) {
      document.querySelector('.draggable-window').remove();
    }
    var count = 0;
    CountlayersResults = 0;
    countSelectedWells = 0;
    selectedWellsClusterGroup = [];
    selectedWellsClusterGroup2 = [];
    let wellsClean = [];
    let selectedWells = new L.markerClusterGroup();
    wellsClusterGroup.eachLayer(function (marker) {

      if (layer.getBounds().contains(marker.getLatLng())) {

        CountlayersResults = 0;

        layersResults.forEach((item) => {

          let latLongString = item.coords.toString();
          let findVirgula = latLongString.indexOf(",");
          let latLong = "LatLng(" + latLongString.substring(0, findVirgula + 1) + " " + latLongString.substring(findVirgula + 1, latLongString.length) + ")";

          if (latLong === marker.getLatLng().toString()) {
            const markerInfo = [{ nome: item.nome, cad: item.cad, bac: item.bac, oper: item.oper, amb: item.amb, sig: item.sig, coords: item.coords },];


            selectedWellsClusterGroup.push(wells[CountlayersResults]);
            selectedWellsClusterGroup2.push(markerInfo[0]);

          };
          CountlayersResults++;
        });

        selectedWells.addLayer(marker);
        count++;
      };
      countSelectedWells++;
    });
    var countRows = wellsClusterGroup.getLayers().length;
    for (let i = countRows; i > 0; i--) {
      //tableResults.deleteRow(i);
      let tableResults2 = document.getElementById("tableResults2");
      if (tableResults2 !== null) {
        if (tableResults2.rows.length > 1) {
          tableResults2.deleteRow(i);
        };
      };
    };
    layersResults = wellsClean;
    wells = wellsClean;
    //alert(`wells antes: ${wells.length}<br>layersResults: ${layersResults.length}`);

    wells = selectedWellsClusterGroup;
    layersResults = selectedWellsClusterGroup2;

    // Exibe o diálogo de confirmação
    if (confirm(count + " poços selecionados na área. Deseja visualizar apenas estes dados no mapa?")) {
      wellsClusterGroup.clearLayers();


      wellsClusterGroup.addLayers(wellsClean);
      wellsClusterGroup.addTo(map);
      wellsClusterGroup.addLayers(selectedWells);
      wellsClusterGroup.addTo(map);
      layerControl.removeLayer(wellsClusterGroup);
      layerControl.addOverlay(wellsClusterGroup, `Poços (${selectedWells.getLayers().length})`);
      map.fitBounds(wellsClusterGroup.getBounds());
      openWindow(keysLayers, navPagesSelected);

      const table = document.getElementById("tableResults2");
      const rows = table.querySelectorAll("tr:not(:first-child)");
      rows.forEach(row => row.remove());

      openWindow(keysLayers, navPagesSelected);

    }
  }
  layerControl.removeLayer(drawnItems);
  layerControl.addOverlay(drawnItems, `desenhos (${drawnItems.getLayers().length})`);

}
);

//------------------------------------------------------
//---------BOTÃO "EXIBIR TABELA DE RESULTADOS"----------
//------------------------------------------------------

var changeLayer = false;
var columns = [];
var keysLayers = [];
var navPagesSelected = 1;
var styleDragLeft;
var styleDragTop;
function openWindow(keysLayers,navPagesSelected) {

  if (document.querySelector('.draggable-window') != null) {
    styleDragLeft = document.querySelector('.draggable-window').style.left;
    styleDragTop = document.querySelector('.draggable-window').style.top;
    document.querySelector('.draggable-window').remove();
  } else {
    styleDragLeft = "500px";
    styleDragTop = "725px";
  }
  openedWindow = true;
  // Create the draggable window
  const draggableWindow = document.createElement("div");
  draggableWindow.classList.add("draggable-window");

  // Create the close button for the window
  const closeButton = document.createElement("span");
  closeButton.classList.add("close-button");
  closeButton.innerHTML = "<b>Fechar X</b>";
  closeButton.onclick = () => {
    countLayers = 0;
    tdLayers = [];
    changeLayer = false;
    columns = [""];
    draggableWindow.parentNode.removeChild(draggableWindow);
    if (document.querySelector('.draggable-window') !== null) {
      document.querySelector('.draggable-window').remove();
    }
    openedWindow = false;
  };

  //create register filters
  // JavaScript para criar o elemento combobox
  const TabelaTitulo = document.createElement("p");
  //TabelaTitulo.style.padding = "2px";
  TabelaTitulo.style.textAlign = "center";
  TabelaTitulo.style.marginTop = "0px";

  TabelaTitulo.style.backgroundColor = "#398ed8";
  TabelaTitulo.id = "TabelaTitulo";
  TabelaTitulo.innerHTML = "<b>Tabela de dados<b>"

  const feicoesTabela = document.createElement("select");
  feicoesTabela.style.padding = "5px";
  feicoesTabela.id = "feicoesTabela";

  const select1 = document.createElement("select");
  select1.id = "select1";
  select1.style.padding = "5px";

  const select2 = document.createElement("select");
  select2.id = "select2";
  select2.style.padding = "5px";
  select2.disabled = true;

  const textFilterModal = document.createElement("text");
  textFilterModal.id = "textFilterModal";
  textFilterModal.style.padding = "5px";
  textFilterModal.disabled = true;
  //textFilterModal.ariaPlaceholder = "digite um valor";
  
  // Criando os elementos HTML
  
  var navPages = document.createElement("nav");
  //navPages.style.alignContent = "center";
  navPages.setAttribute("aria-label", "Page navigation example");
  
  navPages.style.margin = "auto";
  var ulPages = document.createElement("ul");
  ulPages.classList.add("pagination", "justify-content-start");

  var aPages = [];
  var liPages = [];
  // Criando o elemento "Previous"
  liPages[0] = document.createElement("li");
  liPages[0].classList.add("page-item", "disabled");

  aPages[0] = document.createElement("a");
  aPages[0].classList.add("page-link");
  aPages[0].innerText = "Anterior";

  liPages[0].appendChild(aPages[0]);
  ulPages.appendChild(liPages[0]);

  // Criando os elementos de página

  for (var i = 1; i <= 16; i++) {
    liPages[i] = document.createElement("li");
    liPages[i].classList.add("page-item");

    aPages[i] = document.createElement("a");

    aPages[i].classList.add("page-link");
    aPages[i].setAttribute("href", "#");
    aPages[i].innerText = i;

    liPages[i].appendChild(aPages[i]);
    ulPages.appendChild(liPages[i]);
  }
  
  var liElements = ulPages.querySelectorAll("li");
  var aElements = ulPages.querySelectorAll("a");
  //alert(liElements.length);
  // Adicionando o evento de clique a cada elemento li

  // Criando o elemento "Next"
  liPages[liElements.length] = document.createElement("li");
  liPages[liElements.length].classList.add("page-item");

  aPages[liElements.length] = document.createElement("a");
  aPages[liElements.length].classList.add("page-link");
  aPages[liElements.length].setAttribute("href", "#");
  aPages[liElements.length].innerText = "Próximo";

  liPages[liElements.length].appendChild(aPages[liElements.length]);
  ulPages.appendChild(liPages[liElements.length]);

  navPages.appendChild(ulPages);
  
  for (var i = 0; i <= liElements.length; i++) {
    //alert(i); 
    if (i == 0) {
      liPages[i].addEventListener("click", () => {if (navPagesSelected > 1) {
        navPagesSelected -= 1;
        liPages[navPagesSelected].style.fillColor = "#068cbd"
        //alert (navPagesSelected);
        openWindow(keysLayers, navPagesSelected);
        //alert ("navPagesSelected é " + navPagesSelected);
      }});
      } else if (i > 0  && i < liElements.length) {

        liElements[i].addEventListener("click", function() {
        var aElements = this.querySelectorAll("a");
        // Obtendo o valor de innerText do elemento a correspondente
        navPagesSelected = parseInt(aElements[0].innerText);
        liPages[navPagesSelected].style.fillColor = "#068cbd"
        openWindow(keysLayers, navPagesSelected);
        // Exibindo um alerta com o valor de innerText
        //alert("navPagesSelected é " + navPagesSelected);
      });
      } else if (i === liElements.length) {
        
        liPages[i].addEventListener("click", () => {if (navPagesSelected < liElements.length - 1) {
          navPagesSelected += 1;
          liPages[navPagesSelected].style.fillColor = "#068cbd"
          openWindow(keysLayers, navPagesSelected);
          //alert ("navPagesSelected é " + navPagesSelected);
        }});
      };
  }

  var buttonCSV = document.createElement("button");

  // Definindo o texto do botão
  buttonCSV.innerText = "Exportar resultados (Tabela CSV)";
  
  // Adicionando um evento de clique ao botão
  buttonCSV.addEventListener("click", function() {
    exportToCsv(keysLayers, navPagesSelected);
  });
 
// Adicionando cada elemento HTML como filho do contêiner
  const table = createTable(navPagesSelected);
  draggableWindow.appendChild(TabelaTitulo);
  draggableWindow.appendChild(closeButton);
  draggableWindow.appendChild(feicoesTabela);
  draggableWindow.appendChild(select1);
  draggableWindow.appendChild(select2);
  //draggableWindow.innerHTML ="<br>";
  //draggableWindow.appendChild(textFilterModal);
  draggableWindow.appendChild(buttonCSV);
  draggableWindow.appendChild(navPages);
  draggableWindow.appendChild(table);

  draggableWindow.style.left = styleDragLeft;
  draggableWindow.style.top = styleDragTop;
  document.body.appendChild(draggableWindow);

  var pageLinks = draggableWindow.querySelectorAll(".page-link");

  // Adicionando o evento de clique a cada botão
  for (var i = 0; i < pageLinks.length; i++) {
    pageLinks[i].addEventListener("click", function() {
      // Removendo a classe "active" de todos os botões
      for (var j = 0; j < pageLinks.length; j++) {
        pageLinks[j].classList.remove("active");
      }
      
      // Adicionando a classe "active" ao botão clicado
      this.classList.add("active");
    });
  }

  // Variables for drag and drop functionality
  let isDragging = false;
  let mouseX = 0;
  let mouseY = 0;
  let windowX = 0;
  let windowY = 0;

  // Add event listeners for drag and drop functionality
  TabelaTitulo.addEventListener("mousedown", (event) => {
    isDragging = true;
    mouseX = event.clientX;
    mouseY = event.clientY;
    windowX = draggableWindow.offsetLeft;
    windowY = draggableWindow.offsetTop;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  document.addEventListener("mousemove", (event) => {
    if (isDragging) {
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      draggableWindow.style.left = windowX + deltaX + "px";
      draggableWindow.style.top = windowY + deltaY + "px";
    }
  });
  let column;
  //navPagesSelected = 1;
  // Function to create the table
  function createTable(navPagesSelected) {
    var defOptFeicoesTabela;
    //definindo a opção Default para a combobox FeicoesTabela
    defOptFeicoesTabela = document.createElement("option");
    defOptFeicoesTabela.value = 0;
    defOptFeicoesTabela.text = "Selecione a feição";
    defOptFeicoesTabela.selected = true;
    feicoesTabela.appendChild(defOptFeicoesTabela);
    var countFeicoes = 1;
    const spanElements = document.querySelectorAll('.leaflet-control-layers-overlays label span');

    spanElements.forEach((spanElement) => {
      defOptFeicoesTabela = document.createElement("option");
      defOptFeicoesTabela.value = countFeicoes;
      defOptFeicoesTabela.text = spanElement.textContent;
      defOptFeicoesTabela.selected = false;
      feicoesTabela.appendChild(defOptFeicoesTabela);
      countFeicoes++
    });
    if (changeLayer == false) {
      columns = [""];
      
    }

     feicoesTabela.addEventListener("change", function () {
      navPagesSelected = 1;
      changeLayer = true;
      columns = ['id'];

      const table = document.getElementById("tableResults2");
      const rows = table.querySelectorAll("th, td");
      //const rows = table.querySelectorAll("tr:not(:first-child)");
      rows.forEach(row => row.remove());
      var itemExtenso = [];
      var itemIndex = -1;
      const selectedOptionFeicao = this.options[this.selectedIndex].text;
      if (selectedOptionFeicao.includes("Poços") == true) {
        alert('Preparando para exibir dados.<br> Por favor, aguarde até o carregamento total.');
        layersInfo = pocosInfo;
        layersResults = pocosArray;
        keysLayers = Object.keys(pocosInfo[0]);
        keysLayers.forEach((item) => {
          itemIndex += 1;
          if (item == "nome") {
            itemExtenso[itemIndex] = "Nome";
          } else if (item == "bac") {
            itemExtenso[itemIndex] = "Bacia";
          } else if (item == "cad") {
            itemExtenso[itemIndex] = "Cadastro";
          } else if (item == "bacia") {
            itemExtenso[itemIndex] = "Bacia";
          } else if (item == "operador") {
            itemExtenso[itemIndex] = "Operadora";
          } else if (item == "oper") {
            itemExtenso[itemIndex] = "Operadora";
          } else if (item == "prof") {
            itemExtenso[itemIndex] = "Profundidade (m)";
          } else if (item == "link") {
            itemExtenso[itemIndex] = "Link REATE";
          } else if (item == "coords") {
            itemExtenso[itemIndex] = "Coordenadas";
          } else if (item == "sig") {
            itemExtenso[itemIndex] = "Sigilo";
          } else if (item == "process") {
            itemExtenso[itemIndex] = "Processamento";
          } else if (item == "termino") {
            itemExtenso[itemIndex] = "Conclusão";
          } else if (item == "ead") {
            itemExtenso[itemIndex] = "EAD";
          } else if (item == "contrato") {
            itemExtenso[itemIndex] = "Contrato";
          } else if (item == "ambiente") {
            itemExtenso[itemIndex] = "Ambiente";
          } else if (item == "rodada") {
            itemExtenso[itemIndex] = "certame";
          } else if (item == "metodo") {
            itemExtenso[itemIndex] = "Método de Aquisição";
          } else if (item == "base") {
            itemExtenso[itemIndex] = "Bases Legais";
          } else {
            itemExtenso[itemIndex] = item;
          }
          columns.push(itemExtenso[itemIndex]);
          //alert(columns[0]);
        });
        itemExtenso = [];
        itemIndex = -1;
      }  else if (selectedOptionFeicao.includes("Sísmica 2D Pré") == true) {
        alert("exibindo dados de campos de produção.<br> Por favor aguarde até o carregamento dos dados");
        layersInfo =  sis2DPreInfo;
        layersResults = sis2DPreArray;
        keysLayers = Object.keys(sis2DPreInfo[0]);
        keysLayers.forEach((item) => {
          columns.push(item);
        });

      } else if (selectedOptionFeicao.includes("Blocos") == true) {
        alert("exibindo dados de blocos exploratórios.<br> Por favor aguarde até o carregamento dos dados");
        layersInfo = blocosInfo;
        layersResults = blocosArray;
        keysLayers = Object.keys(blocosInfo[0]);
        keysLayers.forEach((item) => {
          columns.push(item);
        });

      } else if (selectedOptionFeicao.includes("Campos") == true) {
        alert("exibindo dados de campos de produção.<br> Por favor aguarde até o carregamento dos dados");
        layersInfo = camposInfo;
        layersResults = camposArray;
        keysLayers = Object.keys(camposInfo[0]);
        keysLayers.forEach((item) => {
          columns.push(item);
        });

      } else if (selectedOptionFeicao.includes("Sísmica 3D Pré") == true) {
        alert("exibindo dados de campos de produção.<br> Por favor aguarde até o carregamento dos dados");
        layersInfo =  sis3DPreInfo;
        layersResults = sis3DPreArray;
        keysLayers = Object.keys(sis3DPreInfo[0]);
        keysLayers.forEach((item) => {
          columns.push(item);
        });

      } else if (selectedOptionFeicao.includes("Sísmica 3D Pós") == true) {
        alert("exibindo dados de campos de produção.<br> Por favor aguarde até o carregamento dos dados");
        layersInfo = sis3DPosInfo;
        layersResults = sis3DPosArray;
        keysLayers = Object.keys(sis3DPosInfo[0]);
        keysLayers.forEach((item) => {
          columns.push(item);
        });

      };
      //return keysLayers;
      openWindow(keysLayers, navPagesSelected);
    });

    const defaultOption1 = document.createElement("option");
    defaultOption1.value = "";
    defaultOption1.text = "Selecione uma coluna";
    defaultOption1.selected = true;
    select1.appendChild(defaultOption1);

    const defaultOption2 = document.createElement("option");
    defaultOption2.value = "";
    defaultOption2.text = "Selecione um operador";
    defaultOption2.selected = true;
    select2.appendChild(defaultOption2);

    const table = document.createElement("table");
    table.setAttribute("id", "tableResults2");
    table.style.cursor = "text";
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    const trHead = document.createElement("tr");

    columns.forEach((column) => {
      const th = document.createElement("th");
      th.innerText = column;
      th.addEventListener("click", () => sortTable(table, column));
      trHead.appendChild(th);
      const option = document.createElement("option");
      option.value = column;
      option.text = column;
      option.style.paddingTop = '5 px';
      select1.appendChild(option);
    });

    thead.appendChild(trHead);

    select1.addEventListener("change", function () {
      const selectedOption = this.options[this.selectedIndex].value;
      if (selectedOption !== "") {
        select2.disabled = false;
        //alert(selectedOption);
      } else {

        select2.disabled = true;
      };
      // Do something with the selected option

    });

    //chamando a array wellResults, definida nos botões 'filtrar por operadora' e 'filtrar por bacia'
    var countLayers = 0;
    var tdLayers = [];

    if (columns[0] != "") {

      layersResults.forEach((item) => {
        countLayers += 1;
        const tr = document.createElement("tr");
        var primeiroReg = navPagesSelected*2000-2000;
        var ultimoReg = navPagesSelected*2000;
        //alert ("gora o valor de navPagesSelected é " + navPagesSelected);
        if (countLayers >= primeiroReg && countLayers < ultimoReg) {
        for (let i = 0; i < columns.length; i++) {
          tdLayers[i] = document.createElement("td");
          //};
          tdLayers[0].innerText = String(countLayers);

          //for (let i = 1; i < columns.length; i++) {

          tdLayers[i].innerText = String(layersInfo[countLayers - 1][keysLayers[i - 1]]);
          if ([keysLayers[i - 1]] == 'link') {
            if ([keysLayers[i - 1]] != '') {
              tdLayers[i].innerHTML = "<a href='https://reate.cprm.gov.br/arquivos/index.php/s/" + String(layersInfo[countLayers - 1][keysLayers[i - 1]]) + "' target='_blank'>Acesse aqui os dados do REATE</a>" + "<br>";
            } else {
              tdLayers[i].innerHTML = "Não há dados do REATE para esta feição."
            };
          };
          //};

          //for (let i = 0; i < columns.length; i++) {
          const tdLayer = tdLayers[i];
          tr.appendChild(tdLayer);
        };
        
         if (layersResults === pocosArray) {
          
          tr.setAttribute("ondblclick", "map.flyTo([" + layersInfo[countLayers - 1].coords + "], 13); L.popup({className: 'custom-popup'}) .setLatLng([" + layersInfo[countLayers - 1].coords + "]) .setContent('Nome do Poço: " + layersInfo[countLayers - 1].nome + "') .openOn(map);");
        } else {
          tr.setAttribute("ondblclick", "var bounds = [[" + item.getBounds().getSouthWest().lat + ", " + item.getBounds().getSouthWest().lng + "], [" + item.getBounds().getNorthEast().lat + ", " + item.getBounds().getNorthEast().lng + "]]; map.flyToBounds(bounds, { animate: true, duration: 1.5});");
        };

        tbody.appendChild(tr);

        };
      });
    };
    table.appendChild(thead);
    table.appendChild(tbody);
  
    //retirando valores duplicados da tabela
    const columnIndex = 1; // A coluna que você deseja verificar a duplicidade (Idade)
    const uniqueValues = {};

    for (let i = 1; i < table.rows.length; i++) {
      const row = table.rows[i];
      const cellValue = row.cells[columnIndex].textContent;

      if (uniqueValues[cellValue]) {
        table.deleteRow(i);
        i--; // Decrementa o índice para ajustar a remoção da linha
      } else {
        uniqueValues[cellValue] = true;
      }
    }
    //renumerando o index da tabela (coluna o)
    for (let i = 1; i < table.rows.length; i++) {
      table.rows[i].cells[0].innerText = i;
    }
    return table;
  };

  var rows = table.getElementsByTagName("tr");

};
//----------------------------------------------------------------
// ---FUNÇÃO REORDENAR TABELA POR ORDEM ALFABÉTICA - INOPERANTE---
//----------------------------------------------------------------
//table.setAttribute("class","sortable");
//Esta função é chamada no cabeçalho da tabela de resultados.
//Ao clicar em uma das células do cabeçalho, os dados são reordenados em ordem crescente.
//OBS: Ainda não está funcionando corretamente.    

function sortTable(table, column) {
  var indexOfRows;
  for (let i = 1; i < table.rows[0].cells.length; i++) {
    if (column === table.rows[0].cells[i].textContent) {
      indexOfRows = i;
    };
  };

  var swithText = [];

  for (let i = 1; i < table.rows[0].cells.length; i++) {
    for (let j = 1; j < table.rows[0].cells.length; j++) {
      if (table.rows[j].cells[indexOfRows].textContent <= table.rows[i].cells[indexOfRows].textContent) {
        swithText = table.rows[j];
        table.rows[j] = table.rows[i];
        table.rows[i] = swithText;
      };
    };
  };
};



//-------------------------------------------------------
//-----Botão "Exportar resultados para Tabela *.CSV"-----
//-------------------------------------------------------

function exportToCsv() {
  //openWindow(keysLayers, navPagesSelected);
  let table = document.getElementById("tableResults2");

  let csvContent = '';
  //let row = "ID,Poço,Cadastro ANP,Operadora,Bacia,Ambiente,Sigilo,Latitude,Longitude";
  csvContent += row + '\r\n';
  for (let i = 0; i < table.rows.length; i++) {
    //layersResults.forEach((item) => {

    let row = table.rows[i].cells[0].innerText + "," + table.rows[i].cells[1].innerText + "," + table.rows[i].cells[2].innerText + "," + table.rows[i].cells[3].innerText + "," + table.rows[i].cells[4].innerText + "," + table.rows[i].cells[5].innerText + "," + table.rows[i].cells[6].innerText + "," + table.rows[i].cells[7].innerText;
    csvContent += row + '\r\n';
  };

  const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });

  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.setAttribute('href', url);
  downloadLink.setAttribute('download', 'dados.csv');
  document.body.appendChild(downloadLink);
  downloadLink.click();
}

