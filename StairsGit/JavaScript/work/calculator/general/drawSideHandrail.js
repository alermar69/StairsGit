//пристенные поручни на прямой лестнице
function drawStrightSideHandrail(par){
	par.handrails = new THREE.Object3D();
	var handrailHeight = 900;
	var handrailYOffset = handrailHeight + params.h1;
	
	//массив длин пристенных поручней для спецификации
	railingParams.sideHandrails = [];
	
	var handrailParams={	
		model: params.handrail,
		length: (params.b1 * params.stairAmt1) / Math.cos(Math.atan(params.h1/params.b1)),
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		}
	handrailParams.dxfBasePoint = newPoint_xy(handrailParams.dxfBasePoint, -handrailParams.length, 0);

	//правая сторона
	if (params.handrailSide_1 == "внешнее" || params.handrailSide_1 == "две") {
		handrailParams = drawHandrail_4(handrailParams); 
	    var handrail = handrailParams.mesh;
		handrail.rotation.y = Math.PI;
		handrail.rotation.z = -Math.atan(params.h1/params.b1);
		handrail.position.x = params.b1 * params.stairAmt1;	
		handrail.position.y = handrailYOffset + params.h1 * params.stairAmt1;
		handrail.position.z = params.M;	
		if(params.turnSide == "левое" && par.stairType != "timber_com") handrail.position.z -= params.M;	
		par.handrails.add(handrail);
		
		//сохраняем параметры для спецификации
		railingParams.sideHandrails.push({len: Math.round(handrailParams.length), holderAmt: handrailParams.holderAmt })
		//подпись в dxf
		var text = "Пристенный поручень нижнего марша правая сторона";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(handrailParams.dxfBasePoint, 0, -80)
		addText(text, textHeight, handrailParams.dxfArr, textBasePoint);
		
		}
	
	//левая сторона
	if (params.handrailSide_1 == "внутреннее" || params.handrailSide_1 == "две") {
		handrailParams.dxfBasePoint.y += 700;
		handrailParams = drawHandrail_4(handrailParams); 
	    var handrail = handrailParams.mesh;
		handrail.rotation.z = Math.atan(params.h1/params.b1);
		handrail.position.x = 0;	
		handrail.position.y = handrailYOffset;
		handrail.position.z = 0;	
		if(params.turnSide == "левое" && par.stairType != "timber_com") handrail.position.z -= params.M;	
		par.handrails.add(handrail);
		
		//сохраняем параметры для спецификации
		railingParams.sideHandrails.push({len: Math.round(handrailParams.length), holderAmt: handrailParams.holderAmt })
		
		//подпись в dxf
		var text = "Пристенный поручень нижнего марша левая сторона";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(handrailParams.dxfBasePoint, 0, -80)
		addText(text, textHeight, handrailParams.dxfArr, textBasePoint);
		
		}
	
	return par;
}//end of drawStrightSideHandrail

