// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"2/textRoll.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"2/textRoll.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./textRoll.css");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TextRoll =
/*#__PURE__*/
function () {
  /**
   * @param {HTMLElement} target
   * @param {number} size
   */
  function TextRoll(target) {
    var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 80;

    _classCallCheck(this, TextRoll);

    this.target = target;
    this.text = "";
    this.size = size;
    this.passingLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    this.letters = [];
    this.rollingLetterDom = [];
    this.passingLetterDom = [];
  }

  _createClass(TextRoll, [{
    key: "createRollingLetter",
    value: function createRollingLetter() {
      var rollingLetter = document.createElement("div");
      rollingLetter.classList.add("rolling-letter");
      rollingLetter.style.width = "".concat(this.size, "px");
      rollingLetter.style.height = "".concat(this.size, "px");
      rollingLetter.style.fontSize = "".concat(this.size, "px");
      return rollingLetter;
    }
  }, {
    key: "createPassingLetter",
    value: function createPassingLetter(letter) {
      var passingLetter = document.createElement("div");
      passingLetter.classList.add("passing-letter");
      passingLetter.style.width = "".concat(this.size, "px");
      passingLetter.style.height = "".concat(this.size, "px");
      passingLetter.innerText = letter;
      return passingLetter;
    }
  }, {
    key: "setText",
    value: function setText(newText) {
      this.text = newText;
      this.letters = this.text.split("");

      for (var i = 0; i < this.letters.length; i++) {
        var rollingLetter = this.createRollingLetter();
        var passingLetter = this.createPassingLetter(this.letters[i]);
        this.rollingLetterDom.push(rollingLetter);
        this.passingLetterDom.push([passingLetter]);
        rollingLetter.appendChild(passingLetter);
        this.target.appendChild(rollingLetter);
      }
    }
  }, {
    key: "updateText",
    value: function updateText(newText) {
      this.rollingLetterDom = [];
      this.passingLetterDom = [];
      this.target.innerHTML = "";
      this.setText(newText);
    }
  }, {
    key: "updateSize",
    value: function updateSize(newSize) {
      this.size = newSize;
      this.updateText(this.text);
    }
  }, {
    key: "getStatus",
    value: function getStatus() {
      console.log(this.rollingLetterDom);
      console.log(this.passingLetterDom);
    }
  }, {
    key: "animateTo",
    value: function animateTo(newText) {
      var _this = this;

      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2000;
      var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 400;
      // confirm text length
      this.updateText(this.text.padEnd(newText.length, " ")); // insert passing letter

      var _loop = function _loop(i) {
        _this.passingLetters.sort(function (x, y) {
          return Math.random() - 0.5;
        }).slice(0, 14 + Math.floor(Math.random() * 5)).map(function (letter) {
          return _this.createPassingLetter(letter);
        }).forEach(function (pl) {
          _this.rollingLetterDom[i].appendChild(pl);

          _this.passingLetterDom[i].push(pl);
        });
      };

      for (var i = 0; i < this.rollingLetterDom.length; i++) {
        _loop(i);
      } // insert next letter


      var newTextLetters = newText.padEnd(this.text.length, " ").split("");

      for (var _i = 0; _i < newTextLetters.length; _i++) {
        var pl = this.createPassingLetter(newTextLetters[_i]);

        this.rollingLetterDom[_i].appendChild(pl);

        this.passingLetterDom[_i].push(pl);
      } // animate


      setTimeout(function () {
        var animateTime;

        for (var _i2 = 0; _i2 < _this.rollingLetterDom.length; _i2++) {
          animateTime = time / 1000 + Math.random();

          for (var j = 0; j < _this.passingLetterDom[_i2].length; j++) {
            var animateValue = "translateY(-".concat(_this.size * (_this.passingLetterDom[_i2].length - 1), "px)");
            _this.passingLetterDom[_i2][j].style.transition = "transform ".concat(animateTime, "s ease-in-out");
            _this.passingLetterDom[_i2][j].style.transform = animateValue;
          }
        } // clear passing letter thing


        setTimeout(function () {
          _this.updateText(newText);
        }, Math.floor(animateTime * 1000 + 1000));
      }, delay);
    }
  }]);

  return TextRoll;
}();

