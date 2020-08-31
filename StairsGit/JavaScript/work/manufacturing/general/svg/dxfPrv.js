$(function () {
	$(".showDxf").click(function(){
		showDxfPrv()
	})
});

function showDxfPrv(){

	var svgText = makeSvgFromDxf(dxfPrimitivesArr)
	
	$("#dxfPrv").html(svgText);
	
	//��������� ��� � ����� ������
	var panZoomTiger = svgPanZoom('#dxfPrv svg', {
		zoomScaleSensitivity: 0.5,
		minZoom: 0.5,
		maxZoom: 100,
	});

}

function makeSvgFromDxf(dxfArray){
	var svgText = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1000 -3000 10000 6000" width="1000" height="800" style="background-color: rgb(255, 255, 255);">'
	var lineWeight = 2;
	$.each(dxfArray, function(){
		
		var command = parseDxf(this);

		if(command[0] == "LINE"){			
			svgText += '<line x1="' + command[10] + '" y1="' + (command[20] * -1) + '" x2="' + command[11] + '" y2="' + (command[21] * -1) + '" stroke="black" fill="transparent" stroke-width="' + lineWeight + '"/>'
		};

		if(command[0] == "CIRCLE"){
			svgText += '<circle r="' + command[40] + '" cx="' + command[10] + '" cy="' + (command[20] * -1) + '" stroke="black" fill="transparent" stroke-width="' + lineWeight + '"/>'
		};
		
		if(command[0] == "ARC"){
			var center = {
				x: command[10] * 1.0,
				y: command[20] * 1.0,
			}
			var rad = command[40];
			var angStart = command[50] / 180 * Math.PI;
			var angEnd = command[51] / 180 * Math.PI;
			var startPoint = polar(center, angStart, rad);
			var endPoint = polar(center, angEnd, rad);
			//endPoint.y = -endPoint.y;
			
			//A40,50 0 0,0 150,150
			var arcText = '<path d="M ' + Math.round(startPoint.x * 1000) / 1000 + ", " + Math.round(-startPoint.y * 1000) / 1000 + " ";
			arcText += "A " + rad + ", " + rad + ' 0 0,0 ' + Math.round(endPoint.x * 1000) / 1000 + ', ' + Math.round(-endPoint.y * 1000) / 1000 + '"';
			arcText += ' stroke="black" fill="transparent" stroke-width="' + lineWeight + '"/>'
			svgText += arcText;
		};
		
		if(command[0] == "TEXT"){
			svgText += '<text x="' + command[10] + '" y="' + (command[20] * -1) + '" font-size="30">' + 
				command[1] + 
				'</text>';
		};
	})
	
	svgText += '</svg>';

	return svgText
}

/** ������� ������������ �������� dxf � ���� ������ � ������
*/

function parseDxf(prim){
	var command = {};
	var curIndex = 0;
	var endPos = prim.length;
	for(var i=0; i<prim.length; i++){
		if(prim[i] == "\n"){
			var name = prim.substring(curIndex, i);
			
			curIndex = i+1;
			var j = i+1;
			while(prim[j] != "\n" && j < endPos){
				j++;
			}
			var val = prim.substring(curIndex, j);
			command[name] = val;
			curIndex = j+1
			i = j+1;
		}
	}
	return command;
}