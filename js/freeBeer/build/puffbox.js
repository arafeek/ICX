/** @jsx React.DOM */

var PuffFancyBox = React.createClass({displayName: 'PuffFancyBox',
    render: function() {
        var   puff = this.props.puff
        var  style = {}
        var  stats = this.props.stats
        var arrows = stats.arrows
        var  width = stats.width
        var height = stats.height
        var    top = stats.y
        var   left = stats.x + CONFIG.leftMargin
        var hidden = !this.props.view.showinfo
        
        // set up classes
        var classArray = ['block']
        if(this.props.extraClassy)
            classArray.push(this.props.extraClassy)
        if(this.props.view.cursor == puff.sig)
            classArray.push('cursor')
        if(PuffData.getBonus(puff, 'envelope'))
            classArray.push('encrypted')
        var className = classArray.join(' ')
        
        var offset = 30
        if(arrows) {
            width  -= offset
            height -= offset
            top  += offset/2
            left += offset/2
        }

        var spacing = 3
        if(!arrows) {
            width  -= spacing
            height -= spacing
            top  += spacing
            left += spacing
        }
        
        if(stats)
            style = {position: 'absolute', width: width, height: height, left: left, top: top }
        
        return (
            React.DOM.div( {className:className, id:puff.sig, key:puff.sig, style:style}, 
                PuffAuthor( {username:puff.username, hidden:hidden} ),
                PuffContent( {puff:puff, height:height} ),
                PuffBar( {puff:puff, hidden:hidden} )
            )
        );
    }
});


var PuffAuthor = React.createClass({displayName: 'PuffAuthor',
    handleClick: function() {
        var username = this.props.username;
        // TODO: consolidate with menu.js handleShowUserPuffs
        return events.pub('ui/show/by-user', { 'view.mode': 'list'
                                             , 'view.filters': puffworlddefaults.view.filters
                                             , 'view.query': puffworlddefaults.view.query
                                             , 'view.filters.users': [username]
                                             })
    },
    render: function() {
        var username = humanizeUsernames(this.props.username)
        var className = 'author' + (this.props.hidden ? ' hidden' : '')

        return (
            React.DOM.div( {className:className}, React.DOM.a( {href:"", onClick:this.handleClick}, username))
        );
    }
});

