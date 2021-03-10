class InstanceManager{
    constructor(par){
        this.instances = [];
    }

    addInstance(par){
        this.instances.push(new SceneInstance(par));
    }
}