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
function toggleDomeDoor(){
	if (window.domeDoor && window.animations) {
		var fakeContext = {
			animationProgress: function(animationName, progress){
				switch (animationName) {
					case 'openDoor':
						window.domeDoor.rotation.y = -Math.PI / 2 + (Math.PI / 2) * progress;
						break;
					case 'closeDoor':
						window.domeDoor.rotation.y = (-Math.PI / 2) * progress;
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