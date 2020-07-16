<?php

function getFileList($dir) {
    // массив, хранящий возвращаемое значение
    $retval = array();

    // добавляет конечный слеш, если была возвращена пустота
    if(substr($dir, -1) != "/") $dir .= "/";
	$errorText = "Не удалось открыть каталог ".substr_replace($dir, "", 0, 37);

    // указать путь до директории и прочитать список вложенных файлов
    $d = @dir($dir) or die($errorText);
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
}//end of getFileList
  
function getFileLinks($path, $ornamentName){
if($path != ""){
	$dir = $GLOBALS['ROOT_PATH'].$path;
	$dirlist = getFileList($dir);
	$result = "<h4>".$ornamentName." ".$path."</h4>";

	//файлы в корневой директории	
		$isFiles = false;
		$result .= '<div>';
		foreach ($dirlist as $item){
			if($item[type] != "directory") {
				$name = str_replace($dir, "", $item[name]);		
				$result .= "<a href='".$path.$name."' target='_blank'>".$name."</a></br>";
				$isFiles = true;
				}
			}
		if(!$isFiles) $result .= "В корневой папке файлов не найдено";
		$result .= '</div>';
		//файлы во вложенных директориях
		$emty_dir = true;
		$result1 = "";
		$result .= '<div>';
		foreach ($dirlist as $item){
			$name = str_replace($dir, "", $item[name]);
			if($item[type] == "directory") {
				$result .= "<h4>".$path.$name."</h4>"; 
				$dirlist1 = getFileList($item[name]);
				foreach ($dirlist1 as $item1){
					$name1 = str_replace($dir, "", $item1[name]);					
					$result .= "<a href='".$path.$name1."' target='_blank'>".$name1."</a></br>";
					}
				}
			}
		$result .= '</div>';	
	echo $result;
	} 
}//end of getFileLinks


function getPrvLinks($path){
	$result = "";
	$dir = $GLOBALS['ROOT_PATH'].$path;
	$dirlist = getFileList($dir);
	
	//картинки во вложенных директориях
	foreach ($dirlist as $item){
		$name = str_replace($dir, "", $item[name]);
		if($item[type] == "directory") {
			//$result .= "<h4>".$path.$name."</h4>"; 
			$dirlist1 = getFileList($item[name]);
			foreach ($dirlist1 as $item1){
				$name1 = str_replace($dir, "", $item1[name]);
				if($item1[type] == "image/png") {
					//resize($GLOBALS['ROOT_PATH'] . $path.$name1);
					//$result .= "<input type='button' data-img='{$path}{$name1}' class='rotate-right'>";
					$folderName = str_replace("/", "", $name);
					$result .= "<img src='".$path.$name1."' class='prvImg' data-folder='$folderName'>";
					}
				}
			}
		}
	
	echo $result;
} //end of getPrvLinks
 
 
//основная функция

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

if($data[linkType] == "files"){
	//узор на подступенках
	if($data[riserOrnamentSeries] != "no" && $data[riserOrnamentNumber] != ""){
		$path = "/images/carving/risers/".$data[riserOrnamentSeries]."/".$data[riserOrnamentNumber];
		$ornamentName = "Узор на подступенках";
		getFileLinks($path, $ornamentName);
		};

	//Верхний узор каркаса
	if($data[topOrnamentSeries] != "no" && $data[topOrnamentNumber] != ""){
		$folder = "/images/carving/carcas_corner/";
		if($data[stringerType] == "tet"){
			$folder = "/images/carving/carcas_line/";
			};
		$path = $folder.$data[topOrnamentSeries]."/".$data[topOrnamentNumber];
		$ornamentName = "Верхний узор каркаса";
		getFileLinks($path, $ornamentName);
		};

	//нижний узор каркаса
	if($data[botOrnamentSeries] != "no" && $data[botOrnamentNumber] != ""){
		$path = "/images/carving/carcas_line/".$data[botOrnamentSeries]."/".$data[botOrnamentNumber];
		$ornamentName = "Нижний узор каркаса";
		getFileLinks($path, $ornamentName);
		};
	
	};
	
if($data[linkType] == "riserPrv"){
	$path = "/images/carving/risers/".$data[riserOrnamentSeries];
		getPrvLinks($path);	

	};
	
	
?>