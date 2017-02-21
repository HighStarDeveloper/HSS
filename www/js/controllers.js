angular.module('starter.controllers', [])

.controller('AppCtrl', function($ionicSideMenuDelegate, $scope, utilityFactory, $state, config, $http, ApiFactory, $ionicHistory, $ionicLoading) {
    $scope.openWebView = function(url, headingTitle, isMenuOption) {
        utilityFactory.showInappBrowserSlideOption(url, headingTitle, isMenuOption);
    }
    var initload = function() {
        $ionicLoading.show();
        ApiFactory.getPhysiciansList().then(function(data) {
                $ionicLoading.hide();
            }).catch(function(data, status) {
                if (window.plugins) {
                    $ionicLoading.hide();
                    window.plugins.toast.show('No Internet Connection', 'long', 'bottom');
                }
            })
            .finally(function() {
                $ionicLoading.hide();
            });
        ApiFactory.getPhysiciansInsuranceList().then(function(data) {
            $ionicLoading.hide();
        });
        ApiFactory.getLocationSeachDetails().then(function(data) {
            $ionicLoading.hide();
        });
    }
    initload();



})

.controller('PhysicianCtrl', function($ionicSideMenuDelegate, $timeout, $scope, $state, config, $http, ApiFactory, $ionicHistory) {
    $scope.data = {
        searchQuery: ""
    };
    $scope.reset = function() {
        $scope.data.searchQuery = "";
    }

    var initload = function() {
        if (window.plugins)
            window.plugins.spinnerDialog.show(null, "loading....");
        ApiFactory.getPhysiciansList().then(function(data) {
                if (window.plugins)
                    window.plugins.spinnerDialog.hide();
            }).catch(function(data, status) {
                if (window.plugins) {
                    window.plugins.spinnerDialog.hide();
                    window.plugins.toast.show('No Internet Connection', 'long', 'bottom');
                }
            })
            .finally(function() {
                if (window.plugins)
                    window.plugins.spinnerDialog.hide();
            });
        ApiFactory.getPhysiciansInsuranceList().then(function(data) {
            if (window.plugins)
                window.plugins.spinnerDialog.hide();
        });
        ApiFactory.getLocationSeachDetails().then(function(data) {
            if (window.plugins)
                window.plugins.spinnerDialog.hide();
        });
    }
    $scope.goBack = function() {
        if ($ionicHistory.backTitle())
            $ionicHistory.goBack();
        else
            $ionicSideMenuDelegate.toggleLeft();
    }
    $scope.viewallphysician = function() {
        if (ApiFactory.getPhysicianslistNotEmpty())
            $state.go('app.physicianslist', {
                result: null
            });
        else
            initload();
    }
    $scope.searchEnter = function(searchKey) {

    }

     $scope.searchBlurDone = function(searchKey) {
       if (window.plugins)
           window.plugins.spinnerDialog.show(null, "loading....");
       $timeout(function(){
         if (ApiFactory.getPhysicianslistNotEmpty())
         $state.go('app.physicianslist', {result: searchKey });
         if (window.plugins)
             window.plugins.spinnerDialog.hide();
       }, 1000);
    }

    $scope.viewallphysiciansInsurance = function() {
        if (ApiFactory.getPhysicianslistNotEmpty())
            $state.go('app.physiciansInsurance');
        else
            initload();
    }
    $scope.viewallphysiciansLocation = function() {
        if (ApiFactory.getPhysicianslistNotEmpty())
            $state.go('app.physicianslocation');
        else
            initload();
    }

    $scope.viewallphysiciansspecialty = function() {
        if (ApiFactory.getPhysicianslistNotEmpty())
            $state.go('app.physiciansspecialty');
        else
            initload();
    }
})

