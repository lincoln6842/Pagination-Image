<?php
    require '\vendor\catfan\medoo\src\Medoo.php';
    require '\vendor\autoload.php';
    use Medoo\Medoo;
    $database = new Medoo([
        'type' => 'mariadb',
        'host' => 'localhost',
        'database' => 'music_database',
        'username' => 'root',
        'password' => 'Exzone69',
    ]);
    $page_index = $_POST["page_index"];
    $maxpagelimit = $_POST["maxpagelimit"];
    $maxCount = $database->count("nanogallery");
    $out = array ('code' => '0', "msg" => "", "count" => "", "data" => "");
    
    $id = $database->select('nanogallery','Trx_Det_Id',["LIMIT" => [$page_index, $maxpagelimit]]);
    $list = $database->select('nanogallery',"*",['Trx_Det_Id'=>$id]);
        //     {'Trx_Det_Id',
        //     'Trx_Id',
        //     'Project_Outlet_Name',
        //     'Project_Outlet_Code',
        //     'Region_Id',
        //     'Chain_Id',
        //     'Channel_Id',
        //     'Project_Outlet_Id',
        //     'Photo',
        //     'Trx_Date',
        //     'Full_Name',
        //     'Remarks',
        //     'Expiry_Date',
        //     'Effective_Date',
        //     'Filter_Category'}
    $out["count"]=$database->count("nanogallery");
    $out["data"]=$list;
    echo json_encode($out);
?>