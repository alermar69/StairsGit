<?php
header('Content-Type: text/html; charset=utf-8');

$url = $_GET['url'];
// echo $_SERVER['DOCUMENT_ROOT'].$url;
$content = file_get_contents($_SERVER['DOCUMENT_ROOT'].$url, true);
$content_utf8 = mb_convert_encoding($content, "utf-8", "windows-1251");

echo $content_utf8;