var crypto = require('crypto');
var express = require('express');
var mongoose = require('mongoose');
var User = mongoose.model('user');
var Guser = mongoose.model('googleuser');
var Pin = mongoose.model('pin');
var Address = mongoose.model('address');
function hash(pwd){
  return crypto.createHash('sha256').update(pwd).
	        digest('base64').toString();
}


module.exports = function(app){


  app.get('/',function(req,res){
    if(req.session.email && req.session.bool===false){
      //res.render('index',{email: req.session.email});
      res.redirect('/logout');
    }
    else if(req.session.email && req.session.bool===true){
      res.render('index',{email: req.session.email});
    }
    else if(req.session.email){
        res.redirect('/postadd');
    }
    else{
      res.redirect('/login');
    }
  });

  app.get('/login',function(req,res){
    if(req.session.email){
      res.redirect('/');
    }
    res.render('login');
  });

  app.post('/loginf',function(req,res){

    User.findOne({email:req.body.email}).exec(function(err,user){
      if(!user){
        res.end('User not present');
      }
      else if(user.password === hash(req.body.password.toString())){
        //else if(user.password === req.body.password.toString()){

        //not working
        /*
        req.session.regenerate(function(err){
        req.session.email = user.email;
        });
        */
            //1st login
        req.session.email = user.email;
        //console.log(req.session.email);
            if(user.add_bool === false){

              //user.set('add_bool',true);
              user.save();
              res.redirect('/postadd');
            }
            else{
              req.session.bool = true;
              res.redirect('/');
            }
      }
      else{
        res.json("Wrong Username or Password");
      }
    });

  });

  app.post('/loging',function(req,res){

  Guser.findOne({email:req.body.email}).exec(function(err,user){
    if(!user){
      var guser = new Guser({email:req.body.email});
      //guser.set('add_bool',true);
      guser.save();
      req.session.email = req.body.email;
      res.json(1);
    }
    else{
      req.session.email = req.body.email;
      req.session.bool = true;
      res.json(0);
    }
  });


  });

app.get('/logout',function(req,res){

		req.session.destroy(function(err){
			console.log('Session Destroyed');
		});
			res.redirect('/login');
	});


//It should be in ajax call from frontend.
app.get('/postadd',function(req,res){
  req.session.bool = false;
  if(req.session.email){
    res.header('Cache-Control','no-cache,private,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0');
    res.sendFile('/views/postadd.html',{root: __dirname});
  }

  else {
    res.redirect('/');
  }
});

app.get('/validpincode',function(req,res){
  var pin = req.query.pin;
  Pin.findOne({pincode: pin}).exec(function(err,pint){
    if(!pint)
    res.json("Not Available");
    else{
      res.json("Available");
    }
  });
  //res.json(req.query.pin)
});

app.post('/formsubmit',function(req,res){

  var add = {
    "pincode": req.body.pincode,
    "address": req.body.address,
    "landmark": req.body.landmark,
    "city": req.body.city,
    "state": req.body.state
  };
  var newaddress = new Address(add);
  //console.log(req.body);
  User.update({email: req.session.email},{$set:{address:newaddress.toObject()}},{ upsert: true }).exec();
  Guser.update({email: req.session.email},{$set:{address:newaddress.toObject()}},{ upsert: true }).exec();
  User.update({email: req.session.email},{$set:{add_bool:true}},{ upsert: true }).exec();
  Guser.update({email: req.session.email},{$set:{add_bool: true}},{ upsert: true }).exec();

  req.session.bool = true;
  res.redirect('/');
});

app.get('/getadd',function(req,res){
  User.findOne({email:req.session.email}).exec(function(err,add){
    if(!add){
      Guser.findOne({email:req.session.email}).exec(function(err,gadd){
        if(!gadd){

        }else {
          res.json(gadd);
        }
      });
    }
    else{
    res.json(add);
    }

  });
});

app.get('/delete',function(req,res){
  User.find({email:req.session.email}).remove().exec();
  Guser.find({email:req.session.email}).remove().exec();
  res.redirect('/logout');
});

app.get('/signup',function(req,res){
    res.render('signup');
});

app.post('/signup',function(req,res){
var user = new User({email:req.body.email});
user.set('password',hash(req.body.password));
user.save();
res.redirect('/login');

});

app.get('/checkemail',function(req,res){
  User.findOne({email:req.query.email}).exec(function(err,data){
    if(!data){
      Guser.findOne({email:req.query.email}).exec(function(err,gdata){
        if(!gdata)
        res.json("Valid");
        else {
          res.json("User Already Exist!!");
        }
      });
    }else {
      res.json("User Already Exist!!");
    }
  });
});

}
