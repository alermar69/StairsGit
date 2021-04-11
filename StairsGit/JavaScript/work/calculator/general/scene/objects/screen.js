class Screen extends AdditionalObject {
  constructor(par) {
    super(par);

    var screenPar = Object.assign({}, this.par);
    screenPar.dxfBasePoint = {x:lastDxfX, y:0}

    var mesh = Screen.draw(screenPar).mesh;
    this.add(mesh);
  }

  static draw(par){
    if(!par) par = {};
    initPar(par);
    
    //исправляем битые параметры
    var meta = this.getMeta();
    meta.inputs.forEach(function(item){
      if(item.key && par[item.key] == "undefined") {
        par[item.key] = item['default']
      }
    })

    par.mesh.add(drawScreen(par));
    
    return par;
  }
  
  /** STATIC **/
  static calcPrice(par){
    var meshPar = Object.assign({}, par.meshParams);
    
    
    return {
      name: this.getDescr(par).title,
      cost: 0,
      priceFactor: par.meshParams.priceFactor,
      costFactor: par.meshParams.costFactor
    }
  }

  static formChange(form, data){
  }

  static getMeta() {
    return {
      title: 'Экран на радиатор',
      inputs: [
        {
          "key": "fillingType",
          "title": "Вставка",
          "values": [
            {
              "value": "нет",
              "title": "нет"
            },
            {
              "value": "01",
              "title": "Тип 1"
            }
          ],
          "default": "01",
          "type": "select"
        },
        {
          "key": "width",
          "title": "Ширина",
          "default": 1000,
          "type": "number"
        },
        {
          "key": "height",
          "title": "Высота",
          "default": 1000,
          "type": "number"
        },
        {
          "key": "depth",
          "title": "Глубина",
          "default": 100,
          "type": "number"
        }
      ]
    }
  }
}

function drawScreen(par){
  var screenObj = new THREE.Object3D();
  var plankWidth = 60;
  var horPlankOffset = 40;
  // Боковая рейка
  var sidePlatePar = {
    len: par.height,
    width: plankWidth,
    thk: 20,
    partName: "screenPlate",
    material: params.materials.additionalObjectTimber
  }

  var horPlatePar = {
    len: par.width - plankWidth * 2,
    width: plankWidth,
    thk: 20,
    partName: "screenPlate",
    material: params.materials.additionalObjectTimber
  }

  var depthPlatePar = {
    len: par.height,
    width: par.depth - sidePlatePar.thk,
    thk: 20,
    partName: "screenPlate",
    material: params.materials.additionalObjectTimber
  }

  // Вертикальные рейки параллельные окну
  var sidePlate1 = drawPlate(sidePlatePar).mesh;
  sidePlate1.rotation.z = Math.PI / 2;
  sidePlate1.position.x = plankWidth;
  sidePlate1.position.z -= sidePlatePar.thk;
  screenObj.add(sidePlate1);
  
  var sidePlate2 = drawPlate(sidePlatePar).mesh;
  sidePlate2.rotation.z = Math.PI / 2;
  sidePlate2.position.x += par.width;
  sidePlate2.position.z -= sidePlatePar.thk;
  screenObj.add(sidePlate2);

  // Горизонтальные рейки
  var horPlate1 = drawPlate(horPlatePar).mesh;
  horPlate1.position.y += horPlankOffset;
  horPlate1.position.x = plankWidth;
  horPlate1.position.z -= sidePlatePar.thk;
  screenObj.add(horPlate1);
  
  var horPlate2 = drawPlate(horPlatePar).mesh;
  horPlate2.position.y += par.height - plankWidth - horPlankOffset;
  horPlate2.position.x = plankWidth;
  horPlate2.position.z -= sidePlatePar.thk;
  screenObj.add(horPlate2);


  // Рейки в сторону окна
  var depthPlate1 = drawPlate(depthPlatePar).mesh;
  depthPlate1.rotation.y = Math.PI / 2;
  depthPlate1.rotation.z = Math.PI / 2;
  // depthPlate1.position.x = -plankWidth;
  depthPlate1.position.z = -depthPlatePar.width - sidePlatePar.thk;
  console.log(sidePlatePar.thk, depthPlatePar.width)
  screenObj.add(depthPlate1);
  
  var depthPlate2 = drawPlate(depthPlatePar).mesh;
  depthPlate2.rotation.y = Math.PI / 2;
  depthPlate2.rotation.z = Math.PI / 2;
  depthPlate2.position.x += par.width - depthPlatePar.thk;
  depthPlate2.position.z -= depthPlatePar.width + sidePlatePar.thk;
  screenObj.add(depthPlate2);

  if (par.fillingType != 'нет') {

    var material = params.materials.additionalObjectTimber.clone();
    material.transparent = true;

    new THREE.TextureLoader().load("/calculator/general/scene/objects/files/screen/" + par.fillingType + ".png", function(map){
      map.repeat = {x: (1/100) * 1.3, y: (1/100) * 1.3};
      map.wrapS = THREE.RepeatWrapping;
      map.wrapT = THREE.RepeatWrapping;
      material.alphaMap = map;
      material.needsUpdate = true;
    });

    console.log(material)

    var fillingPar = {
      width: par.height - plankWidth * 2 - horPlankOffset * 2,
      len: par.width - plankWidth * 2,
      thk: 5,
      partName: "screenFilling",
      material: material
    }

    var fillingPlate = drawPlate(fillingPar).mesh;
    fillingPlate.position.y = plankWidth + horPlankOffset;
    fillingPlate.position.z = sidePlatePar.thk / 2 - sidePlatePar.thk;
    fillingPlate.position.x = plankWidth;

    screenObj.add(fillingPlate);
  }

  return screenObj;
}