.controller('PhysiciansListCtrl', function($scope, $state, config, $http, ApiFactory, $stateParams, $ionicScrollDelegate) {
    $scope.results = $stateParams.result;
    $scope.resData = null;
    $scope.searchBy = {
        FullName: ""
    };
    $scope.physicians_items = [];
    $scope.resData = ApiFactory.getPhysicians();

    var getPhysiciansItems = function() {
        var resDataFilterData = [];
        var isIndexValue = 0;
        $scope.resData.forEach(function(item) {
            resDataFilterData.push({
                'FullName': (typeof item.FullName === 'object') ? item.FullName.__text : item.FullName,
                'Specialty': (typeof item.Specialty === 'object') ? item.Specialty.__text : item.Specialty,
                'LastName': (typeof item.LastName === 'object') ? item.LastName.__text : item.LastName,
                'objIndexID': isIndexValue
            });
            isIndexValue++;
        });
        resDataFilterData.sort(function(a, b) {
            if (a.LastName < b.LastName)
                return -1;
            if (a.LastName > b.LastName)
                return 1;
            return 0;
        });
        return resDataFilterData;
    }
    $scope.customSeacrh = function(search) {
        $scope.physicians_items = [];
        var input = getPhysiciansItems();
        if (!search) return $scope.physicians_items = input;
        var expected = ('' + search).toLowerCase();
        var result = [];
        var filterkeyvalueobject = [];
        for (var i = 0; i < input.length; i++) {
            var item = input[i];
            if (search) {
                if ((item.FullName.toLowerCase().indexOf(expected) !== -1) || (item.Specialty.toLowerCase().indexOf(expected) !== -1)) {
                    result.push(item);
                }
            } else {
                result.push(item);
            }
        }
        $scope.physicians_items = result;
        $ionicScrollDelegate.scrollTop();
    }

    if ($scope.results != null) {
        $scope.searchBy.text = $scope.results;
        $scope.customSeacrh($scope.searchBy.text);
    } else {
        $scope.physicians_items = getPhysiciansItems();
    }

    $scope.showDetails = function(val) {
        if ($scope.results != null)
            $state.go('app.physiciansDetails', {
                isfilter: true,
                details: $scope.resData[val]
            });
        else
            $state.go('app.physiciansDetails', {
                isfilter: false,
                details: $scope.resData[val]
            });
    }

})

.controller('PhysiciansInsuranceListCtrl', function($scope, $state, config, $http, ApiFactory, $stateParams) {
    $scope.physiciansinsurancelist = ["Aetna", "Affinity Access", "Blue Cross HMO POS", "Blue Cross PPO",
        "Blue Cross Pathway", "Cigna", "Connecticare", "Emblem Selectcare", "GHI", "HIP", "Medicare",
        "Medicare Non-Par", "MultiPlan PHCS", "NYS Empire Plan", "Oxford", "United Healthcare",
        "United Healthcare Compass"
    ];

    $scope.insuranceSelectItem = function(searchKey) {
        $state.go('app.physiciansinsurancetype', {
            result: searchKey,
            filterPage: "insurance"
        });
    }
})

.controller('PhysiciansLocationCtrl', function($scope, $state, config, $http, ApiFactory, $stateParams) {
    $scope.physicianslocationlist = ["HSS Main Campus - Main Hospital", "HSS Main Campus - All",
        "HSS Main Campus - East River Professional Building", "HSS Main Campus - Belaire Building",
        "HSS Queens", "HSS Long Island", "Burke Rehabilitation Office", "NewYork-Presbyterian Hospital",
        "New York Hospital Queens", "HSS Main Campus - River Terrace", "Helen Hayes Rehabilitation Hospital",
        "Integrative Care Center", "HSS Stamford Outpatient Center", "HSS Main Campus - 75th Street",
        "HSS Paramus Outpatient Center", "HSS Main Campus - Hip Center"
    ];
    $scope.physicianslocationlist.sort(function(a, b) {
        if (a < b)
            return -1;
        if (a > b)
            return 1;
        return 0;
    });

    $scope.LocationSelectItem = function(searchKey) {
        $state.go('app.physiciansinsurancetype', {
            result: searchKey,
            filterPage: "location"
        });
    }
})

