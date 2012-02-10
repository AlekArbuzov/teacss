<?php

class Controller {

    function __construct($path) {
        $this->path = $path;
    }

    function index() {
        echo "TODO: Write usage";
    }

    function getDir($base,$directory) {
        $res = array();
        $res['name'] = rtrim(str_replace($base,"",$directory),"/");
        $res['type'] = 'folder';
        $res['children'] = array();

        foreach (glob($directory."*",GLOB_ONLYDIR) as $resource) {
            $res['children'][] = $this->getDir($base,$resource."/");
        }
        foreach (glob($directory."*") as $resource) {
            if (!is_dir($resource)) {
                $root = realpath($_SERVER['DOCUMENT_ROOT']);
                $url = realpath($resource);
                $url = str_replace("\\","/",str_replace($root,"",$url));
                $url = "/".trim($url,"/\\");
                $res['children'][] = array('name'=>str_replace($base,"",$resource),'type'=>'file','url'=>$url);
            }
        }
        return $res;
    }

    function files() {
        $sub = @$_REQUEST['path'];
        $text = @$_REQUEST['text'];
        $newFile = @$_REQUEST['newFile'];
        $newFolder = @$_REQUEST['newFolder'];
        $delete = @$_REQUEST['delete'];

        if ($sub!==false) {

            $base =  $_SERVER['DOCUMENT_ROOT']."/".$this->path;
            $path = rtrim($base.$sub,"/\\");

            if ($newFile) {
                if (!file_exists($path."/".$newFile))
                    file_put_contents($path."/".$newFile,"");
                echo "ok";
                return;
            } elseif ($newFolder) {
                if (!file_exists($path."/".$newFolder))
                    mkdir($path."/".$newFolder);
                echo "ok";
                return;
            } elseif ($delete) {
                if (is_dir($path)) {
                    $iterator = new \RecursiveIteratorIterator(
                        new \RecursiveDirectoryIterator($path),\RecursiveIteratorIterator::CHILD_FIRST);
                    foreach ($iterator as $sub) {
                        if ($sub->isDir())
                            rmdir($sub->__toString());
                        else
                            unlink($sub->__toString());
                    }
                    rmdir($path);
                } elseif (is_file($path)) {
                    unlink($path);
                }
                echo "ok";
                return;
            } elseif (is_dir($path)) {
                $res = $this->getDir($base,$path."/");
                echo json_encode($res);
                return;
            } elseif (is_file($path)) {
                if (!isset($_REQUEST['text'])) {
                    readfile($path);
                } else {
                    file_put_contents($path,$text);
                    echo "ok";
                }
                return;
            }
        }
        echo json_encode(array('error' => "Error!"));
    }

    function profile_list() {
        $base =  $_SERVER['DOCUMENT_ROOT']."/".$this->path;
        $path = rtrim($base."profiles","/\\");
        $res = $this->getDir($base,$path."/");
        echo json_encode($res);
    }
    function profile_load() {
        $name = @$_REQUEST['name'];
        if ($name) {
            $save_path = $_SERVER['DOCUMENT_ROOT']."/".$this->path."profiles";
            readfile("$save_path/$name.js");
        }
    }
    function profile_save() {
        $name = @$_REQUEST['name'];
        $data = @$_REQUEST['data'];
        if ($name && $data) {
            $save_path = $_SERVER['DOCUMENT_ROOT']."/".$this->path."profiles";
            if (!file_exists($save_path))
                mkdir($save_path);
            file_put_contents("$save_path/$name.js",$data);
            echo "ok";
        }
    }
    function profile_export() {
        $data = @$_REQUEST['data'];
        if ($data) {
            foreach ($data as $item) {
                $urlParts = parse_url($item['href']);
                $file = $_SERVER['DOCUMENT_ROOT'] . "/" . trim($urlParts['path'],"/\\");
                if (file_exists($file))
                    file_put_contents($file,$item['css']);
                else {
                    echo "file not exists: ".$item['href'];
                    return;
                }
            }
            echo "ok";
            return;
        }
        echo "unsufficient data";
    }
}

$action = @$_GET['action'];
$action = $action?:'index';

$path = @$_GET['path'];
$path = $path?:"";

$controller = new Controller($path);
$controller->$action();
