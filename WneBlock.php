<?php  
require_once 'WneRender.php';

/**
 * The WneBlock class
 *
 * The class handles everything related to embedding notebooks via the block editor.
 * Author: Wolfram Research
 */
class WneBlock{
    /**
     * The WneRender instance
     *
     * @var mixed
     */
    protected $WneRender = null;

	/**
	 * The constructor handles setting everything up
	 *
	 * Author: Wolfram Research
	 */
	public function __construct(){
		add_action('init', array($this, 'registerBlock'));

		add_filter('script_loader_tag', array($this, 'addCrossOrigin'), 10, 2);

		$this->WneRender = new WneRender();
	}

	/**
	 * Handles registering the notebook embedder block and setting up actions and filters
	 *
	 * Author: Wolfram Research
	 */
	public function registerBlock(){
		$pluginUrl = plugins_url('', __FILE__) . DIRECTORY_SEPARATOR;
		$javascriptUrl = $pluginUrl . 'js' . DIRECTORY_SEPARATOR;
		$cssUrl = $pluginUrl . 'css' . DIRECTORY_SEPARATOR;

		wp_register_style(
			'WneBlockCssStyle',
			$cssUrl . 'WneBlockCssStyle.css'
		);
		
		wp_register_style(
			'WneBlockCssEditor',
			$cssUrl . 'WneBlockCssEditor.css'
		);

		wp_enqueue_script(
			'WneJs', 
			'https://www.wolframcdn.com/notebook-embedder/0.3/wolfram-notebook-embedder.min.js'
		);

	    wp_register_script(
	    	'WneBlockJs',
	        $javascriptUrl . 'WneBlockJs.js',
	        array( 'wp-blocks', 'wp-element', 'wp-editor')
	    );

		register_block_type(
			'wolframnotebookembedder/block', 
			array(
				'style' => 'WneBlockCssStyle',
				'editor_style' => 'WneBlockCssEditor',
        		'editor_script' => 'WneBlockJs',
        		'render_callback' => array($this, 'render')
    		)
		);
	}

	/**
	 * Handles rendering of embedded notebook on the public facing side of WordPress
	 *
	 * Author: Wolfram Research
	 */
	public function render($attributes, $content){
		return $this->WneRender->render($attributes);
	}


	/**
	 * Handles rendering of embedded notebook on the public facing side of WordPress
	 *
	 * Author: Wolfram Research
	 */
	public function addCrossOrigin($tag, $handle){
		if($handle !== ''){
        	return $tag;
		}

		return str_replace( ' src', ' crossorigin src', $tag);
	}
}

$wneBlock = new WneBlock();
?>