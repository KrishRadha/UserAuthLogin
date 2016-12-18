/* AUTHOR : RADHA KRISHNA KAVULURU */
/* AUTHOR : RADHA KRISHNA KAVULURU */
/* EDIT 1 : 15-02-2016             */
/* EDIT 2 :                        */



/* ---------------------------------------------------INSERT HEADING HERE------------------------------------------------------------------*/


// ------------------ TO CHANGE BEFORE USE

/*

1) SENDGRID USERNAME AND PASSWORD ( FOR EMAIL VERIFICATION )
2) CUSTOMIZE THE REGISTER FOR WHAT EVER DETAILS YOU WANT ON REGISTRATION
3) LOGIN REQUIRES EMAIL AND PW , CHANGE IF U WANT ANY

  
  
*/


// Available GETS 

/*

1) /login
2) /logout
3) /dashboard
4) /register
5) /verify
6) /
7)





/* ----------------------------------------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------CODE STARTS HERE---------------------------------------------------------------*/



var express=require('express'),http = require('http');  // requiring expressjs
var mongojs=require('mongojs');  // requiring mongojs
var funcz = require('./cust_server.js');// requiring custom_js funcs
var xssFilters = require('xss-filters');
var sanitize = require('mongo-sanitize');
var db=mongojs("mongodb://champrakri:Iamthegod1@ds139278.mlab.com:39278/heroku_0tcxsgmn",['tags','packets','users']);// database is indianpanther ,tables are in array
var bodyparser=require('body-parser');//body parser for parsin the body yo
var validator=require('validator');
var moment = require('moment');
//var multer=require('multer');
var sessions=require('client-sessions');
var bcrypt=require('bcryptjs');
var csrf=require('csurf');
// c surf is the sessions library we are using to store the users sessions on the local browser/ iTS WRITTERN by mozilla i guesss


//var sendgrid=require('sendgrid')('USERNAME','PASSWORD');


//var passport=require('passport');
//var mongoose=require('mongoose');
//mongoose.connect('mongodb://localhost/indianpanther');
var app=express();
app.use(express.static(__dirname+"/public"));  
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

var server = http.createServer(app);

/* ------------------------------------------------ DB CONNECTION  ------------------------------------------------------*/


/*--------------------------------------------------------APP WORKING PARAMS---------------------------------------------------------------------*/

//app.use(var trendtime=1;)






/*--------------------------------------------------------------------------------------------------------------------------------------------*/
//app.use(multer);

app.use(sessions(
    {
    cookieName:'session',
    secret:'123poloshsa90865746asdgy1f2y3gyuiasu',
    duration:30*60*1000,
    activeDuration:5*60*1000
    
    }

));
app.use(csrf());   

app.use(function (req, res, next) {
  var token = req.csrfToken();
  res.cookie('XSRF-TOKEN', token);
  res.locals.csrfToken = token;
  next();
});

app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


//app.use('view engine','jade');



/*-------------------------------------------------- MY MIDDLE WARE -----------------------------------------------*/

app.use(function(req,res,next)
        {
    
    if(req.session && req.session.user)
    {
        db.users.findOne({email:req.session.user.email},function(err,user){
        
            if(user)
            {
               req.user=user;
                delete req.user.password;
                req.session.user=req.user;
                res.locals.user=req.user;
            }
           
            
        next();
        });
    }
    else
    {
        next();
    }
    
});
app.use(handle403);
app.use(handle404);
app.use(handle503);

function requireLogin(req,res,next)
{
    if(!req.user)
    {
        res.redirect('/login');
    }
    else
    {
        next();
    }
};




function handle403(err, req, res, next) {
  if (err.status !== 403) return next();
  res.send('403error');
};
function handle404(err, req, res, next) {
  if (err.status !== 404) return next();
  res.send('404error');
};
function handle503(err, req, res, next) {
  if (err.status !== 503) return next();
  res.send('503error');
};


/*---------------------------------------------------------------------------------------------------------------*/

/*=-----------------------------------------------SCHEMA ---------------------------------------------*/




/* --------------------------------------------------------- API STARTS ------------------------------------------------------------*/

app.get('/',function(req,res){
    if(req.session && req.session.user){
res.redirect('/dashboard');

}
     else{

    res.render("index.html");
     }
    
});


