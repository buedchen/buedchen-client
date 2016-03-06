var DEFAULT_SCHEDULE_POLL_INTERVAL = 15; //seconds

$(function(){
  chrome.storage.local.get(null,function(data){
  if(!data.deviceid) {
    //generate random device id
    var randomPool = new Uint8Array(6);
    crypto.getRandomValues(randomPool);
    var hex = '';
    for (var i = 0; i < randomPool.length; ++i) {
        hex += randomPool[i].toString(16);
    }
    deviceid = hex;
    remotescheduleurl = 'wss://oprdproaf300.corp.intuit.net/ws/schedule';
    password = 'idea';
    chrome.storage.local.set({'deviceid':deviceid});
    chrome.storage.local.set({'remotescheduleurl': remotescheduleurl});
    chrome.storage.local.set({'password':password});
    data.deviceid = deviceid;
    data.remotescheduleurl = remotescheduleurl;
    data.password = password;
  }

  if(data.deviceid) {
    $("#deviceid").val(data.deviceid).siblings('label').addClass('active');
  }

  if(data.remotescheduleurl)
    $("#remote-schedule-url").val(data.remotescheduleurl).siblings('label').addClass('active');

  if(data.local) {
    $("#local").prop("checked",true);
    $('.local, .settings-detail').removeClass('disabled');
  }
  if(data.remote) {
    $("#remote").prop("checked",true);
    $('.remote, .settings-detail').removeClass('disabled');
  }
  if(data.username) $("#username").val(data.username).siblings('label').addClass('active');
  if(data.password) {
    $("#password").val(data.password).siblings('label').addClass('active');
    $("#confirm_password").val(data.password).siblings('label').addClass('active');
  }

  if(data.reset && parseFloat(data.reset)){
    var reset = parseFloat(data.reset);
    $("#reset").prop("checked",true);
    $('.reset').removeClass('disabled');
    $("#resetinterval").val(data.reset).siblings('label').addClass('active');
  }

  if(data.hidecursor) $("#hidecursor").prop("checked",true);
  if(data.disablecontextmenu) $("#disablecontextmenu").prop("checked",true);
  if(data.disabledrag) $("#disabledrag").prop("checked",true);
  if(data.disabletouchhighlight) $("#disabletouchhighlight").prop("checked",true);
  if(data.disableselection) $("#disableselection").prop("checked",true);

  if(data.useragent) $('#useragent').val(data.useragent).siblings('label').addClass('active');

  $('select').material_select();

  $("#reset").on('change',function(){
    if($("#reset").is(':checked')){
      $('.reset').hide().removeClass('disabled').slideDown();
    }else{
      $('.reset').slideUp();
    }
  });

  $("#restart").on('change',function(){
    if($("#restart").is(':checked')){
      $('.restart').hide().removeClass('disabled').slideDown();
    }else{
      $('.restart').slideUp();
    }
  });

  $('#url').focus();

  $('#save').click(function(e){
    e.preventDefault();
    var error = [];
    var deviceid = $('#deviceid').val();
    var reset = $("#reset").is(':checked');
    var restart = $("#restart").is(':checked');
    var reset = $("#reset").is(':checked');
    var hidecursor = $("#hidecursor").is(':checked');
    var disablecontextmenu = $("#disablecontextmenu").is(':checked');
    var disabledrag = $("#disabledrag").is(':checked');
    var disabletouchhighlight = $("#disabletouchhighlight").is(':checked');
    var disableselection = $("#disableselection").is(':checked');
    var useragent = $('#useragent').val();
    var username = $("#username").val();
    var password = $("#password").val();
    var passwordConfirm = $("#confirm_password").val();
    var remotescheduleurl = $("#remote-schedule-url").val();
    var resetcache = $('#reset-cache').is(':checked');

    if(reset){
      var reset = parseFloat($('#resetinterval').val());
      if(!reset) reset = 0;
      if(reset <= 0 ){
        reset = false;
        error.push("Reset interval is required.");
      }
    }
    if(!username){
      error.push("Username is required.");
    }
    if(!password){
      error.push("Password is required.")
    } else if(password != passwordConfirm){
      error.push("Passwords must match.");
    }

    if(!(remotescheduleurl && (remotescheduleurl.indexOf("ws://") >= 0 || remotescheduleurl.indexOf("wss://") >= 0 ))){
      error.push("Schedule URL must be valid.");
    }

    if(error.length){
      for(var i = 0; i < error.length; i++){
        Materialize.toast(error[i], 4000);
      }
      return false;
    }else{
      chrome.storage.local.set({'deviceid':deviceid});
      chrome.storage.local.set({'username':username});
      chrome.storage.local.set({'password':password});

      if(reset) chrome.storage.local.set({'reset':reset});
      else chrome.storage.local.remove('reset');
      if(restart){
        chrome.storage.local.set({'restart':restart});
      }else{
        chrome.storage.local.remove('restart');
      }
      if(remotescheduleurl) chrome.storage.local.set({'remotescheduleurl':remotescheduleurl});
      else chrome.storage.local.remove('remotescheduleurl');
      if(hidecursor) chrome.storage.local.set({'hidecursor':hidecursor});
      else chrome.storage.local.remove('hidecursor');
      if(disablecontextmenu) chrome.storage.local.set({'disablecontextmenu':disablecontextmenu});
      else chrome.storage.local.remove('disablecontextmenu');
      if(disabledrag) chrome.storage.local.set({'disabledrag':disabledrag});
      else chrome.storage.local.remove('disabledrag');
      if(disabletouchhighlight) chrome.storage.local.set({'disabletouchhighlight':disabletouchhighlight});
      else chrome.storage.local.remove('disabletouchhighlight');
      if(disableselection) chrome.storage.local.set({'disableselection':disableselection});
      else chrome.storage.local.remove('disableselection');

      if(resetcache) chrome.storage.local.set({'resetcache': resetcache});
      else chrome.storage.local.remove('resetcache');
      chrome.storage.local.set({'useragent':useragent});
      chrome.runtime.sendMessage('reload');
    }
  });
  });
});
