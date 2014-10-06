// TODO: Rename into PB. namespace
function keepNumberBetween(x,a,b) {
    if(x < a)
        return a
    if(x > b)
        return b

    return x
}

// From brainwallet
function passphraseToPrivateKeyWif(passphrase) {
    var hashStr = Bitcoin.Crypto.SHA256(passphrase).toString();
    // hash = Bitcoin.Crypto.util.bytesToHex(hash);
    // var hash_str = pad(hash, 64, '0');
    hash = Bitcoin.convert.hexToBytes(hashStr);

    return Bitcoin.ECKey(hash).toWif()
}

function pad(str, len, ch) {
    padding = '';
    for (var i = 0; i < len - str.length; i++) {
        padding += ch;
    }
    return padding + str;
}


function getImageCode(sig) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = 18;
    canvas.height = 18;

    var ctx = canvas.getContext("2d");

    var blockSize = 6;
    var blocks = canvas.width / blockSize;

    colors = [
        'rgba(139, 136, 255, .99)',
        'rgba(255, 156, 0 , .99)',
        'rgba(123, 179, 26, .99)',
        'rgba(238, 219, 0, .99)',
        'rgba(204, 51, 51, .99)',
        'rgba(255, 255, 255, .99)',
        'rgba(255, 255, 255, .99)'
    ]

    /*
    // TODO: Do this as often as needed
    var h1 = Bitcoin.Crypto.MD5(sig);
    var h2 = Bitcoin.Crypto.MD5(sig+h1);
    hashed = h2 + h1;

    var parts = hashed.match(/.{1,2}/g);

    // Change into blocks of 6, find closest, then split apart.
    */




    // dec = parts.map( function(item) { return parseInt(item, 16); } );


    for (var i = 0; i < blocks; i++) {
        for(var j = 0; j < blocks; j++) {
            seed = Math.pow(2,i)+Math.pow(3,j);
            var fillIndex = murmurhash3_32_gc(sig, seed)% colors.length
            var fillRgba = colors[fillIndex];

            ctx.fillStyle = fillRgba;

            ctx.fillRect((i*blockSize),(j*blockSize),blockSize,blockSize);

            /*
            // Line overlay
            if(i) {
                ctx.lineWidth = 0.5;
                ctx.strokeStyle="#0000FF";
                ctx.beginPath();
                ctx.moveTo(i*blockSize, 0);
                ctx.lineTo(i*blockSize, canvas.height);
                ctx.stroke();
            }

            if(j) {
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(0, j*blockSize);
                ctx.lineTo(canvas.width, j*blockSize);
                ctx.stroke();
            }
            */




            // $r = array_pop($colors);
            //$g = array_pop($colors);
            //$b = array_pop($colors);

        }
    }

    ctx.lineWidth = 0.5;
    ctx.strokeStyle="#000000";
    ctx.strokeRect(0,0,canvas.width,canvas.height);


    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to guess the
    // original format, but be aware the using "image/jpg" will re-encode the image.
    // return canvas.toDataURL('image/jpeg') // defaults to png, which 4x the size for flickr images

    return canvas.toDataURL("image/png");
    // var dataURL = canvas.toDataURL("image/png");
    // return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

/**
 *
 * @param sig {string}
 * Return an rgba color to use
 */
function getBGcolor(sig) {
    // Get the ascii character numbers of all sigs
    var len = sig.length;
    var total = 0;
    for(var i=0; i<len; i++) {
        total += sig.charCodeAt(i);
    }

    var numbs = [255-(total % 9), 255-(total % 10),255-(total % 11) ]

    return 'rgba(' + numbs[0] + ',' + numbs[1] + ',' + numbs[2] + ',.9)';
}

Date.prototype.yyyymmdd = function() {

    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
    var dd  = this.getDate().toString();

    return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
};

