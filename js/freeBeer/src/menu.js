/** @jsx React.DOM */

/*
  <p>Identity avatar</p>
 */

var Basics = React.createClass({
    render: function() {
        return (
            <PuffIcon />
            )
    }
});

var Blank = React.createClass({
    render: function() {
        return (
            <div></div>
            )
    }
});


var PuffIcon = React.createClass({
    render: function() {
        return <img src={"img/puffballIcon.png"} className="puffballIcon" id="puffballIcon" height="32" width="27" onClick={this.toggleShowMenu} />
    },

    toggleShowMenu: function() {
        if(puffworldprops.menu.show) {
            return events.pub('ui/menu/close', {'menu.show': false})
        } else {
            return events.pub('ui/menu/close', {'menu.show': true})
        }
    }
})

var Menu = React.createClass({
    render: function() {
        return (
            <div className="menu">
                <div id="closeDiv">
                    <a href="#" onClick={this.handleClose}>
                        <i className="fa fa-times-circle-o fa-fw"></i></a>
                </div>
                <Logo />
                <br />
                <View />
                <Preferences />
                <Filter />
                <Publish />
                <Identity />
                <About />
                <Tools />
            </div>
            )
    },

    handleClose: function() {
        return events.pub('ui/menu/close', {'menu.show': false})
    }
});

var Logo = React.createClass({
    render: function() {
        return (
            <a href={CONFIG.url}><img src="img/logo.gif" alt="Logo" className="logo" /></a>
            )
    }
});

var Filter = React.createClass({
    handlePickFilter: function() {
        var user = this.refs.pickuser.getDOMNode().value || false;
        var route = this.refs.pickroute.getDOMNode().value || false;
        return events.pub('ui/view/route/set', 
                        {'view.filterroute': route, 
                         'view.filteruser':user,
                         'view.style':'PuffLatest'});
    },
    handleClearRoute: function() {
        this.refs.pickroute.getDOMNode().value = '';
        return events.pub('ui/view/route/clear', {'view.filterroute': false});
    },
    handleClearUser: function() {
        this.refs.pickuser.getDOMNode().value = '';
        return events.pub('ui/view/user/clear', {'view.filteruser': false});
    },
    handleKeyDown: function(event) {
        if (event.keyCode == 13) {
            this.handlePickFilter();
        }
    },
    render: function() {
        var polyglot = Translate.language[puffworldprops.view.language];
        var route = puffworldprops.view.filterroute || "";
        var user = puffworldprops.view.filteruser || "";
        return (
            <div>
                <div className="menuHeader">
                    <i className="fa fa-filter fa-fw gray"></i> {polyglot.t("menu.filter.title")}
                </div>
                <div className="menuItem">
                    {polyglot.t("menu.filter.route")}:
                    <div className="menuInput">
                    <input type="text" name="filterroute" ref="pickroute" defaultValue={route} size="12" onKeyDown={this.handleKeyDown} />
                    {' '}<a href="#" onClick={this.handlePickFilter}><i className="fa fa-search fa-fw"></i></a>
                    {' '}<a href="#" onClick={this.handleClearRoute} ><i className="fa fa-eraser fa-fw"></i></a>
                    </div><br/>
                </div>
                <div className="menuItem">
                    {polyglot.t("menu.filter.user")}: 
                    <div className="menuInput">
                    <input type="text" name="filteruser" ref="pickuser" defaultValue={user} size="12" onKeyDown={this.handleKeyDown}  />
                    {' '}<a href="#" onClick={this.handlePickFilter} ><i className="fa fa-search fa-fw"></i></a>
                    {' '}<a href="#" onClick={this.handleClearUser} ><i className="fa fa-eraser fa-fw"></i></a>
                    </div><br/>
                </div>
            </div>
            )
    }
});

var View = React.createClass({

    handleViewRoots: function() {
        return events.pub('ui/show/roots', {'view.style': 'PuffRoots', 'view.puff': false, 'menu': puffworlddefaults.menu, 'view.user': ''});
    },

    handleViewLatest: function() {
        return events.pub('ui/show/latest', {'view.style': 'PuffLatest', 'view.puff': false, 'menu': puffworlddefaults.menu, 'view.user': '', 'view.filterroute': false});
    },

    handleShowUserPuffs: function(username) {
        return events.pub('ui/show/by-user', {'view.style': 'PuffByUser', 'view.puff': false, 'view.user': username})
    },

    handleShowShortcuts: function() {
        var polyglot = Translate.language[puffworldprops.view.language];
        showPuff(polyglot.t("puff.shortcut"));
        return false;
    },

    handleShowPuffsForMe: function(){
        var polyglot = Translate.language[puffworldprops.view.language];
        var username = PuffWardrobe.getCurrentUsername();
        if(!username.length) {
            alert(polyglot.t("alert.noUserSet"))
            return false;
        }
        // console.log(username);
       // var route = this.refs.pickroute.getDOMNode().value;
        return events.pub('ui/view/route/set', {'view.filterroute': username});
    },

    render: function() {

        var polyglot = Translate.language[puffworldprops.view.language];
        return (
            <div>
                <div className="menuHeader">
                    <i className="fa fa-sitemap fa-fw gray"></i> {polyglot.t("menu.view.title")}
                </div>

                <div className="menuItem"><a href="#" onClick={this.handleViewLatest}>{polyglot.t("menu.view.latest")}</a>{' '}<span className="shortcut">[l]</span></div>

                <div className="menuItem"><a href="#" onClick={this.handleShowUserPuffs.bind(this,'choices.book')}>{polyglot.t("menu.view.collection")}</a></div>

                <div className="menuItem"><a href="#" onClick={this.handleShowShortcuts}>{polyglot.t("menu.view.shortcut")}</a></div>

                <div className="menuItem"><a href="#" onClick={this.handleShowPuffsForMe}>{polyglot.t("menu.view.showpuffs")}</a></div>

            </div>
            )
    }
});