//пристенные поручни на Г-образной лестнице
function drawTurn90SideHandrail(par){
	par.handrails = new THREE.Object3D();
	var handrailYOffset = 900 + params.h1;
	var handrailHolderOffset = 30;
	var handrailGap = 50;
	// var turnFactor = params.turnSide == "левое" ? -1 : 1;
	var tyrnAddition = 0;
	var stringerThickness = 8;
	if(par.stairType == "metal") {
		if (params.stairModel == "Г-образная с площадкой") {
            if (params.model == "ко") {
                tyrnAddition = 50.0;
            }
            if (params.model == "лт") {
                tyrnAddition = -stringerThickness + 30.0;
            }
        }

        if (params.stairModel == "Г-образная с забегом") {
            if (params.model == "ко") {
                tyrnAddition = 25.0;
            }
            if (params.model == "лт") {
                tyrnAddition = -stringerThickness + 31.0;
            }
        }
	}
	
	//массив длин пристенных поручней для спецификации
	railingParams.sideHandrails = [];
	
	var topMarshPos_Z = par.topMarshPos_Z;

	var handrailParams = {	
		model: params.handrail,
		length: (params.b1 * params.stairAmt1) / Math.cos(Math.atan(params.h1/params.b1)),
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
	}
	handrailParams.dxfBasePoint = newPoint_xy(handrailParams.dxfBasePoint, -handrailParams.length, 0);
	
	//нижний марш
	//правая сторона
	if (params.handrailSide_1 == "внутреннее" || params.handrailSide_1 == "две") {
	    handrailParams = drawHandrail_4(handrailParams); 
	    var handrail = handrailParams.mesh;
		handrail.rotation.y = Math.PI;
		handrail.rotation.z = -Math.atan(params.h1/params.b1);
		handrail.position.x = params.b1 * params.stairAmt1;	
		handrail.position.y = handrailYOffset + params.h1 * params.stairAmt1;
		handrail.position.z = params.M;	
		if(params.turnSide == "левое"){
			handrail.rotation.y = 0;
			handrail.rotation.z = Math.atan(params.h1/params.b1);
		    handrail.position.x = 0;	
		    handrail.position.y = handrailYOffset;	
			handrail.position.z = -params.M;
		}
	    par.handrails.add(handrail);
		
		//сохраняем параметры для спецификации
		railingParams.sideHandrails.push({len: Math.round(handrailParams.length), holderAmt: handrailParams.holderAmt })
		
		//подпись в dxf
		var text = "Пристенный поручень нижнего марша правая сторона";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(handrailParams.dxfBasePoint, 0, -80)
		addText(text, textHeight, handrailParams.dxfArr, textBasePoint);
	}
	
	//левая сторона
	if (params.handrailSide_1 == "внешнее" || params.handrailSide_1 == "две") {
		handrailParams.length -= handrailGap;
		handrailParams.dxfBasePoint = newPoint_xy(handrailParams.dxfBasePoint, -handrailParams.length - 700, 0);
		handrailParams = drawHandrail_4(handrailParams); 
	    var handrail = handrailParams.mesh;
		handrail.rotation.z = Math.atan(params.h1/params.b1);
		handrail.position.x = 0;	
		handrail.position.y = handrailYOffset;
		handrail.position.z = 0;	
		if(params.turnSide == "левое"){
			handrail.rotation.y = Math.PI;
		    handrail.rotation.z = -Math.atan(params.h1/params.b1);
		    handrail.position.x = params.b1 * params.stairAmt1 - handrailGap * Math.cos(Math.atan(params.h1/params.b1));	
		    handrail.position.y = handrailYOffset + params.h1 * params.stairAmt1 - handrailGap * params.h1/params.b1;
		    handrail.position.z = 0;	
		}
	    par.handrails.add(handrail);
		
		//сохраняем параметры для спецификации
		railingParams.sideHandrails.push({len: Math.round(handrailParams.length), holderAmt: handrailParams.holderAmt })
		
		//подпись в dxf
		var text = "Пристенный поручень нижнего марша левая сторона";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(handrailParams.dxfBasePoint, 0, -80)
		addText(text, textHeight, handrailParams.dxfArr, textBasePoint);
		
		handrailParams.length = params.M - handrailHolderOffset - handrailGap + tyrnAddition;
		if(params.stairModel == "Г-образная с забегом") {
			handrailParams.length = (params.M - handrailHolderOffset + tyrnAddition) / Math.cos(Math.atan(3*params.h3/2/(params.M - handrailHolderOffset))) - handrailGap;
		}
		handrailParams.dxfBasePoint = newPoint_xy(handrailParams.dxfBasePoint, -handrailParams.length - 700, 0);
	    handrailParams = drawHandrail_4(handrailParams); 
	    var handrail = handrailParams.mesh;
		if(params.stairModel == "Г-образная с забегом") {
			handrail.rotation.z = Math.atan(3*params.h3/2/(params.M - handrailHolderOffset));
		}
		handrail.position.x = params.b1 * params.stairAmt1;	
		handrail.position.y = handrailYOffset + params.h1 * params.stairAmt1;
		handrail.position.z = 0;
		if(params.turnSide == "левое"){
		    handrail.rotation.y = Math.PI;
			handrail.position.x = params.b1 * params.stairAmt1 + (params.M - handrailHolderOffset) - handrailGap + tyrnAddition;	
		    handrail.position.y = handrailYOffset + params.h1 * params.stairAmt1;
		    if(params.stairModel == "Г-образная с забегом") {
		    	handrail.rotation.z = -Math.atan(3*params.h3/2/(params.M - handrailHolderOffset));
				handrail.position.y += 3*params.h3/2;
		    }
			handrail.position.z = 0;
		}		
	    par.handrails.add(handrail);
		
		//сохраняем параметры для спецификации
		railingParams.sideHandrails.push({len: Math.round(handrailParams.length), holderAmt: handrailParams.holderAmt })
		
		//подпись в dxf
		var text = "Пристенный поручень забега (площадки) нижнего марша левая сторона";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(handrailParams.dxfBasePoint, 0, -80)
		addText(text, textHeight, handrailParams.dxfArr, textBasePoint);
	}
	
	//верхний марш
	var handrailYOffset = params.h1 * (params.stairAmt1 + 1) + 900 + params.h3;
	if(params.stairModel == "Г-образная с забегом") {
		handrailYOffset += 2*params.h3;
	}
	handrailParams.length = (params.b3 * params.stairAmt3) / Math.cos(Math.atan(params.h3/params.b3));
	handrailParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, -handrailParams.length, -1000);
	
	//правая сторона
	if (params.handrailSide_3 == "внутреннее" || params.handrailSide_3 == "две") {
	    handrailParams = drawHandrail_4(handrailParams); 
	    var handrail = handrailParams.mesh;
		handrail.rotation.y = Math.PI - Math.PI/2;
		handrail.rotation.z = -Math.atan(params.h3/params.b3);
		handrail.position.x = params.b1 * params.stairAmt1 + tyrnAddition;	
		handrail.position.y = handrailYOffset + params.h3 * params.stairAmt3;
		handrail.position.z = topMarshPos_Z + params.b3 * params.stairAmt3;	
		if(params.turnSide == "левое"){
		    handrail.rotation.y = Math.PI - Math.PI/2;
		    handrail.rotation.z = Math.atan(params.h3/params.b3);
		    handrail.position.x = params.b1 * params.stairAmt1+ tyrnAddition;	
		    handrail.position.y = handrailYOffset;
		    handrail.position.z = topMarshPos_Z;	
		}		
	    par.handrails.add(handrail);
		
		//сохраняем параметры для спецификации
		railingParams.sideHandrails.push({len: Math.round(handrailParams.length), holderAmt: handrailParams.holderAmt })
		
		//подпись в dxf
		var text = "Пристенный поручень верхнего марша правая сторона";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(handrailParams.dxfBasePoint, 0, -80)
		addText(text, textHeight, handrailParams.dxfArr, textBasePoint);
	}
	
	//левая сторона
	if (params.handrailSide_3 == "внешнее" || params.handrailSide_3 == "две") {
		if(params.stairModel == "Г-образная с площадкой") {
		    handrailParams.length = (params.b3 * (params.stairAmt3 + 1)) / Math.cos(Math.atan(params.h3/params.b3));
		}
		handrailParams.dxfBasePoint = newPoint_xy(handrailParams.dxfBasePoint, -handrailParams.length - 700, 0);
		handrailParams = drawHandrail_4(handrailParams); 
	    var handrail = handrailParams.mesh;
		handrail.rotation.y = -Math.PI/2;
		handrail.rotation.z = Math.atan(params.h3/params.b3);
		handrail.position.x = params.b1 * params.stairAmt1 + params.M + tyrnAddition;	
		handrail.position.y = handrailYOffset;
		handrail.position.z = topMarshPos_Z;	
		if(params.stairModel == "Г-образная с площадкой") {
		    handrail.position.z -= params.b3;	
		    handrail.position.y -= params.h3;
		}
		if(params.turnSide == "левое"){
		    handrail.rotation.y = -Math.PI/2;
		    handrail.rotation.z = -Math.atan(params.h3/params.b3);
		    handrail.position.x = params.b1 * params.stairAmt1 + params.M + tyrnAddition;	
		    handrail.position.y = handrailYOffset + params.h3 * params.stairAmt3;
		    handrail.position.z = topMarshPos_Z - params.b3 * params.stairAmt3;
		}
	    par.handrails.add(handrail);
		
		//сохраняем параметры для спецификации
		railingParams.sideHandrails.push({len: Math.round(handrailParams.length), holderAmt: handrailParams.holderAmt })
		
		//подпись в dxf
		var text = "Пристенный поручень верхнего марша левая сторона";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(handrailParams.dxfBasePoint, 0, -80)
		addText(text, textHeight, handrailParams.dxfArr, textBasePoint);
		
		handrailParams.length = Math.abs(topMarshPos_Z) - handrailHolderOffset - handrailParams.profWidth;
		if(params.stairModel == "Г-образная с забегом") {
			handrailParams.length = handrailParams.length / Math.cos(Math.atan(3*params.h3/2/(Math.abs(topMarshPos_Z) - handrailHolderOffset - handrailParams.profWidth))) - handrailGap;
		}
		else{
			handrailParams.length -= params.b3 + handrailGap;
		}
		handrailParams.dxfBasePoint = newPoint_xy(handrailParams.dxfBasePoint, -handrailParams.length - 700, 0);
	    handrailParams = drawHandrail_4(handrailParams); 
	    var handrail = handrailParams.mesh;
		handrail.rotation.y = -Math.PI/2;
		if(params.stairModel == "Г-образная с забегом") {
			handrail.rotation.z = Math.atan(3*params.h3/2/(Math.abs(topMarshPos_Z) - handrailHolderOffset - handrailParams.profWidth));
		}
		handrail.position.x = params.b1 * params.stairAmt1 + params.M + tyrnAddition;	
		handrail.position.y = handrailYOffset - params.h3;
		if(params.stairModel == "Г-образная с забегом") { 
		    handrail.position.y = handrailYOffset - 3*params.h3/2;
	    }
		handrail.position.z = handrailHolderOffset + handrailParams.profWidth;	
		if(params.turnSide == "левое"){
			handrail.position.z = -handrailHolderOffset - handrailParams.profWidth - (Math.abs(topMarshPos_Z) - handrailHolderOffset - handrailParams.profWidth - params.b3) + handrailGap;
		    if(params.stairModel == "Г-образная с забегом") {
		    	handrail.rotation.z = -Math.atan(3*params.h3/2/(Math.abs(topMarshPos_Z) - handrailHolderOffset - handrailParams.profWidth));
				handrail.position.y += 3*params.h3/2;
			    handrail.position.z = -handrailHolderOffset - handrailParams.profWidth - (Math.abs(topMarshPos_Z) - handrailHolderOffset - handrailParams.profWidth) + handrailGap;
		    }		
		}
	    par.handrails.add(handrail);
		
		//сохраняем параметры для спецификации
		railingParams.sideHandrails.push({len: Math.round(handrailParams.length), holderAmt: handrailParams.holderAmt })
		
		//подпись в dxf
		var text = "Пристенный поручень забега (площадки) верхнего марша левая сторона";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(handrailParams.dxfBasePoint, 0, -80)
		addText(text, textHeight, handrailParams.dxfArr, textBasePoint);
	}
	return par;
}//end of drawTurn90SideHandrail