var _default = TextRoll;
exports.default = _default;
},{"./textRoll.css":"2/textRoll.css"}],"2/images/main.png":[function(require,module,exports) {
module.exports = "/main.c5f19040.png";
},{}],"2/images/sub.png":[function(require,module,exports) {
module.exports = "/sub.0017846c.png";
},{}],"2/data.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.artists = void 0;
var artists = [[0, "Bow Wow"], [1, "Chris Lake"], [2, "3OH!3"], [3, "Tech N9Ne"], [4, "James Blake"], [5, "Michael Jackson"], [6, "Linkin Park"], [7, "Dro"], [8, "Lamb"], [9, "Zacari"], [10, "Jorja Smith"], [11, "Marc Anthony"], [12, "gnash"], [13, "Sia"], [14, "Lil Dicky"], [15, "Dua Lipa"], [16, "Lil Reese"], [17, "Tory Lanez"], [18, "Meek Mill"], [19, "Austin Mahone"], [20, "Royce Da 5'9"], [21, "Natasha Bedingfield"], [22, "Snootie Wild"], [23, "Static Major"], [24, "Jonas Brothers"], [25, "Cutty Ranks"], [26, "Jon Bellion"], [27, "Sugarland"], [28, "Yo Gotti"], [29, "Ed Sheeran"], [30, "Kai"], [31, "NEEDTOBREATHE"], [32, "6LACK"], [33, "Jake Paul"], [34, "Marco Antonio Solis"], [35, "Gus Dapperton"], [36, "Nelly Furtado"], [37, "Pitbull"], [38, "Robin Thicke"], [39, "Twista"], [40, "Iggy Azalea"], [41, "Jonas Blue"], [42, "Brothers Osborne"], [43, "Giveon"], [44, "NERVO"], [45, "Lauren Jauregui"], [46, "A Day To Remember"], [47, "Jidenna"], [48, "Jason Mraz"], [49, "J. Cole"], [50, "PSY"], [51, "Bilal"], [52, "MGK"], [53, "The Script"], [54, "Sarah Buxton"], [55, "Chris Lane"], [56, "Becky G."], [57, "Eva Simons"], [58, "Justin Moore"], [59, "MAX"], [60, "Dakota"], [61, "Hustle Gang"], [62, "R. City"], [63, "John Mayer"], [64, "Tiesto"], [65, "Flo Rida"], [66, "Don Toliver"], [67, "Freshlyground"], [68, "Lana Del Rey"], [69, "A$AP Rocky"], [70, "Arianna"], [71, "Kanye West"], [72, "Jennifer Lawrence"], [73, "Gwen Sebastian"], [74, "Chiddy Bang"], [75, "Ester Dean"], [76, "Chris Willis"], [77, "Emilee"], [78, "Juan Luis Guerra"], [79, "Charlie Puth"], [80, "Rob $tone"], [81, "will.i.am"], [82, "Lil Tecca"], [83, "Stacy Barthe"], [84, "Kesha"], [85, "Problem"], [86, "Lil Skies"], [87, "Majid Jordan"], [88, "Bas"], [89, "Ashe"], [90, "Rivers Cuomo"], [91, "Matt Morris"], [92, "Jeezy"], [93, "A-Trak"], [94, "Neon Trees"], [95, "Gudda"], [96, "Louis Tomlinson"], [97, "Ciara"], [98, "6ix9ine"], [99, "Lil Nas X"], [100, "Greta Svabo Bech"], [101, "Snow Patrol"], [102, "Rick Ross"], [103, "T.I."], [104, "Luke Combs"], [105, "Natalia Jimenez"], [106, "Nivea"], [107, "Enrique Iglesias"], [108, "Ski Mask The Slump God"], [109, "CHVRCHES"], [110, "Backstreet Boys"], [111, "Brando"], [112, "Estelle"], [113, "Pimp C"], [114, "Ugly God"], [115, "Joey Bada$$"], [116, "D.R.A.M."], [117, "Anitta"], [118, "Camila Cabello"], [119, "Katy Perry"], [120, "Nas"], [121, "Lil Peep"], [122, "Charli XCX"], [123, "Rozzi Crane"], [124, "WE the Kings"], [125, "George Jones"], [126, "Aaron Lewis"], [127, "Gunna"], [128, "Luis Fonsi"], [129, "Ne-Yo"], [130, "Powfu"], [131, "Moby"], [132, "Eminem"], [133, "Styles P"], [134, "Sech"], [135, "Kehlani"], [136, "Summer Walker"], [137, "Christina Perri"], [138, "YNW Melly"], [139, "Mike Posner"], [140, "Adam Levine"], [141, "Chad Kroeger"], [142, "Lolo"], [143, "Kirko Bangz"], [144, "Antoine Dodson"], [145, "ScHoolboy Q"], [146, "Lil Jon"], [147, "Alexis Jordan"], [148, "Britney Spears"], [149, "Kane Brown"], [150, "Aloe Blacc"], [151, "Trey Songz"], [152, "Luke Bryan"], [153, "Lil Tjay"], [154, "Lil' Duval"], [155, "Mohombi"], [156, "Jennifer Lopez"], [157, "Chance The Rapper"], [158, "Maejor Ali"], [159, "Taylor Swift"], [160, "DJ SPINKING"], [161, "O.T. Genasis"], [162, "Young Thug"], [163, "Offset"], [164, "Rhiannon Giddens"], [165, "Andre 3000"], [166, "Dr. Dre"], [167, "Anderson .Paak"], [168, "Priscilla"], [169, "Justin Bieber"], [170, "KIDS SEE GHOSTS"], [171, "Tove Lo"], [172, "Big Sean"], [173, "Kodak Black"], [174, "Selena Gomez"], [175, "JAY-Z"], [176, "Alabama"], [177, "Lil Durk"], [178, "Iyaz"], [179, "G-Eazy"], [180, "JACKBOYS"], [181, "PnB Rock"], [182, "Mikky Ekko"], [183, "DJ ESCO"], [184, "Dreezy"], [185, "Milo & Otis"], [186, "Diggy"], [187, "LL Cool J"], [188, "Jack Harlow"], [189, "Logic"], [190, "surf mesa"], [191, "Lauren Bennett"], [192, "Olivia Newton-John"], [193, "Young Dolph"], [194, "Ludacris"], [195, "NLE Choppa"], [196, "The Gregory Brothers"], [197, "Bono"], [198, "Flume"], [199, "KYLE"], [200, "Metro Boomin"], [201, "Bruno Mars"], [202, "Jaden Smith"], [203, "Aaliyah"], [204, "Rascal Flatts"], [205, "August Alsina"], [206, "Theophilus London"], [207, "Maren Morris"], [208, "Fivio Foreign"], [209, "Swedish House Mafia"], [210, "G.R.L."], [211, "DJ Khaled"], [212, "E-40"], [213, "Tierra Whack"], [214, "Mana"], [215, "Panic! At The Disco"], [216, "Yung Bleu"], [217, "Romeo Santos"], [218, "El Cata"], [219, "Jon Pardi"], [220, "Bad Bunny"], [221, "Neon Hitch"], [222, "A$AP Ferg"], [223, "Waka Flocka Flame"], [224, "Kenny Wayne Shepherd"], [225, "Lupe Fiasco"], [226, "David Nail"], [227, "Kobe"], [228, "Martin Garrix"], [229, "Slim Jxmmi"], [230, "YC"], [231, "Landon Cube"], [232, "SAINt JHN"], [233, "Daya"], [234, "blackbear"], [235, "Coldplay"], [236, "Tori Kelly"], [237, "Zedd"], [238, "Solange"], [239, "Omarion"], [240, "Olly Murs"], [241, "Mindless Behavior"], [242, "Kristin Chenoweth"], [243, "DJ Chose"], [244, "Havana Brown"], [245, "Damian Lemar Hudson"], [246, "Cobra Starship"], [247, "Janelle Monae"], [248, "5 Seconds Of Summer"], [249, "Clipse"], [250, "Gym Class Heroes"], [251, "Joyner Lucas"], [252, "Megan Thee Stallion"], [253, "Miley Cyrus"], [254, "Jamie Foxx"], [255, "Roman GianArthur"], [256, "Maroon 5"], [257, "Rozes"], [258, "WizKid"], [259, "21 Savage"], [260, "Moneybagg Yo"], [261, "Sam Smith"], [262, "Francesco Yates"], [263, "Mary J. Blige"], [264, "Tinashe"], [265, "Plies"], [266, "Ty Dolla $ign"], [267, "John Newman"], [268, "Rudimental"], [269, "Ashley Monroe"], [270, "Armin van Buuren"], [271, "Famous Dex"], [272, "BeatKing"], [273, "Johnny Yukon"], [274, "KCamp"], [275, "Rita Ora"], [276, "Keri Hilson"], [277, "Kelly Rowland"], [278, "Ozuna"], [279, "Drake"], [280, "Becky G"], [281, "Matthew Koma"], [282, "SZA"], [283, "Brad Paisley"], [284, "K'Naan"], [285, "Pharrell Williams"], [286, "Wrabel"], [287, "50 Cent"], [288, "Young M.A"], [289, "Tiara Thomas"], [290, "Detail"], [291, "Fantasia"], [292, "Bazzi"], [293, "Jonn Hart"], [294, "Cher Lloyd"], [295, "Usher"], [296, "Cashmere Cat"], [297, "Rocko"], [298, "Jimmy Buffett"], [299, "Lorde"], [300, "Kelsea Ballerini"], [301, "Jessie J"], [302, "Ashanti"], [303, "Morgan Wallen"], [304, "Roscoe Dash"], [305, "Icona Pop"], [306, "Sevyn Streeter"], [307, "Cee-Lo"], [308, "Nick Jonas"], [309, "Benny Benassi"], [310, "The Civil Wars"], [311, "The Weeknd"], [312, "Playboi Carti"], [313, "Sampha"], [314, "Auburn"], [315, "Disclosure"], [316, "Frank Ocean"], [317, "George Benson"], [318, "Far East Movement"], [319, "Diplo Presents Thomas Wesley"], [320, "Lady Gaga"], [321, "Gwen Stefani"], [322, "24kGoldn"], [323, "Train"], [324, "Jacqueez"], [325, "iLoveMakonnen"], [326, "Hayley Williams"], [327, "B.o.B"], [328, "Ozzy Osbourne"], [329, "Thomas Rhett"], [330, "Cataracs"], [331, "Reik"], [332, "French Montana"], [333, "Liam Payne"], [334, "Machine Gun Kelly"], [335, "Kevin Gates"], [336, "Wham!"], [337, "Jussie Smollett"], [338, "Lil Baby"], [339, "Lloyd"], [340, "Gavin DeGraw"], [341, "Young T & Bugsey"], [342, "Headie One"], [343, "Noah Cyrus"], [344, "Cam'ron"], [345, "Faith Hill"], [346, "2 Chainz"], [347, "A Boogie Wit da Hoodie"], [348, "Lil Pump"], [349, "John Legend"], [350, "XYLO"], [351, "Chris Brown"], [352, "Steve Aoki"], [353, "Nyla"], [354, "Syd"], [355, "Alissa Violet"], [356, "Nicki Minaj"], [357, "Sage The Gemini"], [358, "M0"], [359, "MGMT"], [360, "Phoebe Ryan"], [361, "Kelly Clarkson"], [362, "Wale"], [363, "Takeoff"], [364, "Ricky Martin"], [365, "Sam Martin"], [366, "HARDY"], [367, "Sammy Adams"], [368, "James Newton Howard"], [369, "Brent Faiyaz"], [370, "The Lonely Island"], [371, "Gotye"], [372, "MIKA"], [373, "IamSu!"], [374, "Shaggy"], [375, "Internet Money"], [376, "Tim McGraw"], [377, "Sam Dew"], [378, "Pardison Fontaine"], [379, "Keith Urban"], [380, "Trippie Redd"], [381, "Jimmy Fallon"], [382, "Damian \"Jr. Gong\" Marely"], [383, "Travie McCoy"], [384, "Post Malone"], [385, "Action Bronson"], [386, "j-hope"], [387, "Saweetie"], [388, "Reba McEntire"], [389, "Too $hort"], [390, "Bobby Brackins"], [391, "TeeFLii"], [392, "Amanda Shires"], [393, "Jason Derulo"], [394, "Team 10"], [395, "Fifth Harmony"], [396, "XXXTENTACION"], [397, "Matt Nathanson"], [398, "SAYGRACE"], [399, "Rihanna"], [400, "The Game"], [401, "benny blanco"], [402, "Sosamann"], [403, "Lily Allen"], [404, "Carrie Underwood"], [405, "Beyonce"], [406, "Fetty Wap"], [407, "Florida Georgia Line"], [408, "Teyana Taylor"], [409, "Trinidad James"], [410, "Brendon Urie"], [411, "NAV"], [412, "Ke$ha"], [413, "TJR"], [414, "Nicky Jam"], [415, "Travis Scott"], [416, "Clean Bandit"], [417, "Ellie Goulding"], [418, "The Dap-Kings Horns"], [419, "Rod Stewart"], [420, "Chris Richardson"], [421, "YoungBoy Never Broke Again"], [422, "Shawn Mendes"], [423, "iann dior"], [424, "Reginae Carter"], [425, "Kygo"], [426, "Carly Rae Jepsen"], [427, "Conrad Sewell"], [428, "Hailee Steinfeld"], [429, "Diplo"], [430, "Kebo Gotti"], [431, "Avril Lavigne"], [432, "Dzeko"], [433, "Hunter Hayes"], [434, "RiceGum"], [435, "Macklemore"], [436, "Trevor Guthrie"], [437, "Kid Cudi"], [438, "Keyshia Cole"], [439, "Eric Turner"], [440, "Lil Uzi Vert"], [441, "Mike WiLL Made-It"], [442, "Belly"], [443, "JP Saxe"], [444, "Pitbull"], [445, "Gesaffelstein"], [446, "deadmau5"], [447, "Eric Church"], [448, "Calvin Harris"], [449, "Alan Jackson"], [450, "Giggs"], [451, "Empress Of"], [452, "Kiiara"], [453, "Maluma"], [454, "Skylar Grey"], [455, "TLC"], [456, "Hot Chelle Rae"], [457, "Diddy - Dirty Money"], [458, "Janet Jackson"], [459, "Yung Pinch"], [460, "Grey"], [461, "Ace Hood"], [462, "Kodie Shane"], [463, "Alicia Keys"], [464, "Descemer Bueno"], [465, "City Girls"], [466, "George Clinton"], [467, "Jesse McCartney"], [468, "Kaskade"], [469, "Rich Homie Quan"], [470, "Lil Wayne"], [471, "Julia Michaels"], [472, "Major Lazer"], [473, "Bobby Shmurda"], [474, "The Kid LAROI"], [475, "K Camp"], [476, "Ayah Marar"], [477, "Stunna 4 Vegas"], [478, "Chris Stapleton"], [479, "Young Money"], [480, "Pop Smoke"], [481, "David Guetta"], [482, "Zakk Wylde"], [483, "Dreamville"], [484, "Chris Young"], [485, "DJ Drama"], [486, "Jeremih"], [487, "Erika Costell"], [488, "George Michael"], [489, "Young Nudy"], [490, "Lloyd Banks"], [491, "Elle King"], [492, "Sabi"], [493, "Jack White"], [494, "Christina Aguilera"], [495, "A Great Big World"], [496, "Michael Bolton"], [497, "FUTURISTIC"], [498, "Tinie Tempah"], [499, "Lil Yachty"], [500, "Joey Galaxy"], [501, "Demi Lovato"], [502, "H.E.R."], [503, "Sunday Service Choir"], [504, "Jay Sean"], [505, "Swae Lee"], [506, "Emeli Sande"], [507, "Remy Ma"], [508, "Remy Boyz"], [509, "Otis Redding"], [510, "Vince Gill"], [511, "ATR Son Son"], [512, "Bipolar Sunshine"], [513, "Mark Ronson"], [514, "P!nk"], [515, "Alesso"], [516, "Future"], [517, "Labrinth"], [518, "Daddy Yankee"], [519, "Ant Clemons"], [520, "Miranda Lambert"], [521, "Bon Iver"], [522, "Gorillaz"], [523, "Rod Wave"], [524, "Mustard"], [525, "NAV"], [526, "Skepta"], [527, "Brandy"], [528, "Sean Paul"], [529, "Juice WRLD"], [530, "JID"], [531, "Daniel Caesar"], [532, "Shakira"], [533, "R. Kelly"], [534, "Death Cab For Cutie"], [535, "LMFAO"], [536, "TK Kravitz"], [537, "BJ The Chicago Kid"], [538, "Blake Shelton"], [539, "Polo G"], [540, "Khalid"], [541, "MoneyBagg Yo"], [542, "Ella Mai"], [543, "Cheat Codes"], [544, "Curren$Y"], [545, "Foxes"], [546, "Olivia O'Brien"], [547, "New Boyz"], [548, "J Balvin"], [549, "Missy Elliott"], [550, "Doja Cat"], [551, "Quavo"], [552, "Afrojack"], [553, "Skrillex"], [554, "Anthony Hamilton"], [555, "John Ryan"], [556, "Naughty Boy"], [557, "Lauren Alaina"], [558, "Young Jeezy"], [559, "Remo"], [560, "MadeinTYO"], [561, "Emily Warren"], [562, "Royce da 5'9\""], [563, "J. Davi$"], [564, "Mac Miller"], [565, "DeJ Loaf"], [566, "Five Finger Death Punch"], [567, "Kenny Chesney"], [568, "Hoodie Allen"], [569, "DaniLeigh"], [570, "King Chip"], [571, "Sofi Tukker"], [572, "Taio Cruz"], [573, "Juelz Santana"], [574, "Jason Aldean"], [575, "Marshmello"], [576, "GoldLink"], [577, "My Darkest Days"], [578, "Shanell AKA SNL"], [579, "Niall Horan"], [580, "Kimbra"], [581, "Slash"], [582, "Busta Rhymes"], [583, "Snoop Dogg"], [584, "Paul McCartney"], [585, "Nipsey Hussle"], [586, "Amber Coffman"], [587, "The Dirty Heads"], [588, "Gorilla Zoe"], [589, "Bad Meets Evil"], [590, "Wiz Khalifa"], [591, "Money Man"], [592, "The-Dream"], [593, "MC Eiht"], [594, "Skip Marley"], [595, "Karen Fairchild"], [596, "Mick Jagger"], [597, "Cash Cash"], [598, "Cedric Gervais"], [599, "Kevin K-MAC McCall"], [600, "Rich Gang"], [601, "John Martin"], [602, "Juicy J"], [603, "Fred Hammond"], [604, "Bryson Tiller"], [605, "T-Pain"], [606, "King Combs"], [607, "Rowdy Rebel"], [608, "beabadoobee"], [609, "Loud Luxury"], [610, "Boys Like Girls"], [611, "Ryan Tedder"], [612, "Dixie Chicks"], [613, "Robin Schulz"], [614, "Jessie Reyez"], [615, "Willy William"], [616, "Kevin Rudolf"], [617, "Cardi B"], [618, "Fat Joe"], [619, "Pia Mia"], [620, "Anuel AA"], [621, "Miguel"], [622, "Bandit Gang Marco"], [623, "YG"], [624, "Buck 22"], [625, "Monty"], [626, "Joe Budden"], [627, "Kendrick Lamar"], [628, "G Herbo"], [629, "Lauv"], [630, "Ariana Grande"], [631, "Bryce Vine"], [632, "Birdman"], [633, "John Rich"], [634, "Travis Porter"], [635, "Jess Glynne"], [636, "Sada Baby"], [637, "Jill Scott"], [638, "Billy Ray Cyrus"], [639, "Bhad Bhabie"], [640, "Charice"], [641, "Fabolous"], [642, "Tegan And Sara"], [643, "Rome"], [644, "DaBaby"], [645, "Pusha T"], [646, "Pistol Annies"], [647, "LoveRance"], [648, "Chief Keef"], [649, "YEBBA"], [650, "Dev"], [651, "Halsey"], [652, "Reeve Carney"], [653, "Jennifer Hudson"], [654, "Slaughterhouse"], [655, "Blueface"], [656, "Nelly"], [657, "kiLL edward"], [658, "Dierks Bentley"], [659, "BlocBoy JB"], [660, "Grace Potter"], [661, "Trace Adkins"], [662, "OG Maco"], [663, "Rich The Kid"], [664, "Kali Uchis"], [665, "Louis Prima"], [666, "Soulja Boy Tell'em"], [667, "Zayn"], [668, "Huncho Jack"], [669, "CL"], [670, "Nicole Scherzinger"], [671, "Gucci Mane"], [672, "Migos"], [673, "The Chainsmokers"], [674, "Roddy Ricch"], [675, "Victoria Justice"], [676, "Tyga"], [677, "Bebe Rexha"], [678, "Wisin"], [679, "Rae Sremmurd"], [680, "2Cellos"], [681, "King Von"], [682, "Florence Welch"], [683, "Nate Ruess"], [684, "BENEE"], [685, "The Throne"], [686, "fun."], [687, "Idina Menzel"], [688, "YFN Lucci"], [689, "Mariah Carey"], [690, "BTS"], [691, "Prince Royce"], [692, "The Roots"], [693, "Avicii"], [694, "Gabby Barrett"], [695, "Marc E. Bassy"], [696, "Natalie La Rose"], [697, "Timbaland"], [698, "Martha Wainwright"], [699, "Brantley Gilbert"], [700, "Big K.R.I.T."], [701, "Ryan Lewis"], [702, "Ray J"], [703, "Karol G"], [704, "Alessia Cara"], [705, "Justin Timberlake"], [706, "PARTYNEXTDOOR"], [707, "Jhene Aiko"], [708, "ILLENIUM"], [709, "Meghan Trainor"], [710, "Akon"], [711, "U2"], [712, "Lifehouse"], [713, "Daft Punk"], [714, "Cory Gunz"], [715, "Madonna"], [716, "Zac Brown Band"], [717, "Desiigner"], [718, "DJ Snake"], [719, "Sean Kingston"], [720, "Swizz Beatz"], [721, "Iggy Azalea"], [722, "Kid Ink"], [723, "Sirah"]];
exports.artists = artists;
},{}],"2/billboard.json":[function(require,module,exports) {
module.exports = {
};
},{}],"2/app.js":[function(require,module,exports) {
"use strict";

var _textRoll = _interopRequireDefault(require("./textRoll"));

var _main = _interopRequireDefault(require("./images/main.png"));

var _sub = _interopRequireDefault(require("./images/sub.png"));

var _data = require("./data");

var _billboard = _interopRequireDefault(require("./billboard.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function getDummy() {
  var data = [// "Get the Top",
  // "Not Bad",
  // "Garbage",
  // "Wasting Time",
  // "Amazing!!",
  // "The Return of the King",
  "Expected position is No.50", "Expected position is No.1", "Expected position is No.350"];
  return data[Math.floor(Math.random() * data.length)];
}

var App =
/*#__PURE__*/
function () {
  function App() {
    _classCallCheck(this, App);

    // HTML Elements
    this.mainArtistList = document.getElementById("mainArtistList");
    this.subArtistList = document.getElementById("subArtistList");
    this.searchList = undefined;
    this.inputLine = document.getElementById("inputLine");
    this.contentLine = document.getElementById("contentLine");
    this.mainInput = document.getElementById("mainInput");
    this.subInput = document.getElementById("subInput");
    this.mainImage = document.getElementById("mainImage");
    this.subImage = document.getElementById("subImage");
    this.beforeResult = document.getElementById("beforeResult");
    this.result = document.getElementById("result"); // Variables

    this.artists = {
      mainArtist: "",
      subArtist: "",
      mainIdx: -1,
      subIdx: -1
    };
    this.artistType = undefined;
    this.animating = false;
    this.inputT = undefined;
    this.resizeT = undefined;
    this.searchT = undefined;
    this.blurT = undefined;
    this.size = window.innerWidth / 32; // Data

    this.artistsData = _data.artists;
    this.score = _billboard.default.score;
  }

  _createClass(App, [{
    key: "init",
    value: function init() {
      var _this = this;

      // TextRoll
      this.textRoll = new _textRoll.default(result, this.size);
      this.textRoll.setText("Try your Self");
      this.resize(); // Event handler

      window.addEventListener("resize", this.debouncedResize.bind(this));
      this.mainInput.addEventListener("input", this.handleInput.bind(this));
      this.mainInput.addEventListener("focus", function (e) {
        e.target.placeholder = "";

        _this.handleInput(e);
      });
      this.mainInput.addEventListener("blur", function (e) {
        e.target.placeholder = "Main Artist";
        _this.blurT = setTimeout(_this.handleInputBlur.bind(_this), 200);
      });
      this.subInput.addEventListener("input", this.handleInput.bind(this));
      this.subInput.addEventListener("focus", function (e) {
        e.target.placeholder = "";

        _this.handleInput(e);
      });
      this.subInput.addEventListener("blur", function (e) {
        e.target.placeholder = "Sub Artist";
        _this.blurT = setTimeout(_this.handleInputBlur.bind(_this), 200);
      });
    }
  }, {
    key: "handleInput",
    value: function handleInput(e) {
      var _e$target = e.target,
          name = _e$target.name,
          value = _e$target.value;
      this.artists[name] = value;
      this.artistType = name;
      this.handleArtistList(value);
    }
  }, {
    key: "handleArtistList",
    value: function handleArtistList(value) {
      var refElement, targetElement, notTargetElement;

      if (this.artistType === "mainArtist") {
        refElement = this.mainInput.parentElement;
        targetElement = this.mainArtistList;
        notTargetElement = this.subArtistList;
      } else {
        refElement = this.subInput.parentElement;
        targetElement = this.subArtistList;
        notTargetElement = this.mainArtistList;
      }

      this.searchList = targetElement; // targetElement.onclick = () => {
      //   targetElement.style.display = "none";
      // };

      var _refElement$getBoundi = refElement.getBoundingClientRect(),
          width = _refElement$getBoundi.width,
          height = _refElement$getBoundi.height,
          left = _refElement$getBoundi.left,
          top = _refElement$getBoundi.top;

      notTargetElement.style.display = "none";
      targetElement.style = "\n      left: ".concat(left, "px;\n      top: ").concat(top + height + 10, "px;\n      width: ").concat(width, "px;\n      height: ").concat(this.size * 3, "px;\n      opacity: 1;\n    ");
      this.searchArtist(value);
    }
  }, {
    key: "searchArtist",
    value: function searchArtist(term) {
      var _this2 = this;

      if (this.searchT) {
        clearTimeout(this.searchT);
      }

      this.searchT = setTimeout(function () {
        var searchResult = _this2.artistsData.filter(function (artist) {
          return artist[1].search(RegExp(term, "i")) > -1;
        });

        var topTen;

        if (term === "") {
          topTen = searchResult.sort(function (x, y) {
            return Math.random() - 0.5;
          }).slice(0, 10);
        } else {
          topTen = searchResult.slice(0, 10);
        }

        _this2.searchList.innerHTML = "";

        if (topTen.length === 0) {
          _this2.searchList.innerHTML = "\n        <div class=\"searchResultItem\">No Result</div>\n        ";
        } else {
          topTen.forEach(function (item) {
            var searchResultItem = document.createElement("div");
            searchResultItem.className = "searchResultItem";
            searchResultItem.onclick = _this2.handleClickSearchResult.bind(_this2);
            searchResultItem.innerText = item[1];
            searchResultItem.dataset.artist = item[1];
            searchResultItem.dataset.artistIdx = item[0];

            _this2.searchList.appendChild(searchResultItem);
          });
        }
      }, 400);
    }
  }, {
    key: "handleClickSearchResult",
    value: function handleClickSearchResult(e) {
      if (this.blurT) {
        clearTimeout(this.blurT);
      }

      var newValue = e.target.dataset.artist;
      var artistIdx = e.target.dataset.artistIdx;
      var targetInput;

      if (this.artistType === "mainArtist") {
        targetInput = this.mainInput;
        this.artists.mainArtist = newValue;
        this.artists.mainIdx = artistIdx;
      } else {
        targetInput = this.subInput;
        this.artists.subArtist = newValue;
        this.artists.subIdx = artistIdx;
      }

      targetInput.value = newValue;
      this.searchList.innerHTML = "";
      this.searchList.style.display = "none";
      this.showSelectedArtistImage();
    }
  }, {
    key: "handleInputBlur",
    value: function handleInputBlur() {
      this.searchList.innerHTML = "";
      this.searchList.style.display = "none";
      var nowInput;

      if (this.artistType === "mainArtist") {
        nowInput = this.mainInput;
      } else {
        nowInput = this.subInput;
      }

      if (!this.artistsData.includes(nowInput.value)) {
        this.artists[this.artistType] = "";
        nowInput.value = "";
      }

      this.showSelectedArtistImage();
    }
  }, {
    key: "showSelectedArtistImage",
    value: function showSelectedArtistImage() {
      var _this3 = this;

      if (this.artistType === "mainArtist") {
        this.mainImage.style.opacity = 0;

        this.mainImage.ontransitionend = function () {
          if (_this3.artists.mainArtist !== "") {
            _this3.mainImage.innerHTML = "<image src=\"".concat(_main.default, "\"></image>");
          } else {
            _this3.mainImage.innerHTML = "";
          }

          _this3.mainImage.style.opacity = 1;
          _this3.mainImage.ontransitionend = "";
        };
      } else {
        this.subImage.style.opacity = 0;

        this.subImage.ontransitionend = function () {
          if (_this3.artists.subArtist !== "") {
            _this3.subImage.innerHTML = "<image src=\"".concat(_sub.default, "\"></image>");
          } else {
            _this3.subImage.innerHTML = "";
          }

          _this3.subImage.style.opacity = 1;
          _this3.subImage.ontransitionend = "";
        };
      }

      this.showSelectedArtistName();
    }
  }, {
    key: "showSelectedArtistName",
    value: function showSelectedArtistName() {
      if (this.artists.mainArtist !== "" && this.artists.subArtist !== "") {
        this.beforeResult.innerHTML = "<span>".concat(this.artists.mainArtist, "</span><span>feat. ").concat(this.artists.subArtist, "</span>");
        this.predict();
      }
    }
  }, {
    key: "predict",
    value: function predict() {
      var _this4 = this;

      var predictScore = this.score[Number(this.artists.mainIdx)][Number(this.artists.subIdx)];
      console.log("predict", predictScore);

      if (this.artists.mainArtist !== "" && this.artists.subArtist !== "") {
        if (this.inputT) {
          clearTimeout(this.inputT);
        }

        this.inputT = setTimeout(function () {
          _this4.animating = true;
          _this4.mainInput.disabled = true;
          _this4.subInput.disabled = true;

          _this4.textRoll.animateTo("Expected position is No.".concat(predictScore), 1000);

          setTimeout(function () {
            _this4.animating = false;
            _this4.mainInput.disabled = false;
            _this4.subInput.disabled = false;
          }, 2500);
        }, 1200);
      }
    }
  }, {
    key: "resize",
    value: function resize() {
      this.size = window.innerWidth / 32;
      this.inputLine.style.fontSize = this.size + "px";
      this.contentLine.style.fontSize = this.size + "px";
      this.beforeResult.style.fontSize = this.size * 2 + "px";
      this.textRoll.updateSize(this.size);
    }
  }, {
    key: "debouncedResize",
    value: function debouncedResize() {
      var _this5 = this;

      if (this.resizeT) {
        clearTimeout(this.resizeT);
      }

      if (this.animating) {
        this.resizeT = setTimeout(function () {
          _this5.resize();
        }, 2500 + 500);
      } else {
        this.resizeT = setTimeout(function () {
          _this5.resize();
        }, 500);
      }
    }
  }]);

  return App;
}();

window.onload = function () {
  new App().init();
};
},{"./textRoll":"2/textRoll.js","./images/main.png":"2/images/main.png","./images/sub.png":"2/images/sub.png","./data":"2/data.js","./billboard.json":"2/billboard.json"}],"../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58182" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","2/app.js"], null)
//# sourceMappingURL=/app.d85e015d.js.map