var Preferences = React.createClass({
    handleShowHideRelationships: function() {

        if(puffworldprops.view.mode == 'browse') {
            return events.pub('ui/relationships/show', {'view.mode': 'arrows'});
        } else {
            return events.pub('ui/relationships/hide', {'view.mode': 'browse'});
        }
    },

    handleShowHideAnimations: function() {

        if(puffworldprops.view.animation) {
            return events.pub('ui/animation/hide', {'view.animation': false});
        } else {
            return events.pub('ui/animation/show', {'view.animation': true});
        }
    },

    handleShowHideInfobar: function() {
        return events.pub( 'ui/view/showinfo/toggle', 
                         { 'view.showinfo': !puffworldprops.view.showinfo})
    },

    handlePickLanguage: function() {
        var language = this.refs.picklanguage.getDOMNode().value;
        return events.pub('ui/view/language/set', {'view.language': language});
    },

    render: function() {
        var language = puffworldprops.view.language || "en";
        var polyglot = Translate.language[language];
        var all_languages = Object.keys(Translate.language);

        // CSS for checkboxes
        var cb = React.addons.classSet;
        var cbClass = cb({
            'fa': true,
            'fa-fw': true,
            'fa-check-square-o': (puffworldprops.view.mode == 'arrows'),
            'fa-square-o': !(puffworldprops.view.mode == 'arrows'),
            'green': (puffworldprops.view.mode == 'arrows')
        });

        var cb2 = React.addons.classSet;
        var cbClass2 = cb({
            'fa': true,
            'fa-fw': true,
            'fa-check-square-o': puffworldprops.view.animation,
            'fa-square-o': !puffworldprops.view.animation,
            'green': puffworldprops.view.animation
        });

        var cbClass3 = cb({
            'fa': true,
            'fa-fw': true,
            'fa-check-square-o': puffworldprops.view.showinfo,
            'fa-square-o': !puffworldprops.view.showinfo,
            'green': puffworldprops.view.showinfo
        });

        return(
            <div>

                <div className="menuHeader">
                    <i className="fa fa-gears fa-fw gray"></i> {polyglot.t("menu.preferences.title")}
                </div>


                <span className="floatingCheckbox"><i className={cbClass} onClick={this.handleShowHideRelationships} ></i></span>
                <div className="menuItem">
                    <a href="#" onClick={this.handleShowHideRelationships}>{polyglot.t("menu.preferences.relationship")}</a>{' '}<span className="shortcut">[space]</span>
                </div>

                <span className="floatingCheckbox"><i className={cbClass2} onClick={this.handleShowHideAnimations} ></i></span>
                <div className="menuItem">
                    <a href="#" onClick={this.handleShowHideAnimations}>{polyglot.t("menu.preferences.animation")}</a>{' '}<span className="shortcut">[a]</span>
                </div>

                <span className="floatingCheckbox"><i className={cbClass3} onClick={this.handleShowHideInfobar} ></i></span>
                <div className="menuItem">
                    <a href="#" onClick={this.handleShowHideInfobar}>{polyglot.t("menu.preferences.infobar")}</a>{' '}<span className="shortcut">[i]</span>
                </div>

                <div className="menuItem">
                {polyglot.t("menu.preferences.language")}: <select ref="picklanguage" onChange={this.handlePickLanguage} value={language}>
                    {all_languages.map(function(lang) {
                        return <option key={lang} value={lang}>{Translate.language[lang].t("dropdownDisplay")}</option>
                    })}
                </select>
                </div>


            </div>

            )

    }

});


// TODO put back when working
// <div className="menuItem"><a href="#" onClick={this.handleViewRoots}>Recent conversations</a></div>

var Publish = React.createClass({
    handleNewContent: function() {
        return events.pub('ui/reply/open', {'menu': puffworlddefaults.menu, 'reply': {show: true}});
    },

    render: function() {
        var polyglot = Translate.language[puffworldprops.view.language];
        return (
            <div>
                <div className="menuHeader">
                    <i className="fa fa-paper-plane fa-fw gray"></i> {polyglot.t("menu.publish.title")}
                </div>
                <div className="menuItem">
                    <a href="#" onClick={this.handleNewContent}>{polyglot.t("menu.publish.new")}</a>{' '}<span className="shortcut">[n]</span>
                </div>
            </div>
            )
    }
});