var PuffContent = React.createClass({displayName: 'PuffContent',
    handleClick: function() {
        var puff = this.props.puff
        showPuff(puff.sig)
    },
    render: function() {
        var puff = this.props.puff
        var rawPuffs = puffworldprops.raw.puffs || [];
        var puffcontent = '';
        if (rawPuffs.indexOf(puff.sig) == -1) {
            puffcontent = PuffForum.getProcessedPuffContent(puff);
        } else {
            puffcontent = puff.payload.content;
            puffcontent = puffcontent
                                     .replace(/&/g, "&amp;") // escape html
                                     .replace(/</g, "&lt;")
                                     .replace(/>/g, "&gt;")
                                     .replace(/"/g, "&quot;")
                                     .replace(/'/g, "&#039;")
                                     .replace(/(?:\r\n|\r|\n)/g, '<br />') // replace line break with <br /> tag;

        }
        // FIXME: this is bad and stupid because user content becomes unescaped html don't do this really seriously
        return React.DOM.div( {style:{height: this.props.height}, className:"txt", onClick:this.handleClick, dangerouslySetInnerHTML:{__html: puffcontent}})
    }
});

var PuffBar = React.createClass({displayName: 'PuffBar',
    mixins: [TooltipMixin],
    getInitialState: function() {
        return {showMain: true};
    },
    handleShowMore: function() {
        this.setState({showMain: !this.state.showMain});
    },
    componentDidUpdate: function() {
        this.componentDidMount();
    },
    render: function() {
        var puff = this.props.puff;
        var className = 'bar' + (this.props.hidden ? ' hidden' : '')
        var canViewRaw = puff.payload.type=='bbcode'||puff.payload.type=='markdown'||puff.payload.type=='PGN';

        var polyglot = Translate.language[puffworldprops.view.language];
        if (!this.state.showMain) {
            return (
                React.DOM.div( {className:className}, 
                    canViewRaw ? PuffViewRaw( {sig:puff.sig} ) : '',
                    puff.payload.type == 'image' ? PuffViewImage( {puff:puff} ) : "",
                    PuffJson( {puff:puff} ),
                    PuffPermaLink( {sig:puff.sig} ),
                    PuffExpand( {puff:puff} ),
                    
                    React.DOM.span( {className: "icon", onClick:this.handleShowMore}, 
                        React.DOM.a(null, React.DOM.i( {className:"fa fa-ellipsis-h fa-fw"})),
                        Tooltip( {position:"above", content:polyglot.t("menu.tooltip.seeMore")} )
                    )
                )
            );
        }
        //
        return (
            React.DOM.div( {className:className}, 
                PuffFlagLink( {sig:puff.sig} ),
                PuffTipLink( {username:puff.username} ),
                PuffInfoLink( {puff:puff} ),
                PuffParentCount( {puff:puff} ),
                PuffChildrenCount( {puff:puff} ),
                PuffReplyLink( {sig:puff.sig} ),
                React.DOM.span( {className: "icon", onClick:this.handleShowMore}, 
                    React.DOM.a(null, React.DOM.i( {className:"fa fa-ellipsis-h fa-fw"})),
                    Tooltip( {position:"above", content:polyglot.t("menu.tooltip.seeMore")} )
                )
            )
        );
    }
});

var PuffViewImage = React.createClass({displayName: 'PuffViewImage',
    render: function() {
        var puff = this.props.puff;
        var polyglot = Translate.language[puffworldprops.view.language];
        return (
            React.DOM.span( {className: "icon"}, 
                React.DOM.a( {href:puff.payload.content, target:"new"}, React.DOM.i( {className:"fa fa-search-plus fa-fw"})),
                Tooltip( {position:"above", content:polyglot.t("menu.tooltip.viewImage")})
            )
        );
    }
});

var PuffJson = React.createClass({displayName: 'PuffJson',
    handleClick: function() {
        var jsonstring = JSON.stringify(this.props.puff);
        var jswin = window.open("");
        jswin.document.write(jsonstring);
    },
    render: function() {
        var polyglot = Translate.language[puffworldprops.view.language];
        return (
            React.DOM.span( {className: "icon", onClick:this.handleClick}, 
                React.DOM.a(null, React.DOM.i( {className:"fa fa-cubes fa-fw"})),
                Tooltip( {position:"above", content:polyglot.t("menu.tooltip.json")})
            )
        )
    }
 });

var PuffFlagLink = React.createClass({displayName: 'PuffFlagLink',

    getInitialState: function() {
        return {flagged: false}
    },

    handleFlagRequest: function() {
        var self = this;
        var privateKeys = PuffWardrobe.getCurrentKeys();

        if(!privateKeys.username) {
            // TODO handle fail
        }

        if(!privateKeys.admin) {
            // TODO handle fail
        }

        // Stuff to register. These are public keys
        var payload = {};
        var routes = [];
        var type = 'flagPuff';
        var content = this.props.sig;

        payload.time = Date.now();

        var puff = Puffball.buildPuff(privateKeys.username, privateKeys.admin, routes, type, content, payload);

        var data = { type: 'flagPuff'
                   , puff: puff
                   };

        var prom = PuffNet.post(CONFIG.puffApi, data);

        // console.log(puff);

        prom.then(function(result) {
                self.setState({flagged: true});
            })
            .catch(function(err) {
               alert(err);
            });

        return false;
    },



    render: function() {
        var cx1 = React.addons.classSet;
        var newClass = cx1({
            'fa fa-bomb fa-fw': true,
            'gray': this.state.flagged,
            'red': !this.state.flagged
        });

        // Does this user have right to flag?
        if(PuffWardrobe.getCurrentUsername() == CONFIG.zone) {
            return React.DOM.a( {href:"#", onClick:this.handleFlagRequest}, React.DOM.i( {className:newClass} ))
        } else {
            return React.DOM.i(null)
        }

    }
});



var PuffParentCount = React.createClass({displayName: 'PuffParentCount',
    handleClick: function() {
        var puff  = this.props.puff;
        return events.pub('ui/show/parents', { 'view.mode': 'list'
                                             , 'view.query': puffworlddefaults.view.query
                                             , 'view.query.focus': puff.sig
                                             , 'view.query.ancestors': 1
                                             })
    },
    render: function() {
        var puff = this.props.puff;
        var parents = PuffForum.getParents(puff)
        var polyglot = Translate.language[puffworldprops.view.language];
        if (parents.length==0) {
            return (
                    React.DOM.span(null, 
                        React.DOM.span( {className:"click droid"}, React.DOM.span( {ref:"count"} , "0"), " " ),
                        Tooltip( {position:"above", content:polyglot.t("menu.tooltip.parent")} )
                    )
           );
        }
        else {
            return (
                React.DOM.span(null, 
                    React.DOM.a( {href:'#' + this.props.sig, onClick:this.handleClick}, 
                        React.DOM.span( {ref:"count droid"}, parents.length, " " )
                    ),
                    Tooltip( {position:"above", content:polyglot.t("menu.tooltip.parent")})
                )
            );
        }
    }
});

/**
 *
 * Show the Info icon and pop-up the information window
 */
var PuffInfoLink = React.createClass({displayName: 'PuffInfoLink',
    componentDidMount: function(){
        var node = this.getDOMNode();
        var infoLink = node.getElementsByClassName('infoLink')[0];
        var detailInfo = node.getElementsByClassName('detailInfo')[0];

        infoLink.onmouseover = function() {
            detailInfo.style.display = 'block';
        }
        infoLink.onmouseout = function() {
            detailInfo.style.display = 'none';
        }
    },
    render: function() {
        var puff = this.props.puff;
        var date = new Date(puff.payload.time);
        var formattedTime = React.DOM.span(null, "Created ", timeSince(date), " ago");
        var lisc = puff.payload.license ?  React.DOM.span(null, React.DOM.br(null),"License: ", puff.payload.license) : '';

        var type = React.DOM.span(null, React.DOM.br(null),"Type: ", puff.payload.type)

        // var quote = puff.payload.quote ?  <span><br/>Quote: {puff.payload.quote}</span> : '';

        var photographer = puff.photographer ? React.DOM.span(null, React.DOM.br(null),"Photographer: ", puff.photographer) : '';
        var version = React.DOM.span(null, React.DOM.br(null), " Version: ", puff.version);
   //     var altText = formattedTime + ' ' + lisc + ' ' + photographer + ' ' + version;

        return (
            React.DOM.span( {className:"icon"}, 
                React.DOM.a(null, React.DOM.span( {className:"infoLink"}, 
                    React.DOM.i( {className:"fa fa-info fa-fw"}),
                    React.DOM.span( {className:"detailInfo"}, 
                    formattedTime,
                    type,
                    lisc,
                    photographer
                    )
                ))
            )
            );
    }
});

var PuffTipLink = React.createClass({displayName: 'PuffTipLink',
    getInitialState: function() {
        return {
            showTipButtons: false
        };
    },

    handleToggleTipInfo: function(){
        var node = this.getDOMNode();
        var walletInfo = node.getElementsByClassName('walletInfo')[0];

        if(!this.state.showTipButtons) {
            this.setState({showTipButtons: true});
            walletInfo.style.display = 'block';

        } else {
            this.setState({showTipButtons: false});
            walletInfo.style.display = 'none';
        }
        return false;
    },

    render: function() {
        if(this.state.showTipButtons) {

            var tipButtons = TipButton( {currency:"BTC", username:this.props.username} )
        } else {
            var tipButtons = ''
        }

        return (
            React.DOM.span( {className:"icon"}, 
            React.DOM.span( {className:"walletLink"}, 
                React.DOM.a( {href:"#", onClick:this.handleToggleTipInfo}, 
                    React.DOM.i( {className:"fa fa-gittip fa-fw"})
                ),
                React.DOM.span( {className:"walletInfo"}, 
                    tipButtons
                )
            )
            )
            );
    }
});

var TipButton = React.createClass({displayName: 'TipButton',
    getInitialState: function() {
        return {
            publicKey: '',
            btcAddy: '',
            akShort: ''
        };
    },

    componentDidMount: function(){
        // Get the public key for this user, convert to wallet
        // TODO: Get the link so have meta-data set, like "From puffball"



        var self = this;
        var prom = Puffball.getUserRecord(this.props.username);

        prom.then(function(result) {

            self.setState({publicKey: result.adminKey});
            console.log(result.adminKey);

            var btcAddy = Puffball.Crypto.wifToPubKey(result.adminKey);

            console.log(btcAddy);

            btcAddy = btcAddy.getAddress().toString();
            self.setState({btcAddy: btcAddy});

            console.log("HI");

            var akShort = btcAddy.substr(0,5)+'...';
            self.setState({akShort: akShort});



            events.pub('ui/tipbutton/userlookup', {});

            return false;
        })
            .catch(function(err) {
                console.log("PROBLEM");

                self.setState({publicKey: false});
                this.setState({btcAddy: 'Unknown :-('});
                this.setState({akShort: 'FAIL'});
                events.pub('ui/tipbutton/userlookup/failed', {});
                return false;
            })
    },

    render: function() {
        if(this.state.btcAddy)
            return (
                    React.DOM.div( {className:"tip"}, 
                        "Tip user: ", React.DOM.a( {href:"bitcoin:" + this.state.btcAddy}, React.DOM.i( {className:"fa fa-bitcoin fa-fw"}))
                    )
            )

        return React.DOM.i( {className:"fa fa-fw fa-spinner"})
    }

});


var PuffViewRaw = React.createClass({displayName: 'PuffViewRaw',
    handleClick:function() {
        var sig = this.props.sig;
        var rawPuff = puffworldprops.raw.puffs
            ? puffworldprops.raw.puffs.slice() 
            : [];
        var index = rawPuff.indexOf(sig);
        if(index == -1) {
            rawPuff.push(sig)
        } else {
            rawPuff.splice(index, 1)
        }

        return events.pub('ui/raw/add-raw', {'raw': {puffs: rawPuff}});
    },
    render: function() {
        var rawPuff = puffworldprops.raw.puffs
            ? puffworldprops.raw.puffs.slice() 
            : [];
        var cx1 = React.addons.classSet;
        var index   = rawPuff.indexOf(this.props.sig)
        if(index == -1) {
            var isGreen = false;
        } else {
            var isGreen = true;
        }

        var newClass = cx1({
            'fa fa-code fa-fw': true,
            'green': isGreen
        });

        var polyglot = Translate.language[puffworldprops.view.language];
        return (
            React.DOM.span( {className:"icon"}, 
                React.DOM.a( {href:"#", onClick:this.handleClick}, 
                    React.DOM.i( {className:newClass})
                ),
                Tooltip( {position:"above", content:polyglot.t("menu.tooltip.viewRaw")})
            )
        );
    }

})

var PuffChildrenCount = React.createClass({displayName: 'PuffChildrenCount',
    handleClick: function() {
        var puff  = this.props.puff;
        return events.pub('ui/show/parents', { 'view.mode': 'list'
                                             , 'view.query': puffworlddefaults.view.query
                                             , 'view.query.focus': puff.sig
                                             , 'view.query.descendants': 1
                                             })
    },
    render: function() {
        var puff = this.props.puff;
        var children = PuffForum.getChildren(puff)
        var polyglot = Translate.language[puffworldprops.view.language];
        if (children.length==0) {
            return (
                React.DOM.span(null, 
                    React.DOM.span( {className:"click droid"}, React.DOM.span( {ref:"count"}, "0"), " " ),
                    Tooltip( {position:"above", content:polyglot.t("menu.tooltip.children")})
                )
            );
        }
        else {
            return (
                React.DOM.span(null, 
                    React.DOM.a( {href:'#' + this.props.sig, onClick:this.handleClick}, 
                        React.DOM.span( {ref:"count droid"}, children.length, " " )
                    ),
                    Tooltip( {position:"above", content:polyglot.t("menu.tooltip.children")})
                )
            );
        }
    }
});

var PuffPermaLink = React.createClass({displayName: 'PuffPermaLink',
    handleClick: function() {
        var sig  = this.props.sig;
        // var puff = PuffForum.getPuffBySig(sig);
        showPuff(sig);
        return false;
    },
    render: function() {
        var polyglot = Translate.language[puffworldprops.view.language];
        return (
            React.DOM.span( {className:"icon"}, 
                React.DOM.a( {href:'#' + this.props.sig, onClick:this.handleClick}, 
                    React.DOM.i( {className:"fa fa-link fa-fw"})
                ),
                Tooltip( {position:"above", content:polyglot.t("menu.tooltip.permaLink")})
            )
        );
    }
});

var PuffReplyLink = React.createClass({displayName: 'PuffReplyLink',
    handleClick: function() {
        // TODO: make this a toggle. Does it already?
        // TODO: Remove coloring when submit puff

        var sig = this.props.sig;

        var parents = puffworldprops.reply.parents          // OPT: global props hits prevent early bailout
            ? puffworldprops.reply.parents.slice()          // clone to keep pwp immutable
            : []

        var index = parents.indexOf(sig)

        if(index == -1) {
            parents.push(sig)
        } else {
            parents.splice(index, 1)
        }

        var menu = PB.shallow_copy(puffworldprops.menu);    // don't mutate directly!
        if (!puffworldprops.reply.expand) {
            menu.show = true;
            menu.section = 'publish';
        }
        return events.pub('ui/reply/add-parent', { 'reply.show': true
                                                 , 'reply.parents': parents
                                                 , 'menu': menu
                                                 });

        // TODO: draw reply arrows. Maybe
    },
    render: function() {
        var parents = puffworldprops.reply.parents          // OPT: global props hits prevent early bailout
            ? puffworldprops.reply.parents.slice()          // clone to keep pwp immutable
            : []
        var cx1 = React.addons.classSet;
        var index   = parents.indexOf(this.props.sig)

        if(index == -1) {
            var isGreen = false;
        } else {
            var isGreen = true;
        }

        var newClass = cx1({
            'fa fa-reply fa-fw': true,
            'green': isGreen
        });

        var polyglot = Translate.language[puffworldprops.view.language];
        return (
            React.DOM.span( {className:"icon"}, 
                React.DOM.a( {href:"#", onClick:this.handleClick}, 
                    React.DOM.i( {className:newClass})
                ),
                Tooltip( {position:"above", content:polyglot.t("menu.tooltip.reply")})
            )
        );
    }
});


var PuffExpand = React.createClass({displayName: 'PuffExpand',
    handleClick: function() {
        var puff = this.props.puff;
        return events.pub("ui/expand-puff", { 'view.mode': 'focus'
                                            , 'view.filters': puffworlddefaults.view.filters
                                            , 'view.query': puffworlddefaults.view.query
                                            , 'view.query.focus': puff.sig
                                            , 'menu': puffworlddefaults.menu
                                            , 'reply': puffworlddefaults.reply
                                            , 'view.rows': 1
                                            })
    },
    render: function() {
        var polyglot = Translate.language[puffworldprops.view.language];
        return (
            React.DOM.span( {className:"icon"}, 
                React.DOM.a( {href:"#", onClick:this.handleClick}, 
                    React.DOM.i( {className:"fa fa-expand fa-fw"})
                ),
                Tooltip( {position:"above", content:polyglot.t("menu.tooltip.expand")})
            )
        );
    }
});

