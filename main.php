<?

if (!isset($_SESSION['random_id'])) {
	$_SESSION['random_id']= rand(1,3);
}
$prices_date = [];
$now = strtotime("now");

$set_prices = [
	"17.10.2018 13:00" => "23 000р.",
	"17.10.2018 13:15" => "25 000р.",
	"18.10.2018 15:15" => "20 000р."
];

foreach ($set_prices as $key => $value) {
	$current_prices[strtotime($key)] = $value;
}


foreach ($current_prices as $key => $value) {
	if ($now >= $key) {
		$current_price = $value;
	}
}

?>