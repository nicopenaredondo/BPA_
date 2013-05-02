Ext.define('fbtest.controller.main',{
	extend		: 'Ext.app.Controller',
	requires 	: ['Ext.MessageBox'],

	config		: {
		control : {
			'#signout'	: {
				tap	:'onUserTap'
			},
			'#logoutButton' :{
				tap :'logout'
			}
		}
	},

	/**
	 * load load din ng facebook sdk pag may time..hahahaha non-sense comment
	 */

	 init:function(){
	 	window.fbAsyncInit = Ext.bind(this.onFacebookInit, this);

        (function(d){
            var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
            js = d.createElement('script'); js.id = id; js.async = true;
            js.src = "//connect.facebook.net/en_US/all.js";
            d.getElementsByTagName('head')[0].appendChild(js);
        }(document));
	 },

	  onFacebookInit: function() {

        if (fbtest.app.facebookAppId === '') return;

        var me = this;

        FB.init({
            appId  : fbtest.app.facebookAppId,
            cookie : true
        });

        FB.Event.subscribe('auth.logout', Ext.bind(me.onLogout, me));

        FB.getLoginStatus(function(response) {

            clearTimeout(me.fbLoginTimeout);

            me.hasCheckedStatus = true;
            Ext.Viewport.setMasked(false);

            //Ext.get('splashLoader').destroy();
            //Ext.get('rwf-body').addCls('greyBg');

            if (response.status == 'connected') {
                me.onLogin();
            } else {
                me.login();
            }
        });

        me.fbLoginTimeout = setTimeout(function() {

            Ext.Viewport.setMasked(false);

            Ext.create('Ext.MessageBox', {
                title: 'Facebook Error',
                message: [
                    'Facebook Authentication is not responding. ',
                    'Please check your Facebook app is correctly configured, ',
                    'then check the network log for calls to Facebook for more information.',
                    'Restart the app to try again.'
                ].join('')
            }).show();

        }, 10000);
    },

    login: function() {
        Ext.Viewport.setMasked(false);
        var splash = Ext.getCmp('login');
        if (!splash) {
            Ext.Viewport.add({ xclass: 'fbtest.view.login', id: 'login' });
        }
        Ext.getCmp('login').showLoginText();
    },

    onLogin: function() {

        var me = this,
            errTitle;

        FB.api('/me', function(response) {

            if (response.error) {
                FB.logout();

                errTitle = "Facebook " + response.error.type + " error";
                Ext.Msg.alert(errTitle, response.error.message, function() {
                    me.login();
                });
            } else {
                fbtest.userData = response;
                if (!me.main) {
                    me.main = Ext.create('fbtest.view.main', {
                        id: 'main',
                    });
                }
                
                //mainview.setData({name:response.name});
                
                Ext.Viewport.setActiveItem(me.main);
                //Ext.getStore('Runs').load();
            }
        });
    },

    logout: function() {
        Ext.Viewport.setMasked({xtype: 'loadmask', message: 'Logging out...'});
        FB.logout();
    },

    /**
     * Called when the Logout button is tapped
     */
    onLogout: function() {

        if (!this.hasCheckedStatus) return;

        this.login();

        Ext.Viewport.setMasked(false);
        Ext.Viewport.setActiveItem(Ext.getCmp('login'));
        Ext.getStore('Runs').removeAll();

        this.logoutCmp.destroy();
    },

    /**
     * When the user profile picture is tapped, create a Logout button and pop it up next to the
     * avatar.
     */
    onUserTap: function(cmp) {

        if (!this.logoutCmp) {
            this.logoutCmp = Ext.create('Ext.Panel', {
                width: 120,
                top: 0,
                left: 0,
                padding: 5,
                modal: true,
                hideOnMaskTap: true,
                items: [
                    {
                        xtype: 'button',
                        id: 'logoutButton',
                        text: 'Logout',
                        ui: 'decline'
                    }
                ]
            });
        }

        this.logoutCmp.showBy(cmp);
    }
    /**
    *
    *
    *
    **/

});