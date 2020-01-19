function calcSpecBanister(partsList){

	//добавляем позиции, снятые с модели
	
	for(var partName in partsAmt_bal){
		var itemsPar = {
			specObj: partsAmt_bal,
			partName: partName,
			metalPaint: partsAmt_bal[partName]["metalPaint"],
			timberPaint: partsAmt_bal[partName]["timberPaint"],
			division: partsAmt_bal[partName]["division"],
			itemGroup: partsAmt_bal[partName]["group"],
			}

		//itemsPar.timberPaint_bal = itemsPar.timberPaint;
		//itemsPar.metalPaint_bal = itemsPar.metalPaint;

		if(!partsAmt_bal[partName].notAddToSpec) partsList.addSpecObjItems(itemsPar);
		}
	
	//добавляем расчетные позиции
	
	
	//функция в файле /manufacturing/general/calc_spec/calcSpec.js
	var railingSpecPar = {
		unit: "banister",
		}
	railingSpecPar = railingItemsAdd(railingSpecPar);


	for(var i=0; i<railingSpecPar.items.length; i++){
		var item = railingSpecPar.items[i];
		//partsList[item.id].timberPaint_bal = partsList[item.id].timberPaint;
		//partsList[item.id].metalPaint_bal = partsList[item.id].metalPaint;
		partsList.addItem(item);
	}
	
	
	//крепление к верхнему перекрытию
	var fixAmt = getPartAmt("racks", partsAmt_bal) + getPartAmt("forgedRack", partsAmt_bal);
	var fixParams = {
		partsList: partsList,
		fixPart: "саморезы",
		fixSurfaceType: params.fixType2,
		discription: "Крепление к верхнему перекрытию",
		unit: "Балюстрада",
		itemGroup: "Балюстрада",
		amt: fixAmt * 4,
		extraStudLength: params.fixSpacerLength1,
		studDiam: 10,
		}
	// if(params.isAssembling == "есть") addFixParts(fixParams);
		
}
	
	
