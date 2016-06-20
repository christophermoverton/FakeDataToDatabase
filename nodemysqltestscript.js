/*var db = require('node-mysql');
var box = new DB({
    host     : 'Christopher',
    user     : 'ringlesp',
    password : '',
    database : 'PayrollSystem'
});
"Employee", "empid", 
                           "INTEGER not NULL", 
                           "deptid", "INTEGER not NULL", "jobid", "INTEGER not NULL", 
                           "typeid","INTEGER not NULL", "catid", "INTEGER not NULL", 
			   "lastname","VARCHAR(255)", "firstname",
			   "VARCHAR(255)","minit","VARCHAR(1)",
			   "ssn","INTEGER", "dob","DATE", "gender",
			   "VARCHAR(1)", "marital","BOOLEAN",
                           "address1","VARCHAR(255)",
			   "address2","VARCHAR(255)",
			   "city","VARCHAR(255)", "state","VARCHAR(2)",
			   "zipcode","SMALLINT", "country","VARCHAR(255)",
                           "email","VARCHAR(255)", "webpage","VARCHAR(255)",
			   "homephone","SMALLINT", "officephone","SMALLINT",
			   "cellphone","SMALLINT", "regularhours","SMALLINT",
			   "login","VARCHAR(255)", "password","VARCHAR(255)",
			   "admin","BOOLEAN", "superadmin","BOOLEAN",
			   "numlogins","INTEGER", "lastlogindate", "DATE",
			   "loginip", "VARCHAR(255)", "datesignup","DATE",
			   "dateupdated","DATE", "active", "BOOLEAN"},


*/
function revDate(datestr){
  var datepart = datestr.toLocaleDateString().split("/");
  var bdstr = '';
  bdstr += datepart[2];
  
  if (datepart[0].length == 1){
     bdstr += '-0' + datepart[0];
  }
  else{
     bdstr += '-'+datepart[0];
  }
  bdstr += '-'+datepart[1];
  return bdstr;
}

function sqltime(datestr){
   return datestr.toTimeString().split(" ")[0];
}

function sqldatetime(datestr){
   //'2008-01-01 00:00:01'
   var cdate = revDate(datestr);
   var timestr = sqltime(datestr);
   return cdate + " " + timestr;
}

function timeDiff(time1, time2){
   var one_day=1000*60*60*24;
   var time1_ms = time1.getTime();
   var time2_ms = time2.getTime();
   var difference_ms = time1_ms - time2_ms;
   var age = Math.round(Math.round(difference_ms/one_day)/365.25);
   return age;
}

function timeDiff2(time1, time2){
   var one_day=1000*60*60*24;
   var time1_ms = time1.getTime();
   var time2_ms = time2.getTime();
   var difference_ms = time1_ms - time2_ms;
   var age = Math.round(Math.round(difference_ms/one_day));
   return age;
}

function timeDiff3(time1, time2){
   var time1_ms = time1.getTime();
   var time2_ms = time2.getTime();
   var difference_ms = time1_ms - time2_ms;
   //var age = Math.round(Math.round(difference_ms/one_day));
   return difference_ms;
}

function boolval(boolv){
   if (boolv){
      return "TRUE";
   }
   else{
      return "FALSE";
   }
}