/* -----------------------------------------------LOGIN GET API-----------------------------------------------------------------*/
app.get('/login',function(req,res){

    if(req.session && req.session.user){
res.redirect('/dashboard');

}
    else{
    res.render("login.html");
    }
    
});
/* -----------------------------------------------LOGIN POST API-----------------------------------------------------------------*/

app.post('/login',function(req,res){


   
  var user={};
    
    var error=[];
    var valid=1;

    /* ------------------------------------------------ VALIDATION ---------------------------------------------*/
    // email
     user.email=sanitize(req.body['email']);
    if(!validator.isLength(user.email,{min:4,max:2000}))
    {
    
        error.push('EMAILSIZE');
        valid=0;
    }
     if(!validator.isEmail(user.email))
    {
         error.push('EMAIL which you entered is not correct.');
        valid=0;
    }
    //user password
     user.password=sanitize(req.body['password']);
    if(!validator.isLength(user.password,{min:4,max:200}))
    {
    
        error.push('PASSWORD is not correct as it seems');
        valid=0;
    }
    var passcheck='';
    if(valid==1){
        
    db.users.findOne({email:user.email},function(err,doc){
    
        if(!doc)
        {
            error.push('INVALID');
            res.json({error:error});
        }
        else
        {
    passcheck=doc['password'];
        if(bcrypt.compareSync(user.password,passcheck))
    {
        /* ------------------------------------------- SUCCESS -----------------------------------------------*/
        if(doc['verify']==0)
        {
             error.push('Please verify your account by clicking on the verification email sent to you.');
            res.json({error:error});
        }
        else
        {
        req.session.user=doc;
        res.json({done:"GO"});
        }//session = set-cookie stores stff
        /* ------------------------------------------- SUCCESS -----------------------------------------------*/
    }
     else
    {
        error.push('INVALID');
        res.json({error:error});
    }
        }
    
    });
    
    
    
    }
    else
    {
        res.json({error:error});
    }
   
    
    

});

/* -----------------------------------------------REGISTER GET API-----------------------------------------------------------------*/

app.get('/register',function(req,res){
    
if(req.session&&req.session.user)
{
    res.redirect('/dashboard');
}
    else{
    res.render("register.html",{csrfToken:req.csrfToken()});
    }
    
});


/* -----------------------------------------------REGISTER API-----------------------------------------------------------------*/