.controller('PhysiciansDetailsCtrl', function($scope, config, $state, $stateParams, ApiFactory, $ionicSideMenuDelegate, utilityFactory) {
    $scope.physiciansdetails = {};
    for (var key in $stateParams.details) {
        $scope.physiciansdetails[key] = (typeof $stateParams.details[key] === 'object') ? $stateParams.details[key].__text : $stateParams.details[key];
    }
    $scope.isShowLoaderLoad = false; // Check Spinner show/hide event.
    $scope.openMapApp = function(val) {
        if (val == "location1") {
            var getLocation = $scope.physiciansdetails.Address1 + "," + $scope.physiciansdetails.Address12 + "," + $scope.physiciansdetails.City1;
            getLocation = getLocation + "," + $scope.physiciansdetails.State1 + "," + $scope.physiciansdetails.Zip1;
            if (device.platform === 'iOS' || device.platform === 'iPhone' || navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
                var url = "http://maps.apple.com/maps?q=" + encodeURIComponent(getLocation);
                window.open(url, '_system', 'location=yes');
            } else {
                var url = "geo:0,0?q=" + encodeURIComponent(getLocation);
                window.open(url, '_system', 'location=yes');
            }
        } else if (val == "location2") {
            var getLocation = $scope.physiciansdetails.Address21 + "," + $scope.physiciansdetails.Address22 + "," + $scope.physiciansdetails.City2;
            getLocation = getLocation + "," + $scope.physiciansdetails.State2 + "," + $scope.physiciansdetails.Zip2;
            if (device.platform === 'iOS' || device.platform === 'iPhone' || navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
                var url = "http://maps.apple.com/maps?q=" + encodeURIComponent(getLocation);
                window.open(url, '_system', 'location=yes');
            } else {
                var url = "geo:0,0?q=" + encodeURIComponent(getLocation);
                window.open(url, '_system', 'location=yes');
            }
        } else if (val == "location3") {
            var getLocation = $scope.physiciansdetails.Address31 + "," + $scope.physiciansdetails.Address32 + "," + $scope.physiciansdetails.City3;
            getLocation = getLocation + "," + $scope.physiciansdetails.State3 + "," + $scope.physiciansdetails.Zip3;
            if (device.platform === 'iOS' || device.platform === 'iPhone' || navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
                var url = "http://maps.apple.com/maps?q=" + encodeURIComponent(getLocation);
                window.open(url, '_system', 'location=yes');
            } else {
                var url = "geo:0,0?q=" + encodeURIComponent(getLocation);
                window.open(url, '_system', 'location=yes');
            }
        }
    }

    $scope.openFullProfile = function() {
        var isTitleText = "Physicians";
        var url = $scope.physiciansdetails.ProfileURL;
        utilityFactory.showInappBrowserSlideOptionWithBackButton(url, isTitleText, "img/backbutton.png");
    }
    $scope.openAddContet = function() {

        var myContact = navigator.contacts.create({
            "displayName": $scope.physiciansdetails.FullName || ""
        });
        var getLocation = $scope.physiciansdetails.Address1 + "," + $scope.physiciansdetails.City1;
        getLocation = getLocation + "," + $scope.physiciansdetails.State1 + "," + $scope.physiciansdetails.Zip1;
        var phoneNumbers = [];
        phoneNumbers[0] = new ContactField('home', $scope.physiciansdetails.Phone1 || null, true);
        phoneNumbers[1] = new ContactField('work', $scope.physiciansdetails.Phone2 || null, false);
        myContact.phoneNumbers = phoneNumbers;
        myContact.addresses = getLocation;
        myContact.save(function(contact_obj) {
            var contactObjToModify = contact_obj.clone();
            contact_obj.remove(function() {
                var phoneNumbers = [contactObjToModify.phoneNumbers[0]];
                contactObjToModify.phoneNumbers = phoneNumbers;
                contactObjToModify.save(function(c_obj) {
                    window.plugins.toast.show('Contact saved successfully', 'long', 'bottom');
                }, function(error) {
                    console.log("Not able to save the cloned object: " + error);
                });
            }, function(contactError) {
                console.log("Contact Remove Operation failed: " + contactError);
            });
        });
    }

    $scope.openCallview = function() {
        window.open('tel:' + $scope.physiciansdetails.Phone1 || null, '_system', 'location=yes')
    }
})

