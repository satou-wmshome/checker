<?php
	$debug = ( !isset( $_GET[ "debug" ] ) ) ? false : true;
	define( "DEBUG", $debug );

  include_once( "./assets/php/Skinny.php" );
	require_once( "./assets/php/Mobile_Detect.php" );
	require_once( "./assets/php/simple_html_dom.php" );
	require_once( "./assets/php/theme.php" );
	require_once( "./assets/php/part.php" );

	$out = array();

	$detect = new Mobile_Detect;
	$mobile_flg = $detect->isMobile() ? true : false;
	$out[ "mobile_flg" ] = $mobile_flg;

	$theme = new Theme( $mobile_flg );
	$theme_json_data = $theme->jsonData();
	$out[ "media" ] = $theme->media();
	$out[ "layout_css" ] = $theme->layoutCssPath();
	$out[ "mod_css" ] = $theme->modCssPath();

	$out[ "get_media" ] = ( isset( $_GET[ "media" ] ) ) ? $_GET[ "media" ] : null;
	$out[ "get_theme" ] = ( isset( $_GET[ "theme" ] ) ) ? $_GET[ "theme" ] : null;
	$out[ "get_parts" ] = ( isset( $_GET[ "parts" ] ) ) ? $_GET[ "parts" ] : null;
	$out[ "get_keyword" ] = ( isset( $_GET[ "keyword" ] ) ) ? $_GET[ "keyword" ] : null;
	$out[ "get_selectmethod" ] = ( isset( $_GET[ "selectmethod" ] ) ) ? $_GET[ "selectmethod" ] : null;
	$out[ "get_header" ] = ( isset( $_GET[ "header" ] ) ) ? $_GET[ "header" ] : null;
	$out[ "get_main" ] = ( isset( $_GET[ "main" ] ) ) ? $_GET[ "main" ] : null;
	$out[ "get_sub" ] = ( isset( $_GET[ "sub" ] ) ) ? $_GET[ "sub" ] : null;
	$out[ "get_footer" ] = ( isset( $_GET[ "footer" ] ) ) ? $_GET[ "footer" ] : null;

	$area_array = array( "header", "main", "sub", "footer" );
	$html = str_get_html( file_get_contents( $theme->layoutTextInternalPath() ) );
	$parts = new Part;
	$parts_tmpl = array();
	foreach( $area_array as $area ) {
		$list = $parts->partsData( $area );
		if( !is_null( $list ) ) {
			$parts_tmpl[ $area ] = null;
			foreach( $list as $val) {
				$data_parts_name = "";
				if( array_key_exists( "data-parts-name", $val[ "json_data" ] ) ) {
					$data_parts_name = $val[ "json_data" ][ "data-parts-name" ];
				}

				$parts_html = str_get_html( $val[ "tmpl" ] );
				$parts_cls = $parts_html->find( "[data-parts-name]", 0 )->getAttribute("class");
				$parts_cls_arr = explode( " ", $parts_cls );
				foreach( $parts_cls_arr as $tmp_cls ) {
					if ( strstr( $tmp_cls, "ex-style" ) ) {
						$tmp_cls = explode( "ex-style_", $tmp_cls );
						$default_cls = $tmp_cls[ 1 ];
					}
				}
				$parts_html->clear();

				$variation_id = "";
				if( array_key_exists( $val[ "json_data" ][ "parts_variation" ], $theme_json_data[ "parts_variation" ] ) ) {
					$variation_arr = $theme_json_data[ "parts_variation" ][ $val[ "json_data" ][ "parts_variation" ] ][ "list" ];
					foreach( $variation_arr as $variation ) {
						$variation_id .= $variation[ "id" ]. " ";
					}
				}
				$variation_id = trim( $variation_id );

				$dir = "";
				foreach ( $val[ "json_data" ][ "dir" ] as $dir_name ) {
					$dir .= $dir_name. ", ";
				}
				$tip_data = sprintf("data-powertip=\"default : %s<br />variation : %s<br />dir : %s<br />ver : %s\"",
											$default_cls,
											$variation_id,
											rtrim($dir, ", "),
											$val[ "json_data" ][ "ver" ]
										);

				$label = "";
				$label = sprintf( "<span class=\"chk-label\" data-chk-label-name=\"%s\" data-chk-default-ex=\"%s\" data-chk-variation=\"%s\" %s>[%s] %s</span>\n",
													$data_parts_name,
													$default_cls,
													$variation_id,
													$tip_data,
													$data_parts_name,
													$val[ "json_data" ][ "name" ]
												);
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
