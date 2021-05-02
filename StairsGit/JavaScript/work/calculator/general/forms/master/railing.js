
$(function(){
	
	//открытие модального окна
	$('#open_master_modal').click(function(){
		$("#master_modal_railing").modal("show")
	});

	$('#railingMasterInputs').delegate('input,select', 'change', function(){
		railingMasterFormChange()
	});

  $('#createConcreteStairs').click(function(){
    drawStair();
  })
  railingMasterFormChange()
});

function railingMasterFormChange(){
  console.log('change')
  $("#railingMasterInputs .marsh1").show(); 
  $("#railingMasterInputs .marsh2").hide();
  $("#railingMasterInputs .marsh3").show();

  if ($("#railingStairGeometry").val() == "Прямая") $("#railingMasterInputs .marsh3").hide();

  if ($("#railingStairGeometry").val() == "П-образная трехмаршевая") {
    $("#railingMasterInputs .marsh2").show();
  }
}

function drawStair(){
  $('.concreteParRow').remove();
  $("#stairSectAmt").val(0);

  var M = 900;

  var par = {};
  $.each($("#railingMasterInputs input, #railingMasterInputs select"), function(){
    par[this.id] = $(this).val();
  });

  var turnFactor = 1;
  if (par.railingStairTurn == 'Левый') turnFactor = -1;

  console.log(par);

  // 1 марш
  var marsh1Id = addConcreteInputs();
  $("#stairSectAmt").val($("#stairSectAmt").val()*1.0 + 1);

  $('.concreteParRow[data-id="'+marsh1Id+'"]').find('input.a').val(par.a1);
  $('.concreteParRow[data-id="'+marsh1Id+'"]').find('input.h').val(par.h1);
  $('.concreteParRow[data-id="'+marsh1Id+'"]').find('input.b').val(par.b1);
  $('.concreteParRow[data-id="'+marsh1Id+'"]').find('input.stairAmt').val(par.stairAmt1);

  redrawConcrete();

  // 2 марш
  if (par.railingStairGeometry == 'П-образная трехмаршевая') {
    var turn2Id = addConcreteInputs();
    $("#stairSectAmt").val($("#stairSectAmt").val()*1.0 + 1);
    var turnType = 'площадка';
    if (par.railingStairGeometry == 'Г-образная с забегом') turnType = 'забег';

    if (turnType == 'площадка') {
    
      $('.concreteParRow[data-id="'+turn1Id+'"]').find('select.sectType').val('площадка');
      $('.concreteParRow[data-id="'+turn1Id+'"]').find('input.h').val(par.h2);
      $('.concreteParRow[data-id="'+turn1Id+'"]').find('input#sectLen' + (turn1Id - 1)).val(M);
      
      var turn2BasePoint = {x:concreteSectParams[1].connectPoint.x, y: concreteSectParams[1].connectPoint.y + par.h2 * 1.0, z: concreteSectParams[1].connectPoint.z - M / 2}
  
      $('.concreteParRow[data-id="'+turn1Id+'"]').find('input.posX').val(turn2BasePoint.x * 1.0);
      $('.concreteParRow[data-id="'+turn1Id+'"]').find('input.posY').val(turn2BasePoint.y * 1.0);
      $('.concreteParRow[data-id="'+turn1Id+'"]').find('input.posZ').val(turn2BasePoint.z * 1.0);
    }else{
      $('.concreteParRow[data-id="'+turn1Id+'"]').find('select.sectType').val('поворот');
      $('.concreteParRow[data-id="'+turn1Id+'"]').find('input.h').val(par.h2);
      $('.concreteParRow[data-id="'+turn1Id+'"]').find('input.stairAmt').val(3);
      
      var turn2BasePoint = {x:concreteSectParams[1].connectPoint.x, y: concreteSectParams[1].connectPoint.y, z: concreteSectParams[1].connectPoint.z - M / 2}
  
      $('.concreteParRow[data-id="'+turn1Id+'"]').find('input.posX').val(turn2BasePoint.x * 1.0);
      $('.concreteParRow[data-id="'+turn1Id+'"]').find('input.posY').val(turn2BasePoint.y * 1.0);
      $('.concreteParRow[data-id="'+turn1Id+'"]').find('input.posZ').val(turn2BasePoint.z * 1.0);
      $('.concreteParRow[data-id="'+turn1Id+'"]').find('input.posAng').val(-90);
    }

    redrawConcrete();

    var marsh2Id = addConcreteInputs();
    $("#stairSectAmt").val($("#stairSectAmt").val()*1.0 + 1);
  
    $('.concreteParRow[data-id="'+marsh2Id+'"]').find('input.a').val(par.a2);
    $('.concreteParRow[data-id="'+marsh2Id+'"]').find('input.h').val(par.h2);
    $('.concreteParRow[data-id="'+marsh2Id+'"]').find('input.b').val(par.b2);
    $('.concreteParRow[data-id="'+marsh2Id+'"]').find('input.stairAmt').val(par.stairAmt2);

    // Поворот марша
    
    var marshBasePoint = newPoint_xyz(turn2BasePoint, concreteSectParams[turn2Id].connectPoint.x, concreteSectParams[turn2Id].connectPoint.y, concreteSectParams[turn2Id].connectPoint.z)
    var rot = 90;
    if (par.railingStairGeometry.indexOf('П-образная') != -1) rot = 180;
    if (par.railingStairTurn == 'Левый') {
      rot *= -1;
    }
    $('.concreteParRow[data-id="'+marsh2Id+'"]').find('input.posAng').val(rot);
    $('.concreteParRow[data-id="'+marsh2Id+'"]').find('input.posX').val(marshBasePoint.x);
    $('.concreteParRow[data-id="'+marsh2Id+'"]').find('input.posY').val(marshBasePoint.y);
    $('.concreteParRow[data-id="'+marsh2Id+'"]').find('input.posZ').val(marshBasePoint.z);
  }

  // 3 марш
  if (par.railingStairGeometry != 'Прямая') {

    var turn2Id = addConcreteInputs();
    $("#stairSectAmt").val($("#stairSectAmt").val()*1.0 + 1);
    var turnType = 'площадка';
    if (par.railingStairGeometry == 'Г-образная с забегом') turnType = 'забег';

    if (turnType == 'площадка') {
    
      $('.concreteParRow[data-id="'+turn2Id+'"]').find('select.sectType').val('площадка');
      $('.concreteParRow[data-id="'+turn2Id+'"]').find('input.h').val(par.h3);
      $('.concreteParRow[data-id="'+turn2Id+'"]').find('input#sectLen' + (turn2Id - 1)).val(M);
      
      var turn2BasePoint = {x:concreteSectParams[1].connectPoint.x, y: concreteSectParams[1].connectPoint.y + par.h3 * 1.0, z: concreteSectParams[1].connectPoint.z - M / 2}
  
      $('.concreteParRow[data-id="'+turn2Id+'"]').find('input.posX').val(turn2BasePoint.x * 1.0);
      $('.concreteParRow[data-id="'+turn2Id+'"]').find('input.posY').val(turn2BasePoint.y * 1.0);
      $('.concreteParRow[data-id="'+turn2Id+'"]').find('input.posZ').val(turn2BasePoint.z * 1.0);
    }else{
      $('.concreteParRow[data-id="'+turn2Id+'"]').find('select.sectType').val('поворот');
      $('.concreteParRow[data-id="'+turn2Id+'"]').find('input.h').val(par.h3);
      $('.concreteParRow[data-id="'+turn2Id+'"]').find('input.stairAmt').val(3);
      if (turnFactor == -1) {
        $('.concreteParRow[data-id="'+turn2Id+'"]').find('input#turnAngle' + (turn2Id - 1)).val(-90);
      }
      
      var turn2BasePoint = {x:concreteSectParams[1].connectPoint.x, y: concreteSectParams[1].connectPoint.y, z: concreteSectParams[1].connectPoint.z - M / 2}
      if (turnFactor == -1) {
        var turn2BasePoint = {x:concreteSectParams[1].connectPoint.x, y: concreteSectParams[1].connectPoint.y, z: concreteSectParams[1].connectPoint.z + M / 2}
      }
      $('.concreteParRow[data-id="'+turn2Id+'"]').find('input.posX').val(turn2BasePoint.x * 1.0);
      $('.concreteParRow[data-id="'+turn2Id+'"]').find('input.posY').val(turn2BasePoint.y * 1.0);
      $('.concreteParRow[data-id="'+turn2Id+'"]').find('input.posZ').val(turn2BasePoint.z * 1.0);
      $('.concreteParRow[data-id="'+turn2Id+'"]').find('input.posAng').val(-90);
    }

    redrawConcrete();

    var marsh3Id = addConcreteInputs();
    $("#stairSectAmt").val($("#stairSectAmt").val()*1.0 + 1);
  
    $('.concreteParRow[data-id="'+marsh3Id+'"]').find('input.a').val(par.a3);
    $('.concreteParRow[data-id="'+marsh3Id+'"]').find('input.h').val(par.h3);
    $('.concreteParRow[data-id="'+marsh3Id+'"]').find('input.b').val(par.b3);
    $('.concreteParRow[data-id="'+marsh3Id+'"]').find('input.stairAmt').val(par.stairAmt3);

    // Поворот марша
    
    var marshBasePoint = newPoint_xyz(turn2BasePoint, concreteSectParams[turn2Id].connectPoint.x, concreteSectParams[turn2Id].connectPoint.y, concreteSectParams[turn2Id].connectPoint.z);
    if (turnFactor == -1) {
      var marshBasePoint = newPoint_xyz(turn2BasePoint, concreteSectParams[turn2Id].connectPoint.x + M, concreteSectParams[turn2Id].connectPoint.y, concreteSectParams[turn2Id].connectPoint.z);
      if (turnType == 'площадка') {
        var marshBasePoint = newPoint_xyz(turn2BasePoint, concreteSectParams[turn2Id].connectPoint.x + M, concreteSectParams[turn2Id].connectPoint.y, concreteSectParams[turn2Id].connectPoint.z + M);
      }
    }
    var rot = 90;
    if (par.railingStairGeometry.indexOf('П-образная') != -1) rot = 180;
    rot *= turnFactor;
    
    $('.concreteParRow[data-id="'+marsh3Id+'"]').find('input.posAng').val(rot);
    $('.concreteParRow[data-id="'+marsh3Id+'"]').find('input.posX').val(marshBasePoint.x);
    $('.concreteParRow[data-id="'+marsh3Id+'"]').find('input.posY').val(marshBasePoint.y);
    $('.concreteParRow[data-id="'+marsh3Id+'"]').find('input.posZ').val(marshBasePoint.z);
  }

  redrawConcrete();
}