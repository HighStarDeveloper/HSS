
var app = angular.module("service.controllers", []);
app.factory('ApiFactory', function($http,$cordovaGeolocation) {
  var allphysicianslist = [];
  var filterphysiciansList = [];
  var allphysiciansinsurancelist = [];
  var filterphysiciansinsurancelist =[];
  var allSlideViewList = [];
  var locationSeachDetailsList =[];
  var userCurrentlocation=null;
  return {
    getPhysiciansList: function(){
      // if(allphysicianslist)
      //   return allphysicianslist;
      allphysicianslist = [];//https://www.hss.edu/app-physicians-modified.xml
    	return $http.get("https://www.hss.edu/physician-listing.xml",{
           transformResponse: function (cnv) {
                    var x2js = new X2JS();
                    var aftCnv = x2js.xml_str2json(cnv);
                    return allphysicianslist = aftCnv;
            }
        })
    },
    getSlideViewList: function(){
      // if(allSlideViewList)
      //   return allSlideViewList;
      allSlideViewList = [];
      return $http.get("http://squarable.com/tmp/hss/hss_app_slider.xml",{
           transformResponse: function (cnv) {
                    var x2js = new X2JS();
                    var aftCnv = x2js.xml_str2json(cnv);
                    return allSlideViewList = aftCnv;
            }
        })
    },
    getLocationSeachDetails: function(){
      // if(allSlideViewList)
      //   return allSlideViewList;
    locationSeachDetailsList = [];
      return $http.get("http://squarable.com/tmp/hss/hss_location_info.xml",{
           transformResponse: function (cnv) {
                    var x2js = new X2JS();
                    var aftCnv = x2js.xml_str2json(cnv);
                    return locationSeachDetailsList = aftCnv;
            }
        })
    },
    getSlideViewForlocal: function(val){
          return {
             content_image :allSlideViewList.hss_app_slider.content_image[val],
             content_link_target :allSlideViewList.hss_app_slider.content_link_target[val],
             content_subtitle :allSlideViewList.hss_app_slider.content_subtitle[val],
             content_text :allSlideViewList.hss_app_slider.content_text[val],
             content_title :allSlideViewList.hss_app_slider.content_title[val],
             cover_image :allSlideViewList.hss_app_slider.cover_image[val],
             cover_image_link_text :allSlideViewList.hss_app_slider.cover_image_link_text[val],
             cover_image_title :allSlideViewList.hss_app_slider.cover_image_title[val]
         }
  },

    getPhysicianslistNotEmpty: function () {
       return allphysicianslist?true:false;
     },
    findUserCurrentlocation:function () {
      return userCurrentlocation;
    },
    getUserCurrentLocation: function (success,error) {
      var posOptions = {timeout: 15000, enableHighAccuracy: false};
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
             userCurrentlocation = position.coords;
             return success(userCurrentlocation);
          }, function(err)  {
            // error
              console.log(err);
              return error(err);

          });
    },

    getPhysicians: function(){
      var returnPhysiciansList=[];
      if(this.getPhysicianslistNotEmpty())
      {
       //if(allphysicianslist['data-set'].record.length > 0)
       if(allphysicianslist.xml.Table.Row.length>0)
        {
          //for(var i=0;i<allphysicianslist['data-set'].record.length;i++)
         for(var i=0;i<allphysicianslist.xml.Table.Row.length;i++)
          {
           var objectValue = allphysicianslist.xml.Table.Row[i];
           objectValue['InsurancesAccepted'] = this.filterPhysiciansInsurance(objectValue);
          returnPhysiciansList.push(objectValue);
         }
       }
      }
      return returnPhysiciansList;
		},

    getPhysiciansFilter: function(searchKey){
      filterphysiciansList=[];
      if(searchKey == "")
      {
        return allphysicianslist.xml.Table.Row;
      }
      for(var i=0;i<allphysicianslist.xml.Table.Row.length;i++)
      {
        var objectValue = allphysicianslist.xml.Table.Row[i];
        var stringFullName = (typeof objectValue.FullName === 'object')?objectValue.FullName.__text.toLowerCase():objectValue.FullName.toLowerCase();
        //objectValue.FullName.toLowerCase();
        if(stringFullName.search(searchKey.toLowerCase())>=0)
        {
          filterphysiciansList.push(objectValue);
        }
      }
      return filterphysiciansList;
    },

    getPhysiciansInsuranceList: function(){
      // if(allphysiciansinsurancelist)
      //   return allphysiciansinsurancelist;
      //https://www.hss.edu/app-physicians-insurance.xml
    	return $http.get("https://www.hss.edu/physician-insurance.xml",{
           transformResponse: function (cnv) {
                    var x2js = new X2JS();
                    var aftCnv = x2js.xml_str2json(cnv);
                    return allphysiciansinsurancelist = aftCnv;
            }
        })
    },

    getPhysiciansInsurance: function(){
      return allphysiciansinsurancelist;
    },

  filterPhysiciansInsurance: function(object){
    var stringInsurance = "";
    if(allphysiciansinsurancelist!=null)
    {
     //for(var i=0;i<allphysiciansinsurancelist.Root.Row.length;i++)
     for(var i=0;i<allphysiciansinsurancelist.xml.Table.Row.length;i++)
     {
      objectInsurance = allphysiciansinsurancelist.xml.Table.Row[i];
      var stringName = (typeof objectInsurance.LastName === 'object')?objectInsurance.LastName.__text.toLowerCase():objectInsurance.LastName.toLowerCase();
      var stringName1 = (typeof object.LastName === 'object')?object.LastName.__text.toLowerCase():object.LastName.toLowerCase();
       if( stringName != null && stringName == stringName1)
       {   stringInsurance  = "";
            for(key in objectInsurance){
                if(key!="LastName" && key!="Department" && key!="Phone")
                {
                    var stringNewAdded = (typeof objectInsurance[key] === 'object')?objectInsurance[key].__text:objectInsurance[key];
                     if(stringInsurance=="")
                         stringInsurance = stringInsurance + stringNewAdded;
                     else if(typeof stringNewAdded != 'undefined' && stringNewAdded.length > 0)
                      stringInsurance = stringInsurance + ", " + stringNewAdded;
                 }
              }
        }
      }
    }
    return stringInsurance;
  },

getPhysiciansInsurancesTypeFilter: function (insurancestype,searchKey,filterPage) {
    if(searchKey!=""){
       returnPhysiciansList =[];
       for(var i=0;i<filterphysiciansinsurancelist.length;i++)
         {
               var objectValue = filterphysiciansinsurancelist[i];
               var stringFullName = (typeof objectValue.FullName === 'object')?objectValue.FullName.__text.toLowerCase():objectValue.FullName.toLowerCase()
               if(stringFullName.search(searchKey.toLowerCase())>=0){
                 returnPhysiciansList.push(objectValue);
               }
         }
         return returnPhysiciansList;
    }
    else if(filterPage=="location")
    {
      var handlephysicianslist = this.getPhysicians();
       filterphysiciansinsurancelist=[];
        for(var i=0;i<handlephysicianslist.length;i++)
          {
                var objectValue = handlephysicianslist[i];
                var stringPractice1= "";
                var stringPractice2= "";
                var stringPractice3= "";
                var stringPractice4= "";
                 stringPractice1= (typeof objectValue.Practice1 === 'object')?(objectValue.Practice1.__text?objectValue.Practice1.__text.toLowerCase():""):(objectValue.Practice1?objectValue.Practice1.toLowerCase():"");
                 stringPractice2= (typeof objectValue.Practice2 === 'object')?(objectValue.Practice2.__text?objectValue.Practice2.__text.toLowerCase():""):(objectValue.Practice2?objectValue.Practice2.toLowerCase():"");
                 stringPractice3= (typeof objectValue.Practice3 === 'object')?(objectValue.Practice3.__text?objectValue.Practice3.__text.toLowerCase():""):(objectValue.Practice3?objectValue.Practice3.toLowerCase():"");
                 stringPractice4= (typeof objectValue.Practice4 === 'object')?(objectValue.Practice4.__text?objectValue.Practice4.__text.toLowerCase():""):(objectValue.Practice4?objectValue.Practice4.toLowerCase():"");

                if(stringPractice1 !="" && stringPractice1.search(insurancestype.toLowerCase())>=0 )
                {
                  filterphysiciansinsurancelist.push(objectValue);
                }
                else if(stringPractice2 !="" && stringPractice2.search(insurancestype.toLowerCase())>=0 ){
                    filterphysiciansinsurancelist.push(objectValue);
                }
                else if(stringPractice3 !="" && stringPractice3.search(insurancestype.toLowerCase())>=0 ){
                      filterphysiciansinsurancelist.push(objectValue);
                  }
               else if(stringPractice4 !="" && stringPractice4.search(insurancestype.toLowerCase())>=0 ){
                        filterphysiciansinsurancelist.push(objectValue);
                }
          }
     return filterphysiciansinsurancelist;
    }
    else if (filterPage=='specialty') {
      var handlephysicianslist = this.getPhysicians();
       filterphysiciansinsurancelist=[];
        for(var i=0;i<handlephysicianslist.length;i++)
          {
                var objectValue = handlephysicianslist[i];
                var stringSpecialty= (typeof objectValue.Specialty === 'object')?(objectValue.Specialty.__text?objectValue.Specialty.__text.toLowerCase():""):(objectValue.Specialty?objectValue.Specialty.toLowerCase():"");
                var stringSubspecialties= (typeof objectValue.Subspecialties === 'object')?(objectValue.Subspecialties.__text?objectValue.Subspecialties.__text.toLowerCase():""):(objectValue.Specialty?objectValue.Subspecialties.toLowerCase():"");
                if(stringSpecialty !="" && stringSpecialty.search(insurancestype.toLowerCase())>=0)
                {
                  filterphysiciansinsurancelist.push(objectValue);
                }
                else if(stringSubspecialties !="" && stringSubspecialties.search(insurancestype.toLowerCase())>=0 ){
                    filterphysiciansinsurancelist.push(objectValue);
                }
           }
     return filterphysiciansinsurancelist;
     }else if (filterPage=='bodyPart') {
       var handlephysicianslist = this.getPhysicians();
        filterphysiciansinsurancelist=[];
         for(var i=0;i<handlephysicianslist.length;i++)
           {
                 var objectValue = handlephysicianslist[i];
                 var stringbodyPartTagAccepted=(typeof objectValue.bodyPartTag === 'object')?(objectValue.bodyPartTag.__text?objectValue.bodyPartTag.__text.toLowerCase():""):(objectValue.bodyPartTag?objectValue.bodyPartTag.toLowerCase():"");
                 var stringSpecialExpertiseAccepted=(typeof objectValue.SpecialExpertise === 'object')?(objectValue.SpecialExpertise.__text?objectValue.SpecialExpertise.__text.toLowerCase():""):(objectValue.SpecialExpertise?objectValue.SpecialExpertise.toLowerCase():"");
                 var isbodypart = insurancestype.split(",");
                 for(var seachpart=0;seachpart<isbodypart.length;seachpart++)
                 {
                    var isExist = false;
                    if(stringbodyPartTagAccepted.search(isbodypart[seachpart].toLowerCase())>=0)
                    {
                      filterphysiciansinsurancelist.push(objectValue);
                      isExist = true;
                    }
                    else if(stringSpecialExpertiseAccepted.search(isbodypart[seachpart].toLowerCase())>=0)
                    {
                      filterphysiciansinsurancelist.push(objectValue);
                      isExist = true;
                    }
                    if(isExist == true)
                     break;
                 }
           }
      return filterphysiciansinsurancelist;
      }

    else {
          var handlephysicianslist = this.getPhysicians();
           filterphysiciansinsurancelist=[];
            for(var i=0;i<handlephysicianslist.length;i++)
              {
                    var objectValue = handlephysicianslist[i];
                    var stringInsurancesAccepted= (typeof objectValue.InsurancesAccepted === 'object')?(objectValue.InsurancesAccepted.__text?objectValue.InsurancesAccepted.__text.toLowerCase():""):(objectValue.bodyPartTag?objectValue.InsurancesAccepted.toLowerCase():"");
                    if(stringInsurancesAccepted.search(insurancestype.toLowerCase())>=0){
                      filterphysiciansinsurancelist.push(objectValue);
                    }
              }
         return filterphysiciansinsurancelist;
       }
  },
getLocationSearchlist : function () {
   return locationSeachDetailsList;
 },
 getLocationSearchName: function(){
   var returnArrayVlaue = [];
    if(locationSeachDetailsList != null){
     for(var i=0;i<locationSeachDetailsList.hss_location_info.Location.length;i++)
       {
         var locationtype = locationSeachDetailsList.hss_location_info.Location[i].LocationType;
         if(returnArrayVlaue.indexOf(locationtype)< 0)
          {
            returnArrayVlaue.push(locationtype);
          }
       }
    }
   return returnArrayVlaue;
 },
getLocationSearchFilter : function (filtertext) {
     var filterlocationsearchlist = locationSeachDetailsList;
     var returnArrayVlaue = [];
     for(var i=0;i<filterlocationsearchlist.hss_location_info.Location.length;i++){
           var objectValue = filterlocationsearchlist.hss_location_info.Location[i];
           var stringlocationtype= (typeof objectValue.LocationType === 'object')?(objectValue.LocationType.__text?objectValue.LocationType.__text.toLowerCase():""):(objectValue.LocationType?objectValue.LocationType.toLowerCase():"");
           if(stringlocationtype !="" && stringlocationtype.search(filtertext.toLowerCase())>=0 ){
            returnArrayVlaue.push({name:objectValue.Name,objectValue:objectValue,distance:"",locationtype:null});
          }
      }
    return returnArrayVlaue;
  }
 }
})
