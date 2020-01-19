var shapeArr = [];

function addWall(viewportId) {

/*удаляем существующую балюстраду*/
if (viewportId == 'viewPort1') {
	for(var i=0; i<shapeArr.length; i++) scene.remove(shapeArr[i]);
	}
shapeArr = [];

var wallLedgeType = [];
var wallLedgeWidth = [];
var wallLedgeHeight = [];
var wallLedgeDepth = [];
var wallLedgePosX = [];
var wallLedgePosY = [];
var wallLedgeAmt = 2;

/*считываем параметры из формы*/

for (var i=0; i < wallLedgeAmt; i++) {
var id = "wallLedgeType" + i;
wallLedgeType[i] = getInputValue(id);

var id = "wallLedgeWidth" + i;
wallLedgeWidth[i] = getInputValue(id);

var id = "wallLedgeHeight" + i;
wallLedgeHeight[i] = getInputValue(id);

var id = "wallLedgeDepth" + i;
wallLedgeDepth[i] = getInputValue(id);

var id = "wallLedgePosX" + i;
wallLedgePosX[i] = getInputValue(id);

var id = "wallLedgePosY" + i;
wallLedgePosY[i] = getInputValue(id);

}
//console.log(wallLedgePosY[0])

var wallWidth = 4000;
var wallHeight = 5000;
var wallThickness = 300;

/*вспомогательные оси*/		
var axes = new THREE.AxisHelper( 2000 );
shapeArr.push(axes);
	
/*добавляем стену*/
var wallMaterial = new THREE.MeshLambertMaterial( {color: 0xBFBFBF});
var geometry = new THREE.BoxGeometry( wallWidth, wallHeight, wallThickness);
var wall = new THREE.Mesh( geometry, wallMaterial );
	wall.position.x = wallWidth/2;
	wall.position.y = wallHeight/2;
	wall.position.z = -wallThickness/2;
	//shapeArr.push(wall);
	
	var wallBSP = new ThreeBSP(wall);

/*добавляем выступы*/
for (var i=0; i < wallLedgeAmt; i++) {
	var geometry = new THREE.BoxGeometry( wallLedgeWidth[i], wallLedgeHeight[i], wallLedgeDepth[i]);
	var ledge = new THREE.Mesh( geometry, wallMaterial );
		ledge.position.x = wallLedgeWidth[i]/2 + wallLedgePosX[i];
		ledge.position.y = wallLedgeHeight[i]/2 + wallLedgePosY[i];
		if (wallLedgeType[i]=="выступ"){
			ledge.position.z = wallLedgeDepth[i]/2;
			shapeArr.push(ledge);
			}
		if (wallLedgeType[i]=="проем"){			
			ledge.position.z = -wallLedgeDepth[i]/2;
			var ledgeBSP = new ThreeBSP(ledge);
			wallBSP = wallBSP.subtract(ledgeBSP);
			}
	}
	
	if(wallBSP){
		wall = wallBSP.toMesh();
		wall.material = wallMaterial;
		}
				
	shapeArr.push(wall);
	
	for (var i = 0; i < shapeArr.length; i++) addWareframe(shapeArr[i], shapeArr);

	if (viewportId == 'viewPort1') {	
	for(var i=0; i<shapeArr.length; i++) scene.add(shapeArr[i]); 
	}
}


