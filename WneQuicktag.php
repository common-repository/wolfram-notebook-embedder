<?php  
require_once 'WneRender.php';

/**
 * The WneQuicktag class
 *
 * The class handles everything related to embedding notebooks via quicktags
 * Author: Wolfram Research
 */
class WneQuicktag{
    /**
     * The plugin url base
     *
     * @var string
     */
    protected $pluginUrl = '';

    /**
     * The url base for plugin js files
     *
     * @var string
     */
    protected $javascriptUrl = '';

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
		$this->pluginUrl = plugins_url('', __FILE__) . DIRECTORY_SEPARATOR;
		$this->javascriptUrl = $this->pluginUrl . 'js' . DIRECTORY_SEPARATOR;

		add_action( 'wp_enqueue_scripts', array($this, 'registerApi'));
		add_action('admin_print_scripts', array($this, 'registerQuicktag'));
		add_action('init', array($this, 'registerTinyMCE'));
		add_filter('the_content', array($this, 'parseContent'));

		$this->WneRender = new WneRender();
	}

	/**
	 * registers the main api file
	 *
	 * Author: Wolfram Research
	 */
	public function registerApi(){
		wp_enqueue_script(
			'WneJs', 
			'https://www.wolframcdn.com/notebook-embedder/0.3/wolfram-notebook-embedder.min.js'
		);
	}

	/**
	 * registers the plain text editor button
	 *
	 * Author: Wolfram Research
	 */
	public function registerQuicktag(){
	    wp_enqueue_script('WnePlainJs', $this->javascriptUrl . 'WnePlain.js', array('quicktags'));
	}

	/**
	 * registers the TinyMCE button
	 *
	 * Author: Wolfram Research
	 */
	public function registerTinyMCE(){
		if ((current_user_can('edit_posts') || current_user_can('edit_pages')) && get_user_option('rich_editing')){
            add_filter("mce_external_plugins", array($this, 'registerTinyMCEPluginFile'));
            add_filter('mce_buttons', array($this, 'registerTinyMCEPluginButton'));
        }
	}

	/**
	 * mce filter function that adds our plugin
	 *
	 * Author: Wolfram Research
	 */
    public function registerTinyMCEPluginButton($buttons){
        array_push($buttons, 'separator', 'WolframNotebook');
        return $buttons;
    }
    
 	/**
	 * mce filter function that adds our js file
	 *
	 * Author: Wolfram Research
	 */
    public function registerTinyMCEPluginFile($plugins){
        $plugins['WolframNotebook'] = $this->javascriptUrl . 'WneTinyMCE.js';
        return $plugins;
    }

 	/**
	 * filter function for parsing the content
	 *
	 * Author: Wolfram Research
	 */
    public function parseContent($content = ''){   
        $regex = '/(\[WolframNotebook [^\[]*\])/';
        $newContent = preg_replace_callback($regex, array($this, 'parseShortCode'),$content);
        
        if($newContent !== null){
            return $newContent;
        }else{
            return $content;   
        }    
    }

    protected function parseShortCodeAttribute($raw){
        $split = explode('=', $raw, 2);
        return array($split[0] => substr($split[1], 1, strlen($split[1])- 2));
    }

 	protected function parseShortCode($shortCode){
 		$tag = str_replace(array('&#8221;','&#8243;'),array('"','"'), $shortCode[1]);

 		$rawAttributes = null;
        $attributes = array();

        # this regex finds either of the following two attribute paterns attr='atr1' or attr="atr1"
        $regex = '#' . '([a-zA-Z0-9]*="[^"]*")' . '#' ;
        
        # get the raw short code attributes
        preg_match_all($regex, $tag, $rawAttributes);

        # process the raw attribues into key/value pairs
        foreach ($rawAttributes[1] AS $rawAttribute){   
            $attributes = array_merge($attributes, $this->parseShortCodeAttribute($rawAttribute));
        }

        if (array_key_exists('url', $attributes)) {
            $attributes['id'] = uniqid('wneBlock-');
            return $this->WneRender->render($attributes);
        }else{
        	return '';
        }
 	}
}

$wneQuicktag = new WneQuicktag();
?>