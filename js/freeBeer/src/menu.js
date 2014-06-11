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
                <View />
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

var View = React.createClass({

    handleViewRoots: function() {
        return events.pub('ui/show/roots', {'view.style': 'PuffRoots', 'view.puff': false, 'menu': puffworlddefaults.menu, 'view.user': ''});
    },

    handleViewLatest: function() {
        return events.pub('ui/show/latest', {'view.style': 'PuffLatest', 'view.puff': false, 'menu': puffworlddefaults.menu, 'view.user': ''});
    },

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

    handleShowUserPuffs: function(username) {
        return events.pub('ui/show/by-user', {'view.style': 'PuffByUser', 'view.puff': false, 'view.user': username})
    },

    handleShowShortcuts: function() {
        showPuff('381yXYnCBc9ARmPWSYLH3kUYThksyfntQeFiDvBvZAoLN9bf2LbaG3GLsE6amcuLSKhs5d3qERXnTU3BFA2vP957SY18nRkM');
    },


    render: function() {
        // CSS for tabs
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

        return (
            <div><br />
                <div className="menuHeader">
                    <i className="fa fa-sitemap fa-fw gray"></i> View
                </div>

                <div className="menuItem"><a href="#" onClick={this.handleViewLatest}>Latest puffs</a></div>

                <div className="menuItem"><a href="#" onClick={this.handleShowUserPuffs.bind(this,'choices.book')}>Choices collection</a></div>

                <div className="menuItem"><a href="#" onClick={this.handleShowShortcuts}>Keyboard shortcuts</a></div>

                <span className="floatingCheckbox"><i className={cbClass} onClick={this.handleShowHideRelationships} ></i></span>
                <div className="menuItem">
                    <a href="#" onClick={this.handleShowHideRelationships}>Show relationships</a>
                </div>

                <span className="floatingCheckbox"><i className={cbClass2} onClick={this.handleShowHideAnimations} ></i></span>
                <div className="menuItem">
                    <a href="#" onClick={this.handleShowHideAnimations}>Show animations</a>
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

        return (
            <div>
                <div className="menuHeader">
                    <i className="fa fa-paper-plane fa-fw gray"></i> Publish
                </div>
                <div className="menuItem">
                    <a href="#" onClick={this.handleNewContent}>New puff</a>
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
                showNewIdentity: false
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


        return (
            <div>
                <div className="menuHeader"><i className="fa fa-user fa-fw gray"></i> Identity</div>
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

        if(!all_usernames.length) return <div className="menuItem">None</div>

        // Force selection of the single user when just one
        if(all_usernames.length == 1) {
            PuffWardrobe.switchCurrent(all_usernames[0]);
        }

        var username = PuffWardrobe.getCurrentUsername()

        // TODO: find a way to select from just one username (for remove user with exactly two users)
        // TODO: Need 2-way bind to prevent select from changing back every time you change it

        return (
            <div className="menuItem">
                Current: <select ref="switcher" onChange={this.handleUserPick} value={username}>
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
        console.log(keyType);

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
                self.state[keyType] = 'Incorrect';
                events.pub('ui/event', {});
                return false;
            } else {
                self.state[keyType] = true;
                self.state.usernameStatus = true;

                // Add this to wardrobe, set to current
                // If they have other keys in wardrobe, don't overwrite!
                if(PuffWardrobe.getCurrentKeys()['root']) {
                    var rootKeyPrivate = PuffWardrobe.getCurrentKeys()['root'];
                } else {
                    var rootKeyPrivate = '';
                }

                if(PuffWardrobe.getCurrentKeys()['admin']) {
                    var adminKeyPrivate = PuffWardrobe.getCurrentKeys()['admin'];
                } else {
                    var adminKeyPrivate = '';
                }

                if(PuffWardrobe.getCurrentKeys()['default']) {
                    var defaultKeyPrivate = PuffWardrobe.getCurrentKeys()['default'];
                } else {
                    var defaultKeyPrivate = '';
                }


                if(keyType == 'defaultKey') {
                    PuffWardrobe.storePrivateKeysDirectly(username, rootKeyPrivate, adminKeyPrivate, privateKey);
                } else if(keyType == 'adminKey') {
                    PuffWardrobe.storePrivateKeysDirectly(username, rootKeyPrivate, privateKey, defaultKeyPrivate);
                } else {
                    PuffWardrobe.storePrivateKeysDirectly(username, privateKey, adminKeyPrivate, defaultKeyPrivate);
                }

                PuffWardrobe.switchCurrent(username);

                // Store this identity
                events.pub('profile/nickname/set', username);

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

            return (
                <div className="menuSection">
                    <div><em>Use this area to store keys with this browser. To publish content, set only your default key.</em></div>
                    <div className="menuLabel">Username:</div>
                    <div className="menuInput">
                        <input type="text" name="username" ref="username" defaultValue={currUser} size="12" />
                        {' '}<a href="#" onClick={this.handleUsernameLookup}><Checkmark show={this.state.usernameStatus} /></a>
                        <em>{this.state.usernameStatus}</em>
                    </div><br />
                    <div><i className="fa fa-lock fa-fw gray"></i> Private Keys</div>

                    <div className="menuLabel">default: </div>
                    <div className="menuInput">
                        <input type="text" name="defaultKey" ref="defaultKey" size="12" />
                        {' '}<a href="#" onClick={this.handleKeyCheck.bind(this,'defaultKey')}>
                                <Checkmark show={this.state.defaultKey} /></a>
                                <em>{this.state.defaultKey}</em>
                    </div><br />

                    <div className="menuLabel">admin: </div>
                    <div className="menuInput">
                        <input type="text" name="adminKey" ref="adminKey" size="12" />
                        {' '}<a href="#" onClick={this.handleKeyCheck.bind(this,'adminKey')}>
                        <Checkmark show={this.state.adminKey} /></a>
                        <em>{this.state.adminKey}</em>
                    </div><br />

                    <div className="menuLabel">root: </div>
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

    render: function() {
        if (!this.props.show) {
            return <span></span>
        } else {

            var currUser = this.props.username;

            // TODO: make sure not None
            // TODO: Allow erase keys here?
            return (
                <div className="menuSection">
                    <div><em>Stored keys for: </em><span className="authorSpan">{currUser}</span>
                    </div>

                    <div><i className="fa fa-lock fa-fw gray"></i> Private Keys</div>

                    <div className="menuLabel">default: </div>
                    <div className="menuInput">
                        <input type="text" name="defaultKey" ref="defaultKey" size="12" value={PuffWardrobe.getCurrentKeys()['default']} />
                    </div><br />

                    <div className="menuLabel">admin: </div>
                    <div className="menuInput">
                        <input type="text" name="adminKey" ref="adminKey" size="12" value={PuffWardrobe.getCurrentKeys()['admin']} />
                    </div><br />

                    <div className="menuLabel">root: </div>
                    <div className="menuInput">
                        <input type="text" name="rootKey" ref="rootKey" size="12" value={PuffWardrobe.getCurrentKeys()['root']} />
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
            usernameAvailable: 'unknown',
            rootKeyMessage: '',
            adminKeyMessage: '',
            defaultKeyMessage: '',
            usernameMessage: '',
            newUsername: ''
        }
    },

    // TODO: Add options for users to save keys
    // TODO: Add to advanced tools <UsernameCheckbox show={this.state.usernameAvailable} />
    render: function() {
        if (!this.props.show) {
            return <span></span>
        } else {

            return (
                <div className="menuSection">

                    <div className="menuLabel"><em>Desired username:</em></div><br />

                    <div className="menuInput">
                        <input type="text" name="newUsername" ref="newUsername" readOnly  value={this.state.newUsername} size="12" /> <a href="#" onClick={this.handleGenerateUsername}><i className="fa fa-refresh fa-fw" rel="tooltip" title="Generate a new username"></i></a> <i className="fa fa-question-circle fa-fw" rel="tooltip" title="Right now, only anonymous usernames can be registered. To be notified when regular usernames become available, send a puff with .puffball in your zones"></i>
                    </div>

                    <br />
                    <br />
                    <div className="menuHeader"><i className="fa fa-unlock-alt"></i> Public Keys</div>


                    <div className="menuLabel"><sup>*</sup>root: </div>
                    <div className="menuInput">
                        <input type="text" name="rootKeyPublic" ref="rootKeyPublic" size="18" />
                    </div>
                    <br />

                    <div className="menuLabel"><sup>*</sup>admin: </div>
                    <div className="menuInput">
                        <input type="text" name="adminKeyPublic" ref="adminKeyPublic" size="18" />
                    </div>

                    <br />

                    <div className="menuLabel"><sup>*</sup>default: </div>
                    <div className="menuInput">
                        <input type="text" name="defaultKeyPublic" ref="defaultKeyPublic" size="18" />
                    </div>
                    <br />

                    <a href="#" onClick={this.handleGeneratePrivateKeys} >Generate</a> or <a href="#" onClick={this.handleConvertPrivatePublic} >Private<span className="fa fa-long-arrow-right fa-fw"></span>Public</a><br />

                    <em>{this.state.rootKeyMessage} {this.state.adminKeyMessage} {this.state.defaultKeyMessage}</em>
                    <br />
                    <div className="menuHeader"><i className="fa fa-lock"></i> Private Keys</div>
                    <div className="menuLabel">root: </div>
                    <div className="menuInput">
                        <input type="text" name="rootKeyPrivate" ref="rootKeyPrivate" size="18" />
                    </div>
                    <br />

                    <div className="menuLabel">admin: </div>
                    <div className="menuInput">
                        <input type="text" name="adminKeyPrivate" ref="adminKeyPrivate" size="18" />
                    </div>
                    <br />

                    <div className="menuLabel">default: </div>
                    <div className="menuInput">
                        <input type="text" name="defaultKeyPrivate" ref="defaultKeyPrivate" size="18" />
                    </div>

                    <br />

                    <input className="btn-link" type="button" value="Submit username request" onClick={this.handleUsernameRequest} /><br />
                    <em>{this.state.usernameMessage}</em>
                </div>
                )
        }
    },

    handleGenerateUsername: function() {
        var generatedName = 'anon.' + PuffWardrobe.generateRandomUsername();
        this.setState({newUsername: generatedName});
        return false;
    },

    componentWillMount: function() {
        this.handleGenerateUsername();
    },

    handleUsernameRequest: function() {

        // BUILD REQUEST
        console.log("BEGIN username request for ", this.refs.newUsername.getDOMNode().value);

        // Stuff to register. These are public keys
        var rootKeyPublic = this.refs.rootKeyPublic.getDOMNode().value;
        var adminKeyPublic = this.refs.adminKeyPublic.getDOMNode().value;
        var defaultKeyPublic = this.refs.defaultKeyPublic.getDOMNode().value;

        rootKeyPrivate = this.refs.rootKeyPrivate.getDOMNode().value;
        adminKeyPrivate = this.refs.adminKeyPrivate.getDOMNode().value;
        defaultKeyPrivate = this.refs.defaultKeyPrivate.getDOMNode().value;

        requestedUsername = this.refs.newUsername.getDOMNode().value;

        if(!rootKeyPublic || !adminKeyPublic || !defaultKeyPublic) {
            this.setState({usernameMessage: "You must set all of your public keys before making a registration request."});
            return false;
        }

        /*


         var privateKeys = PuffWardrobe.getCurrentKeys();

         if(!privateKeys.username) {
         this.setState({usernameMessage: "You must set your identity before building registration requests."});
         // this.state.result = {"FAIL": "You must set your identity before building registration requests."}
         return events.pub('ui/puff-packer/user-registration/error', {});
         }


         var puff = Puffball.buildPuff(privateKeys.username, privateKeys.admin, routes, type, content, payload);
         // NOTE: we're skipping previous, because requestUsername-style puffs don't use it.

         var self = this;
         self.state.puff = puff;
         events.pub('ui/puff-packer/build-register-puff', {});
         */

        var self = this;

        // SUBMIT REQUEST
        var prom = PuffNet.registerSubuser('anon', CONFIG.anon.privateKeyAdmin, requestedUsername, rootKeyPublic, adminKeyPublic, defaultKeyPublic);

        prom.then(function(userRecord) {
                // store directly because we know they're valid
                PuffWardrobe.storePrivateKeysDirectly(requestedUsername, rootKeyPrivate, adminKeyPrivate, defaultKeyPrivate);
                self.setState({usernameMessage: 'Success!'});
                events.pub('ui/event', {});
                return userRecord;
            },
            function(err) {
                console.log("ERR")
                self.setState({usernameMessage: err.toString()});
                events.pub('ui/event', {});
            });

        // TODO: Set this person as the current user


    },

    handleSendPuffToServer: function(puff) {
        // Send the contents of the puff off to userApi with type=updateUsingPuff and post['puff']
        var self = this;

        var prom = PuffNet.updateUserRecord(puff)

        prom.then(function(result) {
            self.setState({result: result});
            self.setState({usernameMessage: "Success!"});
            events.pub('ui/puff-packer/userlookup', {});
        }).catch(function(err) {
            self.setState({'FAIL': err.message});
            self.setState({usernameMessage: 'FAIL: ' + err.message});
            events.pub('ui/puff-packer/userlookup/failed', {});

        })

        return prom;
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
        this.setState({rootKeyMessage: ''});
        this.setState({adminKeyMessage: ''});
        this.setState({defaultKeyMessage: ''});
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

        /*
         this.refs.rootKeyPublic.getDOMNode().value = Puffball.Crypto.privateToPublic(rP);
         this.refs.adminKeyPublic.getDOMNode().value = Puffball.Crypto.privateToPublic(aP);
         this.refs.defaultKeyPublic.getDOMNode().value = Puffball.Crypto.privateToPublic(dP);
         */
        return false;

    },

    handleUsernameLookup: function() {

        this.state.usernameAvailable = 'checking';
        var username = this.refs.newUsername.getDOMNode().value;
        var self = this;

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
        return (
            <div>
                <div className="menuHeader">
                <i className="fa fa-info-circle fa-fw gray"></i> About
            </div>

                <div className="menuItem"><a href="https://github.com/puffball/freebeer/" target="_new">Source code</a></div>
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
        return (
            <div>
                <div className="menuHeader">
                <i className="fa fa-wrench fa-fw gray"></i> Advanced tools
            </div>
                <div className="menuItem">
                    <a href="#" onClick={this.handlePackPuffs}>Puff builder</a>
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