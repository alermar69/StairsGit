class SceneInstance{
    constructor(par){
        this.ready = false;
        this.orderName = par.orderName;
        this.scene = new THREE.Scene();
        createLights(this.scene);

        this.prepareData();
    }

    prepareData(){
        var self = this;
        var settings = {
            dataType: 'json',
            url: '/orders/calc-controller/get-by-ordername/' + this.orderName,
            type: 'GET',
            success: function (data) {
                self.data = data;
                self.ready = true;
                self.recalculate();
            },
            error: function (a, b) {}
        };
        $.ajax(settings);
    }

    recalculate(){
        if (this.ready) {
            view.scene = this.scene;
            IS_ISOLATION = true;
            var self = this;
            setLoadedData(this.data, false, function(){
                self.scene.traverse(function(node){
                    if (node.material) node.material = node.material.clone();
                })
                view.scene = window.scene;
                if (window.loadedData) setLoadedData(loadedData)
            })
        }else{
            console.warn('Instance is not ready')
        }
    }
}