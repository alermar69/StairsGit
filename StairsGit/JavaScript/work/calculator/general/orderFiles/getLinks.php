<?php
include "image.php";
function getFileList($dir)
  {
    // массив, хранящий возвращаемое значение
    $retval = array();

    // добавляет конечный слеш, если была возвращена пустота
    if(substr($dir, -1) != "/") $dir .= "/";

    // указать путь до директории и прочитать список вложенных файлов
    $d = @dir($dir) or die("getFileList: Не удалось открыть каталог $dir для чтения");
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

  /*Входные данные: 
  ** Имя файла - полный физ. путь
  ** Размер новай картинки (ширина, высота), для того чтобы обрезать по одному краю 
  ** нужно указать один параметр как ноль array(800, 0), 
  ** ширина всегда меньшая
  ** Тип обрезки: proportional - сохранять пропорции; extract - обрезка 
  **
  */
  function resize($filename, array $arSize = array(800, 0), $type = 'proportional', $overwrite = true){
	  
	  if(file_exists($filename)){
		  
		$info = pathinfo($filename);
		
		$image = new Image($filename);  

		list($width_orig, $height_orig) = getimagesize($filename);
		
		list($width, $height) = $arSize;
		
		if(!$width && !$height)
			return false;
		
		if($width_orig > $height_orig){
			list($width, $height) = array($height, $width);
		}
		
		$width = $width ? $width : IntVal($height / $height_orig * $width_orig);
		$height = $height ? $height : IntVal($width / $width_orig * $height_orig);
		
		switch($type){
			case 'proportional': 
				$image->resize($width, $height);
			break;
			case 'extract': 
				$type = $type ? ($width_orig > $height_orig ? 'h' : ($width_orig < $height_orig ? 'w' : '') ) : '';
				$image->resize($width, $height, $type);
			break;
		}
		
		$image->save($overwrite ? $filename : ($info['dirname'] . '/' . $info['filename'] . '_sm.' . $info['extension']));
		return true;
	  }
	  return false;
  }

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


$path = "/pz/01. Заказы/".$data[orderName];
if($data[orderName]{0} == "w") $path = "/pz/orders_2/".$data[orderName];

$dir = $_SERVER['DOCUMENT_ROOT'].$path;

//ищем папку, содержащую в названии слово Фото
$folder = "";
if($data[target] == "photos"){
	$dirlist = getFileList($dir);
	foreach ($dirlist as $item){
		if(strpos($item[name], "Фото")) $folder = str_replace($dir, "", $item[name]);
		}	
	};
	
if($data[target] == "techInfo"){
	$dirlist = getFileList($dir);
	foreach ($dirlist as $item){
		if(strpos($item[name], "Техническая")) $folder = str_replace($dir, "", $item[name]);
		}	
	};

if($data[target] == "docInfo"){
	$dirlist = getFileList($dir);
	foreach ($dirlist as $item){
		if(strpos($item[name], "Договоры")) $folder = str_replace($dir, "", $item[name]);
		}	
	};


//echo "Папка".$folder."<br/>";
if($folder != ""){
	$path .= $folder;
	$dir = $_SERVER['DOCUMENT_ROOT'].$path;

	//echo $dir;
	$dirlist = getFileList($dir);

	$result = "<h4>".$path."</h4>";

	if($data[target] == "photos"){
		//картинки в корневой директории
		$isImages = false;
		$result .= '<div>';
		foreach ($dirlist as $item){
			$name = str_replace($dir, "", $item[name]);		
			if($item[type] == "image/jpeg") {
				resize($_SERVER['DOCUMENT_ROOT'] . $path.$name);
				$result .= "<input type='button' data-img='{$path}{$name}' class='rotate-right'>";
				$result .= "<a href='".$path.$name."' data-fancybox='gallery'><img src='".$path.$name."' class='img_150'></a>";
				$isImages = true;
				}
			}
		if(!$isImages) $result .= "В корневой папке изображений не найдено";
		$result .= '</div>';
		//картинки во вложенных директориях
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
					if($item1[type] == "image/jpeg") {
						resize($_SERVER['DOCUMENT_ROOT'] . $path.$name1);
						$result .= "<input type='button' data-img='{$path}{$name1}' class='rotate-right'>";
						$result .= "<a href='".$path.$name1."' data-fancybox='gallery'><img src='".$path.$name1."' class='img_150'></a>";
						}
					}
				}
			}
		$result .= '</div>';
		echo $result;
	}
	/** функция рекурсивно выводит содержимое папки и вложенных папок
	*/
	/*
	echo $path;
	echo $dir;
	echo $folder;
	*/
	$folder = $dir;
	
	function printDirContent($dirlist, $folderName){
		global $dir;
		global $path;
		global $folder;
		
		$isFiles = false;
		echo '<ul>';
		foreach ($dirlist as $item){
			$name = str_replace($dir, "", $item[name]);	
			if($item[type] != "directory") {					
				$fileNname = str_replace($folderName, "", $item[name]);
				echo "<li><a href='".$path.$name."' target='_blank'>".$fileNname."</a></li>";
				$isFiles = true;
				}
			else {
				echo '<li>';
				echo '<p class="folder">/'.$name.'</p>'; 
				$dirlist1 = getFileList($item[name]);
				printDirContent($dirlist1, $item[name]);
				echo '</li>';
			}
		}
		echo '</ul>';
		//if(!$isFiles) echo "папка пустая";
		
	
	}
	if($data[target] != "photos"){
		printDirContent($dirlist, $dir);
		/*
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
		//картинки во вложенных директориях
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
		*/
		
	}
	
	
	
	
}

?>