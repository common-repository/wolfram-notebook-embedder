( function( blocks, element, blockEditor,components){
    var registerBlockType = blocks.registerBlockType;
    var El = element.createElement;
    var UseBlockProps = blockEditor.useBlockProps;

    var registry = [];
    var embeds = [];
    var blockIcon =  El(
        'svg', 
        { 
        width: '24',
        height: '24',
        },
        El(
            'path',
            { 
            fill: '#da1f26',
            d: 'M21.1,0.1H4.3c-0.9,0-1.7,0.6-2,1.4H0.8v1.4h1.4v1.4H0.8v1.4h1.4v1.4H0.8v1.4h1.4v1.4 H0.8v1.4h1.4v1.4H0.8v1.4h1.4v1.4H0.8v1.4h1.4v1.4H0.8v1.4h1.4v1.4H0.8v1.4h1.5c0.3,0.8,1.1,1.4,2,1.4h16.8c1.1,0,2-0.9,2.1-2.1 V2.2C23.2,1,22.3,0.1,21.1,0.1z M21.8,21.8c0,0.4-0.3,0.7-0.7,0.7h0H4.3c-0.4,0-0.7-0.3-0.7-0.7c0,0,0,0,0,0V2.2 c0-0.4,0.3-0.7,0.7-0.7h16.8c0.4,0,0.7,0.3,0.7,0.7V21.8z M17.3,8.7l0.3-3.5l-3.2,1.4l-1.8-3l-1.8,3L7.7,5.2l0.4,3.5L4.7,9.4L7,12 l-2.3,2.6l3.4,0.7l-0.4,3.5l3.2-1.4l1.8,3l1.8-3l3.2,1.4l-0.3-3.5l3.4-0.7L18.4,12l2.3-2.6L17.3,8.7z M14.6,7.5l1.3-0.6l-0.7,0.9 l-1.3,0.4L14.6,7.5z M16.6,7.4l-0.1,1.5l-0.6,0.9V8.3L16.6,7.4z M15,8.8v2l-1.8,0.6V9.5L15,8.8z M12.7,5.2l1.1,1.9l-1.1,1.4 l-1.1-1.4L12.7,5.2z M12.3,9.4v2l-1.8-0.6l-0.1-2L12.3,9.4z M10.8,7.4l0.6,0.8l-1.3-0.5L9.5,6.8L10.8,7.4z M9.5,8.3v1.4L8.9,8.8 L8.8,7.3L9.5,8.3z M6.3,9.9l2.1-0.5l1,1.4l-1.7,0.6L6.3,9.9z M7.8,12.4l1-0.4L8,13l-1.1,0.4L7.8,12.4z M7,14.3l1.2-0.5l1.3,0.4 l-1.1,0.3L7,14.3z M8.7,17.5l0.2-2.1l1.7-0.5l0.1,1.8L8.7,17.5z M10.9,13.7L9,13.2l1.2-1.6l1.8,0.6L10.9,13.7z M12.3,18l-0.7-1.3 v-1.1l0.8,1.1L12.3,18z M11.6,14.2l1.1-1.5l1.1,1.5l-1.1,1.6L11.6,14.2z M13.9,16.7L13.1,18v-1.3l0.8-1.1L13.9,16.7z M13.4,12.2 l1.8-0.6l1.3,1.6l-2,0.6L13.4,12.2z M14.7,16.6v-1.8l1.7,0.5l0.2,2.1L14.7,16.6z M16.9,14.6l-1.1-0.3l1.3-0.4l1.2,0.4L16.9,14.6z M18.5,13.4L17.4,13l-0.8-1l1,0.4L18.5,13.4z M17.7,11.5L16,10.9l1-1.4l2.1,0.5L17.7,11.5z' 
            }
        )
    );

    registerBlockType( 
        'wolframnotebookembedder/block', 
        {
            title: 'Wolfram Notebook',
            description: 'Add Wolfram computations, interactive visualizations and real-world knowledge to your content.',
            category: 'embed',
            keywords: ['wolfram', 'notebook', 'embed'],
            icon: blockIcon,
            apiVersion: 2, 
            attributes: {
                url: {
                    type: 'string'
                },
                id: {
                    type: 'string'
                },
                width: {
                    type: 'string'
                },
                maxHeight: {
                    type: 'string'
                },
                blockInteractivity: {
                    type: 'boolean'  
                }
            },
            edit: function(props){

                function generateUuid(){
                    var s = function() {
                        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
                    };

                    return (s()+s()+"-"+s()+"-"+s()+"-"+s()+"-"+s()+s()+s());
                }

                function regexValidate(pattern, value){
                    var regex = new RegExp(pattern);
                    return regex.test(value);
                }

                function register(id){
                    registry.push(id);
                }

                function registerEmbed(id){
                    embeds.push(id);
                }

                function isregistered(id){
                    if (registry.indexOf(id) !== -1){
                        return true;
                    }

                    return false;
                }

                function isEmbeded(id){
                    if (embeds.indexOf(id) !== -1){
                        return true;
                    }

                    return false;
                }

                function removeEmbed(){
                    document.getElementById(embedWrapperId).innerHTML = '';
                }

                function renderEmbed(){
                    var wrap = document.createElement("div");
                    wrap.id = props.attributes.id; 

                    var style = '';
                    if(props.attributes.hasOwnProperty('width') && regexValidate(widthValidationPattern, props.attributes.width)){
                        if (props.attributes.width != '') {
                            style += 'width:' + props.attributes.width + 'px;';    
                        } 
                    }
                    if(props.attributes.hasOwnProperty('maxHeight') && regexValidate(maxHeightValidationPattern, props.attributes.maxHeight)){
                        if (props.attributes.maxHeight != '') {
                            style += 'max-height:' + props.attributes.maxHeight + 'px;';    
                        } 
                    }
                    wrap.style = style;

                    var className = 'wneContainer ';
                    if(props.attributes.hasOwnProperty('className')){
                        className += props.attributes.className;
                    }
                    wrap.className = className;

                    document.getElementById(embedWrapperId).appendChild(wrap);

                    var EmbedAttributes = {};
                    if(props.attributes.hasOwnProperty('width') && props.attributes.width != ''){
                        EmbedAttributes.width = props.attributes.width;
                    }

                    if(props.attributes.hasOwnProperty('maxHeight') && props.attributes.maxHeight != ''){
                        EmbedAttributes.maxHeight = props.attributes.maxHeight;
                    }

                    if(props.attributes.hasOwnProperty('blockInteractivity')){
                        EmbedAttributes.allowInteract = !props.attributes.blockInteractivity;
                    }

                    var target = document.getElementById(props.attributes.id);
                    WolframNotebookEmbedder.embed(props.attributes.url, target, EmbedAttributes);

                }

                function hideForm(){
                    document.getElementById(formWrapperId).classList.add('wneHide');
                } 

                function showForm(){
                    document.getElementById(formWrapperId).classList.remove('wneHide');
                } 

                function hideEditButton(){
                    var elements = document.getElementsByClassName(editButtonUniqueClass);
                    for(var i = 0; i < elements.length; i++){
                        elements[i].classList.add('wneHide');
                    }
                }

                function showEditButton(){
                    var elements = document.getElementsByClassName(editButtonUniqueClass);
                    for(var i = 0; i < elements.length; i++){
                        elements[i].classList.remove('wneHide');
                    }
                }

                function urlChangeListner(value){  
                    props.setAttributes({url: value});
                }

                function widthChangeListner(value){  
                    props.setAttributes({width: value});
                }

                function maxHeightChangeListner(value){  
                    props.setAttributes({maxHeight: value});
                }

                function blockInteractivityChangeListner(value){  
                    props.setAttributes({blockInteractivity: value});
                }

                function clickedEdit(){
                    hideEditButton();
                    removeEmbed();
                    showForm();
                }

                function clickedEmbed(){  
                    if (regexValidate(urlValidationPattern, props.attributes.url)){
                        showEditButton();
                        hideForm();
                        removeEmbed();
                        renderEmbed();
                    } 
                }

                // declare stuff
                if (!props.attributes.hasOwnProperty('id')){
                    props.attributes.id = 'wneBlock-' + generateUuid();
                }

                var urlValidationPattern = '.*/(obj|object)/.*';
                var widthValidationPattern = '[1-9]+[0-9]*';
                var maxHeightValidationPattern = '(Infinity|[1-9]+[0-9]*)';

                var formWrapperClass = 'wneFormWrapper';
                var formWrapperId = 'wneForm-' + props.attributes.id;

                var editButtonUniqueClass = 'wneUniqueEditButton-' + props.attributes.id;
                var editButtonClasses = 'wneEditButton ' + editButtonUniqueClass;
                
                var embedWrapperId = 'wneEmbedWrapper-' + props.attributes.id;

                // the convoluted part
                if (isregistered(props.attributes.id)) {
                    if (isEmbeded(props.attributes.id)) {
                        formWrapperClass += ' wneHide';
                    }else{
                        editButtonClasses += ' wneHide';
                    }
                }else{
                    register(props.attributes.id);

                    if(props.attributes.hasOwnProperty('url') && regexValidate(urlValidationPattern, props.attributes.url)){
                        formWrapperClass += ' wneHide';

                        registerEmbed(props.attributes.id);
                        setTimeout(function(){
                            renderEmbed();
                        }, 50);
                    }else{
                        editButtonClasses += ' wneHide';
                    }
                }

                return El(
                    'div',
                    UseBlockProps(),
                    El(
                        'div',
                        UseBlockProps(), 
                        El(
                            blockEditor.BlockControls,
                            { 
                                key: 'controls',
                            }, 
                            El(
                                components.ToolbarButton, 
                                {
                                    type: 'button',
                                    label: 'Edit',
                                    className: editButtonClasses,
                                    onClick: clickedEdit,
                                    icon: El(
                                        'svg', 
                                        { 
                                        width: '24',
                                        height: '24'
                                        },
                                        El(
                                            'path',
                                            { 
                                            d: 'M19.64648,4.77246,18.22754,3.35352A1.49074,1.49074,0,0,0,17.167,2.91406h-.001a1.49507,1.49507,0,0,0-1.07422.45508l-11.043,12.043a.48506.48506,0,0,0-.07062.11511l-.00751-.00378L2.95312,19.5a1.15566,1.15566,0,0,0,1.02051,1.6748A1.16471,1.16471,0,0,0,4.5,21.04688L8.47656,19.0293l-.002-.004a.49467.49467,0,0,0,.14361-.10443L19.64648,6.89355a1.49943,1.49943,0,0,0,0-2.12109ZM4.04688,20.1543a.14064.14064,0,0,1-.17383-.02735.13906.13906,0,0,1-.02735-.17383l1.70563-3.36175,1.8573,1.8573ZM18.9248,6.20215,8.23438,17.86035l-2.125-2.125,10.7041-11.6748a.495.495,0,0,1,.35254-.14649h.001a.49558.49558,0,0,1,.35352.14649l1.41894,1.41894a.49783.49783,0,0,1,.14649.35449A.51259.51259,0,0,1,18.9248,6.20215Z' 
                                            }
                                        )
                                    )
                                }
                            )
                        )
                    ),
                    El(
                        'div',
                        {
                            id: formWrapperId,
                            className: formWrapperClass,
                        },
                        El(
                            components.Placeholder,
                            { 
                                icon: blockIcon,
                                label: 'Wolfram Notebook URL',
                                instructions: 'Paste the URL of the Cloud notebook you want to display on your site:'
                            },
                            El(
                                'form',
                                {
                                    onSubmit: function(event){
                                        event.preventDefault();
                                        clickedEmbed();
                                    }
                                },
                                El(
                                    'div',
                                    { 
                                        className: 'wneFieldWrap'
                                    },
                                    El(
                                        components.TextControl,
                                        {
                                            type: 'url',
                                            autocomplete: 'off',
                                            placeholder: 'Wolfram Notebook URL...',
                                            required: 'required',
                                            pattern: urlValidationPattern,
                                            value: props.attributes.url,
                                            onChange: urlChangeListner                                            
                                        }
                                    )
                                ),
                                El(
                                    'div',
                                    { 
                                        className: 'wneFieldWrap'
                                    },
                                    El(
                                        components.TextControl,
                                        {
                                            type: 'text',
                                            autocomplete: 'off',
                                            placeholder: 'Optional Width (e.g. 20)',
                                            pattern: widthValidationPattern,
                                            value: props.attributes.width,
                                            onChange: widthChangeListner                                       
                                        }
                                    )
                                ),
                                El(
                                    'div',
                                    { 
                                        className: 'wneFieldWrap'
                                    },
                                    El(
                                        components.TextControl,
                                        {
                                            type: 'text',
                                            autocomplete: 'off',
                                            placeholder: 'Optional Max Height (e.g. 20)',
                                            pattern: maxHeightValidationPattern,
                                            value: props.attributes.maxHeight,
                                            onChange: maxHeightChangeListner                                   
                                        }
                                    )
                                ),
                                El(
                                    'div',
                                    { 
                                        className: 'wneFieldWrap'
                                    },
                                    El(
                                        components.CheckboxControl,
                                        {
                                            label: "Block Interactivity",
                                            checked: props.attributes.blockInteractivity,
                                            onChange: blockInteractivityChangeListner
                                        }
                                    )
                                ),
                                El(
                                    'div',
                                    { 
                                        className: 'wneFieldWrap'
                                    },
                                    El(
                                        components.Button,
                                        {
                                            isPrimary: true,
                                            label: 'Embed',
                                            type: 'submit'
                                        },
                                        'Embed'
                                    )
                                )
                            ),
                            El(
                                components.ExternalLink,
                                {
                                    href: 'https://reference.wolfram.com/language/WolframNotebookEmbedder/',
                                    target: '_blank',
                                },
                                'Learn more about Wolfram Notebook embedding'   
                            )
                        )
                    ),
                    El(
                    'div',
                        { 
                            id: embedWrapperId
                        }
                    )
                );

            },
            save: function(){
                return null;
            }
        }
    );

}(
    window.wp.blocks,
    window.wp.element,
    window.wp.blockEditor,
    window.wp.components,
));