.controller('PhysiciansInsurancetypeCtrl', function($scope, $ionicScrollDelegate, config, $state, $stateParams, ApiFactory) {
    $scope.insurancestype = $stateParams.result;
    $scope.filterPage = $stateParams.filterPage;
    $scope.filterByBodyPart = $stateParams.filterByBodyPart || null;
    $scope.searchBy = {
        text: ""
    };
    $scope.resData = ApiFactory.getPhysiciansInsurancesTypeFilter($scope.insurancestype, "", $scope.filterPage);

    var getPhysiciansItems = function() {
        var resDataFilterData = [];
        var isIndexValue = 0;
        $scope.resData.sort(function(a, b) {
            if (a.LastName < b.LastName)
                return -1;
            if (a.LastName > b.LastName)
                return 1;
            return 0;
        });
        $scope.resData.forEach(function(item) {
            resDataFilterData.push({
                'FullName': (typeof item.FullName === 'object') ? item.FullName.__text : item.FullName,
                'Specialty': (typeof item.Specialty === 'object') ? item.Specialty.__text : item.Specialty,
                'LastName': (typeof item.LastName === 'object') ? item.LastName.__text : item.LastName,
                'objIndexID': isIndexValue
            });
            isIndexValue++;
        });
        return resDataFilterData;
    }
    $scope.customSeacrh = function(search) {
        $scope.filter_items = [];
        var input = getPhysiciansItems();
        if (!search) return $scope.filter_items = input;
        var expected = ('' + search).toLowerCase();
        var result = [];
        var filterkeyvalueobject = [];
        for (var i = 0; i < input.length; i++) {
            var item = input[i];
            if (search) {
                if ((item.FullName.toLowerCase().indexOf(expected) !== -1) || (item.Specialty.toLowerCase().indexOf(expected) !== -1)) {
                    result.push(item);
                }
            } else {
                result.push(item);
            }
        }
        $scope.filter_items = result;
        $ionicScrollDelegate.scrollTop();
    }
    $scope.filter_items = getPhysiciansItems();

    $scope.showDetails = function(val) {
        if ($scope.results != null)
            $state.go('app.physiciansDetails', {
                isfilter: true,
                details: $scope.resData[val]
            });
        else
            $state.go('app.physiciansDetails', {
                isfilter: false,
                details: $scope.resData[val]
            });
    }
})

.controller('SocialmediaCtrl', function($scope, config, $state, $stateParams, ApiFactory, utilityFactory) {
    $scope.showweburl = false;
    $scope.weblink = "";
    $scope.socialmediaitems = [{
            "name": "HSS Blog",
            "url": "https://www.hss.edu/playbook"
        }, {
            "name": "Facebook",
            "url": "https://www.facebook.com/hspecialsurgery/"
        }, {
            "name": "Twitter",
            "url": "https://twitter.com/HSpecialSurgery"
        }, {
            "name": "YouTube",
            "url": "https://www.youtube.com/user/HSpecialSurgery"
        }, {
            "name": "Instagram",
            "url": "https://www.instagram.com/hspecialsurgery/"
        },
        //  {"name":"Google+","url":""},
        {
            "name": "LinkedIn",
            "url": "https://www.linkedin.com/company/hospital-for-special-surgery"
        }
    ]
    $scope.morepagesitems = [{
        "name": "About HSS",
        "url": "https://www.hss.edu/about.asp"
    }, {
        "name": "Request Appointment",
        "url": "https://www.hss.edu/secure/prs-appointment-request.htm"
    }, {
        "name": "Contact Us",
        "url": "https://www.hss.edu/contact.asp"
    }, {
        "name": "Subscribe to HSS",
        "url": "https://www.hss.edu/registration.asp"
    }]

    $scope.openWebView = function(url, headingTitle, isMenuOption) {
        //$state.go('app.showinternalview',{url:url,isTitle:headingTitle});
        utilityFactory.showInappBrowserSlideOptionWithBackButton(url, headingTitle, "img/backbutton.png", isMenuOption);
    }
    $scope.openinnerpage = function(url, headingTitle) {
        // $state.go('app.innermorepage',{url:url,isTitle:headingTitle});
        utilityFactory.showInappBrowserSlideOptionWithBackButton(url, headingTitle, "img/backbutton.png", false);
    }

})

