<?php
	$debug = ( !isset( $_GET[ "debug" ] ) ) ? false : true;
	define( "DEBUG", $debug );

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
	$theme_json_data = $theme->jsonData();
	$out[ "media" ] = $theme->media();
	$out[ "layout_css" ] = $theme->layoutCssPath();
	$out[ "mod_css" ] = $theme->modCssPath();

	$area_array = array( "header", "main", "sub", "footer" );
	$html = str_get_html( file_get_contents( $theme->layoutTextInternalPath() ) );
	$parts = new Part;
	$parts_tmpl = array();
	foreach( $area_array as $area ) {
		$list = $parts->partData( $area );
		if( !is_null( $list ) ) {
			$parts_tmpl[ $area ] = null;
			foreach( $list as $val) {
				$label_display = true ? "block" : "none";
				$variation_arr = $theme_json_data[ "parts_variation" ][ $val[ "json_data" ][ "parts_variation" ] ][ "list" ];
				$variation_id = "";
				foreach( $variation_arr as $variation ) {
					$variation_id .= $variation[ "id" ]. " ";
				}
				$variation_id = trim( $variation_id );
				$label = "";
				$label = sprintf( "<span class=\"chk-part-name\" data-chk-label-name=\"%s\" data-chk-variation=\"%s\" style=\"display:%s\">[%s] %s</span>\n",
													$val[ "json_data" ][ "data-parts-name" ],
													$variation_id,
													$label_display,
													$val[ "json_data" ][ "data-parts-name" ],
													$val[ "json_data" ][ "name" ] );
				$parts_tmpl[ $area ] .= $label. $val[ "tmpl" ];
			}
			$html->find( "[data-cms-contents*=page-". $area. "]", 0 )->innertext = $parts_tmpl[ $area ];
		}
	}
	$out[ "html" ] = $html->outertext;
	$html->clear();
	unset( $html );

	$ex = array();
	foreach( $theme_json_data[ "parts_variation" ] as $tmp_val ) {
		if( array_key_exists( "list", $tmp_val ) ) {
			foreach( $tmp_val[ "list" ] as $val ) {
				if( array_key_exists( "id", $val ) ) {
					$ex[] = $val[ "id" ];
				}
			}
		}
	}
	sort( $ex );
	$ex = array_unique( $ex );
	$prev_ex = "";
	foreach( $ex as $val) {
		$clear = ( strcmp( substr( $val, 0, 3 ), substr( $prev_ex, 0, 3 ) ) ) ? true : false;
		$tmp[] = array( "id" => $val, "clear" => $clear );
		$prev_ex = $val;
	}
	$out[ "ex_style" ] = $tmp;

	if( DEBUG ) {
		echo "<style>pre { font-size:12px;line-height:1.3; }</style>";
		echo "<h2>【index.php】</h2>";
		echo "<pre>";var_dump($out);echo "</pre>";
	} else {
  	$Skinny->SkinnyDisplay( "index.html", $out );
	}
?>
