class Stair extends AdditionalObject {
    constructor(par) {
        super(par);
        this.noRemoveObject = true;
    }

    static getMeta() {
        return {
            title: 'Лестница',
            noRedraw: true,
            inputs: [
                {
                    key: "orderName",
                    title: "Номер заказа",
                    type: "text",
                    printable: "true",
                },
                {
                    key: "updateIsolatedObject",
                    title: "Обновить",
                    type: "action",
                }
            ]
        }
    }
}

/**
 * 
*/
function updateIsolatedObject(form, context) {
	if (isolationManger) {
        form.find('[data-propid="updateIsolatedObject"] button').attr('disabled', true);
        form.find('[data-propid="updateIsolatedObject"] button').html('Запрос к базе данных');
        
        var orderName = context.meshParams.orderName;
        var settings = {
            dataType: 'json',
            url: '/orders/calc-controller/get-by-ordername/' + orderName,
            type: 'GET',
            success: function (data) {
                console.log(data);

                form.find('[data-propid="updateIsolatedObject"] button').html('Загрузка среды');

                var mesh = additional_objects_contexts[context.id];
                mesh.children.forEach(function(child){
                    mesh.remove(child);
                })
                isolationManger.addInstance({calcType: 'metal'}, function(instance){
                    
                    form.find('[data-propid="updateIsolatedObject"] button').html('Загрузка модели');
                    setTimeout(() => {
                        instance.context.setLoadedData(data, false, function(){
                            instance.getObject('Main', function(obj){
                                mesh.add(obj);
                                form.find('[data-propid="updateIsolatedObject"] button').attr('disabled', false);
                                form.find('[data-propid="updateIsolatedObject"] button').html('Обновить');
                            });
                        });
                    }, 1550);
                });
            },
            error: function (a, b) {}
        };
        $.ajax(settings);
    }
}