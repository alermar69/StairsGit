<?php

/** функция возвращает список файлов директории с описанием
*/
function getFileList($dir){

	// массив, хранящий возвращаемое значение
	$retval = array();

	// добавляет конечный слеш, если была возвращена пустота
	if(substr($dir, -1) != "/") $dir .= "/";

	// указать путь до директории и прочитать список вложенных файлов
	$d = @dir($dir);
	if(!$d) return 'Не удалось открыть каталог';

if($d){
	while(false !== ($entry = $d->read())) {

	  // пропустить скрытые файлы
	  if($entry[0] == ".") continue;
	  if(is_dir("$dir$entry")) {
		$retval[] = array(
		  "name" => "$dir$entry/",
		  "size" => 0,
		  "lastmod" => filemtime("$dir$entry"),
		  "type" => mime_content_type("$dir$entry")
		);
	  } elseif(is_readable("$dir$entry")) {
		$retval[] = array(
		  "name" => "$dir$entry",
		  "size" => filesize("$dir$entry"),
		  "lastmod" => filemtime("$dir$entry"),
		  "type" => mime_content_type("$dir$entry")
		);
	  }
	}
	$d->close();
	
	return $retval;
}
	
}