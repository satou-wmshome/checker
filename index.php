<?php
  include_once( "Skinny.php" );
	require_once( "./assets/Mobile_Detect.php" );
	require_once( "./assets/simple_html_dom.php" );
	require_once( "./assets/theme.php" );

	$out = array();

	$detect = new Mobile_Detect;
	$mobile_flg = $detect->isMobile() ? true : false ;
	$out[ "mobile_flg" ] = $mobile_flg;

	$theme = new Theme( $mobile_flg );
	$out[ "media" ] = $theme->media();
	$out[ "layout_css" ] = $theme->layoutCssPath();
	$out[ "mod_css" ] = $theme->modCssPath();


	$part = "part";
	if( isset( $_GET[ "part" ] ) ) {
		$part = htmlspecialchars( $_GET[ "part" ] );
	}

//	$layout_txt = file_get_contents( sprintf( "%s%s/%s/layout.txt", $theme_dir, $theme, $media ) );

	echo "<pre>";var_dump($out);echo "</pre>";
  $Skinny->SkinnyDisplay( "index.html", $out );
?>
