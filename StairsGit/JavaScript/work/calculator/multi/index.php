<?
  require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
  $APPLICATION->SetTitle("Расчет лестниц");
?>

<!-- Параметры многоэтажной загрузки -->
<script>
  var isMulti = true;
</script>

<!-- все формы -->
<?php
  $GLOBALS['MULTI'] = true;
  include $GLOBALS['ROOT_PATH']."/calculator/general/forms/main.php"
?>

<!-- все скрипты -->
<?php 
    $GLOBALS['MULTI'] = true;
  include $GLOBALS['ROOT_PATH']."/calculator/general/scripts.php" 
?>

<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>
