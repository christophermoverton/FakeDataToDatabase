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
			   "ssn","SMALLINT", "dob","DATE", "gender",
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
  bdstr += '-'+datepart[1]+'-';
  if (datepart[0].length == 1){
     bdstr += '0' + datepart[0];
  }
  else{
     bdstr += datepart[0];
  }
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

var mysql = require('mysql');
var faker = require('faker');
var Faker = require('Faker');
var ssn = require('ssn');
var Chance = require('chance');
var chance = new Chance();
var count = 10;
var i;
var arr = [];
for(i = 0; i < count; i++){
   var fDat = {};
   //fDat['firstname'] = faker.name.firstName();
   fDat['lastname'] = faker.name.lastName();
   fDat['address1'] = faker.address.streetAddress();
   fDat['city'] = faker.address.city();
   fDat['state'] = faker.address.stateAbbr();
   fDat['zipcode'] = faker.address.zipCode();
   fDat['email'] = faker.internet.email();
   fDat['homephone'] = faker.phone.phoneNumberFormat();
   fDat['officephone'] = faker.phone.phoneNumber();
   fDat['cellphone'] = faker.phone.phoneNumberFormat();
   fDat['regularhours'] = 40;
   fDat['login'] = faker.internet.userName();
   fDat['password'] = faker.internet.password();
   var year = chance.year({min: 1953, max:1998});
   var bday = chance.birthday({year:year});
   var bdays = bday.toLocaleDateString().split("/");
   var bdstr = '';
   bdstr += bdays[2];
   bdstr += '-'+bdays[1]+'-';
   if (bdays[0].length == 1){
     bdstr += '0' + bdays[0];
   }
   else{
     bdstr += bdays[0];
   }
   fDat['dob'] = bdstr;
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
   fDat['admin'] = faker.random.boolean();
   fDat['superadmin'] = faker.random.boolean();
   var startdate = new Date();
   var startdate2 = startdate;
   if (diff18 > 0){
      var year2 = chance.year({min: 2016-diff18, max:2016});
      startdate = chance.date({year: year2});      
   }
   console.log(startdate);
   fDat['datesignup'] = revDate(startdate);
   var lastsignupdate = startdate2
   if (startdate != startdate2){
      var timediff2 = timeDiff(startdate2, startdate);
      var year3 = chance.year({min: 2016-timediff2, max:2016});
      lastsignupdate = chance.date({year:year3});
   }
   //console.log(lastsignupdate);
   fDat['lastsignupdate'] = revDate(lastsignupdate);
   if (chance.normal() > .8){
      fDat['active'] = false;
   }
   else{
      fDat['active'] = true;
   }
   fDat['webpage'] = faker.internet.domainName();
   fDat['numlogins'] = chance.integer({min: 0, max: 4000});
   if (chance.normal() < .35){
      fDat['marital'] = true;
   }
   else{
      fDat['marital'] = false;
   }
   fDat['ssn'] = chance.ssn({dashes:false});
   arr.push(fDat);
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
 
var queryString = 'INSERT INTO Employee (lastname, firstname, minit, address1, city, state, zipcode,';
queryString += 'email, webpage, homephone, officephone, cellphone, regularhours,';
queryString += 'gender, dob, ssn, login, password, admin, superadmin, numlogins,';
queryString += 'marital, datesignup, lastsignupdate, active) VALUES ';
var c = 0;
for (let r of arr){
   queryString += '('+r['lastname']+','+r['firstname']+','+r['minit'];
   queryString += ','+r['address1']+','+r['city']+','+r['state']+','+r['zipcode'];
   queryString += ','+r['gender']+','+r['dob']+','+r['ssn']+','+r['login']+','+r['password'];
   queryString += ','+r['admin']+','+r['superadmin']+','+r['numlogins']+','+r['marital'];
   queryString += ','+r['datesignup']+','+r['lastsignupdate']+','+r['active']+')';
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
 
connection.end();
