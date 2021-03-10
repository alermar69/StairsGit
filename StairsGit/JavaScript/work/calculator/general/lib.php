<?php

if (isset($USER) && $USER->GetLogin() == 'dev_demo') {
	if (!strpos(getRootUrl(), 'dev_demo.')) {
		header("Location: https://dev_demo.6692035.ru/orders/orders");
		exit;
	}
}

function getRootUrl()
{
	return 'https://' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
}

function getCalcType()
{
	$url = getRootUrl();

	$calc_types = ['bolz', 'console', 'metal', 'mono', 'railing', 'timber', 'timber_stock', 'vhod', 'vint', 'geometry', 'wardrobe', 'wardrobe_2', 'carport', 'objects', 'veranda', 'slabs', 'table', 'sill', 'sideboard', 'coupe','custom', 'fire_2'];
	
	$calc_type = '';
	foreach($calc_types as $item){
		if (strpos($url,'/'.$item.'/') !== false) $calc_type = $item;
	};

	if (isset($_GET['multiCalcType'])) {
		return $_GET['multiCalcType'];
	}else{
		return $calc_type;
	}
}

function userIsBoss(){
	global $USER;
	return $USER->IsAdmin() || in_array(9, $USER->GetUserGroupArray());
}

function getTemplate()
{
	$url = getRootUrl();

	$templates = ['calculator', 'manufacturing', 'installation', 'customers', 'cnc'];
	$template = '';
	foreach($templates as $item){
		if (strpos($url,'/'.$item) !== false) $template = $item;
	};

	return $template;
}

function getCalcTypeIsStair(){
	$calc_type = getCalcType();
	$notStairs = ['railing', 'wardrobe', 'wardrobe_2', 'carport', 'table', 'slabs', 'sill', 'sideboard', 'coupe', 'objects'];
	
	return !in_array($calc_type, $notStairs);
}