.controller('InnerViewCtrl', function($scope, config, $state, $stateParams, ApiFactory, utilityFactory, $ionicHistory) {
    $scope.titleName = $stateParams.isTitle;
    $scope.isMenuOption = $stateParams.isMenuOption;
    document.getElementById("isInnerView").src = $stateParams.url;
    $scope.goback = function() {
        $ionicHistory.goBack();
    }
})

.controller('InnerMoreViewCtrl', function($scope, config, $state, $stateParams, ApiFactory, utilityFactory, $ionicHistory) {
    $scope.titleName = $stateParams.isTitle;
    $scope.goback = function() {
        $ionicHistory.goBack();
    }
    $scope.openWebView = function(url, headingTitle) {
        utilityFactory.showInappBrowserSlideOptionWithBackButton($stateParams.url, $stateParams.isTitle, "img/backbutton.png", false);
    }
})

.controller('PhysiciansSpecialtyCtrl', function($scope, $state, config, $http, ApiFactory, $stateParams) {
    $scope.physicianslpecialtylist = ["Orthopedic Surgery", "Pediatrics", "Perioperative Medicine", "Rheumatology",
        "Internal Medicine", "Hip and Knee Replacement", "ACC", "Physiatry", "Spine", "Neurology", "Radiology and Imaging", "Psychiatry",
        "Anesthesiology", "Sports Medicine", "Foot and Ankle", "Hand and Upper Extremity", "Infectious Diseases", "Hip Preservation",
        "Limb Lengthening", "Primary Care Sports Medicine", "Osteoporosis/Metabolic Bone", "Pain Management", "Trauma", "Pathology",
        "Endocrinology", "Podiatry", "Oncology", "Psychology", "Cardiology", "Metabolic Bone"
    ];
    $scope.physicianslpecialtylist.sort(function(a, b) {
        if (a < b)
            return -1;
        if (a > b)
            return 1;
        return 0;
    });
    $scope.physicianslpecialtybodypart = ["Head,Brain", "Shoulder", "Spine,Back,Lowerback,Neck", "ELbow,Arm,Wrist,Forearm,Upper Arm",
        "Wrist,Hand", "Hip,Pelvis", "Knee", "Leg", "Ankle,Foot"
    ];

    $scope.SpecialtySelectItem = function(searchKey) {
        $state.go('app.physiciansinsurancetype', {
            result: searchKey,
            filterPage: "specialty"
        });
    }
    $scope.showBodyTab = true;
    $scope.buttonType1 = "button isactiveSpecialtyTab";
    $scope.buttonType2 = "button normal";
    $scope.changeTab = function(select) {
        if (select == "1") {
            $scope.buttonType1 = "button isactiveSpecialtyTab";
            $scope.buttonType2 = "button";
            $scope.showBodyTab = true;
        } else {
            $scope.buttonType1 = "button";
            $scope.buttonType2 = "button isactiveSpecialtyTab";
            $scope.showBodyTab = false;
        }
    }
    $scope.bodyPartEvent = function(val) {
        $state.go('app.physiciansinsurancetype', {
            result: $scope.physicianslpecialtybodypart[val - 1],
            filterPage: "bodyPart"
        });
    }
    $scope.bodyPartAll = function(val) {
        var physicianslpecialtybodypart = "Head,Brain,Shoulder,Spine,Back,Lowerback,Neck,ELbow,Arm,Wrist,Forearm,Upper,Arm,Wrist,Hand,Hip,Pelvis,Knee,Leg,Ankle,Foot";
        $state.go('app.physiciansinsurancetype', {
            result: physicianslpecialtybodypart,
            filterPage: "bodyPart"
        });
    }

})