var Identity = React.createClass({
    getInitialState: function() {
        return {
            username: PuffWardrobe.getCurrentUsername(),
            showUserRootPrivateKey: false,
            showUserAdminPrivateKey: false,
            showUserDefaultPrivateKey: false,
            tabs: {
                showSetIdentity: false,
                showEditIdentity: false,
                showNewIdentity: (puffworldprops.view.style == 'MenuAdd')
            }
        }
    },

    componentWillMount: function() {
        if (!this.state.username) {
            // var prom = PuffWardrobe.storePrivateKeys('anon', 0, CONFIG.anon.privateKeyAdmin, 0);
            // prom.then(function() {
            //     PuffWardrobe.switchCurrent('anon');
            //     events.pub('ui/puff-packer/set-identity-to-anon', {});
            // });
            // 
            // this.setState({username: 'anon'});

        }
    },

    render: function() {

        // CSS for tabs
        var cx1 = React.addons.classSet;
        var newClass = cx1({
            'linkTabHighlighted': this.state.tabs.showNewIdentity,
            'linkTab': !this.state.tabs.showNewIdentity
        });

        var cx2 = React.addons.classSet;
        var setClass = cx2({
            'linkTabHighlighted': this.state.tabs.showSetIdentity,
            'linkTab': !this.state.tabs.showSetIdentity
        });

        var cx3 = React.addons.classSet;
        var editClass = cx3({
            'linkTabHighlighted': this.state.tabs.showEditIdentity,
            'linkTab': !this.state.tabs.showEditIdentity
        });

        var currUser = PuffWardrobe.getCurrentUsername();

        // TODO: Help icon takes you to tutorial related to this.

        var polyglot = Translate.language[puffworldprops.view.language];
        return (
            <div>
                <div className="menuHeader"><i className="fa fa-user fa-fw gray"></i> {polyglot.t("menu.identity.title")}</div>
                <AuthorPicker />
                <div className="leftIndent">
                <div className={setClass}  onClick={this.toggleShowTab.bind(this,'showSetIdentity')} ><i className="fa fa-sign-in fa-fw"></i></div>
                <div className={editClass} onClick={this.toggleShowTab.bind(this,'showEditIdentity')}><i className="fa fa-eye fa-fw"></i></div>
                <div className={newClass}  onClick={this.toggleShowTab.bind(this,'showNewIdentity')} ><i className="fa fa-plus fa-fw"></i></div>
                <br />
                <SetIdentity  show={this.state.tabs.showSetIdentity}  username={currUser}/>
                <EditIdentity show={this.state.tabs.showEditIdentity} username={currUser}/>
                <NewIdentity  show={this.state.tabs.showNewIdentity}  />
                </div>

            </div>
            )
    },

    toggleShowTab: function(tabName) {
        var self = this;

        var truthArray = [false, false, false];
        var tabArray = ['showSetIdentity', 'showEditIdentity', 'showNewIdentity'];

        if(!self.state.tabs[tabName]) {
            var toggleThis = tabArray.indexOf(tabName);
            truthArray[toggleThis] = true;
        }

        // Do the update of tab value
        this.setState({tabs: {
            showSetIdentity: truthArray[0],
            showEditIdentity: truthArray[1],
            showNewIdentity: truthArray[2]
        }
        });

    }
});

// Was PuffSwitchUser
var AuthorPicker = React.createClass({
    handleUserPick: function() {
        PuffWardrobe.switchCurrent(this.refs.switcher.getDOMNode().value)
        return events.pub('ui/menu/user/pick-one/hide', {'menu.user.pick_one': false})
    },

    handleRemoveUser: function() {
        var userToRemove = this.refs.switcher.getDOMNode().value;

        // Confirm alert first
        var msg = "WARNING: This will erase all of this user's private keys from your web browser. If you have not yet saved your private keys, hit Cancel and use the EDIT section of the menu to save your keys. Are you sure you wish to continue?"
        var r = confirm(msg);
        if (r == false) {
            return false
        }

        PuffWardrobe.removeKeys(userToRemove);
        events.pub('user/'+userToRemove+'/remove', {});
        events.pub('ui/user/'+userToRemove+'/remove', {}); // this should be generated by previous event
        return false;
    },

    handleViewUser: function() {
        var username = this.props.username;
        return events.pub('ui/show/by-user', {'view.style': 'PuffByUser', 'view.puff': false, 'view.user': username})
    },

    render: function() {
        var all_usernames = Object.keys(PuffWardrobe.getAll())
        var polyglot = Translate.language[puffworldprops.view.language];
        if(!all_usernames.length) return <div className="menuItem">{polyglot.t("menu.identity.none")}</div>

        // Force selection of the single user when just one
        if(all_usernames.length == 1) {
            PuffWardrobe.switchCurrent(all_usernames[0]);
        }

        var username = PuffWardrobe.getCurrentUsername()

        // TODO: find a way to select from just one username (for remove user with exactly two users)
        // TODO: Need 2-way bind to prevent select from changing back every time you change it

        return (
            <div className="menuItem">
                {polyglot.t("menu.identity.current")}: <select ref="switcher" onChange={this.handleUserPick} value={username}>
                    {all_usernames.map(function(username) {
                        return <option key={username} value={username}>{username}</option>
                    })}
                </select>
                {' '}<a href="#" onClick={this.handleRemoveUser}><i className="fa fa-trash-o fa-fw"></i></a>
                {' '}<ViewUserLink username={username} />
            </div>
            );
    }
    // TODO add alt tags to icons, or link it too a "help" puff.
    // NOTE: This might destroy the puff the person was working on
});

var ViewUserLink = React.createClass({
    viewUser: function() {
        var username = this.props.username;
        return events.pub('ui/show/by-user', {'view.style': 'PuffByUser', 'view.puff': false, 'view.user': username})
    },

    render: function() {
        if(!Object.keys(PuffWardrobe.getAll()).length) {
            return <i></i>;
        }

        return (
            <a href="#" onClick={this.viewUser}>
                <i className="fa fa-search fa-fw"></i>
            </a>
            )
    }

});

