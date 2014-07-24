<?php
class Theme {
	const THEME_DIR_INTERNAL = "/var/www/html/next-cms-design-theme/theme";
	const THEME_DIR_EXTERNAL = "/next-cms-design-theme/theme";
	const DEFAULT_THEME_NM = "A1-1a1-L25_v10";

	private $theme = array();

	function __construct( $mobile_flg ) {
		$this->setName();
		$this->setMedia( $mobile_flg );
		$this->setFilePath();
		$this->setJsonData();
		if( DEBUG ) {
			echo "<h2>【theme.php】</h2>";
			echo "<pre>";var_dump($this);echo "</pre>";
		}
	}

	private function setName() {
		$this->theme[ "name" ] = isset( $_GET[ "theme" ] ) ? htmlspecialchars( $_GET[ "theme" ] ) : self::DEFAULT_THEME_NM;
	}

	private function setMedia( $mobile_flg ) {
		$this->theme[ "media" ] = $mobile_flg ? "sp" : "pc" ;
		$this->theme[ "media" ] = isset( $_GET[ "media" ] ) ? htmlspecialchars( $_GET[ "media" ] ) : $this->theme[ "media" ];
	}

	private function setFilePath() {
		$this->theme[ "internal_root_path" ] = sprintf( "%s/%s", self::THEME_DIR_INTERNAL, $this->theme[ "name" ] );
		$this->theme[ "internal_media_path" ] = sprintf( "%s/%s", $this->theme[ "internal_root_path" ], $this->theme[ "media" ] );
		$this->theme[ "external_root_path" ] = sprintf( "%s/%s", self::THEME_DIR_EXTERNAL, $this->theme[ "name" ] );
		$this->theme[ "external_media_path" ] = sprintf( "%s/%s", $this->theme[ "external_root_path" ], $this->theme[ "media" ] );
	}

	private function setJsonData() {
		$this->theme[ "json_data" ] = array();
		if( $json = @file_get_contents( $this->theme[ "internal_root_path" ]. "/theme.json" ) ) {
			$json = mb_convert_encoding( $json, "UTF8", "auto" );
			$this->theme[ "json_data" ] = json_decode($json, true);
		}
	}

	public function name() {
		return $this->theme[ "name" ];
	}

	public function media() {
		return $this->theme[ "media" ];
	}

	public function jsonData() {
		return $this->theme[ "json_data" ];
	}

	public function layoutTextInternalPath() {
		return sprintf( "%s/layout.txt", $this->theme[ "internal_media_path" ] );
	}

	public function layoutCssPath() {
		return sprintf( "%s/layout.css", $this->theme[ "external_media_path" ] );
	}

	public function modCssPath() {
		return sprintf( "%s/mod.css", $this->theme[ "external_media_path" ] );
	}

}
?>
