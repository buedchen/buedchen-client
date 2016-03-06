chrome.app.runtime.onLaunched.addListener(init);
chrome.app.runtime.onRestarted.addListener(init);

var directoryServer, adminServer;

function init() {

  var win, basePath, socketInfo, data;
  var filesMap = {};

  //don't let computer sleep
  chrome.power.requestKeepAwake("display");

  chrome.storage.local.get(null,function(data){
    if(('remotescheduleurl' in data)){
      openWindow("windows/browser.html");
    }else{
      //need to run setup
      console.log("remotescheduleurl is empty");
      openWindow("windows/setup.html");
    }
  });

  chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
    if(request == "reload"){
      chrome.runtime.getPlatformInfo(function(p){
        console.log('reload',p.os,'dir',directoryServer);
        if(p.os == "cros"){
          //we're on ChromeOS, so `reload()` will always work
          chrome.runtime.reload();
        }else{
          var w = chrome.app.window.getAll();
          for(var i = 0; i < w.length; i++){
            w[i].close();
          }
          init();
        }
      });
    }
  });

  function openWindow(path){
    if(win) win.close();
    chrome.system.display.getInfo(function(d){
      chrome.app.window.create(path, {
        'frame': 'none',
        'id': 'browser',
        'state': 'fullscreen',
        'bounds':{
           'left':0,
           'top':0,
           'width':d[0].bounds.width,
           'height':d[0].bounds.height
        }
      },function(w){
        win = w;
        win.fullscreen();
        setTimeout(function(){
          win.fullscreen();
        },1000);
      });
    });
  }
}
