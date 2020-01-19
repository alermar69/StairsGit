<?php
include "image.php";

$data = array();
switch(strtoupper($_SERVER["REQUEST_METHOD"]))
{
	case 'POST': // сохраняем параметры
		$post = true;
		$data = $_POST;
		break;
	case 'GET':
		$post = false;
		$data = $_GET;
		break;
	default: exit();
}

foreach ($data as $name=>$val)
{
  ${$name} = $val; 
}

if($img && file_exists($_SERVER['DOCUMENT_ROOT'] . $img)){
	$image = new Image($_SERVER['DOCUMENT_ROOT'] . $img);
	$image->rotate(90);
	$image->save($_SERVER['DOCUMENT_ROOT'] . $img);
	echo json_encode(array('STATUS' => 'SUCCESS', 'HTML' => ''), JSON_UNESCAPED_UNICODE);
}else{
	echo json_encode(array('STATUS' => 'ERROR', 'MESSAGE' => 'Картинка не найденна'), JSON_UNESCAPED_UNICODE);
}
return;
?>