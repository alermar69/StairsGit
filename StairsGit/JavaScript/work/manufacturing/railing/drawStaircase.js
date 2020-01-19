//создаем глобальные массивы

var railing = [];
var dxfPrimitivesArr0 = [];
  
	var stringerThickness = 8;
	var treadThickness = 40;
	var stringerWidth = 150; 
	var riserThickness = 20;

drawStaircase = function (viewportId, isVisible) {

/*удаляем предыдущую лестницу*/
	if (railing) removeObjects(viewportId, 'railing');

//очищаем глобальные массивы
	railing = [];

	dxfPrimitivesArr = [];
	var dxfBasePoint = {x:0, y:0}
	
//очищаем глобальный массив параметров деталей
	railingParams = {
		glass: [],
		handrails: [],
		sideHolderAmt: 0,
		glassHolderAmt: 0,
		};
		
	holeMooveParams = [];
	
	//обнуляем счетчики спецификации
	partsAmt = {};
	partsAmt_bal = {};
	specObj = partsAmt; //задаем объект, куда будут сохраняться данные для спецификации
	poleList = {};
	
/*задаем материалы*/
	
	var timberMaterial = new THREE.MeshLambertMaterial({color: params.timberColor, overdraw: 0.5});
	var metalMaterial = new THREE.MeshLambertMaterial({color: params.metalColor, wireframe: false});
	var metalMaterial2 = new THREE.MeshLambertMaterial({color: 0xA3A3A3, wireframe: false});
	var glassMaterial = new THREE.MeshLambertMaterial({opacity:0.6, color: 0x3AE2CE, transparent:true});
	

	var turnFactor = 1;
	if(params.turnSide == "левое") turnFactor = -1;
	

dxfBasePoint = {x:0, y:-4000}
		
//перебираем все смещения рутелей
	var rutelMooveAmt = $("#rutelMooveAmt").val();	
	for(var i=0; i<rutelMooveAmt; i++){
		var holeMoove = {
			sectID: $(".sectID").eq(i).val() * 1.0,
			glassId: $(".glassId").eq(i).val() * 1.0,
			holeId: $(".holeId").eq(i).val() * 1.0,
			mooveX: $(".mooveX").eq(i).val() * 1.0,
			mooveY: $(".mooveY").eq(i).val() * 1.0,
			}
		holeMooveParams.push(holeMoove)
		}

//перебираем все секции ограждения
	var railingSectAmt = $("#railingSectAmt").val();	
	for(var i=1; i<=railingSectAmt; i++){
		//для каждой секции формируем массив параметров
		var sectParams = {
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: dxfBasePoint,
			holeMooveParams: holeMooveParams,
			sectID: i,
			railingParams: railingParams,
		};
		$("#railingParamsTable tr").eq(i).find('td input,select,textarea').each(function(){
			var inputId = $(this).attr("id");
			var propName = inputId.match(/^([^0-9]+)[0-9]+$/)[1]; //отсекаем индекс
			sectParams[propName] = $(this).val();
		});
		sectParams = drawRailingSection(sectParams);
		//console.log(sectParams)
		var glassSection = sectParams.mesh;
		glassSection.position.x = sectParams.railingPosX;
		glassSection.position.y = sectParams.railingPosY;
		glassSection.position.z = sectParams.railingPosZ;
		glassSection.rotation.y = sectParams.railingPosAng * Math.PI / 180;
			var angle = sectParams.angle * Math.PI / 180;
			angle = angle < 0 ? -angle : angle > Math.PI / 2 ? Math.PI - angle : angle;
		if(sectParams.angle % 90 != 0 && (sectParams.angle < 0 || sectParams.angle > 90)){
			glassSection.rotation.y -= Math.PI;
			glassSection.position.x -= sectParams.len * 1.0;
			glassSection.position.y -= sectParams.len * 1.0 * Math.tan(angle);
		}
		railing.push(glassSection);
		dxfBasePoint = newPoint_xy(dxfBasePoint, sectParams.len*1.0 + 500, 0);
	}

	//добавляем белые ребра для всех объектов

    for (var i = 0; i < railing.length; i++) addWareframe(railing[i], railing);

		
//добавляем объекты в сцену
	addObjects(viewportId, railing, 'railing');

 //измерение размеров на модели
	addMeasurement(viewportId);

	setTimeout(function() {
		if(typeof staircaseLoaded != 'undefined') staircaseLoaded();
	}, 0);

} //end of drawStair
	

function setTestHolesMoove(){
	//смещение левого нижнего отверстия на первом стекле первой секции
	var holeMoove = {
		sectID: 1,
		glassId: 1,
		holeId: 1,
		mooveX: 50,
		mooveY: 50,
		}
	holeMooveParams.push(holeMoove)
	
	//смещение правого верхнего отверстия на первом стекле первой секции
	var holeMoove = {
		sectID: 1,
		glassId: 1,
		holeId: 4,
		mooveX: -50,
		mooveY: -50,
		}
	holeMooveParams.push(holeMoove)
	
	//смещение левого нижнего отверстия на втором стекле второй секции
	var holeMoove = {
		sectID: 2,
		glassId: 2,
		holeId: 1,
		mooveX: 50,
		mooveY: 100,
		}
	holeMooveParams.push(holeMoove)

}
