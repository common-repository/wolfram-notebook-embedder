(function() {
        tinymce.create('tinymce.plugins.WolframNotebook', {
                init : function(ed, url) {
                        var img = url;
                        img = img.replace('/js', '/img/tinyMCEbutton.png')

                        ed.addButton('WolframNotebook', {
                                title : 'Wolfram Notebook',
                                image : img,
                                onclick : function() {
                                    ed.selection.setContent('[WolframNotebook url="" width="" maxHeight="" blockInteractivity=""]');
                                }
                        });
                },

                getInfo : function() {
                        return {
                                longname : 'Wolfram Notebook',
                                author : 'Wolfram Research',
                                authorurl : 'http://www.wolfram.com',
                                infourl : 'http://www.wolfram.com',
                                version : "1.0"
                        };
                }
        });

        tinymce.PluginManager.add('WolframNotebook', tinymce.plugins.WolframNotebook);
})();