//пристенные поручни на П-образной лестнице
function drawTurn180SideHandrail(par){
	par.handrails = new THREE.Object3D();
	var handrailYOffset = 900 + params.h1;
	var handrailHolderOffset = 30;
	var handrailGap = 50;
	// var turnFactor = params.turnSide == "левое" ? -1 : 1;
	var tyrnAddition = 0;
	var stringerThickness = 8;
	if(par.stairType == "metal") {
		if (params.stairModel == "П-образная с площадкой") {
            if (params.model == "ко") {
                tyrnAddition = 50.0;
            }
            if (params.model == "лт") {
                tyrnAddition = -stringerThickness + 30.0;
            }
        }

        if (params.stairModel == "П-образная с забегом") {
            if (params.model == "ко") {
                tyrnAddition = 25.0;
            }
            if (params.model == "лт") {
                tyrnAddition = -stringerThickness + 31.0;
            }
        }
	}
	
	
	//массив длин пристенных поручней для спецификации
	railingParams.sideHandrails = [];
	
	var topMarshPos_Z = par.topMarshPos_Z;
	
	var handrailParams={	
		model: params.handrail,
		length: (params.b1 * params.stairAmt1) / Math.cos(Math.atan(params.h1/params.b1)),
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
	}
	handrailParams.dxfBasePoint = newPoint_xy(handrailParams.dxfBasePoint, -handrailParams.length, 0);
	
	//нижний марш
	//правая сторона
	if (params.handrailSide_1 == "внутреннее" || params.handrailSide_1 == "две") {	
	    handrailParams = drawHandrail_4(handrailParams); 
	    var handrail = handrailParams.mesh;
		handrail.rotation.y = Math.PI;
		handrail.rotation.z = -Math.atan(params.h1/params.b1);
		handrail.position.x = params.b1 * params.stairAmt1;	
		handrail.position.y = handrailYOffset + params.h1 * params.stairAmt1;
		handrail.position.z = params.M;	
		if(params.turnSide == "левое"){
		    handrail.rotation.y = 0;
			handrail.rotation.z = Math.atan(params.h1/params.b1);
		    handrail.position.x = 0;	
		    handrail.position.y = handrailYOffset;
			handrail.position.z = -params.M;
		}
	    par.handrails.add(handrail);
		
		//сохраняем параметры для спецификации
		railingParams.sideHandrails.push({len: Math.round(handrailParams.length), holderAmt: handrailParams.holderAmt })
		
		//подпись в dxf
		var text = "Пристенный поручень нижнего марша правая сторона";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(handrailParams.dxfBasePoint, 0, -80)
		addText(text, textHeight, handrailParams.dxfArr, textBasePoint);
	}
	
	//левая сторона
	if (params.handrailSide_1 == "внешнее" || params.handrailSide_1 == "две") {
		handrailParams.length -= handrailGap;
		handrailParams.dxfBasePoint = newPoint_xy(handrailParams.dxfBasePoint, -handrailParams.length - 700, 0);
		handrailParams = drawHandrail_4(handrailParams); 
	    var handrail = handrailParams.mesh;
		handrail.rotation.z = Math.atan(params.h1/params.b1);
		handrail.position.x = 0;
		handrail.position.y = handrailYOffset;
		handrail.position.z = 0;	
		if(params.turnSide == "левое"){ 
			handrail.rotation.y = Math.PI;
	    	handrail.rotation.z = -Math.atan(params.h1/params.b1);
		    handrail.position.x = params.b1 * params.stairAmt1 - handrailGap * Math.cos(Math.atan(params.h1/params.b1));	
		    handrail.position.y = handrailYOffset + params.h1 * params.stairAmt1 - handrailGap * params.h1/params.b1; 
		    handrail.position.z = 0;
		}
	    par.handrails.add(handrail);
		
		//сохраняем параметры для спецификации
		railingParams.sideHandrails.push({len: Math.round(handrailParams.length), holderAmt: handrailParams.holderAmt })
		
		//подпись в dxf
		var text = "Пристенный поручень нижнего марша левая сторона";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(handrailParams.dxfBasePoint, 0, -80)
		addText(text, textHeight, handrailParams.dxfArr, textBasePoint);
		
		handrailParams.length = params.platformLength_1 - handrailHolderOffset - handrailParams.profWidth - handrailGap + tyrnAddition;
		if(params.stairModel == "П-образная с забегом") {
			handrailParams.length = (params.M - handrailHolderOffset - handrailParams.profWidth) / Math.cos(Math.atan(params.h3/(params.M - handrailHolderOffset))) - handrailGap;
		}
		handrailParams.dxfBasePoint = newPoint_xy(handrailParams.dxfBasePoint, -handrailParams.length - 700, 0);
	    handrailParams = drawHandrail_4(handrailParams); 
	    var handrail = handrailParams.mesh;
		if(params.stairModel == "П-образная с забегом") {
			handrail.rotation.z = Math.atan(params.h3/(params.M - handrailHolderOffset - handrailParams.profWidth));
		}
		handrail.position.x = params.b1 * params.stairAmt1;	
		handrail.position.y = handrailYOffset + params.h1 * params.stairAmt1;
		handrail.position.z = 0;
		if(params.turnSide == "левое"){
		    handrail.rotation.y = Math.PI;
			handrail.position.x = params.b1 * params.stairAmt1 + (params.platformLength_1 - handrailHolderOffset - handrailParams.profWidth - handrailGap + tyrnAddition);	
		    handrail.position.y = handrailYOffset + params.h1 * params.stairAmt1;
		    if(params.stairModel == "П-образная с забегом") {
				handrail.position.x = params.b1 * params.stairAmt1 + params.M - handrailHolderOffset - handrailParams.profWidth - handrailGap + tyrnAddition;
		    	handrail.rotation.z = -Math.atan(params.h3/(params.M - handrailHolderOffset - handrailParams.profWidth));
				handrail.position.y += params.h3;
		    }
			handrail.position.z = 0;
		}		
	    par.handrails.add(handrail);
		
		//сохраняем параметры для спецификации
		railingParams.sideHandrails.push({len: Math.round(handrailParams.length), holderAmt: handrailParams.holderAmt })
		
		//подпись в dxf
		var text = "Пристенный поручень забега (площадки) нижнего марша левая сторона";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(handrailParams.dxfBasePoint, 0, -80)
		addText(text, textHeight, handrailParams.dxfArr, textBasePoint);
	}
	 
	//промежуточная площадка (забег)
	handrailParams.length = 2*params.M + params.marshDist - 2*handrailHolderOffset;
	if(params.stairModel == "П-образная с забегом") {
		handrailParams.length = handrailParams.length / Math.cos(Math.atan((3*params.h3 + params.h3/2)/(2*params.M + params.marshDist)));
	}
	handrailParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, -handrailParams.length, -1000);
	var handrailYOffset = params.h1 * (params.stairAmt1 + 1) + 900;
	if(params.stairModel == "П-образная с забегом") {
		handrailYOffset += params.h3;
	}
	
	if ((params.stairModel == "П-образная с забегом" && params.backHandrail_2 == "есть") || 
	    (params.stairModel == "П-образная с площадкой" && params.backHandrail_1 == "есть")) {	
	    handrailParams = drawHandrail_4(handrailParams); 
	    var handrail = handrailParams.mesh;
		handrail.rotation.y = -Math.PI/2;
		handrail.rotation.z = 0;
		handrail.position.x = params.b1 * params.stairAmt1 + params.platformLength_1 + tyrnAddition;	
		handrail.position.y = handrailYOffset;
		handrail.position.z = handrailHolderOffset;	
		if(params.stairModel == "П-образная с забегом") {
			handrail.rotation.z = Math.atan((3*params.h3 + params.h3/2)/(2*params.M + params.marshDist));
			handrail.position.x = params.b1 * params.stairAmt1 + params.M + tyrnAddition;	
		}
		if(params.turnSide == "левое"){
		    handrail.rotation.y = -Math.PI/2;
		    handrail.rotation.z = 0;
		    handrail.position.x = params.b1 * params.stairAmt1 + params.platformLength_1 + tyrnAddition;	
		    handrail.position.y = handrailYOffset;
		    handrail.position.z = -(2*params.M + params.marshDist - 2*handrailHolderOffset)-handrailHolderOffset;	
		    if(params.stairModel == "П-образная с забегом") {
			    handrail.rotation.z = -Math.atan((3*params.h3 + params.h3/2)/(2*params.M + params.marshDist));
				handrail.position.y = handrailYOffset + (3*params.h3 + params.h3/2);
			    handrail.position.x = params.b1 * params.stairAmt1 + params.M + tyrnAddition;	
		    }
		}		
	    par.handrails.add(handrail);
		
		//сохраняем параметры для спецификации
		railingParams.sideHandrails.push({len: Math.round(handrailParams.length), holderAmt: handrailParams.holderAmt })
		
		//подпись в dxf
		var text = "Пристенный поручень промежуточной площадки (забега)";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(handrailParams.dxfBasePoint, 0, -80)
		addText(text, textHeight, handrailParams.dxfArr, textBasePoint);
	}
	
	//верхний марш
	handrailParams.length = (params.b3 * params.stairAmt3) / Math.cos(Math.atan(params.h3/params.b3));	
	handrailParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, -handrailParams.length, -2000);
	if(params.stairModel == "П-образная с забегом") {
		handrailYOffset += 5*params.h3;
	}
	else{
		handrailYOffset += params.h3;
	}
	
	//правая сторона
	if (params.handrailSide_3 == "внутреннее" || params.handrailSide_3 == "две") {	
	    handrailParams = drawHandrail_4(handrailParams); 
	    var handrail = handrailParams.mesh;
		handrail.rotation.y = 0;
		handrail.rotation.z = -Math.atan(params.h3/params.b3);
		handrail.position.x = params.b1 * params.stairAmt1 - params.b3 * params.stairAmt3;	
		handrail.position.y = handrailYOffset + params.h3 * params.stairAmt3;
		handrail.position.z = params.M + params.marshDist;	
		if(params.turnSide == "левое"){
		    handrail.rotation.y = -Math.PI;
		    handrail.rotation.z = Math.atan(params.h3/params.b3);
		    handrail.position.x = params.b1 * params.stairAmt1;	
		    handrail.position.y = handrailYOffset;
		    handrail.position.z = -(params.M + params.marshDist);	
		}		
	    par.handrails.add(handrail);
		
		//сохраняем параметры для спецификации
		railingParams.sideHandrails.push({len: Math.round(handrailParams.length), holderAmt: handrailParams.holderAmt })
		
		//подпись в dxf
		var text = "Пристенный поручень верхнего марша правая сторона";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(handrailParams.dxfBasePoint, 0, -80)
		addText(text, textHeight, handrailParams.dxfArr, textBasePoint);
	}
	
	//левая сторона
	if (params.handrailSide_3 == "внешнее" || params.handrailSide_3 == "две") {
		if(params.stairModel == "П-образная с площадкой") {
			handrailParams.length = (params.b3 * (params.stairAmt3 + 1)) / Math.cos(Math.atan(params.h3/params.b3));
		}
		handrailParams.dxfBasePoint = newPoint_xy(handrailParams.dxfBasePoint, -handrailParams.length - 700, 0);
		handrailParams = drawHandrail_4(handrailParams); 
	    var handrail = handrailParams.mesh;
		handrail.rotation.y = -Math.PI;
		handrail.rotation.z = Math.atan(params.h3/params.b3);
		handrail.position.x = params.b1 * params.stairAmt1;	
		handrail.position.y = handrailYOffset;
		handrail.position.z = 2*params.M + params.marshDist;	
		if(params.stairModel == "П-образная с площадкой") {
			handrail.position.x += params.b3;
			handrail.position.y -= params.h3;
		}
		if(params.turnSide == "левое"){
		    handrail.rotation.y = 0;
		    handrail.rotation.z = -Math.atan(params.h3/params.b3);
		    handrail.position.x = params.b1 * params.stairAmt1 - params.b3 * params.stairAmt3;	
		    handrail.position.y = handrailYOffset + params.h3 * params.stairAmt3;
		    handrail.position.z = -(2*params.M + params.marshDist);
		}
	    par.handrails.add(handrail);
		
		//сохраняем параметры для спецификации
		railingParams.sideHandrails.push({len: Math.round(handrailParams.length), holderAmt: handrailParams.holderAmt })
		
		//подпись в dxf
		var text = "Пристенный поручень верхнего марша левая сторона";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(handrailParams.dxfBasePoint, 0, -80)
		addText(text, textHeight, handrailParams.dxfArr, textBasePoint);
		
		handrailParams.length = params.platformLength_1 - handrailHolderOffset - handrailParams.profWidth;
		if(params.stairModel == "П-образная с забегом") {
			handrailParams.length = (params.M - handrailHolderOffset - handrailParams.profWidth) / Math.cos(Math.atan(3*params.h3/2/(params.M - handrailHolderOffset - handrailParams.profWidth))) - 2*handrailGap + tyrnAddition;
		}
		else {
			handrailParams.length -= params.b3 + 2*handrailGap - tyrnAddition;
		}
		handrailParams.dxfBasePoint = newPoint_xy(handrailParams.dxfBasePoint, -handrailParams.length - 700, 0);
	    handrailParams = drawHandrail_4(handrailParams); 
	    var handrail = handrailParams.mesh;
		handrail.rotation.y = -Math.PI;
		handrail.position.x = params.b1 * params.stairAmt1 + params.platformLength_1 - handrailHolderOffset - handrailParams.profWidth - handrailGap + tyrnAddition;	
		handrail.position.y = handrailYOffset;
		if(params.stairModel == "П-образная с площадкой") {
			handrail.position.y -= params.h3;
		}
		if(params.stairModel == "П-образная с забегом") {
			handrail.position.x = params.b1 * params.stairAmt1 + params.M - handrailHolderOffset - handrailParams.profWidth - handrailGap + tyrnAddition;
			handrail.rotation.z = Math.atan(3*params.h3/2/(params.M - handrailHolderOffset - handrailParams.profWidth));
		    handrail.position.y = handrailYOffset - 3*params.h3/2;
	    }
		handrail.position.z = 2*params.M + params.marshDist;	
		if(params.turnSide == "левое"){
		    if(params.stairModel == "П-образная с забегом") {
		    	handrail.rotation.z = -Math.atan(3*params.h3/2/(params.M - handrailHolderOffset - handrailParams.profWidth));
				handrail.position.y += 3*params.h3/2;
		    }
			handrail.rotation.y = 0;
			handrail.position.x = params.b1 * params.stairAmt1 + handrailGap;
			handrail.position.z = -(2*params.M + params.marshDist);	
		    if(params.stairModel == "П-образная с площадкой") {
			    handrail.position.x += params.b3;
		    }
		}
	    par.handrails.add(handrail);
		
		//сохраняем параметры для спецификации
		railingParams.sideHandrails.push({len: Math.round(handrailParams.length), holderAmt: handrailParams.holderAmt })
		
		//подпись в dxf
		var text = "Пристенный поручень забега (площадки) верхнего марша левая сторона";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(handrailParams.dxfBasePoint, 0, -80)
		addText(text, textHeight, handrailParams.dxfArr, textBasePoint);
	}
	return par;
}//end of drawTurn180SideHandrail