var SetIdentity = React.createClass({

    getInitialState: function() {
        return {
            rootKeyStatus: false,
            adminKeyStatus: false,
            defaultKeyStatus: false,

            usernameStatus: false,
            rootKey: false,
            adminKey: false,
            defaultKey: false

        }
    },

    handleUsernameLookup: function() {
        var username = this.refs.username.getDOMNode().value;
        var self = this;

        // Check for zero length
        if(!username.length) {
            this.state.usernameStatus = 'Missing';
            events.pub('ui/event', {});
            return false;
        }

        var prom = Puffball.getUserRecord(username);

        prom.then(function(result) {
            self.state.usernameStatus = true;
            events.pub('ui/puff-packer/userlookup', {});
        })
            .catch(function(err) {
                self.state.usernameStatus = 'Not found';
                events.pub('ui/puff-packer/userlookup/failed', {});
            })
        return false;
    },

    handleKeyCheck: function(keyType) {
        // console.log(keyType);

        var self = this;

        // Reset state
        /*
        this.state[keyType] = false;
        events.pub('ui/event', {});
        */

        var username = this.refs.username.getDOMNode().value;
        var privateKey = this.refs[keyType].getDOMNode().value;

        // Check for zero length
        if(!privateKey.length) {
            this.state[keyType] = 'Key missing';
            events.pub('ui/event', {});
            return false;
        }

        // Convert to public key
        var publicKey = Puffball.Crypto.privateToPublic(privateKey);
        if(!publicKey) {
            this.state[keyType] = 'Bad key';
            events.pub('ui/event', {});
            return false;
        }

        var prom = Puffball.getUserRecord(username);

        prom.then(function(userInfo) {

            if(publicKey != userInfo[keyType]) {
                self.state[keyType] = 'Incorrect key';
                events.pub('ui/event', {});
                return false;
            } else {
                self.state[keyType] = true;
                self.state.usernameStatus = true;

                // Add this to wardrobe, set username to current
                if(keyType == 'defaultKey') {
                    PuffWardrobe.storeDefaultKey(username, privateKey);
                    console.log("Updated default key");
                }

                if(keyType == 'adminKey') {
                    PuffWardrobe.storeAdminKey(username, privateKey);
                }

                if(keyType == 'rootKey') {
                    PuffWardrobe.storeRootKey(username, privateKey);
                }

                // At least one good key, set this to current user
                PuffWardrobe.switchCurrent(username);

                events.pub('ui/event', {});
                return false;
            }
        })
            .catch(function(err) {
                self.state[keyType] = 'Not found';
                events.pub('ui/event', {});
                return false;
            })
        return false;

    },

    render: function() {
        if (!this.props.show) {
            return <div></div>
        } else {
            var currUser = this.props.username;
            var polyglot = Translate.language[puffworldprops.view.language];
            return (
                <div className="menuSection">
                    <div><em>{polyglot.t("menu.identity.storeKey.msg")}</em></div>
                    <div className="menuLabel">{polyglot.t("menu.identity.username")}:</div>
                    <div className="menuInput">
                        <input type="text" name="username" ref="username" defaultValue={currUser} size="12" />
                        {' '}<a href="#" onClick={this.handleUsernameLookup}><Checkmark show={this.state.usernameStatus} /></a>
                        <em>{this.state.usernameStatus}</em>
                    </div><br />
                    <div><i className="fa fa-lock fa-fw gray"></i> {polyglot.t("menu.identity.private")}</div>

                    <div className="menuLabel">{polyglot.t("menu.identity.default")}: </div>
                    <div className="menuInput">
                        <input type="text" name="defaultKey" ref="defaultKey" size="12" />
                        {' '}<a href="#" onClick={this.handleKeyCheck.bind(this,'defaultKey')}>
                                <Checkmark show={this.state.defaultKey} /></a>
                                <em>{this.state.defaultKey}</em>
                    </div><br />

                    <div className="menuLabel">{polyglot.t("menu.identity.admin")}: </div>
                    <div className="menuInput">
                        <input type="text" name="adminKey" ref="adminKey" size="12" />
                        {' '}<a href="#" onClick={this.handleKeyCheck.bind(this,'adminKey')}>
                        <Checkmark show={this.state.adminKey} /></a>
                        <em>{this.state.adminKey}</em>
                    </div><br />

                    <div className="menuLabel">{polyglot.t("menu.identity.root")}: </div>
                    <div className="menuInput">
                        <input type="text" name="rootKey" ref="rootKey" size="12" />
                        {' '}<a href="#" onClick={this.handleKeyCheck.bind(this,'rootKey')}>
                        <Checkmark show={this.state.rootKey} /></a>
                        <em>{this.state.rootKey}</em>
                    </div><br />
                </div>
                )
        }
    }
});

var Checkmark = React.createClass({
   render: function() {
       if(this.props.show === false) {
           return <i className="fa fa-check-circle fa-fw gray"></i>
       } else if(this.props.show === true) {
           return <i className="fa fa-check-circle fa-fw green"></i>
       } else {
           return <i className="fa fa-check-circle fa-fw red"></i>
       }

   }
});

