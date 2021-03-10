class IsolationManger{
    constructor(par){
        this.instances = {};
    }

    addInstance(par, callback){
        if (!this.instances[par.calcType]) {
            var self = this;
            let instancePar = {
                query:{
                    calcType: par.calcType,
                },
                loadedData: par.loadedData
            }
            this.instances[par.calcType] = new IsolationInstance(instancePar);
            if (callback) {
                this.instances[par.calcType].context.addEventListener("iframeLoaded", function(event){
                    callback(self.instances[par.calcType]);
                }, false);
            }
        }else{
            if (callback) callback(this.instances[par.calcType]);
        }
    }
}