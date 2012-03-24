<?php

class TeacssFileController {

    function __construct($path) {
        $this->path = $path;
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
                $res = array();
                $iterator = new \DirectoryIterator($path);
                foreach ($iterator as $sub) {
                    $name = $sub->__toString();
                    $file = str_replace($base,"",str_replace("\\","/",realpath($sub->getPathname())));
                    if ($sub->isDir()) {
                        if (!$sub->isDot())
                            $res[] = array('name'=>$name,'folder'=>true,'path'=>$file);
                    }
                }
                foreach ($iterator as $sub) {
                    $name = $sub->__toString();
                    $file = str_replace($base,"",str_replace("\\","/",realpath($sub->getPathname())));
                    if (!$sub->isDir()) {
                        $res[] = array('name'=>$name,'folder'=>false,'path'=>$file);
                    }
                }
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
                file_put_contents($file,$item['css']);
            }
            echo "ok";
            return;
        }
        echo "unsufficient data";
    }
}