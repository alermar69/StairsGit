class IsolationInstance{
    constructor(par){
        var queryString = $.param(par.query);
        this.htmlElement = $("<iframe style='width: 0px; height: 0px;' src='/calculator/general/isolation/isolation.php?"+queryString+"' frameborder='0'></iframe>");
        $('#isolationIframes').append(this.htmlElement);
        this.context = this.htmlElement[0].contentWindow;
        if (par.loadedData) this.context.loadedData = par.loadedData
    }

    getObject(name, callback){
        try {
            var obj = this.context.view.scene.children.find(function(obj){return obj.name == name});
            this.context.view.scene.remove(obj);
            obj.traverse(function(node){
                if (node.material) node.material = node.material.clone();
                node.noRemoveObject = true;
            })
            setTimeout(() => {
                callback(obj)
            }, 0);
        } catch (error) {
            console.warn('context error')
        }
    }
}