var mysql = require('mysql');
var faker = require('faker');
var Faker = require('Faker');
var ssn = require('ssn');
var Chance = require('chance');
var chance = new Chance();
var count = 30;
var empnumber = count;
var maxJobids = 400;
var i;
var arr = [];
for(i = 0; i < count; i++){
   var fDat = {};
   //fDat['firstname'] = faker.name.firstName();
   fDat['lastname'] = faker.name.lastName();
   fDat['address1'] = faker.address.streetAddress();
   fDat['city'] = faker.address.city();
   fDat['state'] = faker.address.stateAbbr();
   fDat['zipcode'] = faker.address.zipCode().slice(0,5);
   fDat['email'] = faker.internet.email();
   fDat['homephone'] = faker.phone.phoneNumberFormat();
   fDat['officephone'] = faker.phone.phoneNumber();
   fDat['cellphone'] = faker.phone.phoneNumberFormat();
   fDat['regularhours'] = 40;
   fDat['login'] = faker.internet.userName();
   fDat['password'] = faker.internet.password();
   var year = chance.year({min: 1953, max:1998});
   var bday = chance.birthday({year:year});
   /*
   var bdays = bday.toLocaleDateString().split("/");
   var bdstr = '';
   bdstr += bdays[2];
   bdstr += '-'+bdays[1]+'-';
   if (bdays[0].length == 1){
     bdstr += '0' + bdays[0];
   }
   else{
     bdstr += bdays[0];
   }*/
   fDat['dob'] = revDate(bday);
   var cday = new Date();
   var one_day=1000*60*60*24;
   var bday_ms = bday.getTime();
   var cday_ms = cday.getTime();
   var difference_ms = cday_ms - bday_ms;
   var age = Math.round(Math.round(difference_ms/one_day)/365.25);
   var diff18 = age-18.0;
   console.log(diff18);
   var gender = chance.gender();
   if (gender == 'Female'){
      fDat['gender'] = 'F';
      fDat['firstname'] = chance.first({gender: 'Female'});
   }
   else{
      fDat['gender'] = 'M';
      fDat['firstname'] = chance.first({gender: 'Male'});
   }
   fDat['minit'] = chance.character();
  
   fDat['admin'] = boolval(faker.random.boolean());
   fDat['superadmin'] =  boolval(faker.random.boolean());
   var startdate = new Date();
   var startdate2 = startdate;
   if (diff18 > 0){
      var year2 = chance.year({min: 2016-diff18, max:2016});
      startdate = chance.date({year: year2});      
   }
   console.log(startdate);
   fDat['datesignup'] = revDate(startdate);
   fDat['datesignup2'] = startdate;
   var lastsignupdate = startdate2
   if (startdate != startdate2){
      var timediff2 = timeDiff(startdate2, startdate);
      var year3 = chance.year({min: 2016-timediff2, max:2016});
      lastsignupdate = chance.date({year:year3});
   }
   //console.log(lastsignupdate);
   fDat['lastsignupdate'] = revDate(lastsignupdate);
   if (chance.normal() > .8){
      fDat['active'] = boolval(false);
   }
   else{
      fDat['active'] = boolval(true);
   }
   fDat['webpage'] = faker.internet.domainName();
   fDat['numlogins'] = chance.integer({min: 0, max: 4000});
   if (chance.normal() < .35){
      fDat['marital'] = boolval(true);
   }
   else{
      fDat['marital'] = boolval(false);
   }
   fDat['ssn'] = chance.ssn({dashes:false});
   fDat['deptid'] = chance.integer({min:1, max:40});
   fDat['typeid'] = chance.integer({min:1, max:200});
   fDat['jobid'] = chance.integer({min:1, max:maxJobids});
   fDat['catid'] = chance.integer({min:1001, max: 2002});
   arr.push(fDat);
}
/*
	      new String[]{"Messages","Imid","INTEGER not NULL AUTO_INCREMENT",
                           "empid","INTEGER",
			   "message", "MEDIUMTEXT", "postedby", "VARCHAR(255)",
			   "dateposted", "DATE", "numviews", "INTEGER", 
			   "active", "BOOLEAN"}
*/
var arr2 = [];
//generate messages
for(i = 0; i < chance.integer({min:20, max:100}); i++){
    var fDat = {}; //generating message dat
    fDat['empid'] = chance.integer({min:1, max: (count-1)});
    fDat['message'] = faker.lorem.paragraph();
    fDat['postedby'] = arr[fDat['empid']]['email'];
    var startdate = new Date();
    var startdate2 = startdate;
    startdate = arr[fDat['empid']]['datesignup2'];
    var dateposted = startdate2;
    if (startdate != startdate2){
      var timediff2 = timeDiff(startdate2, startdate);
      var year3 = chance.year({min: 2016-timediff2, max:2016});
      dateposted = chance.date({year:year3});
    }
    fDat['dateposted'] = revDate(dateposted);
    fDat['numviews'] = chance.integer({min:1, max:100});
    if (chance.normal() > .8){
      fDat['active'] = boolval(false);
    }
    else{
      fDat['active'] = boolval(true);
    }
    arr2.push(fDat);
}
/*
              new String[]{"Locks","lockid", "INTEGER not NULL AUTO_INCREMENT", 
                           "empid", "INTEGER", 
			   "datelock", "DATE", "reasonlock", "VARCHAR(2)",
			   "active", "BOOLEAN"},
*/

var arr3 = [];
var empSalaryDat = {};
for(i = 0; i<arr.length; i++){
   var startdate = arr[i]['datesignup2'];
   var startdate2 = new Date();
   var payrolllocks = 24.0*timeDiff(startdate2, startdate);
   var j;
   var datelock = startdate2;
   var fulltime = 'TRUE';
   var fulltime2 = true; 
   if (!chance.bool()){
      var fulltime = 'FALSE';
      var fulltime2 = false;
   }
   
   var hourlypay = chance.float({min: 12.0000, max: 30.0000});
   empSalaryDat[i] = {fulltime: fulltime, fulltime2: fulltime2, 
                            hourlypay: hourlypay};
   for (j = 0; j<payrolllocks; j++){
      var fDat = {};
      var datelock = new Date(datelock);
      fDat['prevdatelock'] = datelock;
      fDat['fulltime'] = fulltime;
      fDat['fulltime2'] = fulltime2;
      if (j == 0){
         if (datelock.getDate() < 15){
            datelock.setDate(15);
         }
         else{
            datelock.setMonth(datelock.getMonth()+1);
            datelock.setDate(1);
         }
      }
      else{
         if (datelock.getDate() == 1){
             datelock.setDate(15);
         }
         else{
             datelock.setMonth(datelock.getMonth()+1);
             datelock.setDate(1);
         }
      }
      fDat['datelock'] = datelock;
      fDat['reasonlock'] = chance.word({length:2});
      fDat['active'] = 'FALSE';
      arr3.push(fDat);
   }
}

