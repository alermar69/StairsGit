<?
  require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
  $APPLICATION->SetTitle("Шаблон КП на нестандартные изделия v.1.0"); 
?>

<!-- все формы -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/main.php" ?>

<!-- все скрипты -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/scripts.php" ?>

<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>
