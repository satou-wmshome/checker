<?php
  include_once( "Skinny.php" );

	$theme_dir = "/var/www/html/next-cms-design-theme/theme/";
	$part_dir = "";
	$out = array();

	$media = "pc";
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
