let hashMap =
  localStorage.getItem("maxnav_storage") === null
    ? []
    : JSON.parse(localStorage.getItem("maxnav_storage"));

let isTouchDevice = "ontouchstart" in document.documentElement;

let keyInput = "";

const getMaxId = () =>
  hashMap.length > 0 ? hashMap[hashMap.length - 1].id : 0;

const getCurrentIndexById = function (id) {
  hashMap.forEach((item, index) => {
    if (id === item.id) {
      return index;
    }
  });
};

const addSite = function (url, id, pushToHashMap = true) {
  let fullURL = "https://www." + simplifyURL(url, true);
  $(`<li class="siteListItem" id=${id}>
    <div class="outWrapper">
        <div class="icon-close-wrapper close">  
            <svg class="icon-close">
                <use class="close" xlink:href="#icon-close"></use>
            </svg>
        </div>
        <div class="site-info">
            <div class="logo">${simplifyURL(url)[0].toUpperCase()}</div>
            <div class="link">${simplifyURL(url)}</div>
        </div>
    </div>
    </li>`).insertBefore(".addButton");
  addEvent();
  if (pushToHashMap) {
    hashMap.push({
      id: id,
      logo: simplifyURL(url)[0].toUpperCase(),
      siteURL: simplifyURL(url),
      fullURL: fullURL,
    });
    console.log(hashMap);
  }
};

const addEvent = function () {
  if (isTouchDevice) {
    $(".siteListItem").on("taphold", (e) => {
      console.log("OK");
      $(`#${e.currentTarget.id}`).remove();
      hashMap.splice(e.currentTarget.id - 1, 1);
    });
    $(".siteListItem").click((e) => {
      $(".icon-close-wrapper").hide();
      window.open(hashMap[e.currentTarget.id - 1].fullURL, (target = "_self"));
    });
  } else {
    $(".siteListItem").click((e) => {
      if (e.target.classList.value.indexOf("close") > -1) {
        e.stopPropagation();
        $(`#${e.currentTarget.id}`).remove();
        //currentTarget是挂载监听函数的对象，即选中的.siteListItem类的对象
        hashMap.splice(e.currentTarget.id - 1, 1);
      } else {
        window.open(
          hashMap[e.currentTarget.id - 1].fullURL,
          (target = "_self")
        );
      }
      console.log(hashMap);
    });
  }
};

const simplifyURL = (str, removePrefixOnly = false) =>
  removePrefixOnly
    ? str
        .replace(/^http:\/\/|^https:\/\//, "")
        .replace(/^www\./, "")
        .replace(/^\/+/, "")
    : str
        .replace(/^http:\/\/|^https:\/\//, "")
        .replace(/^www\./, "")
        .replace(/^\/+/, "")
        .replace(/(\?|\/)\S+$/g, "");

/**
 * 初始化站点，使用立即执行函数从localStorage中读取站点信息并渲染
 */
!(function initiateSite() {
  hashMap.forEach((item) => {
    addSite(item.fullURL, item.id, false);
  });
  // 根据设备类型，显示帮助内容
  isTouchDevice
    ? $(".guide").html(`<svg class="icon icon-info">
    <use xlink:href="#icon-info"></use>
  </svg>&nbsp;移动端要删除网页，请按住想删除的标签1秒！`)
    : $(".guide").html(`<svg class="icon icon-info">
    <use xlink:href="#icon-info"></use>
  </svg>&nbsp;电脑端不选中输入框时直接用键盘输入网址，网址的前面几个字符一致的标签就会变绿，只有唯一符合就会自动跳转！`);
})();

$(".addButton").click(() => {
  let url = prompt(
    "请输入新的站点名\n注意：不需输入http(s):// 和 www\n注意2：输入了我也会帮你去掉233"
  );
  addSite(url, getMaxId() + 1, true);
});

window.onbeforeunload = () => {
  localStorage.setItem("maxnav_storage", JSON.stringify(hashMap));
  // localStorage.removeItem("maxnav_storage");
};

//增强版键盘输入事件
$(document).on("keypress", (e) => {
  //如果是选中输入框后输入的，则不予处理，且阻止该事件冒泡
  if (e.target.classList[0] === "searchText") {
    e.stopPropagation();
    //否则将输入的字符加入搜索字符串
  } else {
    const { key } = e;
    keyInput += key;
    console.log(keyInput);
    //循环遍历哈希表，当输入之后将符合的结果加入新的数组，下次遍历这个数组即可，节省资源
    let mapCache = hashMap;
    let s = [];
    for (i in mapCache) {
      console.log(mapCache[i].siteURL);
      //判断开头的字符是否符合
      if (mapCache[i].siteURL.indexOf(keyInput) === 0) {
        $(`#${mapCache[i].id}`).css("background", "lightgreen");
        s.push({ id: mapCache[i].id, siteURL: mapCache[i].siteURL });
      } else {
        $(`#${mapCache[i].id}`).css("background", "white");
      }
    }
    if (s.length === 1) {
      window.open(hashMap[s[0].id - 1].fullURL, (target = "_self"));
    }
    mapCache = s;
    // console.log(mapCache)
  }
});
