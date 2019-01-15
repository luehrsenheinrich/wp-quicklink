<?php

require_once( 'vendor/freemius/php-sdk/freemius/FreemiusBase.php');
require_once( 'vendor/freemius/php-sdk/freemius/Freemius.php');
require_once( 'vendor/autoload.php');

$basepath = realpath(__DIR__ . '/..');
$zippath = realpath( $basepath . '/update/wp-munich-blocks-premium.zip' );

// Load the enviroment variables
$dotenv = new Dotenv\Dotenv( $basepath );
$dotenv->load();

$sandbox = false;
define( 'FS__API_SCOPE', 'developer' );
define( 'FS__API_DEV_ID', getenv('FS__API_DEV_ID') );
define( 'FS__API_PLUGIN_ID', getenv('FS__API_PLUGIN_ID') );
define( 'FS__API_PUBLIC_KEY', getenv('FS__API_PUBLIC_KEY') );
define( 'FS__API_SECRET_KEY', getenv('FS__API_SECRET_KEY') );
define( 'COMPOSE_PROJECT_NAME', getenv('COMPOSE_PROJECT_NAME') );

try {
	$freemius = new Freemius_Api(FS__API_SCOPE, FS__API_DEV_ID, FS__API_PUBLIC_KEY, FS__API_SECRET_KEY, $sandbox);

	if ( ! file_exists( $zippath ) ) {
		echo "- zip file not found";
		exit(20);
	}

	// Upload the zip
	echo "-Uploading to freemius\n";
	$deploy = $freemius->Api('plugins/'.FS__API_PLUGIN_ID.'/tags.json', 'POST', array(
		'add_contributor' => true
	), array(
		'file' => $zippath
	));

	if (!property_exists($deploy, 'id')) {
		print_r($deploy);
		die();
	}
	echo "-Deploy done on Freemius\n";

	// Generate url to download the zip
	$zip = $freemius->GetSignedUrl('plugins/'.FS__API_PLUGIN_ID.'/tags/'.$deploy->id.'.zip');
	$path = pathinfo($zippath);
	$newzipname = $path['dirname'] . '/wp-munich-blocks';
	$newzipname .= '.zip';
	file_put_contents($newzipname,file_get_contents($zip));

	echo "-Download Freemius free version\n";
}
catch (Exception $e) {
	echo '-Freemius server has problems'."\n";
	die();
}