/*
	      new String[]{"Payroll", "payrollid", "INTEGER not NULL AUTO_INCREMENT", 
			   "empid", "INTEGER", "date", "DATE", "startday", 
			   "DATE", "endday", "DATE", "hoursworked", "FLOAT", 
			   "grosspay", "DECIMAL(19,4)", "deductions", 
			   "DECIMAL(19,4)", "netpay", "DECIMAL(19,4)"},
*/

var arr4 = [];

for (r in arr3){
   fDat = {};
   var startdate = r['prevdatelock'];
   var endday = new Date(r['datelock']);
   endday.setDate(endday.getDate()-1);
   fDat['date'] = new Date(r['datelock']);
   fDat['hourlypay'] = chance.float({min: 12.0000, max: 30.0000});
   var hoursworked = 10.0;
   if (r['fulltime2']){
      hoursworked = 40.0;
      if (chance.normal() > .75){
          hoursworked += chance.float({min: 0, max: 20});
      }
   }
   else{
      hoursworked = 20.0;
      hoursworked += chance.float({min: 0, max: 10});    
   }
   fDat['hoursworked'] = hoursworked;
   var grosspay = hoursworked*fDat['hourlypay'];
   var deduction = grosspay*.025;
   var taxes = grosspay*.12;
   var netpay = grosspay - deduction -taxes;
   fDat['grosspay'] = grosspay;
   fDat['deductions'] = deduction;
   fDat['taxes'] = taxes;
   fDat['netpay'] = netpay;
   arr4.push(fDat);
}

/*
              new String[]{"Salary","salaryid", "INTEGER not NULL AUTO_INCREMENT", 
			   "empid", "INTEGER", "hourlyrate", "DECIMAL(19,4)",
			   "note" , "VARCHAR(255)"},
*/

arr5 = [];
for (r in empSalaryDat){
   fDat = {};
   var empDat = empSalaryDat[r];
   fDat['empid'] = r;
   fDat['hourlyrate'] = empDat['hourlyrate'];
   fDat['note'] = "";
   arr5.push(fDat);
}

/*
	      new String[]{"Jobtitle", "jobid", "INTEGER not NULL", 
                           "jobtitle", "VARCHAR(255)", "jobdesc", "VARCHAR(255)"}, 
*/
arr6 = [];
for (i = 1; i < maxJobids; i++){
   fDat = {};
   fDat['jobtitle'] = faker.lorem.word();
   fDat['jobdesc'] = faker.lorem.words();
   fDat['jobid'] = i;
   arr6.push(fDat);
}

/*
	      new String[]{"Emppicture", "picid", "INTEGER not NULL", "linkid", 
			   "INTEGER", "type", "VARCHAR(10)", "filename", 
			   "VARCHAR(255)", "filesize", "INTEGER", 
			   "picture", "VARCHAR(255)"},
*/
arr7 = [];
var emps = chance.unique(chance.integer, empnumber);
var lemps = chance.unique(chance.integer, empnumber);
var imagetypes = new Set(["JPEG", "GIF", "PNG", "TIFF", "BMP"]);
for (empID in empSalaryDat){
   fDat = {};
   fDat['picid'] = emps[empID];
   fDat['linkid'] = lemps[empID];
   fDat['type'] = "JPEG";
   fDat['filesize'] = 4291;
   fDat['picture'] = faker.image.avatar();
   fDat['filename'] = faker.lorem.words();
   arr7.push(fDat);
}

/*
	      new String[]{"EmpCategory", "empid", "INTEGER", "catname", 
			   "VARCHAR(255)", "catdesc", "VARCHAR(255)", 
			   "miscnote", "VARCHAR(255)"},
*/
arr8 = [];
var categories = new Set();
var catdesc = [];
for (i = 0; i<8; i++){
   categories.add(faker.lorem.word());
   catdesc.push(faker.lorem.words());
}
categories = Array.from(categories);
for(empID in empSalaryDat){
   fDat = {};
   fDat['empid'] = empID;
   var id = chance.integer({min:1, max: categories.size});
   fDat['catname'] = categories[id];
   fDat['catdesc'] = catdesc[id];
   fDat['miscnote'] = "";
   arr8.push(fDat);
}

/*
              new String[]{"EmployeeType", "typeid", "INTEGER", "typename", 
			   "VARCHAR(255)", "typedesc", "VARCHAR(255)",
			   "miscnote", "VARCHAR(255)"},
*/

arr9 = [];
etypes ={executive:.03, middlemanager: .03, frontlinemanager: .2, 
         regular: .74};