//пристенные поручни на трехмаршевой лестнице
function draw3marshSideHandrail(par){
	par.handrails = new THREE.Object3D();
	var handrailYOffset = 900 + params.h1;
	var handrailHolderOffset = 30;
	var handrailGap = 50;
	// var turnFactor = params.turnSide == "левое" ? -1 : 1;
	var tyrnAddition = 0;
	var stringerThickness = 8;
	var leftZ0Offset = 0;
	if(par.stairType == "metal") {
		var leftZ0Offset = -params.M;
		if (params.turnType_1 == "площадка") {
            if (params.model == "ко") {
                tyrnAddition = 50.0;
            }
            if (params.model == "лт") {
                tyrnAddition = -stringerThickness + 30.0;
            }
        }

        if (params.turnType_1 == "забег") {
            if (params.model == "ко") {
                tyrnAddition = 25.0;
            }
            if (params.model == "лт") {
                tyrnAddition = -stringerThickness + 31.0;
            }
        }
	}
	if(par.stairType == "timber") {
		leftZ0Offset = -params.M;
	}
	
	//массив длин пристенных поручней для спецификации
	railingParams.sideHandrails = [];
	
	var topMarshPos_Z = par.topMarshPos_Z;
	
	var handrailParams={	
		model: params.handrail,
		length: (params.b1 * params.stairAmt1) / Math.cos(Math.atan(params.h1/params.b1)),
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
	}
	handrailParams.dxfBasePoint = newPoint_xy(handrailParams.dxfBasePoint, -handrailParams.length, 0);

	//нижний марш
	//правая сторона
	if (params.handrailSide_1 == "внутреннее" || params.handrailSide_1 == "две") {	
	    handrailParams = drawHandrail_4(handrailParams); 
	    var handrail = handrailParams.mesh;
		handrail.rotation.y = Math.PI;
		handrail.rotation.z = -Math.atan(params.h1/params.b1);
		handrail.position.x = params.b1 * params.stairAmt1;	
		handrail.position.y = handrailYOffset + params.h1 * params.stairAmt1;
		handrail.position.z = params.M;	
		if(params.turnSide == "левое"){
			handrail.rotation.y = 0;
			handrail.rotation.z = Math.atan(params.h1/params.b1);
		    handrail.position.x = 0;	
		    handrail.position.y = handrailYOffset;	
			handrail.position.z = -params.M;
		}
	    par.handrails.add(handrail);
		
		//сохраняем параметры для спецификации
		railingParams.sideHandrails.push({len: Math.round(handrailParams.length), holderAmt: handrailParams.holderAmt })
		
		//подпись в dxf
		var text = "Пристенный поручень нижнего марша правая сторона";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(handrailParams.dxfBasePoint, 0, -80)
		addText(text, textHeight, handrailParams.dxfArr, textBasePoint);
	}

	//левая сторона
	if (params.handrailSide_1 == "внешнее" || params.handrailSide_1 == "две") {
		handrailParams.length -= handrailGap;
		handrailParams.dxfBasePoint = newPoint_xy(handrailParams.dxfBasePoint, -handrailParams.length - 700, 0);
		handrailParams = drawHandrail_4(handrailParams); 
	    var handrail = handrailParams.mesh;
		handrail.rotation.z = Math.atan(params.h1/params.b1);
		handrail.position.x = 0;	
		handrail.position.y = handrailYOffset;
		handrail.position.z = 0;	
		if(params.turnSide == "левое"){
			handrail.rotation.y = Math.PI;
		    handrail.rotation.z = -Math.atan(params.h1/params.b1);
		    handrail.position.x = params.b1 * params.stairAmt1 - handrailGap * Math.cos(Math.atan(params.h1/params.b1));	
		    handrail.position.y = handrailYOffset + params.h1 * params.stairAmt1 - handrailGap * params.h1/params.b1;
		    handrail.position.z = 0;	
		}
	    par.handrails.add(handrail);
		
		//сохраняем параметры для спецификации
		railingParams.sideHandrails.push({len: Math.round(handrailParams.length), holderAmt: handrailParams.holderAmt })
		
		//подпись в dxf
		var text = "Пристенный поручень нижнего марша левая сторона";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(handrailParams.dxfBasePoint, 0, -80)
		addText(text, textHeight, handrailParams.dxfArr, textBasePoint);
		
		handrailParams.length = params.M - handrailHolderOffset - handrailGap;
		if(params.turnType_1 == "забег") {
			handrailParams.length = (params.M - handrailHolderOffset) / Math.cos(Math.atan(3*params.h2/2/(params.M - handrailHolderOffset))) - handrailGap;
		}
		handrailParams.dxfBasePoint = newPoint_xy(handrailParams.dxfBasePoint, -handrailParams.length - 700, 0);
		
	    handrailParams = drawHandrail_4(handrailParams); 
	    var handrail = handrailParams.mesh;
		if(params.turnType_1 == "забег") {
			handrail.rotation.z = Math.atan(3*params.h2/2/(params.M - handrailHolderOffset));
		}
		handrail.position.x = params.b1 * params.stairAmt1;	
		handrail.position.y = handrailYOffset + params.h1 * params.stairAmt1;
		handrail.position.z = 0;
		if(params.turnSide == "левое"){
		    handrail.rotation.y = Math.PI;
			handrail.position.x = params.b1 * params.stairAmt1 + (params.M - handrailHolderOffset) - handrailGap;	
		    handrail.position.y = handrailYOffset + params.h1 * params.stairAmt1;
		    if(params.turnType_1 == "забег") {
		    	handrail.rotation.z = -Math.atan(3*params.h2/2/(params.M - handrailHolderOffset));
				handrail.position.y += 3*params.h2/2;
		    }
			handrail.position.z = 0;
		}		
	    par.handrails.add(handrail);
		
		//сохраняем параметры для спецификации
		railingParams.sideHandrails.push({len: Math.round(handrailParams.length), holderAmt: handrailParams.holderAmt })
		
		//подпись в dxf
		var text = "Пристенный поручень забега (площадки) нижнего марша левая сторона";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(handrailParams.dxfBasePoint, 0, -80)
		addText(text, textHeight, handrailParams.dxfArr, textBasePoint);
	}

	
	//средний марш
	var handrailYOffset = params.h1 * (params.stairAmt1 + 1) + 900 + params.h2;	
	if(params.turnType_1 == "забег") {
		handrailYOffset += 2*params.h2;
	}
	handrailParams.length = (params.b2 * params.stairAmt2) / Math.cos(Math.atan(params.h2/params.b2));
	handrailParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, -handrailParams.length, -1000);	
	if(par.stairType == "metal") {
		if (params.turnType_2 == "площадка") {
            if (params.model == "ко") {
                tyrnAddition = 50.0;
            }
            if (params.model == "лт") {
                tyrnAddition = -stringerThickness + 30.0;
            }
        }

        if (params.turnType_2 == "забег") {
            if (params.model == "ко") {
                tyrnAddition = 25.0;
            }
            if (params.model == "лт") {
                tyrnAddition = -stringerThickness + 31.0;
            }
        }
	}

	//правая сторона
	if (params.handrailSide_2 == "внутреннее" || params.handrailSide_2 == "две") {
	    handrailParams = drawHandrail_4(handrailParams); //функция в файле /calculator/general/drawSideHandrail.js
	    var handrail = handrailParams.mesh;
		handrail.rotation.y = Math.PI - Math.PI/2;
		handrail.rotation.z = -Math.atan(params.h2/params.b2);
		handrail.position.x = params.b1 * params.stairAmt1 + tyrnAddition;	
		handrail.position.y = handrailYOffset + params.h2 * params.stairAmt2;
		handrail.position.z = params.M + params.b2 * params.stairAmt2;	
		if(params.turnSide == "левое"){
		    handrail.rotation.y = Math.PI - Math.PI/2;
		    handrail.rotation.z = Math.atan(params.h2/params.b2);
		    handrail.position.x = params.b1 * params.stairAmt1 + tyrnAddition;	
		    handrail.position.y = handrailYOffset;
		    handrail.position.z = -params.M;	
		}		
	    par.handrails.add(handrail);
		
		//сохраняем параметры для спецификации
		railingParams.sideHandrails.push({len: Math.round(handrailParams.length), holderAmt: handrailParams.holderAmt })
		
		//подпись в dxf
		var text = "Пристенный поручень среднего марша правая сторона";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(handrailParams.dxfBasePoint, 0, -80)
		addText(text, textHeight, handrailParams.dxfArr, textBasePoint);
	}

	//левая сторона
	if (params.handrailSide_2 == "внешнее" || params.handrailSide_2 == "две") {
		handrailParams.length -= handrailGap;
		if(params.turnType_1 == "площадка") {
		    handrailParams.length = (params.b2 * (params.stairAmt2 + 1)) / Math.cos(Math.atan(params.h2/params.b2)) - handrailGap;
		}
		handrailParams.dxfBasePoint = newPoint_xy(handrailParams.dxfBasePoint, -handrailParams.length - 700, 0);
		
		handrailParams = drawHandrail_4(handrailParams); //функция в файле /calculator/general/drawSideHandrail.js
	    var handrail = handrailParams.mesh;
		handrail.rotation.y = -Math.PI/2;
		handrail.rotation.z = Math.atan(params.h2/params.b2);
		handrail.position.x = params.b1 * params.stairAmt1 + params.M + tyrnAddition;	
		handrail.position.y = handrailYOffset;
		handrail.position.z = params.M;	
		if(params.turnType_1 == "площадка") {
		    handrail.position.z -= params.b2;	
		    handrail.position.y -= params.h2;
		}
		if(params.turnSide == "левое"){
		    handrail.rotation.y = -Math.PI/2;
		    handrail.rotation.z = -Math.atan(params.h2/params.b2);
		    handrail.position.x = params.b1 * params.stairAmt1 + params.M + tyrnAddition;	
		    handrail.position.y = handrailYOffset + params.h2 * params.stairAmt2;
		    handrail.position.z = -params.M-params.b2 * params.stairAmt2 + handrailGap;
		}
	    par.handrails.add(handrail);
		
		//сохраняем параметры для спецификации
		railingParams.sideHandrails.push({len: Math.round(handrailParams.length), holderAmt: handrailParams.holderAmt })
		
		//подпись в dxf
		var text = "Пристенный поручень среднего марша левая сторона";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(handrailParams.dxfBasePoint, 0, -80)
		addText(text, textHeight, handrailParams.dxfArr, textBasePoint);
		
		handrailParams.length = params.M - handrailHolderOffset - handrailParams.profWidth;
		if(params.turnType_1 == "забег") {
			handrailParams.length = handrailParams.length / Math.cos(Math.atan(3*params.h2/2/(params.M - handrailHolderOffset - handrailParams.profWidth))) - handrailGap;
		}
		else{
			handrailParams.length = handrailParams.length -= params.b2 + handrailGap;
		}
		handrailParams.dxfBasePoint = newPoint_xy(handrailParams.dxfBasePoint, -handrailParams.length - 700, 0);
		
	    handrailParams = drawHandrail_4(handrailParams); //функция в файле /calculator/general/drawSideHandrail.js
	    var handrail = handrailParams.mesh;
		handrail.rotation.y = -Math.PI/2;
		if(params.turnType_1 == "забег") {
			handrail.rotation.z = Math.atan(3*params.h2/2/(params.M - handrailHolderOffset - handrailParams.profWidth));
		}
		handrail.position.x = params.b1 * params.stairAmt1 + params.M + tyrnAddition;	
		handrail.position.y = handrailYOffset - params.h2;
		if(params.turnType_1 == "забег") {
		    handrail.position.y = handrailYOffset - 3*params.h2/2;
	    }
		handrail.position.z = handrailHolderOffset + handrailParams.profWidth;	
		if(params.turnSide == "левое"){
			handrail.position.z = -handrailHolderOffset - handrailParams.profWidth - (params.M - handrailHolderOffset - handrailParams.profWidth - params.b2) + tyrnAddition;
		    if(params.turnType_1 == "забег") {
		    	handrail.rotation.z = -Math.atan(3*params.h2/2/(params.M - handrailHolderOffset - handrailParams.profWidth));
				handrail.position.y += 3*params.h2/2;
			    handrail.position.z = -handrailHolderOffset + handrailGap - handrailParams.profWidth - (params.M - handrailHolderOffset - handrailParams.profWidth);
		    }		
		}
	    par.handrails.add(handrail);
		
		//сохраняем параметры для спецификации
		railingParams.sideHandrails.push({len: Math.round(handrailParams.length), holderAmt: handrailParams.holderAmt })
		
		//подпись в dxf
		var text = "Пристенный поручень забега (площадки) среднего марша левая сторона";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(handrailParams.dxfBasePoint, 0, -80)
		addText(text, textHeight, handrailParams.dxfArr, textBasePoint);
		
		handrailParams.length = params.M - handrailHolderOffset - handrailParams.profWidth - (par.stairType == "timber"?2*handrailGap:handrailGap) + tyrnAddition;
		if(params.turnType_2 == "забег") {
			handrailParams.length = handrailParams.length / Math.cos(Math.atan(3*params.h3/2/(params.M - handrailHolderOffset - handrailParams.profWidth)));
		}
		handrailParams.dxfBasePoint = newPoint_xy(handrailParams.dxfBasePoint, -handrailParams.length - 700, 0);

	    handrailParams = drawHandrail_4(handrailParams); //функция в файле /calculator/general/drawSideHandrail.js
	    var handrail = handrailParams.mesh;
		handrail.rotation.y = -Math.PI/2;
		if(params.turnType_2 == "забег") {
			handrail.rotation.z = Math.atan(3*params.h3/2/(params.M - handrailHolderOffset - handrailParams.profWidth));
		}
		handrail.position.x = params.b1 * params.stairAmt1 + params.M + tyrnAddition;	
		handrail.position.y = handrailYOffset - params.h2 + params.h2 * (params.stairAmt2 + 1);
		if(params.turnType_2 == "забег") {
		    handrail.position.y = handrailYOffset - params.h2 + params.h2 * (params.stairAmt2 + 1);
	    }
		handrail.position.z = params.b2 * params.stairAmt2 + params.M;	
		if(params.turnSide == "левое"){
			handrail.position.z = -(params.b2 * params.stairAmt2 + params.M + params.M - handrailHolderOffset - handrailParams.profWidth - (par.stairType == "timber"?2*handrailGap:handrailGap) + tyrnAddition);
		    if(params.turnType_2 == "забег") {
		    	handrail.rotation.z = -Math.atan(3*params.h3/2/(params.M - handrailHolderOffset - handrailParams.profWidth));
				handrail.position.y += 3*params.h3/2;
			    handrail.position.z = -(params.b2 * params.stairAmt2 + params.M + params.M - handrailHolderOffset - handrailParams.profWidth - (par.stairType == "timber"?2*handrailGap:handrailGap) + tyrnAddition);
		    }		
		}
	    par.handrails.add(handrail);
		
		//сохраняем параметры для спецификации
		railingParams.sideHandrails.push({len: Math.round(handrailParams.length), holderAmt: handrailParams.holderAmt })
		
		//подпись в dxf
		var text = "Пристенный поручень забега (площадки) среднего марша левая сторона";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(handrailParams.dxfBasePoint, 0, -80)
		addText(text, textHeight, handrailParams.dxfArr, textBasePoint);
	}


	//верхний марш
	var handrailYOffset = params.h1 * (params.stairAmt1 + 1) + params.h2 * (params.stairAmt2 + 1) + 900 + params.h3;
	if(params.turnType_1 == "забег") {
		handrailYOffset += 2*params.h2;
	}
	if(params.turnType_2 == "забег") {
		handrailYOffset += 2*params.h3;
	}
	handrailParams.length = (params.b3 * params.stairAmt3) / Math.cos(Math.atan(params.h3/params.b3));
	handrailParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, -handrailParams.length, -2000);
	
	//правая сторона
	if (params.handrailSide_3 == "внутреннее" || params.handrailSide_3 == "две") {	
	    handrailParams = drawHandrail_4(handrailParams); 
	    var handrail = handrailParams.mesh;
		handrail.rotation.z = -Math.atan(params.h3/params.b3);
		handrail.position.x = params.b1 * params.stairAmt1 - params.b3 * params.stairAmt3;	
		handrail.position.y = handrailYOffset + params.h3 * params.stairAmt3;
		handrail.position.z = topMarshPos_Z - params.M;	
		if(params.turnSide == "левое"){
			handrail.rotation.y = -Math.PI;
		    handrail.rotation.z = Math.atan(params.h3/params.b3);
		    handrail.position.x = params.b1 * params.stairAmt1;	
		    handrail.position.y = handrailYOffset;
		    handrail.position.z = topMarshPos_Z + params.M + leftZ0Offset;	
		}		
	    par.handrails.add(handrail);
		
		//сохраняем параметры для спецификации
		railingParams.sideHandrails.push({len: Math.round(handrailParams.length), holderAmt: handrailParams.holderAmt })
		
		//подпись в dxf
		var text = "Пристенный поручень верхнего марша правая сторона";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(handrailParams.dxfBasePoint, 0, -80)
		addText(text, textHeight, handrailParams.dxfArr, textBasePoint);
	}
	
	//левая сторона
	if (params.handrailSide_3 == "внешнее" || params.handrailSide_3 == "две") {
		if(params.turnType_2 == "площадка") {
		    handrailParams.length = (params.b3 * (params.stairAmt3 + 1)) / Math.cos(Math.atan(params.h3/params.b3));
		}
		handrailParams.dxfBasePoint = newPoint_xy(handrailParams.dxfBasePoint, -handrailParams.length - 700, 0);
		handrailParams = drawHandrail_4(handrailParams); 
	    var handrail = handrailParams.mesh;
		handrail.rotation.y = -Math.PI;
		handrail.rotation.z = Math.atan(params.h3/params.b3);
		handrail.position.x = params.b1 * params.stairAmt1;	
		handrail.position.y = handrailYOffset;
		handrail.position.z = topMarshPos_Z;	
		if(params.turnType_2 == "площадка") {
		    handrail.position.x += params.b3;	
		    handrail.position.y -= params.h3;
		}
		if(params.turnSide == "левое"){
			handrail.rotation.y = 0;
		    handrail.rotation.z = -Math.atan(params.h3/params.b3);
		    handrail.position.x = params.b1 * params.stairAmt1 - params.b3 * params.stairAmt3;	
		    handrail.position.y = handrailYOffset + params.h3 * params.stairAmt3;
		    handrail.position.z = topMarshPos_Z + leftZ0Offset;	
		}
	    par.handrails.add(handrail);
		
		//сохраняем параметры для спецификации
		railingParams.sideHandrails.push({len: Math.round(handrailParams.length), holderAmt: handrailParams.holderAmt })
		
		//подпись в dxf
		var text = "Пристенный поручень верхнего марша левая сторона";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(handrailParams.dxfBasePoint, 0, -80)
		addText(text, textHeight, handrailParams.dxfArr, textBasePoint);
		
		handrailParams.length = params.M - handrailHolderOffset - handrailParams.profWidth;
		if(params.turnType_2 == "забег") {
			handrailParams.length = handrailParams.length / Math.cos(Math.atan(3*params.h3/2/(params.M - handrailHolderOffset - handrailParams.profWidth))) - handrailGap;
		}
		else{
			handrailParams.length -= params.b3 + handrailGap;
		}
		handrailParams.dxfBasePoint = newPoint_xy(handrailParams.dxfBasePoint, -handrailParams.length - 700, 0);
		
	    handrailParams = drawHandrail_4(handrailParams); 
	    var handrail = handrailParams.mesh;
		handrail.rotation.y = -Math.PI;
		if(params.turnType_2 == "забег") {
			handrail.rotation.z = Math.atan(3*params.h3/2/(params.M - handrailHolderOffset - handrailParams.profWidth));
		}
		handrail.position.z = topMarshPos_Z;	
		handrail.position.y = handrailYOffset - params.h3;
		if(params.turnType_2 == "забег") {
		    handrail.position.y = handrailYOffset - 3*params.h3/2;
	    }
		handrail.position.x = params.b1 * params.stairAmt1 + params.M - handrailHolderOffset - handrailParams.profWidth;	
		if(params.turnSide == "левое"){
		    handrail.rotation.y = 0;
			handrail.position.z = topMarshPos_Z + leftZ0Offset;
			handrail.position.x = params.b1 * params.stairAmt1 + params.b3 + handrailGap;
		    if(params.turnType_2 == "забег") {
		    	handrail.rotation.z = -Math.atan(3*params.h3/2/(params.M - handrailHolderOffset - handrailParams.profWidth));
				handrail.position.y += 3*params.h3/2;
			    handrail.position.z = topMarshPos_Z + leftZ0Offset;
				handrail.position.x = params.b1 * params.stairAmt1 + handrailGap;
		    }		
		}
	    par.handrails.add(handrail);
		
		//сохраняем параметры для спецификации
		railingParams.sideHandrails.push({len: Math.round(handrailParams.length), holderAmt: handrailParams.holderAmt })
		
		//подпись в dxf
		var text = "Пристенный поручень забега (площадки) верхнего марша левая сторона";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(handrailParams.dxfBasePoint, 0, -80)
		addText(text, textHeight, handrailParams.dxfArr, textBasePoint);
	}
	return par;	
}//end of draw3marshSideHandrail

