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

function timeDiff(time1, time2){
   var one_day=1000*60*60*24;
   var time1_ms = time1.getTime();
   var time2_ms = time2.getTime();
   var difference_ms = time1_ms - time2_ms;
   var age = Math.round(Math.round(difference_ms/one_day)/365.25);
   return age;
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
   arr7.push(fDat);
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
	      new String[]{"Jobtitle", "jobid", "INTEGER not NULL", 
                           "jobtitle", "VARCHAR(255)", "jobdesc", "VARCHAR(255)"}, 
*/
var queryString = 'INSERT INTO Locks (jobid, jobtitle, jobdesc '; 
queryString += ') VALUES ';
c = 0;
for (r of arr6){
   queryString += '('+r['jobid']+',"'+r['jobtitle']+'","';
   queryString += r['jobdesc']+'")';
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
	      new String[]{"Emppicture", "picid", "INTEGER not NULL", "linkid", 
			   "INTEGER", "type", "VARCHAR(10)", "filename", 
			   "VARCHAR(255)", "filesize", "INTEGER", 
			   "picture", "VARCHAR(255)"},
*/
connection.end();