etypesarr = ['executive', 'middlemanager', 'frontlinemanager', 'regular'];
i = 0;
for (etype in etypesarr){
   fDat = {};
   fDat['typeid'] = i;
   fDat['typename'] = etype;
   fDat['typedesc'] = "";
   fDat['miscnote'] = "";
   arr9.push(fDat);
   i++;
}
/*
new String[]{"IpTable","ipid", "INTEGER AUTO_INCREMENT", "type", 
			   "VARCHAR(20)", "linkid", "INTEGER", "ipaddress", 
			   "VARCHAR(255)", "note", "VARCHAR(255)"},
*/

arr10 = [];
iptabletypes = ["OUTPUT ACCEPT", "FORWARD ACCEPT",
                "INPUT DROP", "OUTPUT DROP", "FORWARD DROP"];
i=0;
while(i < empnumber){
   fDat = {};
   fDat['type'] = (chance.normal()>.96)?"INPUT ACCEPT":iptabletypes[chance.integer({min:0, max:4})];
   fDat['linkid'] = i+1;
   fDat['ipaddress'] = faker.internet.ip();
   fDat['note'] = "";
   arr10.push(fDat);
   i++;
}
/*
              new String[]{"Department", "deptid", "INTEGER", "managerid", 
			   "INTEGER", "deptparentid", "INTEGER", "deptname",
			   "VARCHAR(255)", "location", "VARCHAR(255)",
			   "deptdesc", "VARCHAR(255)", "mandaworkdesc", 
			   "VARCHAR(255)", "messaging", "VARCHAR(255)"},
*/

arr11 = [];
i=0;
var empdeptdensity = chance.floating({min:.05, max: .10});
var deptnums = Math.round(empnumber*empdeptdensity);
var treelevels = chance.integer({min:2, max:9});
var cent = 1.0;
var levels = [];
for (i = 0; i < treelevels; i++){
  if (i==0){
    levels[0] = cent*chance.floating({min:.6, max:.85});
    cent -= levels[0];
  }
  else{
    levels[i] = cent*chance.floating({min:.3, max:.65});
    cent -= levels[i];
  }
}
var tlevels = [];
var tlevels2 = [];
var tlevels3 = [];
for (i=0; i<treelevels; i++){
   tlevels.push(Math.round(levels[i]*deptnums));
   tlevels2.push(Math.round(levels[i]*deptnums));
   if (tlevels2[i]==0.0){tlevels2[i]=1; tlevels[i]=1;}
   if (i > 0){
      tlevels[i] += tlevels[i-1];
      tlevels3.push(Math.floor(tlevels2[i-1]/tlevels2[i])); 
   }
}

var pruferseq = [];
i=0;
var j = 0;
var modv = Math.floor(tlevels3[0]);
var sval = Math.floor(tlevels[0]);
var mink=0
var k;
/*
console.log(deptnums);
console.log(treelevels);
console.log(tlevels);
console.log(tlevels2);
console.log(tlevels3);
*/
var deptmax = 0;
while(i<deptnums){
  if (i<tlevels[j]-1){
     if (j>=(tlevels3.length-1)){
        i++;
        continue;
     }
     k = i-mink;
     if (k%modv==0 && k!=0){
        sval += 1;
        if(sval != 0){deptmax = sval;}
     }
  }
  else{
     j++;
     sval = Math.floor(tlevels[j]);
     if (j>=tlevels3.length-1){
        sval = 0;
     }
     modv = Math.floor(tlevels3[j]);
     mink = Math.floor(tlevels3[j-1]);
     
  }
  pruferseq.push(sval);
  i++;
}
console.log(pruferseq);
i = 0;
eSet = new Set();
for(v of pruferseq){
   var check = false;
   while(!check){
      var eID = chance.integer({min:1, max:empnumber});
      if (!eSet.has(eID)){eSet.add(eID); break;}
   }
}
eSet = Array.from(eSet);
for (eID of eSet){
   fDat = {};
   fDat['deptid'] = i+1;
   fDat['deptparentid'] = pruferseq[i];
   fDat['managerid'] = eSet[pruferseq[i]];
   fDat['deptname'] = faker.lorem.word();
   fDat['location'] = faker.lorem.word();
   fDat['deptdesc'] = faker.lorem.words();
   fDat['mandaworkdesc'] = faker.lorem.words();
   fDat['messaging'] = "";
   arr11.push(fDat);
   i++;
}

/*
	      new String[]{"DeptEvents", "eventid", "INTEGER AUTO_INCREMENT", 
                           "deptid", "INTEGER", 
                           "eventdate", "DATE", "eventtime", 
			   "TIME", "eventbody", "VARCHAR(255)", "postedby", 
			   "VARCHAR(255)", "dateposted", "DATE", "expirydate", 
			   "DATE", "active", "BOOLEAN"},
*/

