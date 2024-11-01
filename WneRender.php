<?php  
/**
 * The WneCurl class
 *
 * The class handles getting the static assets from the cloud
 */
class WneRender{
	/**
	 * Makes the curl request for the static content
	 *
	 * Author: Wolfram Research
	 */
	protected function get($url){
		$url = str_replace(array('/obj/', '/object/'), '/statichtml/', $url);
		$req = wp_remote_get($url, ['timeout'=>10]);
		$body = wp_remote_retrieve_body($req);
		$code = wp_remote_retrieve_response_code($req);

		if($code === '' || $code !== 200){
			return '';
		}
		
		return $body;
	}

	/**
	 * handles cleaning up validating input attributes
	 *
	 * Author: Wolfram Research
	 */
	protected function validateAttributes($attributes){
		$valid = array('id', 'url', 'width', 'maxHeight', 'blockInteractivity', 'className');

		foreach ($attributes as $key => $val){
			if(!in_array($key, $valid)){
				unset($attributes[$key]);
			}
		}

		if (array_key_exists('url', $attributes)){
			$regex = '#.*/(obj|object)/.*#';
			if(preg_match($regex, $attributes['url']) !== 1){
				unset($attributes['url']);
			}
		}


		if (array_key_exists('width', $attributes)){
			$regex = '#[1-9]+[0-9]*#';
			if(preg_match($regex, $attributes['width']) !== 1){
				unset($attributes['width']);
			}
		}

		if (array_key_exists('maxHeight', $attributes)){
			$regex = '#(Infinity|[1-9]+[0-9]*)#';
			if(preg_match($regex, $attributes['maxHeight']) !== 1){
				unset($attributes['maxHeight']);
			}
		}

		if (array_key_exists('blockInteractivity', $attributes)){
			if (!is_bool($attributes['blockInteractivity'])){
				$block = strtolower($attributes['blockInteractivity']);

				if ($block === 'true' || $block === 'false') {
					if ($block === 'true'){
						$attributes['blockInteractivity'] = true;
					}else{
						$attributes['blockInteractivity'] = false;
					}
				}else{
					unset($attributes['blockInteractivity']);
				}
			}
		}

		if (!array_key_exists('className', $attributes)){
			$attributes['className'] = '';
		}

		return $attributes;
	}

	/**
	 * handles generating the attributes for the embed 
	 *
	 * Author: Wolfram Research
	 */
	protected function getEmbedAttributes($attributes){
		$valid = array('width', 'maxHeight', 'blockInteractivity');

		foreach ($attributes as $key => $val){
			if(!in_array($key, $valid)){
				unset($attributes[$key]);
			}
		}

		if(array_key_exists('blockInteractivity', $attributes)){
			$attributes['allowInteract'] = !$attributes['blockInteractivity'];

			unset($attributes['blockInteractivity']);
		}

		$attributes['useShadowDOM'] = true;

		if (count($attributes) >= 1) {
			return json_encode($attributes);
		}else{
			return '{}';
		}
	} 

	/**
	 * handles generating the style tag for the container div
	 *
	 * Author: Wolfram Research
	 */
	protected function getHtmlStyle($attributes){
		$style = '';

		if(array_key_exists('width', $attributes)){
			$style .= 'width:' . $attributes['width'] . 'px;';
		}

		if(array_key_exists('maxHeight', $attributes)){
			$style .= 'max-height:' . $attributes['maxHeight'] . 'px;';
		}

		return $style;
	}

	/**
	 * renders the embed
	 *
	 * Author: Wolfram Research
	 */
	public function render($attributes){
		
		if(array_key_exists('url', $attributes)){
			$attributes = $this->validateAttributes($attributes);
			$embedAttributes = $this->getEmbedAttributes($attributes);
			$style = $this->getHtmlStyle($attributes);
			$id = $attributes['id'];
			$url = $attributes['url'];
			$className = $attributes['className'];
			$static = $this->get($url);

			$render = "<div id='$id' class='wneContainer $className' style='$style'>$static</div>";
			$render .= "<script>WolframNotebookEmbedder.embed('$url', document.getElementById('$id'), $embedAttributes);</script>";
			return $render;
		}else{
			return '';
		}
	}
}

?>