.controller('HomeCtrl', function($scope, $window, config, $state, $ionicSlideBoxDelegate, $ionicSideMenuDelegate, ApiFactory, utilityFactory) {
    config.viewPageTittle = "HSS";
    $scope.slidedata = "";
    $scope.images = [];
    $scope.showImageDetails = function(value) {
        $state.go('app.sliderImageDetails', {
            selectImage: value
        });
    }
    $scope.dev_width = $window.innerWidth;
    $scope.dev_height = $window.innerHeight - $window.innerHeight / 3 - 100;
    //slideview  images
    if (window.plugins)
        window.plugins.spinnerDialog.show(null, "loading....");
    ApiFactory.getSlideViewList().then(function(data) {
            if (window.plugins)
                window.plugins.spinnerDialog.hide();
            var loaclArray = [];
            if (data) {
                for (var i = 0; i < data.data.hss_app_slider.content_image.length; i++) {
                    loaclArray.push({
                        content_image: data.data.hss_app_slider.content_image[i],
                        cover_image_link_text: data.data.hss_app_slider.cover_image_link_text[i],
                        cover_image_title: data.data.hss_app_slider.cover_image_title[i],
                        content_title: data.data.hss_app_slider.content_title[i]
                    });
                }
                $scope.slidedata = [];
                $scope.slidedata = loaclArray;
                $ionicSlideBoxDelegate.update();
                $ionicSlideBoxDelegate.start();
            }
        }).catch(function(data, status) {
            if (window.plugins) {
                window.plugins.spinnerDialog.hide();
                window.plugins.toast.show('No Internet Connection', 'long', 'bottom');
            }
        })
        .finally(function() {
            if (window.plugins)
                window.plugins.spinnerDialog.hide();
        });
    $scope.slidedata = [{
        content_image: ""
    }];
    $scope.physicianEvent = function() {
        $state.go('app.physician');
    }
    $scope.locationsearch = function() {
        $state.go('app.locationsearch');
    }
    $scope.openWebView = function(url, headingTitle, isMenuOption) {
        utilityFactory.showInappBrowserSlideOptionWithBackButton(url, headingTitle, "img/homebackbutton.png", isMenuOption);
    }

})

.controller('SliderImageDetailsCtrl', function($scope, config, $stateParams, $ionicModal, $timeout, ApiFactory, utilityFactory) {
    $scope.dataDetails = ApiFactory.getSlideViewForlocal($stateParams.selectImage);
    $scope.dataDetailsTextcontent = null;
    debugger;
    if (typeof $scope.dataDetails.content_text === 'object')
        $scope.dataDetailsTextcontent = $scope.dataDetails.content_text.p;
    else
        $scope.dataDetailsTextcontent = [$scope.dataDetails.content_text];
    $scope.showMoreDetails = function(url) {
        utilityFactory.showInappBrowserSlideOptionWithBackButton(url, "Highlights", "img/backbutton.png");
    }

})

.controller('LocationSearchCtrl', function($scope, $state, config, $stateParams, $cordovaGeolocation, ApiFactory, utilityFactory, $ionicLoading) {

    $scope.isLocationFound = false;
    $scope.items = ApiFactory.getLocationSearchName();
    $ionicLoading.show();
    $scope.isUserCurrentLocation = function (){
    ApiFactory.getUserCurrentLocation(function(value) {
        console.log(value);
        $scope.isLocationFound = true;
        $ionicLoading.hide();
    }, function(error) {
      $scope.isLocationFound = false;
        console.log(error);
        if (window.plugins)
            window.plugins.toast.show('location not found', 'long', 'bottom');
        $ionicLoading.hide();
    });
  }
    $scope.isUserCurrentLocation();
    // ApiFactory.getUserCurrentLocation(function(value) {
    //     console.log(value);
    //     $scope.isLocationFound = true;
    //     $ionicLoading.hide();
    // }, function(error) {
    //   $scope.isLocationFound = false;
    //     console.log(error);
    //     if (window.plugins)
    //         window.plugins.toast.show('location not found', 'long', 'bottom');
    //     $ionicLoading.hide();
    // });
    $scope.showListDetails = function(val) {
        $state.go('app.locationsearchsublist', {
            selectvalue: val
        });
    }
})

