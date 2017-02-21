
var app = angular.module("config.controllers", []);

app.filter('custom', function($rootScope) {
  return function(input, search) {
    if (!input) return input;
    if (!search) {
      $rootScope.listofalphabstes =[];
      angular.forEach(input, function(value, key) {
          if($rootScope.listofalphabstes.indexOf(key) == -1)
           $rootScope.listofalphabstes.push(key);
      });
      return input;
    }
    var expected = ('' + search).toLowerCase();
    var result = {};
    $rootScope.listofalphabstes =[];
    angular.forEach(input, function(value, key) {
      var actual = ('' + value[0].FullName).toLowerCase();
      console.log(actual);
      if (actual.indexOf(expected) !== -1) {
        result[key] = value;
        if($rootScope.listofalphabstes.indexOf(key) == -1)
         $rootScope.listofalphabstes.push(key);
      }
    });
    return result;
  }
})

app.constant('config', {
    viewPageTittle: 'HSS',
    backButtonTittle:"Back"
});

app.directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                       event.target.blur();
                        scope.$apply(function(){
                                scope.$eval(attrs.ngEnter);
                        });

                        event.preventDefault();
                }
            });
        };
});

app.factory('utilityFactory', function ($ionicSideMenuDelegate,$state) {
  var inappbrowserRef = null;
  var isShowLoaderLoad = false;
  function extractDomain(url) {
      var domain;
      //find & remove protocol (http, ftp, etc.) and get domain
      if (url.indexOf("://") > -1) {
          domain = url.split('/')[2];
      }
      else {
          domain = url.split('/')[0];
      }

      //find & remove port number
      domain = domain.split(':')[0];

      return domain;
  }
  return {
      showInappBrowserSlideOption : function(url,headingTitle,isMenuOption){
           if (!window.cordova){
             if(extractDomain(url)=="www.hss.edu" )
             $state.go('app.showinternalview',{url:url,isTitle:headingTitle,isMenuOption});
             else
                window.open(url, '_system', 'location=yes');
           } else {
         inappbrowserRef = cordova.ThemeableBrowser.open(url, '_blank', {
                                                                 statusbar: {
                                                                 color: '#f8f8f8'
                                                                 },
                                                                 toolbar: {
                                                                 height: 50,
                                                                 color: '#f8f8f8'
                                                                 },
                                                                 title: {
                                                                 color: '#164469',
                                                                 showPageTitle: true,
                                                                 staticText:headingTitle
                                                                 },
                                                                 backButton: {
                                                                 wwwImage: 'img/menubackbutton.png',
                                                                 wwwImagePressed: 'img/menubackbutton.png',
                                                                 align: 'left',
                                                                 event: 'backPressed'
                                                                 },
                                                                 backButtonCanClose: true
                                                                 }).addEventListener('backPressed', function(e) {
                                                                                     inappbrowserRef.close();
                                                                                     $ionicSideMenuDelegate.toggleLeft();
                                                                                     })
           inappbrowserRef.addEventListener('loadstart', function(event) {
                                                  var isPlatformIos = (navigator.userAgent.match(/iPad/i)) == "iPad" || (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? true : false;
                                                  if(isPlatformIos) return;
                                                  if(!isShowLoaderLoad)
                                                  {
                                                  console.log('loadstart');
                                                  isShowLoaderLoad = true;
                                                  window.plugins.spinnerDialog.show(null, "loading....");
                                                  }
                                                  });
           inappbrowserRef.addEventListener('loadstop', function(event) {
                                                  var isPlatformIos = (navigator.userAgent.match(/iPad/i)) == "iPad" || (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? true : false;
                                                  if(isPlatformIos) return;
                                                  console.log('load Stop');
                                                  isShowLoaderLoad = false;
                                                  window.plugins.spinnerDialog.hide();
                                                  });
          }
      },
    showInappBrowserSlideOptionWithBackButton : function(url,headingTitle,backbuttonImage,isMenuOption) {
            if (!window.cordova){
             if(extractDomain(url)=="www.hss.edu" )
               $state.go('app.showinternalview',{url:url,isTitle:headingTitle,isMenuOption:isMenuOption});
              else
                 window.open(url, '_system', 'location=yes');
             } else {
            inappbrowserRef = cordova.ThemeableBrowser.open(url, '_blank', {
            statusbar: {
                color: '#f8f8f8'
            },
            toolbar: {
                height: 50,
                color: '#f8f8f8'
            },
            backButton: {
            wwwImage: backbuttonImage,
            wwwImagePressed: backbuttonImage,
            align: 'left',
            event: 'backPressed'
            },
            title: {
            color: '#164469',
            showPageTitle: true,
            staticText:headingTitle
            },
            backButtonCanClose: true
            }).addEventListener('backPressed', function(e) {
              inappbrowserRef.close();
            })
            inappbrowserRef.addEventListener('loadstart', function(event) {
              var isPlatformIos = (navigator.userAgent.match(/iPad/i)) == "iPad" || (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? true : false;
               if(isPlatformIos) return;
                                   if(!isShowLoaderLoad)
                                   {
                                    console.log('loadstart');
                                    isShowLoaderLoad = true;
                                    window.plugins.spinnerDialog.show(null, "loading....");
                                   }
                               });
            inappbrowserRef.addEventListener('loadstop', function(event) {
              var isPlatformIos = (navigator.userAgent.match(/iPad/i)) == "iPad" || (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? true : false;
              if(isPlatformIos) return;
                                  console.log('load Stop');
                                  isShowLoaderLoad = false;
                                  window.plugins.spinnerDialog.hide();
             });
            }
        }
  }
});
