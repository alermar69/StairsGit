function createPartsList(){
	/*������� ������� ���������� �������*/
	var list = {};
	//������� ���������� ���������� ��������
	list.addItem = function(itemParams){
		var item = {
			amt: itemParams.amt, //���-�� � ������ ����������
			discription: itemParams.discription, //�������� ����������
			unit: itemParams.unit, //���� ��������
			group: itemParams.itemGroup, //������ ������� ��������
			};
		//��������� ���������� � ��������, ���� ��� ����
		if(itemParams.size) item.size = itemParams.size;
		
		this[itemParams.id].items.push(item);
	};
	
//����� ������� ��� ���� ��������
addGeneralItems(list); //������� � ����� /calculator/general/calcSpec.js


	return list;
}//end of createPartsList

// ������� ������� ������������
function calcSpec(){


	//������������� ����������� �������
	var partsList = createPartsList();
	var item = {}
	
	//����������
	calcSpecBanister(partsList);
	

	
	

	
    // ����� ������������ "������������"
    printSpecificationCollation(partsList);
    // ����� ������������ "������"
    printSpecificationAssembly(partsList);
    //�������� ���������� � ����� �� ������� ������������
    $('.tab_4').tablesorter({
		widgets: [ 'zebra', 'filter' ],
		theme: 'blue',
		usNumberFormat : false,
		sortReset      : true,
		sortRestart    : true,
    });
	
	showDrawingsLinks();
	printPartsAmt();
	
} //end of calculateSpec