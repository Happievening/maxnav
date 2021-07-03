// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
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

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
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
  return newRequire;
})({7:[function(require,module,exports) {
var hashMap = localStorage.getItem("maxnav_storage") === null ? [] : JSON.parse(localStorage.getItem("maxnav_storage"));

var isTouchDevice = "ontouchstart" in document.documentElement;

var keyInput = "";

var getMaxId = function getMaxId() {
  return hashMap.length > 0 ? hashMap[hashMap.length - 1].id : 0;
};

var getCurrentIndexById = function getCurrentIndexById(id) {
  hashMap.forEach(function (item, index) {
    if (id === item.id) {
      return index;
    }
  });
};

var addSite = function addSite(url, id) {
  var pushToHashMap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var fullURL = "https://www." + simplifyURL(url, true);
  $("<li class=\"siteListItem\" id=" + id + ">\n    <div class=\"outWrapper\">\n        <div class=\"icon-close-wrapper close\">  \n            <svg class=\"icon-close\">\n                <use class=\"close\" xlink:href=\"#icon-close\"></use>\n            </svg>\n        </div>\n        <div class=\"site-info\">\n            <div class=\"logo\">" + simplifyURL(url)[0].toUpperCase() + "</div>\n            <div class=\"link\">" + simplifyURL(url) + "</div>\n        </div>\n    </div>\n    </li>").insertBefore(".addButton");
  addEvent();
  if (pushToHashMap) {
    hashMap.push({
      id: id,
      logo: simplifyURL(url)[0].toUpperCase(),
      siteURL: simplifyURL(url),
      fullURL: fullURL
    });
    console.log(hashMap);
  }
};

var addEvent = function addEvent() {
  if (isTouchDevice) {
    $(".siteListItem").on("taphold", function (e) {
      console.log("OK");
      $("#" + e.currentTarget.id).remove();
      hashMap.splice(e.currentTarget.id - 1, 1);
    });
    $(".siteListItem").click(function (e) {
      $(".icon-close-wrapper").hide();
      window.open(hashMap[e.currentTarget.id - 1].fullURL, target = "_self");
    });
  } else {
    $(".siteListItem").click(function (e) {
      if (e.target.classList.value.indexOf("close") > -1) {
        e.stopPropagation();
        $("#" + e.currentTarget.id).remove();
        //currentTarget是挂载监听函数的对象，即选中的.siteListItem类的对象
        hashMap.splice(e.currentTarget.id - 1, 1);
      } else {
        window.open(hashMap[e.currentTarget.id - 1].fullURL, target = "_self");
      }
      console.log(hashMap);
    });
  }
};

var simplifyURL = function simplifyURL(str) {
  var removePrefixOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return removePrefixOnly ? str.replace(/^http:\/\/|^https:\/\//, "").replace(/^www\./, "").replace(/^\/+/, "") : str.replace(/^http:\/\/|^https:\/\//, "").replace(/^www\./, "").replace(/^\/+/, "").replace(/(\?|\/)\S+$/g, "");
};

/**
 * 初始化站点，使用立即执行函数从localStorage中读取站点信息并渲染
 */
!function initiateSite() {
  hashMap.forEach(function (item) {
    addSite(item.fullURL, item.id, false);
  });
  // 根据设备类型，显示帮助内容
  isTouchDevice ? $(".guide").html("<svg class=\"icon icon-info\">\n    <use xlink:href=\"#icon-info\"></use>\n  </svg>&nbsp;\u79FB\u52A8\u7AEF\u8981\u5220\u9664\u7F51\u9875\uFF0C\u8BF7\u6309\u4F4F\u60F3\u5220\u9664\u7684\u6807\u7B7E1\u79D2\uFF01") : $(".guide").html("<svg class=\"icon icon-info\">\n    <use xlink:href=\"#icon-info\"></use>\n  </svg>&nbsp;\u7535\u8111\u7AEF\u4E0D\u9009\u4E2D\u8F93\u5165\u6846\u65F6\u76F4\u63A5\u7528\u952E\u76D8\u8F93\u5165\u7F51\u5740\uFF0C\u7F51\u5740\u7684\u524D\u9762\u51E0\u4E2A\u5B57\u7B26\u4E00\u81F4\u7684\u6807\u7B7E\u5C31\u4F1A\u53D8\u7EFF\uFF0C\u53EA\u6709\u552F\u4E00\u7B26\u5408\u5C31\u4F1A\u81EA\u52A8\u8DF3\u8F6C\uFF01");
}();

$(".addButton").click(function () {
  var url = prompt("请输入新的站点名\n注意：不需输入http(s):// 和 www\n注意2：输入了我也会帮你去掉233");
  addSite(url, getMaxId() + 1, true);
});

window.onbeforeunload = function () {
  localStorage.setItem("maxnav_storage", JSON.stringify(hashMap));
  // localStorage.removeItem("maxnav_storage");
};

//增强版键盘输入事件
$(document).on("keypress", function (e) {
  //如果是选中输入框后输入的，则不予处理，且阻止该事件冒泡
  if (e.target.classList[0] === "searchText") {
    e.stopPropagation();
    //否则将输入的字符加入搜索字符串
  } else {
    var key = e.key;

    keyInput += key;
    console.log(keyInput);
    //循环遍历哈希表，当输入之后将符合的结果加入新的数组，下次遍历这个数组即可，节省资源
    var mapCache = hashMap;
    var s = [];
    for (i in mapCache) {
      console.log(mapCache[i].siteURL);
      //判断开头的字符是否符合
      if (mapCache[i].siteURL.indexOf(keyInput) === 0) {
        $("#" + mapCache[i].id).css("background", "lightgreen");
        s.push({ id: mapCache[i].id, siteURL: mapCache[i].siteURL });
      } else {
        $("#" + mapCache[i].id).css("background", "white");
      }
    }
    if (s.length === 1) {
      window.open(hashMap[s[0].id - 1].fullURL, target = "_self");
    }
    mapCache = s;
    // console.log(mapCache)
  }
});
},{}]},{},[7], null)
//# sourceMappingURL=main.a1cc8e5d.map