var events = chance.integer({min:1, max:200});
var eDeptIDs = [];
i=0;
var arr12 = [];
while(i<events){
   fDat = {};
   
   var edid = chance.integer({min:1, max: deptnums});
   fDat['deptid'] = edid;
   //if (!eDeptIDs.has(edid)){eDeptIDs.add(edid); i++;}
   eDeptIDs.push(edid);
   var eyear = chance.year({min:1970, max: 2016});
   var edate = chance.date({year:eyear});
   
   var etime = sqltime(edate);
   var edate2 = revDate(edate);
   fDat['eventdate'] = edate2;
   fDat['eventtime'] = etime;
   fDat['eventbody'] = faker.lorem.word();
   fDat['postedby'] = faker.lorem.word();
   var edate3 = new Date(edate).setDate(edate.getDate()-chance.integer({min:1, max:5}));
   var edate4 = revDate(edate3);
   fDat['dateposted'] = edate4;
   var edate5 = new Date(edate).setDate(edate.getDate()+chance.integer({min:1, max:5}));
   fDat['expirydate'] = revDate(edate5);
   fDat['active'] = 'FALSE';
   arr12.push(fDat);
   i++;
}

/*
              new String[]{"Bonus", "bonusid", "INTEGER AUTO_INCREMENT",
                           "empid", "INTEGER", 
			   "datebonus", "DATE", "bonuspayment", "DECIMAL(19,4)",
			   "note", "VARCHAR(255)"}, 
*/

arr13 = [];
var nBonus = chance.integer({min: 1, max:empnumber*6});
i=0;
while(i<nBonus){
   fDat={};
   var eid = = chance.integer({min:1, max: empnumber});
   fDat['empid'] = eid;
   var minYear = arr[eid]['datesignup2'].getYear();
   var byear = chance.year({min:minYear, max: 2016});
   var bdate = chance.date({year:byear});
   fDat['datebonus2'] = bdate;
   fDat['datebonus'] = revDate(bdate);
   var bpmt = chance.floating({min: 300.00, max: 6000.00});
   fDat['bonuspayment'] = bpmt;
   fDat['note'] = "";
   arr13.push(fDat);
   i++;
}

//eDeptIDs = Array.from(eDeptIDs);
/*
	      new String[]{"Project","projectid", "INTEGER", "deptid", "INTEGER", 
			   "projecttitle", "VARCHAR(255)", "projectdesc", 
			   "VARCHAR(255)", "hoursworked", "FLOAT", "active", 
			   "BOOLEAN"},
*/
arr14=[];
var projectN = chance.integer({min:empnumber*.5, max:empnumber*3});
i=0;
while(i<projectN){
   fDat={};
   var deptId = chance.integer({min:1, max:deptnums});
   fDat['projectid']=deptID;
   fDat['deptid']=deptId;
   fDat['projecttitle'] = faker.lorem.word();
   fDat['projectdesc'] = faker.lorem.words();
   fDat['hoursworked'] = chance.float({min:.1, max:1000});
   fDat['active'] = "FALSE";
   arr14.push(fDat);
   i++;
}

/*
	      new String[]{"Timesheet","timeid", "INTEGER AUTO_INCREMENT",
                            "empid", "INTEGER",
			   "projectid", "INTEGER", "checkin", 
                           "TIMESTAMP DEFAULT '1970-01-01 00:00:01'", 
			   "checkout", 
                           "TIMESTAMP DEFAULT '1970-01-01 00:00:01'", 
                           "rawtime", "FLOAT",
			   "roundedtime", "DECIMAL(19,4)", "workdesc", 
			   "VARCHAR(255)", "ipcheckin", 
                           "TIMESTAMP DEFAULT '1970-01-01 00:00:01'", 
			   "ipcheckout", 
                           "TIMESTAMP DEFAULT '1970-01-01 00:00:01'", 
                           "checked", "BOOLEAN"}, 
                           sqldatetime(datestr)
*/
arr15=[];
i=0;
var k=0;
while(i<empnumber){
   fDat = {};
   tsheet = [];
   daysoffsheet=[];
   var startdate = arr[i]['datesignup2'];
   var yearsemp = timeDiff(new Date(), startdate);
   var vacdays = 14*yearsemp;
   var daysemp = timeDiff(new Date(), startdate);
   var j=0;
   
   var daysoff = new Set();
   var pDate = new Date(startdate);
   while (daysoff.size < 2){
      daysoff.add(chance.integer({min:0, max:6}));
   }
   var starthour = chance.integer({min:5, max:13});
   pDate.setHours(starthour);
   while(j < daysemp){
      fDat = {};
      if (k%7 == 0 && k !=0){
         k++;
      }
      if (daysoff.has(j%7)){
         j++; 
         continue;
      }
      if (chance.normal()<.04 && vacdays > 0){
         daysoffsheet.push(pDate);
         vacdays--;
         j++;
         continue;
      }

      fDat['checkin'] = sqldatetime(pDate);
      var pDate2 = new Date(pDate);
      pDate2.setMinutes(pDate2.getMinutes() + chance.integer({min:1, min:10}));
      fDat['ipcheckin'] = sqldatetime(pDate2);
      var pDate3 = new Date(pDate);
      pDate3.setHours(pDate2.getHours()+8);
      fDat['checkout'] = sqldatetime(pDate3);
      var pDate4 = new Date(pDate3);
      pDate4.setMinutes(pDate4.getMinutes() - chance.integer({min:1, min:5}));
      fDat['ipcheckout'] = sqldatetime(pDate4);
      pDate.setDate(pDate.getDate()+1);
      fDat['rawtime'] = timediff3(pDate3,pDate2);
      fDat['roundedtime'] = fDat['rawtime'];
      fDat['projectid'] = k;
      j++;
   }
   i++;
}
console.log(arr);
 
