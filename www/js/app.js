// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var viewPageTittle ="";
angular.module('starter',[
'ionic',
'starter.controllers',
'config.controllers',
'service.controllers',
'ion-alpha-scroll','ngCordova'])

.run(function($ionicPlatform,$rootScope) {
  $rootScope.listofalphabstes =[];
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      }
    })
    .state('app.physician', {
        url: '/physician',
        views: {
          'menuContent': {
            templateUrl: 'templates/physicians.html',
            controller: 'PhysicianCtrl'
          }
        }
      })
  .state('app.socialmedia', {
               url: '/socialmedia',
               views: {
               'menuContent': {
               templateUrl: 'templates/socialmedia.html',
               controller: 'SocialmediaCtrl'
               }
               }
               })
.state('app.morepages', {
       url: '/morepages',
       views: {
       'menuContent': {
       templateUrl: 'templates/morepages.html',
       controller: 'SocialmediaCtrl'
       }
       }
       })

.state('app.physicianslist', {
        url: '/physicianslist',
        views: {
          'menuContent': {
            templateUrl: 'templates/physicianslist.html',
            controller: 'PhysiciansListCtrl'
          }
        },
        params: {result: null},
      })
  .state('app.physiciansDetails', {
          url: '/physiciansDetails',
          views: {
            'menuContent': {
              templateUrl: 'templates/physiciansDetails.html',
              controller: 'PhysiciansDetailsCtrl'
            }
          },
          params: {isfilter: null,details:null}
        })
  .state('app.physiciansInsurance', {
          url: '/physiciansInsurance',
          views: {
            'menuContent': {
              templateUrl: 'templates/physiciansinsurance.html',
              controller: 'PhysiciansInsuranceListCtrl'
            }
          }
        })
  .state('app.physiciansinsurancetype', {
          url: '/physiciansinsurancetypelist',
          views: {
            'menuContent': {
              templateUrl: 'templates/physiciansinsurancetypelist.html',
              controller: 'PhysiciansInsurancetypeCtrl'
            }
          },
          params: {result: null,filterPage:null,filterByBodyPart:null},
        })

  .state('app.physicianslocation', {
          url: '/physicianslocation',
          views: {
            'menuContent': {
              templateUrl: 'templates/physicianslocationlist.html',
              controller: 'PhysiciansLocationCtrl'
            }
          }
        })
  .state('app.physiciansspecialty', {
          url: '/physiciansspecialty',
          views: {
            'menuContent': {
              templateUrl: 'templates/physiciansSpecialty.html',
              controller: 'PhysiciansSpecialtyCtrl'
            }
          }
        })
 .state('app.showinternalview', {
            url: '/showinternalview',
            views: {
              'menuContent': {
                templateUrl: 'templates/showinternalview.html',
                controller: 'InnerViewCtrl'
              }
            },
            params:{isTitle:null,url:null,isMenuOption:false}
          })

  .state('app.innermorepage', {
             url: '/innermorepage',
             views: {
               'menuContent': {
                 templateUrl: 'templates/innermorepage.html',
                 controller: 'InnerMoreViewCtrl'
               }
             },
             params:{isTitle:null,url:null}
       })

.state('app.sliderImageDetails', {
           url: '/sliderImageDetails',
           views: {
             'menuContent': {
               templateUrl: 'templates/sliderImageDetails.html',
               controller: 'SliderImageDetailsCtrl'
             }
           },
           params: {selectImage:null}
         })

 .state('app.locationsearch', {
            url: '/locationsearch',
            views: {
              'menuContent': {
                templateUrl: 'templates/locationsearch.html',
                controller: 'LocationSearchCtrl'
              }
            }
        })
  .state('app.locationsearchsublist', {
             url: '/locationsearchsublist',
             views: {
               'menuContent': {
                 templateUrl: 'templates/locationsearchsublist.html',
                 controller: 'LocationSearchSubListCtrl'
               }
             },
             params: {selectvalue:null}
         })
         .state('app.locationDetails', {
                    url: '/locationDetails',
                    views: {
                      'menuContent': {
                        templateUrl: 'templates/locationDetails.html',
                        controller: 'LocationDetailsCtrl'
                      }
                    },
                    params: {objectValue:null,distance:null}
                })
      .state('app.mapview', {
                 url: '/mapview',
                 views: {
                   'menuContent': {
                     templateUrl: 'templates/mapview.html',
                     controller: 'mapviewCtrl'
                   }
                 },
                 params: {objectValue:null,distance:null}
             })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
