$(function(){
	$('body').on('click', '#toggleDomeDoor', function(){
		toggleDomeDoor();
	});

	$('.mainButtons').append('<button class="btn btn-outline-secondary dome" id="toggleDomeDoor">Открыть/Закрыть</button>');
	if(params.carportType == 'купол') {
		$('.doors-toggle').show();
	}
});

window.domeDoorOpen = false;
/**
 * Функция открывает/закрывает дверь навеса
 */
function toggleDomeDoor(state){
	if (window.domeDoor && window.animations) {
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
		animations.push({
			animationName: window.domeDoorOpen == true ? 'closeDoor' : 'openDoor',
			timeStart: new Date().getTime(),
			duration: 1000,
			context: fakeContext
		});
		window.domeDoorOpen = !window.domeDoorOpen;
	}
}