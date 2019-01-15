<?php
    require_once 'php-sdk-master/freemius/FreemiusBase.php';
    require_once 'php-sdk-master/freemius/Freemius.php';

    define( 'FS__API_SCOPE', 'developer' );
    define( 'FS__API_DEV_ID', 1234 );
    define( 'FS__API_PUBLIC_KEY', 'pk_YOUR_PUBLIC_KEY' );
    define( 'FS__API_SECRET_KEY', 'sk_YOUR_SECRET_KEY' );

    // Init SDK.
    $api = new Freemius_Api(FS__API_SCOPE, FS__API_DEV_ID, FS__API_PUBLIC_KEY, FS__API_SECRET_KEY, true);

    $result = $api->Api('plugins/115/tags.json', 'POST', array(
        'add_contributor' => true
    ), array(
        'file' => 'C:\xampp\htdocs\deployment-via-sdk\my-plugin.zip'
    ));

    print_r($result);