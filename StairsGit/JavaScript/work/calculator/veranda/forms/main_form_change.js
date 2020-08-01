function changeFormCarcas(){
	if (params.pltType == 'единая с лестницей') {
		$("#pltHeight").val((params.stairAmt1 + 1) * params.h1);
		//$("#calcType").val('vhod');
		$("#platformTop").val('площадка');
		if (params.pltLen !== params.M) $("#platformTop").val('увеличенная');
		$("#platformLength_3").val(params.pltWidth);
		$("#platformWidth_3").val(params.pltLen);


		//params.calcType = 'vhod';
		//params.platformTop = 'площадка';
		//if (params.pltLen !== params.M) params.platformTop = 'увеличенная';
		//params.platformLength_3 = params.pltWidth;
		//params.platformWidth_3 = params.pltLen
	}
	 
}