//���������� ���������� ��� ������������
var testingMode = false;
var boltDiam = 10;
var boltBulge = 8;
var boltLen = 30;
var anglesHasBolts = true; //������������ ����� �������
var drawLongBolts = true; //������������ ������� �����, ����������� ��� ������ ����� ������ ��������
var turnFactor = 1;
var treadsObj;

drawTable = function (viewportId, isVisible) {
	
	for(var layer in layers){
		removeObjects(viewportId, layer);
	}

   	var model = {
		objects: [],
		add: function(obj, layer){
			var objInfo = {
				obj: obj,
				layer: layer,
				}
			this.objects.push(objInfo);
			},
		};
	
	//�������� �������� ������������
	partsAmt = {};
	specObj = partsAmt; //������ ������, ���� ����� ����������� ������ ��� ������������
	poleList = {};

	/*������� �������*/
	dxfPrimitivesArr = [];
	
		/*** ������ ***/
	
	var carcasPar = {
		dxfBasePoint: {x: 0, y: 0},
		}
		
	var carcasObj = drawCarcas(carcasPar);
	model.add(carcasObj.carcas, "carcas");
	model.add(carcasObj.panels, "panels");
	model.add(carcasObj.countertop, "countertop");
	
	
		
	
//�������
	
	for(var i=0; i<model.objects.length; i++){
		var obj = model.objects[i].obj;
		//��������� ����� �����
		if(model.objects[i].layer != "dimensions" && model.objects[i].layer != "dimensions2") addWareframe(obj, obj);
		//��������� � �����
		addObjects(viewportId, obj, model.objects[i].layer);
		}

	//��������� �������� �� ������
	addMeasurement(viewportId);
	
};