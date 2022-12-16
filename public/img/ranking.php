<?php

$nick = $_POST['nick'];
$score = $_POST['score'];

// echo $nick;
// echo $score;

$file_open = fopen("data.csv","a");
$no_rows = count(file("data.csv"));
if($no_rows>1){
    $no_rows = ($no_rows - 1) + 1;
}
$form_data = array(
    'sr_no'=> $no_rows,
    'nick' => $nick,
    'score' => $score,
);
fputcsv($file_open, $form_data);
$nick = '';
$score = '';
$csv = array_map('str_getcsv', file('data.csv'));
echo json_encode($csv);