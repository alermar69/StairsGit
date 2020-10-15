<?php

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

	return $calc_type;
}

function getTemplate()
{
	$url = getRootUrl();

	$templates = ['calculator', 'manufacturing', 'installation', 'customers'];
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