app.post('/register',function(req,res){
   console.log(req.body);  

  
    var time = moment().format('MMMM Do YYYY, h:mm:ss a');
    
    var user={};
    
    var error=[];
    var valid=1;

    /* ------------------------------------------------ VALIDATION ---------------------------------------------*/
    // username
    user.name=sanitize(req.body['name']);
    
    if(!validator.isLength(user.name,{min:4,max:200}))
    {
    
       error.push('NAME must be greater than 3 letters and less than 200 letters');
        valid=0;
    }
    //user email
     user.email=sanitize(req.body['email']);
    if(!validator.isLength(user.email,{min:4,max:2000}))
    {
    
        error.push('EMAIL id must be greater than 3 letters and less than 2000 letters');
        valid=0;
    }
    
    //inkoview id
     user.username=sanitize(req.body['username']);
    if(!validator.isLength(user.username,{min:4,max:13}))
    {
    
        error.push('Inkoview id must be greater than 4 letters and less than 14 letters');
        valid=0;
    }
     if(!validator.isEmail(user.email))
    {
         error.push('EMAIL is not correctly entered');
        valid=0;
    }
    //user password
     user.password=sanitize(req.body['password']);
    if(!validator.isLength(user.password,{min:4,max:200}))
    {
    
        error.push('PASSWORD must have minimum of 4 letters and maximum of 200 letters');
        valid=0;
    }
     user.repassword=sanitize(req.body['repassword']);
    if(user.repassword!=user.password)
    {
    
        error.push('PASSWORDs you entered are not same. Try entering them again.');
        valid=0;
    }
    else
    {
        delete user.repassword;
    }
    
  
     user.addedat=time;
     user.verify=0; //
     user.authority=0;
    user.description=' This is the place where all the details belonging to this profile goes. Everything which the user needs to be said about himself can come out here. On the contrary, if you are seeing this message, there is no description to this profile yet. :( ';
    user.vercode=funcz.RandStr(15);
    
    
    //check unique user name--------------------------------------------------------
    
   db.users.findOne({username:user.username},function(err,doc){
   
       if(doc){
       
           error.push('Username is already in use. Please chose another one.');
        valid=0;
       
       }
   
   });
    
    //check unique user name--------------------------------------------------------
    
         db.users.findOne({email:user.email},function(err,doc){
    
        if(!doc)
        {
            if(valid==1)
    {
        
    
        
        
            
        var hash=bcrypt.hashSync(user.password,bcrypt.genSaltSync(10));
        user.password=hash;
        //--------------------------------------------------
        db.users.insert(user,function(err,doc){
    
    //console.log(user);
            if(err)
            {
                error.push('We have problems with the server. Please try after some time');
                 res.json({error:error});
            }
    
            else{
 
           var url=req.headers.host+'/verify?email='+user.email+'&vercode='+user.vercode;
                
                var api_key = 'key-82e44fbcb782eb183b249a2312d04f95';
var domain = 'appa79187c642a346eca4b910d9d840dbc3.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
 
var data = {
  from: 'ChatPacketsAuth<cp@chatpackets.com>',
  to: user.email,
  subject: 'Verify Your Chat Packets account',
  text: 'Please verify your account by visiting the following link.  '+url
};
 
mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
                var succ ={done:"GO"};
            res.json(succ);
               
                // Maild Done
                
            }
            
            });
        
          //-----------------------------------------------  
       
        
    }
    
    
    else
    {
        res.json({error:error});
    }
        }
             else{
                   error.push('Your EMAIL id'+user.email+'already has a registered account on Inkoview. Try logging in?');
        res.json({error:error});
             }
    
// ------- INSERT -----------------------------------------------------------------------------------------------------------------------
   
    
         });
    
            
         

 
    

        // INSERT END-------------------------------------------------------------------------------------------------------------------
    
    
});



/* -------------------------------------------------------REGISTER DONE---------------------------------------------------------------*/

/* -----------------------------------------------FOUROFOURGET API-----------------------------------------------------------------*/


app.get('/fourofour',function(req,res){
    
    res.render("fourofour.html");
     
    
});

app.get('/fourothree',function(req,res){
    
    res.render("fourothree.html");
     
    
});
/* -----------------------------------------------FOUROFOURGET API-----------------------------------------------------------------*/

app.get('/dashboard',requireLogin,function(req,res){

    res.render('dashboard.html',{user:req.session.user});
    
    
    
});


/*-----------------------------------------------------POST AND GET PROFILE-------------------------------------------------------*/

app.get('/profile',requireLogin,function(req,res){
    
    
    var query=req.query;
    var user={};
    if(query.username){
    
    db.users.findOne({username:query.username},function(err,doc){
   
       if(doc){
       
          // scrap the user out
           user.username=doc.username;
           user.email=doc.email;
           user.description=doc.description;
           user.name=doc.name;
           
           if(req.session.user.username==user.username)
         { 
             res.render('profile.html',{profileuser:user,same:true});
         }
           else
           {
               // different user's profile
               res.render('profile.html',{profileuser:user,same:false});
           }
       
       }
        else
        {
           // User does Not exist. 
            res.render('fourofour.html');
        }
   
   });
  
        
    }
    
    else
    {
        // improper URL.
        res.render('fourofour.html');
    }

    
    
    
    
});

app.post('/profile',requireLogin,function(req,res){


    
    if(req.body['description']){
   var description =sanitize(req.body['description']);
        var error={};
        var time = moment().format('MMMM Do YYYY, h:mm:ss a');
        if(!validator.isLength(description,{min:10,max:1000000}))
        {
            error.push('Profile Description must be in the range of 10 to 10000000 charecters. ');
            
            res.render('profile.html',{profileuser:req.session.user,same:true,error:error});
        }
        else{
            
            db.users.update({username:req.session.user.username},{$set:{description:description}},function(err,doc){
                if(doc)
                {
                    res.render('profile.html',{profileuser:req.session.user,same:true});
                }
                else
                {
                    error.push('Error in Updating your status. Please try later ');
                    res.render('profile.html',{profileuser:req.session.user,same:true,error:error});
                    
                }
                
            
            });
        }
        
       
        
        
        
        
        
    }
    else{
        //improper post?
        res.redirect('/dashboard');
    }
    


});

