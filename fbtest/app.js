Ext.application({
    name            : 'fbtest',
    views           : ['main','login'],
    controllers     : ['main'],
    launch          : function(){
        //instantiating the main view
       /* var Main = {xtype : 'mainview'};
        Ext.Viewport.add([Main]);*/
        this.facebookAppId = '345263065595829';

        if (this.facebookAppId === '') {
            Ext.create('Ext.Component', {
                fullscreen: true,
                padding: 20,
                html: [
                    '<p>Please read the source of app.js to set up this example locally.</p><br/>',
                    '<p>For a live example, visit <a href="http://ju.mp/senchajwf">http://ju.mp/senchajwf</a></p>'
                ].join('')
            });
        }
    },
    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});