var connection = mysql.createConnection(
    {
      host     : 'localhost',
      user     : 'Christopher',
      password : 'ringlesp',
      database : 'PayrollSystem',
    }
);
 
connection.connect();
 
var queryString = 'INSERT INTO Employee (deptid, jobid, typeid, catid, lastname, '; 
queryString += 'firstname, minit, address1, city, state, zipcode,';
queryString += 'email, webpage, homephone, officephone, cellphone, regularhours,';
queryString += 'gender, dob, ssn, login, password, admin, superadmin, numlogins,';
queryString += 'marital, datesignup, lastlogindate, active) VALUES ';
var c = 0;
for (r of arr){
   queryString += '('+r['deptid']+','+r['jobid']+','+r['typeid']+','+r['catid']+',"'+r['lastname']+'","';
   queryString += r['firstname']+'","'+r['minit'];
   queryString += '","'+r['address1']+'","'+r['city']+'","'+r['state']+'","'+r['zipcode'];
   queryString += '","'+r['email']+'","'+r['webpage']+'","'+r['homephone']+'","'+r['officephone'];
   queryString += '","'+r['cellphone']+'",'+r['regularhours'];
   queryString += ',"'+r['gender']+'","'+r['dob']+'",'+r['ssn']+',"'+r['login']+'","'+r['password'];
   queryString += '",'+r['admin']+','+r['superadmin']+','+r['numlogins']+','+r['marital'];
   queryString += ',"'+r['datesignup']+'","'+r['lastsignupdate']+'",'+r['active']+')';
   if (c == arr.length-1){
      queryString += ';';
   }
   else{
      queryString += ',';
   }
   c++;
}
console.log('Query...'+queryString);
connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
 
    for (var i in rows) {
        console.log('Post Titles: ', rows[i]);
    }
});

/*
	      new String[]{"Messages","Imid","INTEGER not NULL AUTO_INCREMENT",
                           "empid","INTEGER",
			   "message", "MEDIUMTEXT", "postedby", "VARCHAR(255)",
			   "dateposted", "DATE", "numviews", "INTEGER", 
			   "active", "BOOLEAN"}
*/

var queryString = 'INSERT INTO Messages (empid, message, postedby, dateposted, numviews, '; 
queryString += 'active) VALUES ';
c = 0;
for (r of arr2){
   queryString += '('+r['empid']+',"'+r['message']+'","';
   queryString += r['postedby']+'","'+r['dateposted']+'",'+r['numviews']+','+r['active']+')';
   if (c == arr2.length-1){
      queryString += ';';
   }
   else{
      queryString += ',';
   }
   c++;
}
console.log('Query...'+queryString);
connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
 
    for (var i in rows) {
        console.log('Post Titles: ', rows[i]);
    }
});
 
/*
              new String[]{"Locks","lockid", "INTEGER not NULL AUTO_INCREMENT", 
                           "empid", "INTEGER", 
			   "datelock", "DATE", "reasonlock", "VARCHAR(2)",
			   "active", "BOOLEAN"},
*/

var queryString = 'INSERT INTO Locks (empid, datelock, reasonlock, '; 
queryString += 'active) VALUES ';
c = 0;
for (r of arr3){
   queryString += '('+r['empid']+',"'+r['datelock']+'","';
   queryString += r['reasonlock']+'",'+r['active']+')';
   if (c == arr3.length-1){
      queryString += ';';
   }
   else{
      queryString += ',';
   }
   c++;
}
console.log('Query...'+queryString);
connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
 
    for (var i in rows) {
        console.log('Post Titles: ', rows[i]);
    }
});

/*
	      new String[]{"Payroll", "payrollid", "INTEGER not NULL AUTO_INCREMENT", 
			   "empid", "INTEGER", "date", "DATE", "startday", 
			   "DATE", "endday", "DATE", "hoursworked", "FLOAT", 
			   "grosspay", "DECIMAL(19,4)", "deductions", 
			   "DECIMAL(19,4)", "netpay", "DECIMAL(19,4)"},
*/

