<?php
	define( "DEBUG", false );

  include_once( "Skinny.php" );
	require_once( "./assets/Mobile_Detect.php" );
	require_once( "./assets/simple_html_dom.php" );
	require_once( "./assets/theme.php" );
	require_once( "./assets/part.php" );

	$out = array();

	$detect = new Mobile_Detect;
	$mobile_flg = $detect->isMobile() ? true : false ;
	$out[ "mobile_flg" ] = $mobile_flg;

	$theme = new Theme( $mobile_flg );
	$out[ "media" ] = $theme->media();
	$out[ "layout_css" ] = $theme->layoutCssPath();
	$out[ "mod_css" ] = $theme->modCssPath();

	$area_array = array( "header", "main", "sub", "footer" );
	$html = str_get_html( file_get_contents( $theme->layoutTextInternalPath() ) );
	$parts = new Part;
	$parts_tmpl = array();
	foreach( $area_array as $area ) {
		$tmp = $parts->partData( $area );
		$parts_tmpl[ $area ] = null;
		foreach( $tmp as $val) {
			$label = "";
			if( true ) {
				$label = sprintf( "<span>[%s] %s</span>\n", $val[ "json" ][ "data-parts-name" ], $val[ "json" ][ "name" ] );
			}
			$parts_tmpl[ $area ] .= $label. $val[ "tmpl" ];
		}
		$html->find( "[data-cms-contents*=page-". $area. "]", 0 )->innertext = $parts_tmpl[ $area ];
	}
	$out[ "html" ] = $html->outertext;
	$html->clear();
	unset( $html );

	if( DEBUG ) {
		echo "<pre>";var_dump($out);echo "</pre>";
	} else {
  	$Skinny->SkinnyDisplay( "index.html", $out );
	}
?>