Date.prototype.ymdhis = function() {

    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
    var dd  = this.getDate().toString();
    var hh = this.getHours().toString();
    var mn = this.getMinutes().toString();
    var ss = this.getSeconds().toString();

    return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]) + ' ' + hh+':'+mn+':'+ss;
};


/**
 * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
 *
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 *
 * @param {string} key ASCII only
 * @param {number} seed Positive integer only
 * @return {number} 32-bit positive integer hash
 */

function murmurhash3_32_gc(key, seed) {
    var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;

    remainder = key.length & 3; // key.length % 4
    bytes = key.length - remainder;
    h1 = seed;
    c1 = 0xcc9e2d51;
    c2 = 0x1b873593;
    i = 0;

    while (i < bytes) {
        k1 =
            ((key.charCodeAt(i) & 0xff)) |
            ((key.charCodeAt(++i) & 0xff) << 8) |
            ((key.charCodeAt(++i) & 0xff) << 16) |
            ((key.charCodeAt(++i) & 0xff) << 24);
        ++i;

        k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
        k1 = (k1 << 15) | (k1 >>> 17);
        k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

        h1 ^= k1;
        h1 = (h1 << 13) | (h1 >>> 19);
        h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
        h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
    }

    k1 = 0;

    switch (remainder) {
        case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
        case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
        case 1: k1 ^= (key.charCodeAt(i) & 0xff);

            k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
            k1 = (k1 << 15) | (k1 >>> 17);
            k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
            h1 ^= k1;
    }

    h1 ^= key.length;

    h1 ^= h1 >>> 16;
    h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
    h1 ^= h1 >>> 13;
    h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
    h1 ^= h1 >>> 16;

    return h1 >>> 0;
}

/* Function to construct a random passphrase from an array of words*/
var generatePassphrase = function(dict,numWords) {
    var passphrase = "";
    for(var i=0; i < numWords; i++) {
        var randWord = PB.Crypto.getRandomItem(dict)

        if (i == 0) {
            passphrase += randWord;
        } else {
            passphrase = passphrase + " " + randWord;
        }
    }
    return passphrase;
}

// Is the object empty?
// From http://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

// Browser detection by kennebec
// http://stackoverflow.com/questions/2400935/browser-detection-in-javascript

// Original function
// Do not touch, might be useful later on when support on more browser is needed

// function getBrowserAndVersion() {
//     var ua= navigator.userAgent, tem, 
//     M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
//     if(/trident/i.test(M[1])){
//         tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
//         return 'IE '+(tem[1] || '');
//     }
//     if(M[1]=== 'Chrome'){
//         tem= ua.match(/\bOPR\/(\d+)/)
//         if(tem!= null) return 'Opera '+tem[1];
//     }
//     M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
//     if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
//     return M.join(' ');
// }

function getBrowser() {
    var ua= navigator.userAgent, tem, 
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){ // IE
        return 'IE';
    } else { // Chrome or FF
        return M[1];
    }
}

function getAnimalCSS() {
    // Get animals

    // Chrome uses "rules"
    // Firefox and IE uses "cssRules"
    var animalCSS = [];
    var animals = [];
    var i = 0;

    // on source site stylesheets are not compiled into one single file
    // on live site all stylesheets are pulled into one file
    for(var j = 0; j < document.styleSheets.length; j++) {
        if (getBrowser() == "Chrome") {
            animalCSS = document.styleSheets[j].rules;
        } else {
            animalCSS = document.styleSheets[j].cssRules;
        }

        for(var k = 0; k < animalCSS.length; k++) {
            var selector = animalCSS[k].selectorText;

            if(typeof selector != 'undefined') {

                // Chrome and IE inserts an ":" between animal name and before
                // Firefox doesn't
                splitResult = selector.replace("::",":").replace(":","-").split("-");

                if( splitResult[0] == '.icon') {
                    animals[i] = splitResult[1];
                    i++;
                }
            }
        }
    }
    return animals;
}

