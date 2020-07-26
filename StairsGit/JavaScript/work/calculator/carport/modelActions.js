$(function(){
	$('body').on('click', '#toggleDomeDoor', function(){
		toggleDomeDoor();
	});

	$('.mainButtons').append('<button class="btn btn-outline-secondary dome" id="toggleDomeDoor">Открыть/Закрыть</button>');

});

window.domeDoorOpen = false;
/**
 * Функция открывает/закрывает дверь навеса
 */
function toggleDomeDoor(state){
	console.log(state)
	if ((window.domeDoor || window.moovableSections) && window.animations) {
		
		//поворотный сектор
		if(params.carportType == 'купол'){
			var fullAngle = (params.doorAng + params.overlayAng * 2) / 180 * Math.PI;
			var closedPosAng = -fullAngle + (params.overlayAng / 180 * Math.PI)
			if(state != undefined) window.domeDoorOpen = state;
			var fakeContext = {
				animationProgress: function(animationName, progress){
					switch (animationName) {
						case 'openDoor':
							window.domeDoor.rotation.y = closedPosAng + fullAngle * progress;
							break;
						case 'closeDoor':
							window.domeDoor.rotation.y = closedPosAng * progress;
							break;
					}
				}
			}
		}
		
		//сдвижные секции
		if(params.carportType == 'сдвижной') {
			//var fullAngle = (params.doorAng + params.overlayAng * 2) / 180 * Math.PI;
			//var closedPosAng = -fullAngle + (params.overlayAng / 180 * Math.PI)
			if(state != undefined) window.domeDoorOpen = state;
			var fakeContext = {
				animationProgress: function(animationName, progress){
					switch (animationName) {
						case 'openDoor':
							$.each(window.moovableSections, function(i){
								var mooveLen = (params.sectAmt - i - 1) * params.sectLen;
								this.position.z = mooveLen * progress;
							})							
							break;
						case 'closeDoor':
							$.each(window.moovableSections, function(i){
								var mooveLen = (params.sectAmt - i - 1) * params.sectLen;
								this.position.z = mooveLen * (1 - progress);
							})	
							break;
					}
				}
			}
		}
				
		animations.push({
			animationName: window.domeDoorOpen == true ? 'closeDoor' : 'openDoor',
			timeStart: new Date().getTime(),
			duration: 1000,
			context: fakeContext
		});
		window.domeDoorOpen = !window.domeDoorOpen;
	}
}