/*-----------------------------------------------------POST AND GET NEWVIEW-------------------------------------------------------*/

/*-----------------------------------------------------POST AND GET NEWVIEW-------------------------------------------------------*/

app.get('/newpacket',requireLogin,function(req,res){
    
    res.render('newpacket.html');
    
});

app.post('/newpacket',requireLogin,function(req,res){
    
    
    var cpid='';
    var error,packet={};
    
    if(req.body['chatpacket']||req.body['chatpacket']!=''&req.body['cpid'])
    {
    packet.message=sanitize(req.body['chatpacket']);cpid=req.body['cpid'];
    }
    
    else
        error.push('Not a valid Chat packet or ID ! Please try again');
    
    if(!error)
    {
        
         
   db.users.findOne({username:cpid},function(err,doc){
   
       if(doc){
           
           packet.senderid=req.session.user.username;
           packet.recieverid=cpid;
           packet.time=moment().format('MMMM Do YYYY, h:mm:ss a');
           
           db.packets.find().sort({packetid:-1}).limit(1,function(err,doc1){
               
               console.log(doc1);
               if(err)
               {
                   res.json({error:'iderror: Packet did not get delivered. We are facing some difficulties. Please try later'});
               }
           
             else if(doc1!='undefined'&doc1.length!=0)
             {
                 packet.packetid=  doc1[0].packetid+1;
               
             }// incrementing
               else
               { 
                packet.packetid=0;
                console.log(3);
                
               }
           
         
      
          db.packets.insert(packet,function(err,packetdoc){
          
             // console.log(packet);
          if(packetdoc){
          console.log(packetdoc);
              res.json({succ:'go'});
              
          }
              else
              {
                  //packet not inserted error
                  res.json({error:'629NP : Packet did not get delivered. We are facing some difficulties. Please try later'});
              }
          
          });   });
       }
       else
       {
           // No user named cpid error
           res.json({error:'The Chat packet Id you entered is incorrect. No one exists with that Id.'});
       }
   
   });
    }
    else
    {
        // Not valid chat packet error
        res.json(error);
    }
    
    
    
    
    
    
    
    
  //  res.render('newinkoview.html'); render something!
    
});



/*------------------------------------------------------------------------------------------------------------------*/



/*----------------------------------------------------PACKETS DISPLAY------------------------------------------------*/

