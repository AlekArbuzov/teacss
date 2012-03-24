<?php

require 'controller.php';

$action = @$_GET['action'];
$action = $action?:'index';

$path = @$_GET['path'];
$path = $path?:"";

$controller = new TeacssFileController($path);
$controller->$action();
