<?php
class Theme {
	const THEME_DIR_INTERNAL = "/var/www/html/next-cms-design-theme/theme";
	const THEME_DIR_EXTERNAL = "/next-cms-design-theme/theme";
	const DEFAULT_THEME_NM = "theme1-1";

	private $theme = array();

	function __construct( $mobile_flg ) {
		$this->setName();
		$this->setMedia( $mobile_flg );
		$this->setFilePath();
//		echo "<pre>";var_dump($this);echo "</pre>";
	}

	private function setName() {
		$this->theme[ "name" ] = isset( $_GET[ "theme" ] ) ? htmlspecialchars( $_GET[ "theme" ] ) : self::DEFAULT_THEME_NM;
	}

	private function setMedia( $mobile_flg ) {
		$this->theme[ "media" ] = $mobile_flg ? "sp" : "pc" ;
		$this->theme[ "media" ] = isset( $_GET[ "media" ] ) ? htmlspecialchars( $_GET[ "media" ] ) : $this->theme[ "media" ];
	}

	private function setFilePath() {
		$this->theme[ "internal_path" ] = sprintf( "%s/%s/%s", self::THEME_DIR_INTERNAL, $this->theme[ "name" ], $this->theme[ "media" ] );
		$this->theme[ "external_path" ] = sprintf( "%s/%s/%s", self::THEME_DIR_EXTERNAL, $this->theme[ "name" ], $this->theme[ "media" ] );
	}

	public function name() {
		return $this->theme[ "name" ];
	}

	public function media() {
		return $this->theme[ "media" ];
	}

	public function layoutTextInternalPath() {
		return sprintf( "%s/layout.txt", $this->theme[ "internal_path" ] );
	}

	public function layoutCssPath() {
		return sprintf( "%s/layout.css", $this->theme[ "external_path" ] );
	}

	public function modCssPath() {
		return sprintf( "%s/mod.css", $this->theme[ "external_path" ] );
	}
}
?>
