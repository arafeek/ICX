/** @jsx React.DOM */

var ViewKeybindingsMixin = {
    componentDidMount: function() {
        
        // n shows new puff form
        Mousetrap.bind('n', function() { 
            return events.pub('ui/reply/open', {'menu': puffworlddefaults.menu, 'reply': {show: true}});
        }.bind(this));
        
        // r replies to 'selected' puff
        Mousetrap.bind('r', function() { 
            var parents = puffworldprops.reply.parents || [] // OPT: global prop hits prevent early bailout
            parents = parents.slice()                        // don't mutate props directly
            var sig = this.props.view.cursor
            
            if (!sig) return;                                // no cursor? do nothing
            
            var index = parents.indexOf(sig)
            
            if(index == -1) {
                parents.push(sig)
            } else {
                parents.splice(index, 1)
            }
            
            return events.pub('ui/reply/open', {'menu': puffworlddefaults.menu, 'reply': {show: true, parents: parents
}});
        }.bind(this));
        
        // i toggles info boxes
        Mousetrap.bind('i', function() { 
            return events.pub( 'ui/view/showinfo/toggle', 
                             { 'view.showinfo': !this.props.view.showinfo})
        }.bind(this));
        
        
        // 1-9 controls number of columns
        Mousetrap.bind(['1','2','3','4','5','6','7','8','9'], function(e) { 
            return events.pub('ui/view/cols/set', {'view.cols': 1*String.fromCharCode(e.which)})
        }.bind(this));
        
        // shift+1-9 controls number of rows
        Mousetrap.bind(['shift+1','shift+2','shift+3','shift+4','shift+5','shift+6','shift+7','shift+8','shift+9'], function(e) { 
            return events.pub('ui/view/rows/set', {'view.rows': 1*String.fromCharCode(e.which)})
        }.bind(this));
        
        // spacebar toggles display mode
        Mousetrap.bind('space', function(e) { 
            return events.pub( 'ui/view-mode/change', 
                             { 'view.mode': this.props.view.mode == 'browse' ? 'arrows' : 'browse'})
        }.bind(this));
        
        // escape closes menu, else closes reply, else removes cursor, else pops up 'nothing to close' alert
        Mousetrap.bind('esc', function(e) { 
            if(puffworldprops.menu.show)
                return events.pub('ui/menu/close', {'menu.show': false})

            if(puffworldprops.reply.show)
                return events.pub('ui/menu/close', {'reply.show': false})

            if(puffworldprops.view.cursor) {
                var cursor = document.getElementById(puffworldprops.view.cursor);
                cursor.className = cursor.className.replace(' cursor', '');
                return events.pub('ui/menu/close', {'view.cursor': false})
            }

            alert("I'm afraid there's nothing left to close!")
        }.bind(this));
        
        // cmd-enter submits the reply box
        Mousetrap.bind(['command+enter','ctrl+enter'], function(e) {
            if(!this.props.reply.show) 
                return true
            
            if(typeof globalReplyFormSubmitArg == 'function')
                globalReplyFormSubmitArg()
        }.bind(this));
        
        
        // we have to customize stopCallback to make cmd-enter work inside reply boxes
        Mousetrap.stopCallback = function(e, element, combo) {

            // if the element has the class "mousetrap" AND the combo is command+enter or esc, then no need to stop
            if(~['command+enter', 'esc','ctrl+enter'].indexOf(combo) && (' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
                return false;
            }

            // stop for input, select, and textarea
            return element.tagName == 'INPUT' || element.tagName == 'SELECT' || element.tagName == 'TEXTAREA' || (element.contentEditable && element.contentEditable == 'true');
        }
    },
    componentWillUnmount: function() {
        Mousetrap.reset();
    }
};

var CursorBindingsMixin = {
    componentDidMount: function() {
        
        // arrows move the selection cursor
        // THINK: wasd?
        Mousetrap.bind(['left', 'up', 'right', 'down'], function(e) { 
            var current = this.props.view.cursor;
            
            if (!current || !document.getElementById(current))
                current = this.props.view.puff.sig;
                
            if (!current)
                current = document.querySelector('.block').id;
                
            current = document.getElementById(current);
            var next = moveToNeighbour(current.id, e.which, this.props.view.mode);
            
            if (next)
                events.pub('ui/view/cursor/set', {'view.cursor': next.id});
            
            return false
        }.bind(this));
        
        // enter focuses the selected puff
        Mousetrap.bind('enter', function(e) { 
            // don't refocus if there's nothing selected
            if (!this.props.view.cursor)
                return false;
            
            // don't refocus if we're selecting the focused puff 
            if (this.props.view.cursor == this.props.view.puff.sig)
                return false;
            
            showPuff(this.props.view.cursor);
            return false;
        }.bind(this));
        
    },
    componentWillUnmount: function() {
        Mousetrap.reset();
    },
    cursorPower: function(puffs, defaultPuff) {
        var cursor = this.props.view.cursor
        
        if(cursor) {
            var oneOfThesePuffsIsSelected = puffs.filter(function(puff) {return puff.sig == cursor}).length
            if(oneOfThesePuffsIsSelected) {
                return false 
            }
        }
        
        var newCursor = (defaultPuff||puffs[0]||{}).sig
        
        if(newCursor)
            return events.pub('ui/view/cursor/set', {'view.cursor': newCursor})
    }
};

var GridLayoutMixin = {    
    getScreenCoords: function() {
        return { width:  window.innerWidth - CONFIG.leftMargin
               , height: window.innerHeight
               }
    },
    getDimensions: function() {
        return { rows: ~~this.props.view.rows || 4
               , cols: ~~this.props.view.cols || 5
               }
    },
    getGridBox: function(rows, cols) {
        var screencoords = this.getScreenCoords()
        return getGridCoordBox(rows, cols, screencoords.width, screencoords.height)
    },
    getStandardBox: function(rows, cols) {
        var gridbox = this.getGridBox(rows, cols)
        var mode    = this.props.view.mode
        return this.applySizes(1, 1, gridbox, {mode: mode})
    },
    applySizes: function(width, height, gridCoords, bonus, miny, minx, maxy, maxx) {
        return function(className) {
            return function(puff) {
                return extend((bonus || {}), gridCoords(width, height, miny, minx, maxy, maxx), 
                                             {puff: puff, className: className}) } } 
    },
    getPuffBoxList: function(puffs) {
        var dimensions  = this.getDimensions() 
        var standardBox = this.getStandardBox(dimensions.rows, dimensions.cols)
        return puffs.map(standardBox('child'))
                    .filter(function(pbox) {return pbox.height})
    },
    makeArrows: function(puffBoxen) {
        var screencoords = this.getScreenCoords()
        
        var arrows = puffBoxen.reduce(function(acc, puffbox) {
                        return acc.concat(
                            puffbox.puff.payload.parents.map(
                                function(parent) {
                                    return [puffBoxen.filter(
                                        function(pb) {
                                            return pb.puff.sig == parent})[0], puffbox]}))}, [])
                                                .filter(function(pair) {return pair[0]})

        return (
            React.DOM.svg( {width:screencoords.width, height:screencoords.height, style:{position:'absolute', top:'0px', left:'0px'}}, 
                React.DOM.defs( {dangerouslySetInnerHTML:{__html: '<marker id="triangle" viewBox="0 0 20 20" refX="10" refY="10" fill="blue" markerUnits="strokeWidth" markerWidth="18" markerHeight="12" orient="auto"><path d="M 0 5 L 10 10 L 0 15 z" /><circle cx="15" cy="10" r="5" fill="white" /></marker>'}} ),
                arrows.map(function(arrow) {
                    return PuffArrow( {key:'arrow-' + arrow[0].puff.sig + '-' + arrow[1].puff.sig, arrow:arrow} )
                })
            )
        )        
    },
    standardGridify: function(puffs) {
        var puffBoxList = this.getPuffBoxList(puffs)
        return this.manualGridify(puffBoxList)
    },
    manualGridify: function(puffBoxList) {
        var arrowList = this.props.view.mode == 'arrows' ? this.makeArrows(puffBoxList) : ''
        var viewprops = this.props.view
        
        var fancyWrapper = (function() {
            return function(puffplus) {     // this is getting really messy -- maybe just transfer props
                var className = puffplus.className
                var stats = puffplus
                var puff  = puffplus.puff
                var view  = viewprops
                return PuffFancyBox( {puff:puff, key:puff.sig, extraClassy:className, stats:stats, view:view} )
            }
        })()
        
        
        return (
            React.DOM.div(null, 
                React.DOM.div( {id:"talltree"}, 
                    puffBoxList.map(fancyWrapper)
                ),

                arrowList
            )
        )
    }
};

// MAIN VIEWS
var PuffWorld = React.createClass({displayName: 'PuffWorld',
    render: function() {

        var defaultPuff = PuffForum.getPuffById(CONFIG.defaultPuff);
        var defaultViewProps = {};
        defaultViewProps.puff = defaultPuff;

        var view;
        var viewprops = this.props.view || {};

        if( viewprops.style == 'PuffTallTree' )
            view  = PuffTallTree(    {view:viewprops, reply:this.props.reply} )

        else if( viewprops.style == 'PuffAllChildren' )
            view  = PuffAllChildren( {view:viewprops, reply:this.props.reply, puff:viewprops.puff} )

        else if( viewprops.style == 'PuffAllParents' )
            view  = PuffAllParents(  {view:viewprops, reply:this.props.reply, puff:viewprops.puff} )

        else if( viewprops.style == 'PuffByUser' )
            view  = PuffByUser(      {view:viewprops, reply:this.props.reply, user:viewprops.user} )

        else if( viewprops.style == 'PuffLatest' )
            view  = PuffLatest(      {view:viewprops, reply:this.props.reply} )

        else if( viewprops.style == 'PuffPacker' )
            view  = PuffPacker(         {tools:this.props.tools} )

        else view = PuffTallTree(    {view:defaultViewProps, reply:this.props.reply} )

        var reply = this.props.reply.show ? PuffReplyForm( {reply:this.props.reply} ) : ''

        var menu = this.props.menu.show ? React.DOM.div(null, Menu( {prefs:this.props.prefs, profile:this.props.profile} )) : ''

        var animateClass =  this.props.view.animation ? "animation" : '';

        return (
            React.DOM.div( {className:animateClass}, 
                PuffHeader( {menu:this.props.menu} ),
                menu,
                view,
                reply,
                PuffFooter(null )
            )
            )
    }
});


var PuffRoots = React.createClass({displayName: 'PuffRoots',
    mixins: [ViewKeybindingsMixin, CursorBindingsMixin, GridLayoutMixin],
    render: function() {
        var dimensions = this.getDimensions();
        var limit = dimensions.cols * dimensions.rows;
        var puffs = PuffForum.getRootPuffs(limit); // pre-sorted
        this.cursorPower(puffs)
        return this.standardGridify(puffs);
    }
});

var PuffAllChildren = React.createClass({displayName: 'PuffAllChildren',
    mixins: [ViewKeybindingsMixin, CursorBindingsMixin, GridLayoutMixin],
    render: function() {
        var puffs = PuffForum.getChildren(this.props.puff); // pre-sorted
        this.cursorPower(puffs)
        return this.standardGridify(puffs);
    }
});

var PuffAllParents = React.createClass({displayName: 'PuffAllParents',
    mixins: [ViewKeybindingsMixin, CursorBindingsMixin, GridLayoutMixin],
    render: function() {
        var puffs = PuffForum.getParents(this.props.puff); // pre-sorted
        this.cursorPower(puffs)
        return this.standardGridify(puffs);
    }
});

var PuffByUser = React.createClass({displayName: 'PuffByUser',
    mixins: [ViewKeybindingsMixin, CursorBindingsMixin, GridLayoutMixin],
    render: function() {
        var dimensions = this.getDimensions();
        var limit = dimensions.cols * dimensions.rows;
        var puffs = PuffForum.getByUser(this.props.user, limit); // pre-sorted
        this.cursorPower(puffs)
        return this.standardGridify(puffs);
    }
});

var PuffLatest = React.createClass({displayName: 'PuffLatest',
    mixins: [ViewKeybindingsMixin, CursorBindingsMixin, GridLayoutMixin],
    render: function() {
        var dimensions = this.getDimensions();
        var limit = dimensions.cols * dimensions.rows;
        var puffs = PuffForum.getLatestPuffs(limit); // pre-sorted
        this.cursorPower(puffs)
        return this.standardGridify(puffs);
    }
});


var PuffTallTree = React.createClass({displayName: 'PuffTallTree',
    mixins: [ViewKeybindingsMixin, CursorBindingsMixin, GridLayoutMixin],
    render: function() {

        var puff   = this.props.view.puff
        var mode   = this.props.view.mode
        var sigfun = function(item) {return item.sig}
        var username = PuffWardrobe.getCurrentUsername()
        
        if(!puff)
            return React.DOM.div(null)
        
        // gridCoord params
        var screencoords = this.getScreenCoords()
        var dimensions   = this.getDimensions()
        var cols    = dimensions.cols
        var gridbox = this.getGridBox(dimensions.rows, cols)
        
        var standardBox  = this.applySizes(1, 1, gridbox, {mode: mode})
        var secondRowBox = this.applySizes(1, 1, gridbox, {mode: mode}, 1)
        var fourthRowBox = this.applySizes(1, 1, gridbox, {mode: mode}, 4)
        var stuckBigBox  = this.applySizes(cols > 1 ? 2 : 1, 2, gridbox, {mode: mode}, 1, 0, 1, 0)
        
        // gather puffs
        var parentPuffs   = PuffForum.getParents(puff) // pre-sorted

        var grandPuffs    = parentPuffs.reduce(function(acc, puff) {return acc.concat(PuffForum.getParents(puff))}, [])
        var greatPuffs    =  grandPuffs.reduce(function(acc, puff) {return acc.concat(PuffForum.getParents(puff))}, [])
  
            parentPuffs   = parentPuffs.concat(grandPuffs, greatPuffs)
                                       .filter(function(item, index, array) {return array.indexOf(item) == index}) 
                                       .slice(0, cols)
                                       
        var siblingPuffs  = PuffForum.getSiblings(puff) // pre-sorted
                                     .filter(function(item) {
                                         return !~[puff.sig].concat(parentPuffs.map(sigfun)).indexOf(item.sig)})
                                     .slice(0, cols > 1 ? (cols-2)*2 : 0)
                                     
        var childrenPuffs = PuffForum.getChildren(puff) // pre-sorted
                                     .filter(function(item) {
                                         return !~[puff.sig].concat(parentPuffs.map(sigfun), siblingPuffs.map(sigfun))
                                                            .indexOf(item.sig)})
                                     .slice(0, cols)
                                     .sort(function(a, b) {
                                         return a.username == username ? -1 : 0       // fancy sorting for current user puffs
                                             || b.username == username ?  1 : 0
                                             || a.username == puff.username ? -1 : 0  // fancy sorting for author puffs
                                             || b.username == puff.username ?  1 : 0
                                             || PuffForum.sortByPayload(b, a) * -1    // regular temporal sort
                                             })
        
        var allPuffs = [].concat( [puff].map(stuckBigBox('focused'))
                                , parentPuffs.map(standardBox('parent'))
                                , siblingPuffs.map(secondRowBox('sibling'))
                                , childrenPuffs.map(fourthRowBox('child'))
                                )
                         .filter(function(x) {return x.width})                  // remove nodes that don't fit in the grid 
                         .sort(function(a, b) {                                 // sort required so React doesn't have to 
                             if(a.puff.sig+'' < b.puff.sig+'') return -1;       // remove and re-add DOM nodes in order to
                             if(a.puff.sig+'' > b.puff.sig+'') return 1;        // order them properly
                             return 0; })
                             // return a.puff.sig+'' < b.puff.sig+'' ? 1 : a.puff.sig+'' == b.puff.sig+'' ? 0 : -1})
        
        
        this.cursorPower(allPuffs.map(function(pbox) {return pbox.puff}), puff)
        
        return this.manualGridify(allPuffs)
    }
})


var PuffArrow =  React.createClass({displayName: 'PuffArrow',
    render: function() {
        var arrow = this.props.arrow
        
        var p = arrow[0]
        var c = arrow[1]
        
        var offset = 30
        var xoffset = CONFIG.leftMargin
        var yoffset = 0
        var baseShift = 12

        var x1 = p.x + p.width/2 + xoffset
        var y1 = p.y + p.height/2
        var x2 = c.x + c.width/2 + xoffset
        var y2 = c.y + c.height/2

        /*
        var leftEdge = x2 - (c.height/2) - offset/2
        var rightEdge = x2 + (c.height/2) + offset/2
        var topEdge = y2 -(c.height/2) - offset/2
        var bottomEdge = y2 + (c.height/2) + offset/2
        */

        var boxSlope = Math.abs(c.height/c.width)

        var dx = x2-x1
        var dy = y2-y1
        var lineSlope = Math.abs(dy/dx)
        var theta = Math.atan(lineSlope)

        // Child is below parent or sideways
        if(y2 >= y1) {

            // Which does it hit first, top edge or left edge?
            if (x2 > x1) {
                // Arrow is left to right
                if (boxSlope < lineSlope) {

                    // Limited by top edge
                    x2 -= ((c.height / 2) - offset / 2) / lineSlope
                    y2 -= ((c.height / 2) - offset / 2)

                    y2 -= Math.abs(Math.sin(theta)) * 5
                } else {

                    // Limited by right edge
                    x2 -= ((c.width / 2) - offset / 2)
                    y2 -= ((c.width / 2) - offset / 2) * lineSlope

                    x2 -= Math.abs(Math.cos(theta)) * 5

                }
            } else {
                if (boxSlope < lineSlope) {

                    // Limited by top edge
                    x2 += ((c.height / 2) + offset / 2) / lineSlope
                    y2 -= ((c.height / 2) - offset / 2)

                    y2 -= Math.abs(Math.sin(theta)) * 5
                } else {

                    // Limited by left edge
                    x2 += ((c.width / 2) - offset / 2)
                    y2 -= ((c.width / 2) - offset / 2) * lineSlope

                    x2 += Math.abs(Math.cos(theta)) * 5
                }
            }
        } else {
            // Which does it hit first, top edge or left edge?
            if (x2 < x1) {
                // Arrow is right to left
                if (boxSlope > lineSlope) {

                    // Limited by bottom edge
                    x2 -= ((c.height / 2) - offset / 2) / lineSlope
                    y2 += ((c.height / 2) - offset / 2)

                    y2 += Math.abs(Math.sin(theta)) * 5
                } else {

                    // Limited by right edge
                    x2 += ((c.width / 2) - offset / 2)
                    y2 += ((c.width / 2) - offset / 2) * lineSlope

                    x2 += Math.abs(Math.cos(theta)) * 5

                }
            } else {
                // Arrow is left to right
                if (boxSlope < lineSlope) {

                    // Limited by bottom edge
                    x2 -= ((c.height / 2) + offset / 2) / lineSlope
                    y2 += ((c.height / 2) - offset / 2)

                    y2 += Math.abs(Math.sin(theta)) * 5
                } else {

                    // Limited by left edge
                    x2 -= ((c.width / 2) - offset / 2)
                    y2 += ((c.width / 2) - offset / 2) * lineSlope

                    x2 -= Math.abs(Math.cos(theta)) * 5
                }
            }
        }

        // WORKING: All downward arrows
        // WORKING: Straight up
        // ?: Up and left limited by bottom
        // ?: Up and right limited by bottom
        // ?: Up and left limited by edge
        // WORKING: Up and right limited by edge


        // Use mod of sig, so we can do same for arrowheads!
        // TODO: Make mini-helper function
        var colNumber = parseInt(Bitcoin.Crypto.MD5(this.props.key.slice(-32)),16);
        colNumber = colNumber % CONFIG.arrowColors.length;

        var stroke = CONFIG.arrowColors[colNumber]
        
        return Arrow( {x1:x1, y1:y1, x2:x2, y2:y2, stroke:stroke, fill:stroke} )
    }
})

var Arrow = React.createClass({displayName: 'Arrow',
    componentDidMount: function() {
        this.getDOMNode().setAttribute('marker-end', 'url(#triangle)')
    },
    render: function() {
        
        // dangerouslySetInnerHTML={{__html: '<animate attributeName="x2" from='+Math.random()+' to='+this.props.x2+' dur="1s" /><animate attributeName="y2" from='+Math.random()+' to='+this.props.y2+'  dur="1s" />'}}

        // save this!
        // <path d={'M ' + this.props.x1 + ' ' + this.props.y1 + ' Q ' + (this.props.x2  + (this.props.x2 - this.props.x1)/2 - 10) + ' ' + (this.props.y2 + (this.props.y2 - this.props.y1)/2 - 20) + ' ' + this.props.x2 + ' ' + this.props.y2} fillOpacity="0" stroke={this.props.stroke} strokeWidth="2" />

        //

        var result = (
            React.DOM.line( {x1:this.props.x1, y1:this.props.y1, x2:this.props.x2, y2:this.props.y2, stroke:this.props.stroke, strokeWidth:"2", fill:this.props.fill} )

        )
        
        return result
    }
})
 


var PuffHeader = React.createClass({displayName: 'PuffHeader',
    handleClick: function() {
        if(this.props.menu.show)
            return events.pub('ui/menu/close', {'menu': puffworlddefaults.menu})
        else
            return events.pub('ui/menu/open', {'menu.show': true})
    },
    render: function() {
        return (
            React.DOM.div(null, 
                React.DOM.img( {onClick:this.handleClick, src:"img/puffballIconBigger.png", id:"puffballIcon", height:"48", width:"41", className:this.props.menu.show ? 'menuOn' : ''} )
            )
        );
    }
});

var PuffFooter = React.createClass({displayName: 'PuffFooter',
    render: function() {
        var width = (window.innerHeight-66)+'px';
        return (
            React.DOM.div( {className:"footer", style:{width: width}}, 
                React.DOM.div( {className:"footerText"}, 
                "Powered by ", React.DOM.a( {href:"http://www.puffball.io", className:"footerText"}, "puffball"),"."+' '+
                "Responsibility for all content lies with the publishing author and not this website."
                )
            )
        );
    }
});