/** функция отрисовывает кронштейн пристенного поручня
*/

function drawWallHandrailHolder(par){

	par.mesh = new THREE.Object3D();
	par.profSise = 10;
	par.flanDiam = 60;
	par.flanThk = 3;
	
	var shape = new THREE.Shape();
    var p0 = { "x": par.flanThk, "y": 0.0 };
    var p1 = newPoint_xy(p0, 0, par.profSise);
    var p2 = newPoint_xy(p1, par.wallOffset - par.profSise/2 - par.flanThk, 0.0);
    var p3 = newPoint_xy(p2, 0.0, par.height - par.profSise/2 - 0.01);
    var p4 = newPoint_xy(p3, par.profSise, 0.0);
	var p5 = newPoint_xy(p4, 0, -par.height - par.profSise/2);
	
	addLine(shape, par.dxfArr, p0, p1, par.dxfBasePoint);
    addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
    addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
    addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint);
    addLine(shape, par.dxfArr, p4, p5, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p5, p0, par.dxfBasePoint);

    var extrudeOptions = {
        amount: par.profSise,
        bevelEnabled: false,
        curveSegments: 12,
        steps: 1
		}

    geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
    var hook = new THREE.Mesh(geometry, par.material);
	hook.rotation.y = -Math.PI/2;
	hook.position.x = par.profSise/2;
	hook.position.y = -par.profSise/2 - 0.01;
	par.mesh.add(hook);
	
	var geometry = new THREE.CylinderGeometry(par.flanDiam/2, par.flanDiam/2, par.flanThk, 30, 1, false);
    var base = new THREE.Mesh(geometry, par.material);
	base.rotation.x = Math.PI/2;
	base.position.x = 0;
    base.position.y = 0
    base.position.z = -par.flanThk/2;
	par.mesh.add(base);
	
	//параметры поручня
	var handrailPar = {
		prof: params.handrailProf,
		sideSlots: params.handrailSlots,
		handrailType: params.handrail,
		metalPaint: params.metalPaint_perila,
		timberPaint: params.timberPaint_perila,
		}
	handrailtype = calcHandrailMeterParams(handrailPar).handrailModel; //функция в файле priceLib.js
		
	//сохраняем данные для спецификации
	var partName = "wallHandrailHolder";	
	if(par.isGlassHandrail) partName = "glassHandrailHolder";
	
	if(typeof specObj !='undefined' && partName){
		if(!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				name: "Пристенный кронштейн поручня нерж.",
				metalPaint: false,
				timberPaint: false,
				division: "stock_1",
				workUnitName: "amt",
				group: "Ограждения",
				}
			}
		if(params.sideHandrailHolders == "крашеные") {
			specObj[partName].metalPaint = true;
			specObj[partName].name = "Пристенный кронштейн поручня лазерн.";
			}	
		if(partName == "glassHandrailHolder") specObj[partName].name = "Кронштейн поручня на стекло";
		
		var name = "плоск."
		if(handrailtype == "round") name = "кругл.";		
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}
	par.mesh.specId = partName + name;
	
	
	
return par;
}//end of drawWallHandrailHolder





