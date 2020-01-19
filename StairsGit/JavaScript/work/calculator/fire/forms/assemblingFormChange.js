function changeFormAssembling() {
/*показываем опции доставки*/
var delivery = getInputValue("delivery");
var isAssembling = getInputValue("isAssembling");

if(delivery == "Московская обл.") 
	document.getElementById("deliveryDist_tr").style.display = "table-row";
else
	document.getElementById("deliveryDist_tr").style.display = "none";
//console.log(isAssembling)
/*показываем опции установки*/
var installation_tr = document.getElementsByClassName("installation_tr");
if(isAssembling == "есть") 
	for (var i=0; i<installation_tr.length; i++) 
		installation_tr[i].style.display = "table-row";
else 
	for (var i=0; i<installation_tr.length; i++) 
		installation_tr[i].style.display = "none";
}