var queryString = 'INSERT INTO Payroll (empid, date, startday, endday, hoursworked, '; 
queryString += 'grosspay, deductions, netpay) VALUES ';
c = 0;
for (r of arr4){
   queryString += '('+r['empid']+',"'+r['date']+'","'+ r['startday']+'","';
   queryString += r['endday']+'",'+r['hoursworked']+','+r['grosspay']+','+r['deductions'];
   queryString += ','+r['netpay'] +')';
   if (c == arr4.length-1){
      queryString += ';';
   }
   else{
      queryString += ',';
   }
   c++;
}
console.log('Query...'+queryString);
connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
 
    for (var i in rows) {
        console.log('Post Titles: ', rows[i]);
    }
});

/*
              new String[]{"Salary","salaryid", "INTEGER not NULL AUTO_INCREMENT", 
			   "empid", "INTEGER", "hourlyrate", "DECIMAL(19,4)",
			   "note" , "VARCHAR(255)"},
*/

var queryString = 'INSERT INTO Locks (empid, hourlyrate, '; 
queryString += 'note) VALUES ';
c = 0;
for (r of arr5){
   queryString += '('+r['empid']+','+r['hourlyrate']+',"';
   queryString += r['note']+')';
   if (c == arr5.length-1){
      queryString += ';';
   }
   else{
      queryString += ',';
   }
   c++;
}
console.log('Query...'+queryString);
connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
 
    for (var i in rows) {
        console.log('Post Titles: ', rows[i]);
    }
});

/*
	      new String[]{"Jobtitle", "jobid", "INTEGER not NULL", 
                           "jobtitle", "VARCHAR(255)", "jobdesc", "VARCHAR(255)"}, 
*/
var queryString = 'INSERT INTO Locks (jobid, jobtitle, jobdesc '; 
queryString += ') VALUES ';
c = 0;
for (r of arr6){
   queryString += '('+r['jobid']+',"'+r['jobtitle']+'","';
   queryString += r['jobdesc']+'")';
   if (c == arr6.length-1){
      queryString += ';';
   }
   else{
      queryString += ',';
   }
   c++;
}
console.log('Query...'+queryString);
connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
 
    for (var i in rows) {
        console.log('Post Titles: ', rows[i]);
    }
});

/*
	      new String[]{"Emppicture", "picid", "INTEGER not NULL", "linkid", 
			   "INTEGER", "type", "VARCHAR(10)", "filename", 
			   "VARCHAR(255)", "filesize", "INTEGER", 
			   "picture", "VARCHAR(255)"},
*/

var queryString = 'INSERT INTO Emppicture (picid, linkid, type, '; 
queryString += 'filename, filesize, picture) VALUES ';
c = 0;
for (r of arr7){
   queryString += '('+r['picid']+','+r['linkid']+',"';
   queryString += r['type']+'","'+r['filename']+'",'+r['filesize'];
   queryString += ',"'+r['picture']+")';
   if (c == arr7.length-1){
      queryString += ';';
   }
   else{
      queryString += ',';
   }
   c++;
}
console.log('Query...'+queryString);
connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
 
    for (var i in rows) {
        console.log('Post Titles: ', rows[i]);
    }
});

/*
	      new String[]{"EmpCategory", "empid", "INTEGER", "catname", 
			   "VARCHAR(255)", "catdesc", "VARCHAR(255)", 
			   "miscnote", "VARCHAR(255)"},
*/

var queryString = 'INSERT INTO EmpCategory (empid, catname, catdesc, '; 
queryString += 'miscnote) VALUES ';
c = 0;
for (r of arr8){
   queryString += '('+r['empid']+',"'+r['catname']+'","';
   queryString += r['catdesc']+'","'+r['misnote']+'")';
   if (c == arr8.length-1){
      queryString += ';';
   }
   else{
      queryString += ',';
   }
   c++;
}
console.log('Query...'+queryString);
connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
 
    for (var i in rows) {
        console.log('Post Titles: ', rows[i]);
    }
});

/*
              new String[]{"EmployeeType", "typeid", "INTEGER", "typename", 
			   "VARCHAR(255)", "typedesc", "VARCHAR(255)",
			   "miscnote", "VARCHAR(255)"},
*/
var queryString = 'INSERT INTO EmployeeType (typeid, typename, typedesc, '; 
queryString += 'miscnote) VALUES ';
c = 0;
for (r of arr9){
   queryString += '('+r['typeid']+',"'+r['typename']+'","';
   queryString += r['typedesc']+'","'+r['misnote']+'")';
   if (c == arr9.length-1){
      queryString += ';';
   }
   else{
      queryString += ',';
   }
   c++;
}
console.log('Query...'+queryString);
connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
 
    for (var i in rows) {
        console.log('Post Titles: ', rows[i]);
    }
});

