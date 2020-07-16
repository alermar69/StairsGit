var costMarkup=1.15;

function calculateBanisterPrice(){


//извлекаем кол-ва из глобального массива счетчиков

banisterParams.handrailAmt = getPartAmt("handrails", partsAmt_bal);
banisterParams.handrailLength_sum = getPartPropVal("handrails", "sumLength", partsAmt_bal);
banisterParams.rigelAmt = getPartAmt("rigels", partsAmt_bal);
banisterParams.rigelLength_sum = getPartPropVal("rigels", "sumLength", partsAmt_bal);
banisterParams.rackAmt = getPartAmt("racks", partsAmt_bal);
banisterParams.balAmt1 = getPartPropVal("forgedBal", "amt1", partsAmt_bal);
banisterParams.balAmt2 = getPartPropVal("forgedBal", "amt2", partsAmt_bal);
banisterParams.glassAmt = getPartAmt("glasses", partsAmt_bal);
banisterParams.glassArea = getPartPropVal("glasses", "sumArea", partsAmt_bal);
if(params.railingModel == "Трап") banisterParams.rackAmt = getPartAmt("ladderBal", partsAmt_bal);

if (params.railingModel_bal == "Деревянные балясины" || 
	params.railingModel_bal == "Стекло" || 
	params.railingModel_bal == "Дерево с ковкой"){
		banisterParams.balAmt = getPartAmt("timberBal", partsAmt_bal);
		banisterParams.rackAmt = getPartAmt("timberNewell", partsAmt_bal);
		}
		

/***  РАСЧЕТ ЦЕНЫ  ***/

//добавляем информацию о конструкции ограждений в массив параметров
banisterParams.railingName = "балюстрада";
banisterParams.metalPaint = params.metalPaint_railing;
banisterParams.timberPaint = params.timberPaint;
banisterParams.handrailType = params.handrail_bal;
banisterParams.rackType = params.banisterMaterial_bal;
banisterParams.rackBottom = params.rackBottom_bal;
banisterParams.rigelType = params.rigelMaterial_bal;
banisterParams.rigelAmt_0 = params.rigelAmt_bal;
banisterParams.railingModel = params.railingModel_bal;
banisterParams.railingTimber = params.railingTimber_bal;
banisterParams.banister1 = params.banister1_bal;
banisterParams.banister2 = params.banister2_bal;
banisterParams.glassType = params.glassType_bal;

banisterParams.specObj = partsAmt_bal;

calcRailingPrice(banisterParams); //функция находится в файле /calculator/general/priceLib.js
				

}//end of calculateBanisterPrice()