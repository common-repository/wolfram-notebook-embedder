<?php  
/**
 * The WneOembed class
 *
 * The class handles everything related to oEmbed
 */
class WneOembed{
	/**
	 * The constructor handles setting everything up
	 *
	 * Author: Wolfram Research
	 */
	public function __construct(){
		add_action( 'init', array($this, 'addProvider'));
	}

	/**
	 * handles actually registering the oembed provider
	 *
	 * Author: Wolfram Research
	 */
	public function addProvider(){
		wp_oembed_add_provider( 'https://www.wolframcloud.com/*', 'https://www.wolframcloud.com/oembed/');
	}
}

$wneOembed= new WneOembed();
?>