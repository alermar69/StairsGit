var isDoorsFixed = false

function onObjSelection(obj){

	//добавление выделенной полки/ящика в список выделенных
	if(obj.parent.boxId != undefined) obj.boxId = obj.parent.boxId;
	if(obj.boxId != undefined){
		var material = obj.material.clone();	
		obj.material = material;
		//снятие выделения
		if(obj.material.transparent){
			obj.material.transparent = false;
			var pos = selectedItems.indexOf(obj.boxId);
			selectedItems.splice(pos, 1)
			}
		//выделение
		else{
			obj.material.transparent = true;
			obj.material.opacity = 0.6;
			selectedItems.push(obj.boxId);
			}
		
		obj.material.needsUpdate = true;
		changeAllForms();
		}

		//Открывание двери
	var doorId = obj.doorId;
	if(obj.parent.doorId != undefined) doorId = obj.parent.doorId;
	if(doorId != undefined && !isDoorsFixed) {
		var doorParts = getObjectsByProp("doorId", doorId);
		
		//определяем ряд и индекс для выбранной двери
		for(var row in doorPos.rows){
			for(var i=0; i<doorPos.rows[row].length; i++){
				if(doorPos.rows[row][i].id == doorId) {
					var objRow = row;
					var index = i;
					}					
				}
			}
		
		if(objRow != undefined && index != undefined){
			var door = doorPos.rows[objRow][index];
			var rightDoor = doorPos.rows[objRow][index + 1];
			var leftDoor = doorPos.rows[objRow][index - 1];
			
			if(rightDoor == undefined) rightDoor = {pos: doorPos.rightEnd + doorPos.doorMooveStep};
			if(leftDoor == undefined) leftDoor = {pos: doorPos.leftEnd - doorPos.doorMooveStep};
			
			//анимированное смещение двери
			var mooveDoor = function(dist){
				var animationTime = 1000; //миллисекунд
				var animationFrameAmt = 20; //кол-во кадров анимации
				var step = dist / animationFrameAmt; //шаг анимации
				// начать движение
				var timerId = setInterval(function() {
					 $(doorParts).each(function(){
						this.position.x += step;
						});
				}, animationTime / animationFrameAmt);
				
				// через animationTime остановить движение
				setTimeout(function() {
				  clearInterval(timerId);
				}, animationTime);
			}
			
			//если есть возможность сдвигаем вправо
			if(door.pos < doorPos.rightEnd && door.pos < rightDoor.pos - doorPos.doorMooveStep) {
				mooveDoor(doorPos.doorMooveStep)
				door.pos += doorPos.doorMooveStep;
				}
			//если нет возможности сдвинуть вправо, пробуем влево
			else if(door.pos > doorPos.leftEnd  && door.pos > leftDoor.pos + doorPos.doorMooveStep){
				mooveDoor(-doorPos.doorMooveStep)
				door.pos -= doorPos.doorMooveStep;
				}
			}			


		
		}


}//end of onObjSelection