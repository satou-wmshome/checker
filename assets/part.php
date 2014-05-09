<?php
class Part {
	const PART_DIR_INTERNAL = "/var/www/html/part-group";
	const DEFAULT_PARTS_NM = "part";

	private $parts = array();

	function __construct() {
		$this->setName();
		$this->setFilePath();
		$this->setPartsData();
		if( DEBUG ) {
	    echo "<pre>";var_dump($this);echo "</pre>";
		}
	}

	private function setName() {
		$this->parts[ "group_name" ] = isset( $_GET[ "part" ] ) ? htmlspecialchars( $_GET[ "part" ] ) : self::DEFAULT_PARTS_NM;
	}

	private function setFilePath() {
		$this->parts[ "internal_path" ] = sprintf( "%s/%s", self::PART_DIR_INTERNAL, $this->parts[ "group_name" ] );
	}

	private function setPartsData() {
		$this->parts[ "part_data" ] = array();
		$list = array();
		if( $dir = opendir( $this->parts[ "internal_path" ] ) ) {
			while( ( $file = readdir( $dir ) ) !== false ) {
				if( $file != "." && $file != ".." ) {
					$list[] = $file;
				}
			}
			closedir( $dir );
		}
		sort( $list );
		foreach( $list as $file ) {
			$part_dir_path = $this->parts[ "internal_path" ]. "/". $file;
			$tmpl_txt = @file_get_contents( $part_dir_path. "/template.txt" );
			$json = $this->parseJson( $part_dir_path. "/part.json" );
			if( !is_null( $json ) ) {
				$tmp_no = $file;
				$tmp_arr= explode( "-", $file );
				if( count( $tmp_arr ) >= 3 ) {
					$tmp_arr = explode( "_", $tmp_arr[2] );
					$tmp_no = ( is_numeric( $tmp_arr[0] ) ) ? ( string ) intval( $tmp_arr[0] ) : $tmp_no;
				}
				foreach( $json[ "area" ] as $area ) {
					$tmp[ "no" ] = $tmp_no;
					$tmp[ "tmpl" ] = $tmpl_txt;
					$tmp[ "json" ] = $json;
					$this->parts[ "part_data" ][ $area ][ $file ] = $tmp;
				}
			}
		}
	}

	private function parseJson( $json_path ) {
		$res = null;
		if( $json = @file_get_contents( $json_path ) ) {
			$json = mb_convert_encoding( $json, "UTF8", "auto" );
			$res = json_decode($json, true);
		}
		return $res;
	}

	private function selectParts( $area ) {
		$res = null;
		if( $_GET[ $area ] !== "0" ) {
			switch( $_GET[ "selectmethod" ] ) {
				case "r":
					$res = $this->selectPartsRange( $area );
					break;
				case "e":
					$res = $this->selectPartsExtraction( $area );
					break;
			}
		}
		return $res;
	}

	private function selectPartsRange( $area ) {
		$res = null;
		$tmp = explode( "-", $_GET[ $area ] );
		$st = intval( $tmp[0] );
		$ed = !empty( $tmp[1] ) ? intval( $tmp[1] ) : 10000;
		foreach( $this->parts[ "part_data" ][ $area ] as $key => $val ) {
			if( is_numeric( $val[ "no" ] ) ) {
				$part_no = intval( $val[ "no" ] );
				if(  $part_no >= $st && $part_no <= $ed ) {
					$res[ $key ] = $val;
				}
			}
		}
		return $res;
	}

	private function selectPartsExtraction( $area ) {
// ##########
	}

	public function partData( $area ) {
		$res = null;
		if( array_key_exists( $area, $this->parts[ "part_data" ] ) ) {
			if( !isset( $_GET[ $area ] ) || is_null( $_GET[ $area ] ) ) {
				$res = $this->parts[ "part_data" ][ $area ];
			} else {
				$res = $this->selectParts( $area );
			}
		}
		return $res;
	}

}
?>
