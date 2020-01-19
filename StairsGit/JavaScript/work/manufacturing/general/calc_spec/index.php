<?php 

$method = $_SERVER["REQUEST_METHOD"];

if($method == 'POST'){

	$order = $_POST['order'];
	$manager = $_POST['manager'];
	$tables = json_decode($_POST['tables'], JSON_UNESCAPED_UNICODE);

	error_reporting(E_ALL);
	ini_set('display_errors', TRUE);
	ini_set('display_startup_errors', TRUE);
	
	define('EOL',(PHP_SAPI == 'cli') ? PHP_EOL : '<br />');
	
	date_default_timezone_set('Europe/Moscow');
	
	require_once('PHPExcel.php');
	
	require_once('PHPExcel/Writer/Excel5.php');
	
	$xls = new PHPExcel();
	
	$xls->setActiveSheetIndex(0);
	
	$sheet = $xls->getActiveSheet();
	
	$sheet->getPageSetup()
	       ->setOrientation(PHPExcel_Worksheet_PageSetup::ORIENTATION_PORTRAIT);
	$sheet->getPageSetup()
	       ->SetPaperSize(PHPExcel_Worksheet_PageSetup::PAPERSIZE_A4);
	// Поля документа
	$sheet->getPageMargins()->setTop(0.79);
	$sheet->getPageMargins()->setRight(0.39);
	$sheet->getPageMargins()->setLeft(0.39);
	$sheet->getPageMargins()->setBottom(0.79);
	
	//ширина колонок
	$sheet->getColumnDimension('A')->setWidth(31.4);
	$sheet->getColumnDimension('B')->setWidth(7.82);
	$sheet->getColumnDimension('C')->setWidth(20.48);
	$sheet->getColumnDimension('D')->setWidth(30.12);
	
	//имя листа
	$sheet->setTitle('Спецификация');
	
	
	$arial12b = array(
	    'font'  => array(
	        'bold'  => true,
	        'color' => array('rgb' => '000000'),
	        'size'  => 12,
	        'name'  => 'Arial'
	    ));
	$arial12 = array(
	    'font'  => array(
	        'bold'  => false,
	        'color' => array('rgb' => '000000'),
	        'size'  => 12,
	        'name'  => 'Arial'
	    ));
	
	$arial10b = array(
	    'font'  => array(
	        'bold'  => true,
	        'color' => array('rgb' => '000000'),
	        'size'  => 10,
	        'name'  => 'Arial'
	    ));
	$arial10 = array(
	    'font'  => array(
	        'bold'  => false,
	        'color' => array('rgb' => '000000'),
	        'size'  => 10,
	        'name'  => 'Arial'
	    ));
	
	$type = isset($_POST['type']) ? $_POST['type'] : false;
	if($type && $type == 'full'){
	
		
		//Заголовок
		$sheet->setCellValue("A1", 'Спецификация №');
		$sheet->getStyle('A1')->getAlignment()->setHorizontal(
		    PHPExcel_Style_Alignment::HORIZONTAL_RIGHT);
		$sheet->getStyle('A1')->applyFromArray($arial12b);
		
		$sheet->setCellValue("B1", $order);
		$sheet->getStyle('B1')->applyFromArray($arial12b);
		
		//менеджер
		$sheet->setCellValue("A2", 'Менеджер');
		$sheet->getStyle('A2')->getAlignment()->setHorizontal(
		    PHPExcel_Style_Alignment::HORIZONTAL_RIGHT);
		$sheet->getStyle('A2')->applyFromArray($arial10);
		
		$sheet->setCellValue("B2", $manager);
		$sheet->getStyle('B2')->applyFromArray($arial10);
		
		//инженер
		$sheet->setCellValue("A3", 'Инженер');
		$sheet->getStyle('A3')->getAlignment()->setHorizontal(
		    PHPExcel_Style_Alignment::HORIZONTAL_RIGHT);
		$sheet->getStyle('A3')->applyFromArray($arial10);
		$endRow = 5;
		foreach($tables as $table){
		   $endRow = printTable($sheet, $table['title'], $table['rows'], $endRow);		   
		}
	}
	else {
		$endRow = 0;
		foreach($tables as $table){
		   $endRow = printTableSimple($sheet, $table['rows'], $endRow);
		}
	}
	
	
	
	
	
	
	 header ( "Expires: Mon, 1 Apr 1974 05:00:00 GMT" );
	 header ( "Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT" );
	 header ( "Cache-Control: no-cache, must-revalidate" );
	 header ( "Pragma: no-cache" );
	 header ( "Content-type: application/vnd.ms-excel" );
	 header ( "Content-Disposition: attachment; filename=".($type? 'spec.xls':'spec_stock.xls') );
	
	 $objWriter = new PHPExcel_Writer_Excel5($xls);
	 $objWriter->save('php://output');
}
function printTable(&$sheet, $caption, $data = [], $startRow = 5){

	$arial11b = array(
	    'font'  => array(
	        'bold'  => true,
	        'color' => array('rgb' => '000000'),
	        'size'  => 11,
	        'name'  => 'Arial'
	    ));
	$arial10b = array(
	    'font'  => array(
	        'bold'  => true,
	        'color' => array('rgb' => '000000'),
	        'size'  => 10,
	        'name'  => 'Arial'
	    ));
	$arial10 = array(
	    'font'  => array(
	        'bold'  => false,
	        'color' => array('rgb' => '000000'),
	        'size'  => 10,
	        'name'  => 'Arial'
	    ));
	//Таблицы спецификаций
	$sheet->setCellValue("A{$startRow}", $caption);
	$sheet->getStyle("A{$startRow}")->applyFromArray($arial11b);
	
	$sheet->mergeCells("A{$startRow}:D{$startRow}");
	
	$sheet->getStyle("A{$startRow}")->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
	$startRow++;
	if($caption != "Приблизительный расход материала"){
		$sheet->setCellValue("A{$startRow}", 'Наименование');
		$sheet->setCellValue("B{$startRow}", 'Кол-во');
		$sheet->setCellValue("C{$startRow}", 'Покраска');
		$sheet->setCellValue("D{$startRow}", 'Коментарии');
		$sheet->setCellValue("E{$startRow}", 'C модели');
	};
	if($caption == "Приблизительный расход материала"){
		$sheet->setCellValue("A{$startRow}", 'Наименование');
		$sheet->setCellValue("B{$startRow}", 'Ед. изм.');
		$sheet->setCellValue("C{$startRow}", 'Кол-во');
		$sheet->setCellValue("D{$startRow}", 'Коментарии');
	};
	$sheet->getStyle("A{$startRow}:E{$startRow}")->applyFromArray($arial10b);
	$sheet->getStyle("A{$startRow}:E{$startRow}")->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
	$sheet->getStyle("A{$startRow}:E{$startRow}")->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);

	$oldStartRow = $startRow;
	foreach($data as $row){
		$startRow++;
		$sheet->setCellValue("A{$startRow}", $row[0]);
		$sheet->getStyle("A{$startRow}")->getAlignment()->setWrapText(true);
		$sheet->setCellValue("B{$startRow}", $row[1]);
		$sheet->getStyle("B{$startRow}")->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
		$sheet->setCellValue("C{$startRow}", $row[2]);
		$sheet->getStyle("C{$startRow}")->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
		$sheet->setCellValue("D{$startRow}", $row[3]);
		$sheet->setCellValue("E{$startRow}", $row[4]);
		$sheet->getStyle("E{$startRow}")->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
		$sheet->getStyle("D{$startRow}")->getAlignment()->setWrapText(true);

	}
	$style_wrap = [
	    // рамки
	    'borders'=>[
	        // внешняя рамка
	        'outline' => [
	            'style'=>PHPExcel_Style_Border::BORDER_THIN,
	            'color' => [
	                'rgb'=>'000000'
	            ]
	        ],
	        // внутренняя
	        'allborders'=>[
	            'style'=>PHPExcel_Style_Border::BORDER_THIN,
	            'color' => [
	                'rgb'=>'000000'
	            ]
	        ]
	    ]
	];
	$sheet->getStyle("A{$oldStartRow}:E{$startRow}")->applyFromArray($style_wrap);
    $oldStartRow++;
    $sheet->getStyle("A{$oldStartRow}:E{$startRow}")->applyFromArray($arial10);
	return ($startRow+2);
}

function printTableSimple(&$sheet, $data = [], $startRow = 1){
	foreach($data as $row){
		$startRow++;
		$sheet->setCellValue("A{$startRow}", $row[0]);
		$sheet->getStyle("A{$startRow}")->getAlignment()->setWrapText(true);
		$sheet->setCellValue("B{$startRow}", $row[1]);
	}
	return $startRow;
}


?>