app.get('/packets',requireLogin,function(req,res){
    
  var query=req.query;
    var user={};
    if(query.username){
    
    db.users.findOne({username:query.username},function(err,doc){
   
       if(doc){
       
          // scrap the user out
           user.username=doc.username;
           user.email=doc.email;
           user.description=doc.description;
           user.name=doc.name;
           
           if(req.session.user.username==user.username)
         { 
             res.render('packets.html',{otheruser:user,same:true});
         }
           else
           {
               // different user's profile
               res.render('packets.html',{otheruser:user,same:false});
           }
       
       }
        else
        {
           // User does Not exist. 
            res.render('fourofour.html');
        }
   
   });
  
        
    }
    
    else
    {
        // improper URL.
        res.render('fourofour.html');
    }

    
    
});
app.post('/packets',requireLogin,function(req,res){

// get latest update id, other user . Get current user from sessions. Respond with latest messages after latest update id.
    var request={};
    if(req.body['latest_update_id']||req.body['otheruser'])
    {
        
    request.latestid=sanitize(req.body['latest_update_id']);request.otheruser=req.body['otheruser'];
        request.user=req.session.user.username;
        console.log(request);
        if(request.latestid=='N'){
        
        /* return maximum of 15 results.
            db.packets.find(  { $or : [
            
                {  $and:[ {senderid:request.otheruser},{recieverid:request.user} ] },{ $and:[ {senderid:request.user},{recieverid:request.otheruser} ] }
            
            ] } ).sort({time:-1}).limit(20 ,function(err,doc){console.log(doc)}); 
            */
            
            db.packets.find( { $or : [
            
                {  $and:[ {senderid:request.otheruser},{recieverid:request.user} ] },{ $and:[ {senderid:request.user},{recieverid:request.otheruser} ] }
            
            ] } ).sort({packetid:-1}).limit(20 ,function(err,doc){
        
               // console.log('packets search'+doc);
            if(doc!='undefined'&doc.length>0)
            {
               // console.log(doc);
                
        var size=doc.length;
        var replace_string='';
            for(var i=0;i<size;i++)
            {
                if(i==0)
                var latest_id=doc[i].packetid;
                replace_string=replace_string+funcz.ChatStyle(doc[i].senderid,doc[i].message,moment(doc[i].time,'MMMM Do YYYY, h:mm:ss a').format('MMMM Do YYYY, h:mm:ss a'));
            }
        
                
                res.json({latest_update_id:latest_id,new_messages:replace_string});
            }
            else
            {
                // no latest messages  handle
                res.json({nothing:''});
                
            }
            
        });
        
        
        }
        else
        {
        // finding all instances of messages involving these 2 persons latest than given id.
        
        db.packets.find( { $and :[ { packetid: {$gt :request.latestid}},{ $or:[ {$and:[{senderid:request.otheruser},{recieverid:request.user}]},{$and:[{senderid:request.user},{recieverid:request.otheruser}]}] }  ]}). sort( { packetid : -1 } ,function(err,doc){
        
            if(doc!='undefined'&doc.length>0)
            {
                console.log(doc);
        var size=doc.length;
        var replace_string='';
            for(var i=0;i<size;i++)
            {
                if(i==0)
                    var latest_id= doc[i].packetid;
                replace_string=replace_string+funcz.ChatStyle(doc[i].senderid,doc[i].message,moment(doc[i].time,'MMMM Do YYYY, h:mm:ss a').format('MMMM Do YYYY, h:mm:ss a'));
            }
        
               
                res.json({latest_update_id:latest_id,new_messages:replace_string});
            }
            else
            {
                // no latest messages  handle
                res.json({nothing:''});
                
                
            }
            
        });
        
        }
        
    }
    
    else
    {
        // invalid creds...
        res.json({error:'invalid credentials'});
    }
    

});



/*------------------------------------------------------------------------------------------------------------------*/
/*---------------------------------------------LOGOUT------------------------------------------------------*/


app.get('/logout',function(req,res){

   req.session.reset();
                res.redirect('/');
    
    
});


/*-----------------------------------------------VERIFY EMAIL-------------------------------------------------------*/

app.get('/verify',function(req,res){

    var verpar = req.query;
    console.log(verpar);
    if(verpar.email&&verpar.vercode)
    {
        db.users.findOne({email:verpar.email},function(err,user){
        
            if(user)
            {
                if(req.verify==1)
                {
                    res.redirect('/');
                }
                else
                {
               if(user.vercode==verpar.vercode)
               {
                     db.users.findAndModify(
        {query:{_id:mongojs.ObjectId(user._id)},
         update:{$set:{verify:1 }},
        new: true},
        function(err,doc){
         
         if(err)
         {
             res.render("verify.html",{error:'WE ARE FACING TECHNICAL PROBLEMS'+err.code});
         }
             else
             {
                 res.render("verify.html",{error:'VERIFIED. Vistit Chat Packets now  '});
             }
         
         }
    );
               }
                    else
                    {
                        res.render("verify.html",{error:"DO NOT TRY TO HACK DUH NOT THE SAME CODE"});
                    }
                }
            }
            else
            {
                // no user
                res.render("verify.html",{error:"DO NOT TRY TO HACK DUH, NOT CORRECT MAIL ID"});
            }
            
           
            
       
        });
    }
    else
    {
        // no reqs
        res.render("verify.html",{error:"DO NOT TRY TO HACK DUH, NO POST DUDE"});
    }
   
});

/*-----------------------------------------------VERIFY EMAIL ENDS-------------------------------------------------------*/



/*-----------------------------------------------APP WORKING STARTS-------------------------------------------------------*/









/*------------------------------------------------SERVER STUFF ENDS----------------------------------------------*/
//app.listen(3000);
server.listen(process.env.PORT||5000);

console.log("Server running on port 8000");

/* ----------------------------------------------------------------------------------------------------------------------------------------*/
