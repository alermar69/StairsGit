<?php
    $GLOBALS['ROOT_PATH'] = "/home/users/c/cbi4/domains/egorov.6692035.ru";
    $_SERVER['SERVER_NAME'] = 'egorov.6692035.ru';
	$_SERVER['REQUEST_URI'] = '/';
    
    function getRootUrl()
    {
        return 'https://' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
    }

    function getCalcType()
    {
        // $calc_types = ['bolz', 'console', 'metal', 'mono', 'railing', 'timber', 'timber_stock', 'vhod', 'vint', 'geometry', 'wardrobe', 'wardrobe_2', 'carport', 'objects', 'veranda', 'slabs', 'table', 'sill', 'sideboard', 'coupe','custom', 'fire_2'];
        return $_GET['calcType'];
    }

    function getTemplate()
    {
        return 'calculator';
    }

    function getCalcTypeIsStair(){
        $calc_type = getCalcType();
        $notStairs = ['railing', 'wardrobe', 'wardrobe_2', 'carport', 'table', 'slabs', 'sill', 'sideboard', 'coupe', 'objects'];
        
        return !in_array($calc_type, $notStairs);
    }

    class User
    {
        public function IsAdmin()
        {
            return false;
        }

        public function GetUserGroupArray()
        {
            return [];
        }

        public function GetLastName(){
            return "";
        }

        public function GetEmail(){
            return "";
        }

        public function GetLogin(){
            return "";
        }
    }

    $USER = new User();
?>
<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>

<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/gh/kenwheeler/slick@1.8.1/slick/slick.css"/>
<script type="text/javascript" src="//cdn.jsdelivr.net/gh/kenwheeler/slick@1.8.1/slick/slick.min.js"></script>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.css" />
<script src="https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.js"></script>

<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />

<!-- доп. скрипты -->

<script type="text/javascript" src="/calculator/general/inputsReading_2.0.js"></script>
<script type="text/javascript" src="/bitrix/components/my_components/js/my_scripts.js"></script>
<script type="text/javascript" src="/orders/libs/table.js"></script>
<!-- все формы -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/main.php" ?>

<!-- все скрипты -->
<?php
  $GLOBALS['ISOLATION'] = true;
 include $GLOBALS['ROOT_PATH']."/calculator/general/scripts.php" 
?>