var EditIdentity = React.createClass({
    getInitialState: function() {
        return {
            qrCode: false,
            qrCodeUser: false
        }
    },

    handleFocus: function(e) {
        var target = e.target;
        setTimeout(function() {
            target.select();
        }, 0);
    },

    handleShowQRCode: function(e) {
        var keyType = e.target.getAttribute('name');
        var key = this.refs[keyType+'Key'].getDOMNode().value;
        if (keyType == this.state.qrCode || key.length < 1) {
            this.setState({qrCode: false});
        } else {
            this.setState({'qrCode' : keyType,
                           'qrCodeUser' : this.props.username}); 
        }
    },
    handleClickQRCode: function(){
        // create the qr code
        var key = PuffWardrobe.getCurrentKeys()[this.state.qrCode];
        var qr = qrcode(4, 'M');
        qr.addData(key);
        qr.make();
        var image_data = qr.createImgTag(10);
        var data = 'data:image/gif;base64,' + image_data.base64;
        window.open(data, 'Image')
    },

    render: function() {
        if (!this.props.show) {
            return <span></span>
        } else {

            var currUser = this.props.username;
            var qrcodeField = "";
            var showQRCode = this.state.qrCode && this.state.qrCodeUser == currUser;
            if (showQRCode) {
                var keyType = this.state.qrCode;
                var key = PuffWardrobe.getCurrentKeys()[keyType];
                if (key.length < 1) {
                    showQRCode = false;
                } else {
                    var qr = qrcode(4, 'M');
                    qr.addData(key);
                    qr.make();

                    var image_data = qr.createImgTag() || {};
                    var data = 'data:image/gif;base64,' + image_data.base64;
                    qrcodeField = (<img id="qrcode" src={data} width={image_data.width} height={image_data.height} onClick={this.handleClickQRCode}/>);
                }
                
            }

            var qrcodeBaseStyle = "fa fa-qrcode fa-fw";

            var defaultKey = PuffWardrobe.getCurrentKeys()['default'];
            var defaultKeyQRStyle = (showQRCode && this.state.qrCode == 'default') ? qrcodeBaseStyle + " green" : qrcodeBaseStyle + " gray";
            var adminKey = PuffWardrobe.getCurrentKeys()['admin'];
            var adminKeyQRStyle   = (showQRCode && this.state.qrCode == 'admin')   ? qrcodeBaseStyle + " green" : qrcodeBaseStyle + " gray";
            var rootKey = PuffWardrobe.getCurrentKeys()['root'];
            var rootKeyQRStyle    = (showQRCode && this.state.qrCode == 'root')    ? qrcodeBaseStyle + " green" : qrcodeBaseStyle + " gray";

            // TODO: make sure not None
            // TODO: Allow erase keys here?
            var polyglot = Translate.language[puffworldprops.view.language];
            return (
                <div className="menuSection">
                    <div><em>{polyglot.t("menu.identity.edit.msg")}: </em><span className="authorSpan">{currUser}</span>
                    </div>

                    <div><i className="fa fa-lock fa-fw gray"></i> {polyglot.t("menu.identity.private")}</div>
                    {qrcodeField}

                    <div className="menuLabel">{polyglot.t("menu.identity.default")}: </div>
                    <div className="menuInput">
                        <input type="text" name="defaultKey" ref="defaultKey" size="12" value={defaultKey} onFocus={this.handleFocus} />
                        <i className={defaultKeyQRStyle} name="default" onClick={this.handleShowQRCode} ></i>
                    </div><br />

                    <div className="menuLabel">{polyglot.t("menu.identity.admin")}: </div>
                    <div className="menuInput">
                        <input type="text" name="adminKey" ref="adminKey" size="12" value={adminKey} onFocus={this.handleFocus} />
                        <i className={adminKeyQRStyle} name="admin" onClick={this.handleShowQRCode}></i>
                    </div><br />

                    <div className="menuLabel">{polyglot.t("menu.identity.root")}: </div>
                    <div className="menuInput">
                        <input type="text" name="rootKey" ref="rootKey" size="12" value={rootKey} onFocus={this.handleFocus} />
                        <i className={rootKeyQRStyle} name="root" onClick={this.handleShowQRCode}></i>
                    </div><br />

                </div>
                )
        }
    },

    toggleShowRootKey: function() {
        console.log(this.state.rootKey);
        if(this.state.rootKey == 'hidden') {
            this.setState({rootKey: PuffWardrobe.getCurrentUserRecord().rootKey});
        } else {
            this.setState({rootKey: 'hidden'});
        }
        return false;
    },

    handleChange: function(event){
        return false;
    }

});

/*

 <br />
 - Place to view
 - Username is fixed<br />
 - Existing Keys<br />
 + default, admin, root, (click to show each new level)<br />
 + Click next to each one to try and change<br />
 - Message area below for results<br />
 - Reminder to save keys<br />
 */


var defaultPrivateKeyField = React.createClass({
    render: function() {
        return (
            <span>
                <div className="menuLabel">default: </div>
                <div className="menuInput">
                    <input type="text" name="defaultKeyPrivate" ref="defaultKeyPrivate" size="18" />
                </div>
            </span>
            )
    }

})