function getAnimalUnicodes() {
    // Get animals

    // Chrome uses "rules"
    // Firefox and IE uses "cssRules"
    var animalCSS = [];
    var unicodes = [];
    var i = 0;

    // on source site stylesheets are not compiled into one single file
    // on live site all stylesheets are pulled into one file
    for(var j = 0; j < document.styleSheets.length; j++) {
        if (getBrowser() == "Chrome") {
            animalCSS = document.styleSheets[j].rules;
        } else {
            animalCSS = document.styleSheets[j].cssRules;
        }

        for(var k = 0; k < animalCSS.length; k++) {
            var selector = animalCSS[k].selectorText;

            if(typeof selector != 'undefined') {

                // Chrome and IE inserts an ":" between animal name and before
                // Firefox doesn't
                splitResult = selector.replace("::",":").replace(":","-").split("-");


                if( splitResult[0] == '.icon') {
                    // Safari wraps quotes around the unicode character
                    if (getBrowser() == "Safari") {
                        unicodes[i] = animalCSS[k].style.cssText.slice(-2,-1).charCodeAt(0).toString(16);
                    } else {
                        unicodes[i] = animalCSS[k].style.cssText.slice(-3,-2).charCodeAt(0).toString(16);
                    }
                    i++;
                }
            }
        }
    }
    return unicodes;
}


function generateRandomAnimal() {

    var animals = getAnimalCSS();
    var animal = PB.Crypto.getRandomItem(animals);

    return animal;

}

// Basic check to see if something has the form of an email address:
// http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
function looksLikeEmailAddress(str) {
    var lastAtPos = str.lastIndexOf('@');
    var lastDotPos = str.lastIndexOf('.');
    return (lastAtPos < lastDotPos && lastAtPos > 0 && str.indexOf('@@') == -1 && lastDotPos > 2 && (str.length - lastDotPos) > 2);
}

/**
 * Convert an image 
 * to a base64 string
 * @author HaNdTriX
 * http://stackoverflow.com/questions/6150289/how-to-convert-image-into-base64-string-using-javascript
 * @param  {String}   url         
 * @param  {Function} callback    
 * @param  {String}   [outputFormat=image/png]           
 */
// function convertImgToBase64(url, callback, outputFormat){
//     var canvas = document.createElement('CANVAS'),
//         ctx = canvas.getContext('2d'),
//         img = new Image;
//     img.crossOrigin = 'Anonymous';
//     img.onload = function(){
//         var dataURL;
//         canvas.height = img.height;
//         canvas.width = img.width;
//         ctx.drawImage(img, 0, 0);
//         dataURL = canvas.toDataURL(outputFormat);
//         callback.call(this, dataURL);
//         canvas = null; 
//     };
//     img.src = url;
// }

function getAvatar(color, name) {
    var canvas = document.getElementById("avatarCanvas");
    var ctx = canvas.getContext('2d');
    ctx.clearRect ( 0 , 0 , 100 , 100 );
    var unicode = getUnicodeFromName(name);

    /*
    ctx.font = "100px icxicon";
    ctx.fillStyle = "black";
    ctx.fillText(String.fromCharCode(unicode), 0, 100);

    ctx.font = "90px icxicon";
    ctx.fillStyle = color;
    ctx.fillText(String.fromCharCode(unicode), 5, 95);
    */

    ctx.font = "100px icxicon";
    ctx.fillStyle = color;
    ctx.strokeStyle = "#444444";
    ctx.lineWidth = 2;
    ctx.fillText(String.fromCharCode(unicode), 5, 95);
    ctx.strokeText(String.fromCharCode(unicode), 5, 95);
    ctx.fill();
    ctx.stroke();

    return Events.pub('ui/event',
        {'profile.avatarUrl': canvas.toDataURL('png')}
    )
}

function getUnicodeFromName(name) {
    var animals = getAnimalCSS();
    var unicodes = getAnimalUnicodes();
    var index = animals.indexOf(name);
    if(index < 0) {
        return false;
    } else {
        return "0x" + unicodes[index];
    }
}
