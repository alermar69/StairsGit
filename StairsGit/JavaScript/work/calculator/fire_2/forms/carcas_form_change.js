
function changeFormCarcas(){
getAllInputsValues(params);

$("#railingOffset").closest("tr").hide();
if(params.staircaseType == "П-1.2") $("#railingOffset").closest("tr").show();

$("#roofAngle").closest("tr").hide();
$("#corniceWidth").closest("tr").hide();
$("#roofWallHeight").closest("tr").show();
$("#roofWallThk").closest("tr").show();

if(params.roofType == "скатная") {
	$("#roofAngle").closest("tr").show();
	$("#corniceWidth").closest("tr").show();
	$("#roofWallHeight").closest("tr").hide();
	$("#roofWallThk").closest("tr").hide();
	$("#roofWallThk").val(200);
	
	if(params.wallDist < params.corniceWidth + 50) $("#wallDist").val(params.corniceWidth + 50);
	var topLegMinOffset = params.pltLength * Math.tan(params.roofAngle/180*Math.PI) + 300
	if(params.topLegOffset < topLegMinOffset) $("#topLegOffset").val(topLegMinOffset);
	}
		
/*покраска металла*/
$('.metalColor').hide();
if(params.metalPaint == "порошок") $('.metalColor').show();

}