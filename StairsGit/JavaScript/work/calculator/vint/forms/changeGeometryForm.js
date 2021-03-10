$(function(){
    $('#fixStairHeight').click(function(){
        var stepAmt = 0;
        if (params.strightMarsh == 'снизу' || params.strightMarsh == 'сверху и снизу') {
            stepAmt += params.stairAmt1;
        }

        if (params.strightMarsh == 'сверху' || params.strightMarsh == 'сверху и снизу') {
            stepAmt += params.stairAmt3;
        }

        stepAmt += params.stepAmt;
        
        var stepHeight = params.staircaseHeight / stepAmt;
        $("#h1").val(stepHeight);
        $("#h3").val(stepHeight);
        recalculate();
    })
})