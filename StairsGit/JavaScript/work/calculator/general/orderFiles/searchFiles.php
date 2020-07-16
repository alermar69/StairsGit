<?php

/** функция возвращает содержимое папки закза в виде массива
*/

include_once 'fileList.php';

$order_name = $_GET['orderName'];
$path = "/pz/01. Заказы/".$order_name;
$dir = $_SERVER['DOCUMENT_ROOT'].$path;



//echo $dir;

function getDirContent($arr){
	global $dir;

	$dirlist = getFileList($dir . $arr['name']);

	if(!is_array($dirlist)){
		echo json_encode(array('status' => 'not_found', 'data' => $dirlist));
		return;
		die;
		}
	
	foreach ($dirlist as $item){
		if($item[type] == 'directory'){
			//$folder = array('name' => str_replace($dir, "", $item[name]), 'content' => array());
			$folder = getDirContent($folder);
			$arr['content'][] = $folder;
			}
		else{
			$file = array('name' => str_replace($dir, "", $item[name]));
			//не добавляем в массив мусорные файлы
			if(!strpos($file['name'], 'Thumbs.db') && !strpos($file['name'], 'desktop.ini')){
				$arr['content'][] = $file;
				}
			};
		};
	return $arr;
	};


$content = array('name' => '', 'content' => array());

$result = getDirContent($content);
if($result)
	echo json_encode(array('status' => 'ok', 'data' => $result, 'metadata' => $bugProps, 'debug' => $debugInfo ));

//echo json_encode($result)
//print_r($result);


?>