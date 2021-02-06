<?php

$conn=mysqli_connect("localhost", "root", "");
mysqli_select_db($conn,"weather");
if (!$conn) {
 echo json_encode("");
}
else
{
    $city=$_POST["city"];
    $result = mysqli_query($conn, "SELECT * FROM coordinates where city='$city'");
    if (!$result) {
    echo json_encode("");
    }
    else
    {
        $row = mysqli_fetch_array($result);
        echo json_encode(array($row[2],$row[3]));
    }
}
 
//echo json_encode(array("34.0536909","-118.242766"));
?>