/*
new String[]{"IpTable","ipid", "INTEGER AUTO_INCREMENT", "type", 
			   "VARCHAR(20)", "linkid", "INTEGER", "ipaddress", 
			   "VARCHAR(255)", "note", "VARCHAR(255)"},
*/

var queryString = 'INSERT INTO IpTable (type, linkid, ipaddress, '; 
queryString += 'note) VALUES ';
c = 0;
for (r of arr10){
   queryString += '("'+r['type']+'",'+r['linkid']+',"';
   queryString += r['ipaddress']+'","'+r['note']+'")';
   if (c == arr10.length-1){
      queryString += ';';
   }
   else{
      queryString += ',';
   }
   c++;
}
console.log('Query...'+queryString);
connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
 
    for (var i in rows) {
        console.log('Post Titles: ', rows[i]);
    }
});

/*
              new String[]{"Department", "deptid", "INTEGER", "managerid", 
			   "INTEGER", "deptparentid", "INTEGER", "deptname",
			   "VARCHAR(255)", "location", "VARCHAR(255)",
			   "deptdesc", "VARCHAR(255)", "mandaworkdesc", 
			   "VARCHAR(255)", "messaging", "VARCHAR(255)"},
*/

var queryString = 'INSERT INTO Department (deptid, managerid, deptparentid, '; 
queryString += 'deptname, location, deptdesc, mandaworkdesc, messaging) VALUES ';
c = 0;
for (r of arr11){
   queryString += '('+r['deptid']+','+r['managerid']+','+r['deptparentid']+',"';
   queryString += r['deptname']+'","'+r['location']+'","'+r['deptdesc']+'","';
   queryString += r['mandaworkdesc']+'","'+r['messaging'] + '")';
   if (c == arr11.length-1){
      queryString += ';';
   }
   else{
      queryString += ',';
   }
   c++;
}
console.log('Query...'+queryString);
connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
 
    for (var i in rows) {
        console.log('Post Titles: ', rows[i]);
    }
});

/*
	      new String[]{"DeptEvents", "eventid", "INTEGER AUTO_INCREMENT", 
                           "deptid", "INTEGER", 
                           "eventdate", "DATE", "eventtime", 
			   "TIME", "eventbody", "VARCHAR(255)", "postedby", 
			   "VARCHAR(255)", "dateposted", "DATE", "expirydate", 
			   "DATE", "active", "BOOLEAN"},
*/

var queryString = 'INSERT INTO DeptEvents (deptid, eventdate, eventtime, '; 
queryString += 'eventbody, postedby, dateposted, expirydate, active) VALUES ';
c = 0;
for (r of arr12){
   queryString += '('+r['deptid']+',"'+r['eventdate']+'","'+r['eventtime']+'","';
   queryString += r['eventbody']+'","'+r['postedby']+'","'+r['dateposted']+'","';
   queryString += r['expirydate']+'",'+r['active'] + ')';
   if (c == arr12.length-1){
      queryString += ';';
   }
   else{
      queryString += ',';
   }
   c++;
}
console.log('Query...'+queryString);
connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
 
    for (var i in rows) {
        console.log('Post Titles: ', rows[i]);
    }
});

/*
              new String[]{"Bonus", "bonusid", "INTEGER AUTO_INCREMENT",
                           "empid", "INTEGER", 
			   "datebonus", "DATE", "bonuspayment", "DECIMAL(19,4)",
			   "note", "VARCHAR(255)"}, 
*/

var queryString = 'INSERT INTO Bonus (empid, datebonus, bonuspayment, '; 
queryString += 'note) VALUES ';
c = 0;
for (r of arr13){
   queryString += '('+r['empid']+',"'+r['datebonus']+'",'+r['bonuspayment']+',"';
   queryString += r['note']+'")';
   if (c == arr13.length-1){
      queryString += ';';
   }
   else{
      queryString += ',';
   }
   c++;
}
console.log('Query...'+queryString);
connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
 
    for (var i in rows) {
        console.log('Post Titles: ', rows[i]);
    }
});

/*
	      new String[]{"Project","projectid", "INTEGER", "deptid", "INTEGER", 
			   "projecttitle", "VARCHAR(255)", "projectdesc", 
			   "VARCHAR(255)", "hoursworked", "FLOAT", "active", 
			   "BOOLEAN"},
*/

var queryString = 'INSERT INTO Project (projectid, deptid, projecttitle, '; 
queryString += 'projectdesc, hoursworked, active) VALUES ';
c = 0;
for (r of arr14){
   queryString += '('+r['projectid']+','+r['deptid']+',"'+r['projecttitle']+'","';
   queryString += r['projectdesc']+'",'+r['hoursworked']+','+r['active']+')';
   if (c == arr14.length-1){
      queryString += ';';
   }
   else{
      queryString += ',';
   }
   c++;
}
console.log('Query...'+queryString);
connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
 
    for (var i in rows) {
        console.log('Post Titles: ', rows[i]);
    }
});
connection.end();