var NewIdentity = React.createClass({
    getInitialState: function() {
        return {
            step: 0,
            wantImport: false,
            desiredUsername: '',
            usernameAvailable: 'unknown',
            usernameMessage: '',
            newUsername: ''
        }
    },

    handleFocus: function(e) {
        var target = e.target;
        setTimeout(function() {
            target.select();
        }, 0);
    },

    handleAskForImport: function() {
        this.setState({wantImport: !this.state.wantImport})
    },
    handleImport: function() {
        var network = this.refs.import.getDOMNode().value;
        UsernameImport[network].requestAuthentication();
    },
    handleBack: function() {
        this.props.keys = {};
        this.setState({step: (this.state.step+3)%4,
                       usernameMessage: ''});
    },
    handleNext: function() {
        if (this.state.step == 0) {
            // set the desired username
            var username = "";
            if (!this.props.importUsername) {
                username = this.refs.prefix.getDOMNode().value + '.' + this.refs.newUsername.getDOMNode().value;
            } else {
                username = this.props.importUsername;
            }
            // TODO check the username and make sure it is valid
            this.setState({desiredUsername: username});
            setViewPropsInURL();
        } else if (this.state.step == 1) {
            var valid = this.checkKeys();
            if (!valid) return;
            this.setState({usernameMessage: ''});
        }
        this.setState({step: (this.state.step+1)%4});
    },

    handleStartOver: function() {
        var show = this.props.show;
        this.props = {};
        this.props.show = show;
        this.setState({
            step: 0,
            wantImport: false,
            desiredUsername: '',
            usernameMessage: ''
        });
    },

    // TODO: Add options for users to save keys
    // TODO: Add to advanced tools <UsernameCheckbox show={this.state.usernameAvailable} />
    render: function() {
        if (!this.props.show) {
            return <span></span>
        } else {
            var showNext = true;
            var polyglot = Translate.language[puffworldprops.view.language];
            var usernameField = "";
            if (!this.state.wantImport) {
                usernameField = (
                <div>
                    <div className="menuLabel"><em>{polyglot.t("menu.identity.newKey.msg")}:</em></div><br />
                    <div className = "menuItem">
                        <select ref="prefix">
                            {CONFIG.users.map(function(u) {
                                return <option key={u.username} value={u.username}>{u.username}</option>
                            })}
                        </select> <em>.</em>{' '}
                        <input type="text" name="newUsername" ref="newUsername"  defaultValue={this.state.newUsername} size="12" /> <a href="#" onClick={this.handleGenerateUsername}></a> <i className="fa fa-question-circle fa-fw" rel="tooltip" title="Right now, only anonymous usernames can be registered. To be notified when regular usernames become available, send a puff with .puffball in your zones"></i>
                   </div>
                    Or, <input className="btn-link" type="button" onClick={this.handleAskForImport} value="import"/>from another website.
                </div>);
            } else {
                showNext = false;
                usernameField = (
                    <div>
                        <div className="menuLabel"><em>Import from:</em></div>{' '}<select id="import" ref="import">
                                <option value="instagram">Instagram</option>
                                <option value="reddit">Reddit</option>
                            </select><input className="btn-link" type="button" onClick={this.handleImport} value="Go"/>{' '}<input className="btn-link" type="button" onClick={this.handleAskForImport} value="Cancel"/>
                    </div>);
            }
            // check if there is requestedUsername parameter
            var params = getQuerystringObject();
            if (params['requestedUsername']) {
                this.props.importUsername = reduceUsernameToAlphanumeric(params['requestedUsername']);
                this.props.importToken = params['token'];
                this.props.importId = params['requestedUserId'];
                this.props.importNetwork = params['network'];
                showNext = true;
                usernameField = (
                    <div>
                        <div className="menuLabel"><em>Imported Username</em></div>{' '}<span>{this.props.importUsername}</span>{' '}<input className="btn-link" type="button" onClick={this.handleAskForImport} value="Cancel"/>
                    </div>);
            }

            // are we allowing input public keys?
            var publicKeyField= (
            <div>
                <div className="menuHeader"><i className="fa fa-unlock-alt"></i> {polyglot.t("menu.identity.public")}</div>
                <div className="menuLabel"><sup>*</sup>{polyglot.t("menu.identity.root")}: </div>
                    <div className="menuInput">
                        <input type="text" name="rootKeyPublic" ref="rootKeyPublic" size="18" onFocus={this.handleFocus} />
                    </div>
                    <br />

                    <div className="menuLabel"><sup>*</sup>{polyglot.t("menu.identity.admin")}: </div>
                    <div className="menuInput">
                        <input type="text" name="adminKeyPublic" ref="adminKeyPublic" size="18" onFocus={this.handleFocus} />
                    </div>

                    <br />

                    <div className="menuLabel"><sup>*</sup>{polyglot.t("menu.identity.default")}: </div>
                    <div className="menuInput">
                        <input type="text" name="defaultKeyPublic" ref="defaultKeyPublic" size="18" onFocus={this.handleFocus} />
                    </div>
                    <br />
            </div>
            );
            var privateKeyField = (
            <div>
                <div className="menuHeader"><i className="fa fa-lock"></i> {polyglot.t("menu.identity.private")}</div>
                    <div className="menuLabel">{polyglot.t("menu.identity.root")}: </div>
                    <div className="menuInput">
                        <input type="text" name="rootKeyPrivate" ref="rootKeyPrivate" size="18" onFocus={this.handleFocus} />
                    </div>
                    <br />

                    <div className="menuLabel">{polyglot.t("menu.identity.admin")}: </div>
                    <div className="menuInput">
                        <input type="text" name="adminKeyPrivate" ref="adminKeyPrivate" size="18" onFocus={this.handleFocus} />
                    </div>
                    <br />

                    <div className="menuLabel">{polyglot.t("menu.identity.default")}: </div>
                    <div className="menuInput">
                        <input type="text" name="defaultKeyPrivate" ref="defaultKeyPrivate" size="18" onFocus={this.handleFocus} />
                    </div>
                    <br/>
            </div>
            )
            var keyField = (
            <div>
                <em>Remember to save your keys!</em>
                {publicKeyField}
                    <a href="#" onClick={this.handleGeneratePrivateKeys} >{polyglot.t("menu.identity.newKey.generate")}</a> {polyglot.t("menu.identity.newKey.or")} <a href="#" onClick={this.handleConvertPrivatePublic} >{polyglot.t("menu.identity.newKey.convert.private")}<span className="fa fa-long-arrow-right fa-fw"></span>{polyglot.t("menu.identity.newKey.convert.public")}</a><br />
                {privateKeyField}
            </div>
            );

            var submitField = (
                <a href="#" className="floatRight" onClick={this.handleUsernameRequest}>{polyglot.t("menu.identity.newKey.submit")}</a>
            );

            var mainField = [usernameField, keyField, submitField, ""];
            var stepMessage = [
                "Select a new username",
                "Generate keys for " + this.state.desiredUsername,
                "Requested username " + this.state.desiredUsername,
                this.state.desiredUsername
            ];

            var nextField = (
                <a className="floatRight" onClick={this.handleNext}>Next<i className="fa fa-chevron-right fa-fw"></i></a>
            );
            if (!showNext || this.state.step > 1) nextField = "";

            var backField = (
                <a className="floatLeft" onClick={this.handleBack}><i className="fa fa-chevron-left fa-fw"></i>Back</a>
            );
            if (this.state.step == 0) backField="";
            if (this.state.step == 3) backField=(
                <a className="floatLeft" onClick={this.handleStartOver}><i className="fa fa-chevron-left fa-fw"></i>Start Over</a>
            );

            var messageField = this.state.usernameMessage ? (<div><em>{this.state.usernameMessage}</em></div>) : "";

            return (
                <div className="menuSection">
                    <div className="menuLabel">Step#{this.state.step+1}{': '}{stepMessage[this.state.step]}</div><br/>
                    {mainField[this.state.step]}
                    {messageField}
                    {backField}{nextField}<br/>
                </div>
                )
        }
    },

    handleGenerateUsername: function() {
        var generatedName = PuffWardrobe.generateRandomUsername();
        this.setState({newUsername: generatedName});
        return false;
    },

    componentWillMount: function() {
        this.handleGenerateUsername();
    },
    componentDidUpdate: function() {
        this.getDOMNode().scrollIntoView(true);
    },
    componentDidMount: function() {
        this.getDOMNode().scrollIntoView(true);
    },

    checkKeys: function() {
        // Stuff to register. These are public keys
        var rootKeyPublic    = this.refs.rootKeyPublic.getDOMNode().value;
        var adminKeyPublic   = this.refs.adminKeyPublic.getDOMNode().value;
        var defaultKeyPublic = this.refs.defaultKeyPublic.getDOMNode().value;

        var polyglot = Translate.language[puffworldprops.view.language];
        if(!rootKeyPublic || !adminKeyPublic || !defaultKeyPublic) {
            this.setState({usernameMessage: polyglot.t("menu.identity.newKey.error.missing")});
            return false;
        }

        var rootKeyPrivate = this.refs.rootKeyPrivate.getDOMNode().value;
        var adminKeyPrivate = this.refs.adminKeyPrivate.getDOMNode().value;
        var defaultKeyPrivate = this.refs.defaultKeyPrivate.getDOMNode().value;

        // store public keys to prop
        this.props.keys = {
            rootKeyPublic    : rootKeyPublic,
            adminKeyPublic   : adminKeyPublic,
            defaultKeyPublic : defaultKeyPublic,
            rootKeyPrivate   : rootKeyPrivate,
            adminKeyPrivate  : adminKeyPrivate,
            defaultKeyPrivate: defaultKeyPrivate
        };
        return true;        
    },

    handleUsernameRequest: function() {
        var polyglot = Translate.language[puffworldprops.view.language];
        // BUILD REQUEST
        var requestedUsername = this.state.desiredUsername;
        var prefix = "anon";
        var prefixIndex = requestedUsername.indexOf('.');
        if (requestedUsername.indexOf('.') != -1) {
            prefix = requestedUsername.split('.')[0];
        }
        console.log("BEGIN username request for ", requestedUsername);

        var rootKeyPublic     = this.props.keys.rootKeyPublic;
        var adminKeyPublic    = this.props.keys.adminKeyPublic;
        var defaultKeyPublic  = this.props.keys.defaultKeyPublic;
        
        var rootKeyPrivate    = this.props.keys.rootKeyPrivate;
        var adminKeyPrivate   = this.props.keys.adminKeyPrivate;
        var defaultKeyPrivate = this.props.keys.defaultKeyPrivate;

        var self = this;

        // SUBMIT REQUEST
        var prom = PuffNet.registerSubuser(prefix, CONFIG.users[prefix].adminKey, requestedUsername, rootKeyPublic, adminKeyPublic, defaultKeyPublic);
        prom.then(function(userRecord) {
                // store directly because we know they're valid
                PuffWardrobe.storePrivateKeys(requestedUsername, rootKeyPrivate, adminKeyPrivate, defaultKeyPrivate);
                self.setState({step: 3, 
                               usernameMessage: polyglot.t("menu.identity.newKey.success")});

                // Set this person as the current user
                PuffWardrobe.switchCurrent(requestedUsername);

                events.pub('ui/event', {});

            },
            function(err) {
                console.log("ERR")
                self.setState({step: 3, 
                               usernameMessage: err.toString()});
                events.pub('ui/event', {});
            });

        return false;
    },

    handleGeneratePrivateKeys: function() {
        // Get private keys
        var rootKey = Puffball.Crypto.generatePrivateKey();
        var adminKey = Puffball.Crypto.generatePrivateKey();
        var defaultKey = Puffball.Crypto.generatePrivateKey();

        this.refs.rootKeyPrivate.getDOMNode().value = rootKey;
        this.refs.adminKeyPrivate.getDOMNode().value = adminKey;
        this.refs.defaultKeyPrivate.getDOMNode().value = defaultKey;

        this.refs.rootKeyPublic.getDOMNode().value = Puffball.Crypto.privateToPublic(rootKey);
        this.refs.adminKeyPublic.getDOMNode().value = Puffball.Crypto.privateToPublic(adminKey);
        this.refs.defaultKeyPublic.getDOMNode().value = Puffball.Crypto.privateToPublic(defaultKey);

        // Clear out any error messages
        return false;
    },

    handleConvertPrivatePublic: function() {
        // NOTE: When blank, Puffball.Crypto.privateToPublic generates a new public key
        var rP = this.refs.rootKeyPrivate.getDOMNode().value;
        var aP = this.refs.adminKeyPrivate.getDOMNode().value;
        var dP = this.refs.defaultKeyPrivate.getDOMNode().value;

        var missingValues = false;
        if(!rP.length) {
            this.setState({rootKeyMessage: 'Missing root key. '});
            missingValues = true;
        }

        if(!aP.length) {
            this.setState({adminKeyMessage: 'Missing admin key. '});
            missingValues = true;
        }

        if(!dP.length) {
            this.setState({defaultKeyMessage: 'Missing default key. '});
            missingValues = true;
        }

        if(missingValues) {
            return false;
        }

        var rPublic = Puffball.Crypto.privateToPublic(rP);
        var aPublic = Puffball.Crypto.privateToPublic(aP);
        var dPublic = Puffball.Crypto.privateToPublic(dP);

        rPublic ? this.refs.rootKeyPublic.getDOMNode().value = rPublic : this.setState({rootKeyMessage: 'Invalid root key. '});
        aPublic ? this.refs.adminKeyPublic.getDOMNode().value = aPublic : this.setState({adminKeyMessage: 'Invalid admin key. '});
        dPublic ? this.refs.defaultKeyPublic.getDOMNode().value = dPublic : this.setState({defaultKeyMessage: 'Invalid default key. '});

        return false;

    },

    handleUsernameLookup: function() {

        this.state.usernameAvailable = 'checking';
        var username = this.refs.newUsername.getDOMNode().value;

        var prom = Puffball.getUserRecord(username);

        prom.then(function(result) {
            console.log(result);
            if(result.username !== undefined) {
                this.setState({usernameAvailable: 'registered'});
            } else {
                this.setState({usernameAvailable: 'available'});
            }
            // this.state.usernameAvailable
        }).catch(function(err) {
            console.log("ERROR");
            console.log(err.message);
        })
        return false;
    }
});