.controller('LocationSearchSubListCtrl', function($scope, $state, config, $stateParams, $ionicModal, $timeout, $cordovaGeolocation, ApiFactory, utilityFactory, $ionicLoading) {
    var selectlist = $stateParams.selectvalue;
    $scope.items = [];
    $scope.currentLocation = ApiFactory.findUserCurrentlocation();
    $scope.itemsList = ApiFactory.getLocationSearchFilter(selectlist);
    $scope.showDetails = function(val) {
        $state.go('app.locationDetails', {
            objectValue: $scope.itemsList[val].objectValue,
            distance: $scope.itemsList[val].distance
        });
    }
    $scope.showMapView = function() {
        $state.go('app.mapview', {
            objectValue: $scope.itemsList
        });
    }
    var geocoder = new google.maps.Geocoder();
    var address = "";
    var i = 0;

    //calculates distance between two points in km's
    function isDistance(p1, p2) {
        return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 16093).toFixed(2) + " mi";
    }

    function calculateDistance(list, i) {
        if (i < list.length) {
            var selectitems = list[i].objectValue;
            address = (selectitems.Address1 || "") + (selectitems.Address2 || "") + (selectitems.City1 || "") + "," + (selectitems.State1 || "") + " ," + (selectitems.Zip1 || "");
            geocoder.geocode({
                'address': address
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    $scope.itemsList[i].locationtype = results[0].geometry;
                    if ($scope.currentLocation) {
                        var p1 = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                        var p2 = new google.maps.LatLng($scope.currentLocation.latitude, $scope.currentLocation.longitude);
                        $scope.itemsList[i].distance = isDistance(p1, p2);
                    }
                }
            });
            calculateDistance(list, i + 1);
        } else
            $ionicLoading.hide();
    }
    $ionicLoading.show();
    calculateDistance($scope.itemsList, i);
})

.controller('LocationDetailsCtrl', function($scope, config, $stateParams, $ionicModal, utilityFactory, $timeout, $cordovaGeolocation, ApiFactory, utilityFactory) {
    $scope.selectField = $stateParams.objectValue;
    $scope.distance = $stateParams.distance;
    $scope.openMapApp = function() {
        var getLocation = $scope.selectField.Address1 + "," + $scope.selectField.Address2 + "," + $scope.selectField.City1;
        getLocation = getLocation + "," + $scope.selectField.State1 + "," + $scope.selectField.Zip1;
        if (device.platform === 'iOS' || device.platform === 'iPhone' || navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
            var url = "http://maps.apple.com/maps?q=" + encodeURIComponent(getLocation);
            window.open(url, '_system', 'location=yes');
        } else {
            var url = "geo:0,0?q=" + encodeURIComponent(getLocation);
            window.open(url, '_system', 'location=yes');
        }
    }
    $scope.openCallview = function() {
        window.open('tel:' + $scope.selectField.Phone1 || null, '_system', 'location=yes')
    }
    $scope.openMore = function() {
        var isTitleText = "location";
        var url = $scope.selectField.Link;
        utilityFactory.showInappBrowserSlideOptionWithBackButton(url, isTitleText, "img/backbutton.png");
    }
})

.controller('mapviewCtrl', function($scope, config, $stateParams, $cordovaGeolocation, ApiFactory, utilityFactory, $ionicLoading) {
    $scope.selectField = $stateParams.objectValue;
    var currentlocation = ApiFactory.findUserCurrentlocation();
    ionic.Platform.ready(function() {
        var myLatlng = new google.maps.LatLng(0, 0);
        if (currentlocation)
            myLatlng = new google.maps.LatLng(currentlocation.latitude, currentlocation.longitude);
        var mapOptions = {
            center: myLatlng,
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        for (var i = 0; i < $scope.selectField.length; i++) {
            if (!$scope.selectField[i].locationtype)
                return;
            var markerview = new google.maps.Marker({
                position: new google.maps.LatLng($scope.selectField[i].locationtype.location.lat(), $scope.selectField[i].locationtype.location.lng()),
                map: map,
                title: $scope.selectField[i].name
            });
            if (i == $scope.selectField.length - 1)
                map.setCenter(new google.maps.LatLng($scope.selectField[i].locationtype.location.lat(), $scope.selectField[i].locationtype.location.lng()));
        }
        $scope.map = map;
    });
})
