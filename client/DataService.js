angular.module('App').factory('DataService', ['$http','$location', function($http, $location){

  var data=[];
  var sorted=[];
  var sortedObject={};
  var templatesObject={};

  var donorObject = {
   donors:[{
      AccountId: "001d000000K2KKAAA3",
      Amount: 200,
      CloseDate: "2016-08-22",
      Id: "006d000000r6cKWAAY",
      Name:"Test",
      Primary_Contact__c:"003d000000V8J9gAAF",
      address:{
       city: "Monrovia",
       country:"Liberia",
       countryCode:null,
       geocodeAccuracy:null,
       latitude:null,
       longitude:null,
       postalCode:null,
       state:null,
       stateCode:null,
       street:"N&N Corporation",
      },
      date:"08-22-2016",
      donationHistory: {
       lifeTimeAmount:635,
       lifeTimeNumber:2
      },
      email:"dosawea@yahoo.com",
      firstName:"Christian",
      formalGreeting:"Christian Neufville",
      householdId:"a00d0000007j6fAAAQ",
      informalGreeting:"Christian",
      lastName:"Neufville",
      npe01__Contact_Id_for_Role__c:"003d000000V8J9gAAF",
      npe01__Is_Opp_From_Individual__c:"true",
      personName:"Neufville Household",
      phone:"No phone number found",
      },
      {
      AccountId:"001d0000025MIlJAAW",
      Amount:300,
      CloseDate:"2016-08-22",
      Id:"006d000000r6efMAAQ",
      Name:"Trent Test 8/22/16",
      Primary_Contact__c:"003d0000037X5z3AAC",
      address:{
      city:  "Notreal",
      country:"US",
      countryCode:null,
      geocodeAccuracy:null,
      latitude:null,
      longitude:null,
      postalCode:"55444",
      state:"MT",
      stateCode:null,
      street:"123 fake st."
      },
      date:"08-22-2016",
      donationHistory:{
       lifeTimeAmount:1100,
       lifeTimeNumber:2
      },
      email:"trent@fake.net",
      firstName:"Trent",
      formalGreeting:"Mr. Trent Johnson",
      householdId:"a00d000000mOdmgAAC",
      informalGreeting:"Trent",
      lastName:"Johnson",
      npe01__Contact_Id_for_Role__c:"003d0000037X5z3AAC",
      npe01__Is_Opp_From_Individual__c:"true",
      personName:"Johnson Household",
      phone:"(555) 555-3333"
      },
      {
      AccountId:"001d0000025MImRAAW",
      Amount:1234,
      CloseDate:"2016-08-22",
      Id:"006d000000r6ehSAAQ",
      Name:"Jonanthon Wilson- Donation 8/22/2016",
      Primary_Contact__c:"003d0000037X61sAAC",
      address:{
      city:"real",
      country:null,
      countryCode:null,
      geocodeAccuracy:null,
      latitude:null,
      longitude:null,
      postalCode:55707,
      state:"MN",
      stateCode:null,
      street:"74382 idk ave"
      },
      date:"08-22-2016",
      donationHistory:{
      lifeTimeAmount:11110,
      lifeTimeNumber:2
      },
      email:"jon@prime.io",
      firstName:"Jonanthon",
      formalGreeting:"Mr. Jonanthon and Mrs. Wife Wilson",
      householdId:"a00d000000mOdn5AAC",
      informalGreeting:"Jonanthon and Wife",
      lastName:"Wilson",
      npe01__Contact_Id_for_Role__c:"003d0000037X61sAAC",
      npe01__Is_Opp_From_Individual__c:"true",
      personName:"Wilson Household",
      phone:"(651) 444-4444"
         }]
       }

function checkDone(){
  $location.path('/home');
  // $http.get('/salesforce/done').then(success, failure);
}
function success(res){
  getData();
}
function failure(res){
  checkDone();
}

  // function getDonors(){
  //   $http.get('/salesforce/oauth2/auth').then(getData, handleFailure);
  // }
  function getData(){
    $http.get('/salesforce/data').then(handleSuccess, handleFailure);
  }

  function handleSuccess(res){
      console.log(res);
      data=res.data;
      // if(data[0].length===data[3].length){
        sortData(data);
        preconvertDates();
        convertDates();
        $location.path('/home');
      // }
      // else{
        // getData();
      // }
  }
  function handleFailure(res){
    console.log('fail', res);
  }
  function preconvertDates(){
    for (var i=0; i<sortedObject.sorted.length; i++){
    var dateArray = sortedObject.sorted[i].CloseDate.split('-');
    sortedObject.sorted[i].date = dateArray[1]+'-'+dateArray[2]+'-'+dateArray[0];
    }
  }

function convertDates(){
    for (var i = 0; i < sortedObject.sorted.length; i++){
      sortedObject.sorted[i].convertedDate = new Date(sortedObject.sorted[i].date);
    }
}
function sortData(data){
  for (var i=0; i<data[0].length; i++){
    sorted.push(data[0][i]);
  }
  findHouseholdId();
  findNextKeys();
}

function findHouseholdId(){
  for(var i=0; i<sorted.length; i++){
    for(var j=0; j<data[1].length; j++){
      if(sorted[i].Primary_Contact__c == data[1][j].Id){
        sorted[i].householdId= data[1][j].npo02__Household__c;
        break;
      }
    }
  }
}
function findNextKeys(){
  for(var i=0; i<sorted.length; i++){
    sorted[i].email=findEmail(sorted[i]);
    sorted[i].address=findAddress(sorted[i]);
    sorted[i].formalGreeting=findFormalGreeting(sorted[i]);
    sorted[i].informalGreeting=findInformalGreeting(sorted[i]);
    sorted[i].personName=findName(sorted[i]);
    sorted[i].phone=findPhone(sorted[i]);
    sorted[i].donationHistory=findDonationHistory(sorted[i]);
    sorted[i].firstName=findFirstName(sorted[i]);
    sorted[i].lastName=findLastName(sorted[i]);
  }
  console.log(sorted);
}
function findEmail(donationObject){
  var email="";
  for(var i=0; i<data[3].length; i++){
    if(donationObject.householdId==data[3][i].Id && data[3][i].npo02__HouseholdEmail__c != null){
      return data[3][i].npo02__HouseholdEmail__c;
    }
  }
  for (var i=0; i<data[1].length; i++){
    if(donationObject.Primary_Contact__c == data[1][i].Id && data[1][i].Email != null){
      return data[1][i].Email;
    }
  }
  for (var i=0; i<data[2].length; i++){
    if(donationObject.AccountId == data[2][i].Id && data[2][i].Organization_Email__c != null){
      return data[2][i].Organization_Email__c;
    }
  }
  return "no email found";
}
function findAddress(donationObject){
  if(donationObject.npe01__Is_Opp_From_Individual__c === "true"){
    for(var i=0; i<data[1].length; i++){
      if(donationObject.Primary_Contact__c == data[1][i].Id  && data[1][i].MailingAddress != null){
        return data[1][i].MailingAddress;
      }
    }
    for(var i=0; i<data[3].length; i++){
      if(donationObject.householdId == data[3][i].Id  && data[3][i].npo02__Formula_MailingAddress__c != null){
        return data[3][i].npo02__Formula_MailingAddress__c;
      }
    }
  }
  else{
    for(var i=0; i<data[2].length; i++){
      if(donationObject.AccountId == data[2][i].Id && data[2][i].BillingAddress != null){
        return data[2][i].BillingAddress
      }
    }
  }
  return "no address found";
}
function findFormalGreeting(donationObject){
  if(donationObject.npe01__Is_Opp_From_Individual__c === "true"){
    for(var i=0; i<data[3].length; i++){
      if(donationObject.householdId == data[3][i].Id && data[3][i].npo02__Formal_Greeting__c != null){
        return data[3][i].npo02__Formal_Greeting__c;
      }
    }
    for(var i=0; i<data[1].length; i++){
      if(donationObject.Primary_Contact__c == data[1][i].Id && data[1][i].name != null && data[1][i].Saluation != null){
        return data[1][i].Saluation + data[1][i].Name;
      }
      else if(donationObject.Primary_Contact__c == data[1][i].Id && data[1][i].name != null){
        return data[1][i].Name;
      }
    }
  }
  else{
    for(var i=0; i<data[1].length; i++){
      if(donationObject.Primary_Contact__c == data[1][i].Id && data[1][i].Name != null && data[1][i].Saluation != null){
        return data[1][i].Saluation + data[1][i].Name;
      }
      else if(donationObject.Primary_Contact__c == data[1][i].Id && data[1][i].Name != null){
        return data[1][i].Name;
      }
    }
    for(var i=0; i<data[2].length; i++){
      if(donationObject.AccountId == data[2][i].Id && data[2][i].Name != null && data[2][i].Formal_Salutation__c !=null){
        return data[2][i].Formal_Salutation__c + data[2][i].Name;
      }
      else if(donationObject.AccountId == data[2][i].Id && data[2][i].Name != null){
        return data[2][i].Name;
      }
    }
  }
  return "no Formal Greeting found";
}
function findInformalGreeting(donationObject){
  if(donationObject.npe01__Is_Opp_From_Individual__c === "true"){
    for(var i=0; i<data[3].length; i++){
      if(donationObject.householdId == data[3][i].Id && data[3][i].npo02__Informal_Greeting__c != null){
        return data[3][i].npo02__Informal_Greeting__c;
      }
    }
    for(var i=0; i<data[2].length; i++){
      if(donationObject.AccountId == data[2][i].Id && data[2][i].Informal_Greeting__c != null){
        return data[2][i].Informal_Greeting__c;
      }
    }
    for(var i=0; i<data[1].length; i++){
      if(donationObject.Primary_Contact__c == data[1][i].Id && data[1][1].Greeting__c != null){
        return data[2][i].Greeting__c;
      }
    }
  }
  else{
    for(var i=0; i<data[2].length; i++){
      if(donationObject.AccountId == data[2][i].Id && data[2][i].Informal_Greeting__c != null){
        return data[2][i].Informal_Greeting__c;
      }
    }
    for(var i=0; i<data[1].length; i++){
      if(donationObject.Primary_Contact__c == data[1][i].Id && data[1][i].Greeting__c != null){
        return data[1][i].Greeting__c;
      }
    }
  }
  return "no informal Greeting found";
}
function findName(donorObject){
  if(donorObject.npe01__Is_Opp_From_Individual__c === 'true'){
    for(var i = 0; i < data[3].length; i++){
      if(donorObject.householdId == data[3][i].Id){
        return data[3][i].Name;
      }
    }
    for(var j = 0; j < data[1].length; j++){
      if(donorObject.Primary_Contact__c == data[1][j].Id){
        return data[1][j].Name;
      }
    }
  }
  else{
    for(var j = 0; j < data[1].length; j++){
      if(donorObject.Primary_Contact__c == data[1][j].Id){
        return data[1][j].Name;
      }
    }
    for(var k = 0; k < data[2].length; k++){
      if(donorObject.AccountId == data[2][k].Id){
        return data[2][k].Name;
      }
    }
  }
  return 'No Name Found';
}

function findPhone(donorObject){
  if(donorObject.npe01__Is_Opp_From_Individual__c === 'true'){
    for(var i = 0; i < data[3].length; i++){
      if(donorObject.householdId == data[3][i].Id){
        if(data[3][i].npo02__HouseholdPhone__c !== null){
          return data[3][i].npo02__HouseholdPhone__c;
        }
        else{
          break;
        }
      }
    }
    for(var j = 0; j < data[1].length; j++){
      if(donorObject.Primary_Contact__c == data[1][j].Id){
        if(data[1][j].Phone !== null){
          return data[1][j].Phone;
        }
        else{
          break
        }
      }
    }
  }
  else {
    for(var k = 0; k < data[2].length; k++){
      if(donorObject.AccountId == data[2][k].Id){
        if(data[2][k].Phone !== null){
          return data[2][k].Phone;
        }
        else{
          break;
        }
      }
    }
    for(var l = 0; l < data[1].length; l++){
      if(donorObject.Primary_Contact__c == data[1][l].Id){
        if(data[1][l].Phone !== null){
          return data[1][l].Phone;
        }
        else{
        return 'No phone number found';
        }
      }
    }

  }
      return 'No phone number found';
}

function findDonationHistory(donorObject){
  for(var i=0; i < data[2].length; i++){
    var donationHistory = {};
    if(donorObject.AccountId == data[2][i].Id && data[2][i].BillingAddress != null){
      donationHistory.lifeTimeAmount = data[2][i].npe01__LifetimeDonationHistory_Amount__c;
      donationHistory.lifeTimeNumber = data[2][i].npe01__LifetimeDonationHistory_Number__c;
      return donationHistory;
    }
  }
  return 'No donation history found';
}
function findFirstName(donationObject){
  for(var i=0; i<data[1].length; i++){
    if(donationObject.Primary_Contact__c == data[1][i].Id){
      var names = data[1][i].Name.split(' ');
      return names[0];
    }
  }
}
function findLastName(donationObject){
  for(var i=0; i<data[1].length; i++){
    if(donationObject.Primary_Contact__c == data[1][i].Id){
      var names = data[1][i].Name.split(' ');
      return names[1];
    }
  }
}
sortedObject.sorted = sorted;
// preconvertDates();
// convertDates();
function createTemplate(){
  var sendData={};
  $http.post('/template/addtemplates', sendData).then(handletemplatesuccess, handletemplatefailure);
}
// function handletemplatesuccess(res){
//   console.log('Template created');
// }
// function handletemplatefailure(res){
//   console.log('template create failed');
// }
// createTemplate();
var templatesArray=[];
function getTemplates(){
  $http.get('/template/getTemplates').then(getTemplateSuccess, getTemplateFailure);
}
function getTemplateSuccess(res){
  console.log('templates', res);
  templatesArray= res.data;
  console.log(templatesArray);
  templatesObject.template1=templatesArray[0];
  templatesObject.template2=templatesArray[1];
  templatesObject.template3=templatesArray[2];
  templatesObject.template4=templatesArray[3];
  templatesObject.template5=templatesArray[4];
  $location.path('/home');
}
function getTemplateFailure(res){
  console.log('template retrieval failure');
}


  return {
    preconvertDates: preconvertDates,
    convertDates: convertDates,
    sortedObject: sortedObject,
    // getDonors: getDonors,
    getData: getData,
    donorObject: donorObject,
    checkDone: checkDone,
    templatesObject: templatesObject,
    getTemplates: getTemplates
  };
}]);