var UsernameCheckbox = React.createClass({
    render: function () {
        /*
         var cx = React.addons.classSet;
         var classes = cx({

         'fa': true,
         'fa-check red': (this.props.usernameAvailable === 'registered'),
         'fa-check blue': (this.props.usernameAvailable === 'available'),
         'fa-spinner': (this.props.usernameAvailable === 'checking')
         });

         return (
         <div className={classes} rel="tooltip" title="Check availability"></div>
         )
         */


        var checkboxClass = 'menuIcon fa fa-check gray';
        if (this.props.usernameAvailable === 'registered') {
            checkboxClass = 'menuIcon fa fa-check red';
            var usernameNotice = 'Sorry! Not available.';
        } else if(this.props.usernameAvailable === 'available') {
            checkboxClass = 'menuIcon fa fa-check blue';
            var usernameNotice = 'Yes! Username unavailable.';
        } else if(this.props.usernameAvailable === 'checking') {
            checkboxClass = 'menuIcon fa fa-spinner';
            var usernameNotice = '';
        }

        return (
            <span>
                <div className={checkboxClass} rel="tooltip" title="Check availability"></div>
            {usernameNotice}
            </span>
            )

    }
});


var About = React.createClass({
    render: function() {
        var polyglot = Translate.language[puffworldprops.view.language];
        return (
            <div>
                <div className="menuHeader">
                <i className="fa fa-info-circle fa-fw gray"></i> {polyglot.t("menu.about.title")}
            </div>

                <div className="menuItem"><a href="https://github.com/puffball/freebeer/" target="_new">{polyglot.t("menu.about.code")}</a></div>
            </div>
            )
    }
})

