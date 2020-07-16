class OptionalDrawing{
	constructor(){
		this.queue = {ungrouped:[]}; // Очередь отрисовки, очищается перед каждой отрисовкой
	}

	clear(){
		this.queue = {ungrouped: []};
	}

	addToQueue(par, group){
		if (!group) group = 'ungrouped';
		if (!this.queue[group]) this.queue[group] = [];
		this.queue[group].push(par);
	}
	
	draw(group){
		if(!group) group = 'ungrouped';
		for (let i = 0; i < this.queue[group].length; i++) {
			const element = this.queue[group][i];
			if (element && !element.isDrawed) {
				if (element.drawingFunction) {
					var mesh = element.drawingFunction(element.par);
					if (mesh) {
						if (element.position) {
							mesh.position.x = element.position.x || 0;
							mesh.position.y = element.position.y || 0;
							mesh.position.z = element.position.z || 0;
						}
						if (element.rotation) {
							mesh.rotation.x = element.rotation.x || 0;
							mesh.rotation.y = element.rotation.y || 0;
							mesh.rotation.z = element.rotation.z || 0;
						}
						if (element.parent && element.parent.add) {
							element.parent.add(mesh);
						}
					}
				}
				element.isDrawed = true;
			}
		}
	}
}