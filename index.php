<?php
  include_once( "Skinny.php" );
	require_once( "./assets/Mobile_Detect.php" );

	$detect = new Mobile_Detect;
	$theme_dir = "/var/www/html/next-cms-design-theme/theme/";
	$part_dir = "";
	$out = array();

	$out[ "mobile_flg" ] = false;
	if( $detect->isMobile() ) {
		$out[ "mobile_flg" ] = true;
		$media = "sp";
	} else {
		$media = "pc";
	}
	if( isset( $_GET[ "media" ] ) ) {
		$media = htmlspecialchars( $_GET[ "media" ] );
	}
	$out[ "media" ] = $media;

	$theme = "theme1-1";
	if( isset( $_GET[ "theme" ] ) ) {
		$theme = htmlspecialchars( $_GET[ "theme" ] );
	}
	$out[ "theme" ] = $theme;

	$part = "part";
	if( isset( $_GET[ "part" ] ) ) {
		$part = htmlspecialchars( $_GET[ "part" ] );
	}

	$layout_txt = file_get_contents( sprintf( "%s%s/%s/layout.txt", $theme_dir, $theme, $media ) );

  $Skinny->SkinnyDisplay( "index.html", $out );
?>
