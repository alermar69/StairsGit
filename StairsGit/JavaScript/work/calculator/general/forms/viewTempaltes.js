$(function(){
    $(".toggleViewTemplate").click(function(){
        changeTemplateView($(this).attr('data-view_type'));
    })
});

var currentView = 'editing';

function changeTemplateView(viewType){
    debugger;
    if (currentView == 'construction_task') closeConstructionTask();
    if (currentView == 'print') togglePrintMode(false);

    if (viewType == 'construction_task') createConstructionTaskWrapper();
    if (viewType == 'print') togglePrintMode(true);

    currentView = viewType;
}