/*
// TODO: Put in stuff for
Call this Info instead of about, and have About puff
 <div>User guide</div>
 <div>Contact us</div>
 <div>Privacy policy</div>
 TODO: Add puff for
 Privacy policy: If you choose to make a puff public, it is public for everyone to see. If you encrypt a puff, its true contents will only be visible to your intended recipient, subject to the limitations of the cryptograhic tools used and your ability to keep your private keys private. Nothing prevents your intended recipient from sharing decripted copies of your content. <br /> Your username entry contains your public keys and information about your most recent content. You can view your full username record in the Advanced Tools section.

 TODO: Contact us link brings up a stub for a private puff with .puffball in the routing.

 */

var Tools = React.createClass({
    handlePackPuffs: function() {
        return events.pub('ui/show/puffpacker', {'view.style': 'PuffPacker', 'menu': puffworlddefaults.menu});
    },

    render: function() {
        var polyglot = Translate.language[puffworldprops.view.language];
        return (
            <div>
                <div className="menuHeader">
                <i className="fa fa-wrench fa-fw gray"></i> {polyglot.t("menu.tool.title")}
            </div>
                <div className="menuItem">
                    <a href="#" onClick={this.handlePackPuffs}>{polyglot.t("menu.tool.builder")}</a>
                </div>
            </div>
            )
    }
})

var Main = React.createClass({
    render: function() {
        return (
            <div>Main!</div>
            )
    }
});
