
var mongoose = require('mongoose');
var moment = require('moment');
var projectModel  = mongoose.model('projectModel');

var userModel  = mongoose.model('userModel');


exports.lastConnectionUser = function() {
    var lastIntervalDate = new Date();
    var intervalObject = setInterval(function () {
        var actualDate= new Date();
        //console.log(actualDate);
        lastIntervalDate.setMinutes(lastIntervalDate.getMinutes() - 4);
        console.log(lastIntervalDate);

        userModel.find(function(err, users) {
            if(err) res.send(500, err.message);


        	for(var i=0; i<users.length; i++)
        	{
                if(users[i].connected==true)
                {
                    if(users[i].lastConnection<=lastIntervalDate.setMinutes(lastIntervalDate.getMinutes() - 4))
                    {
                        if(users[i].connected==true)
                        {
                            console.log("user disconnected: " + users[i].username);
                            users[i].connected= false;
                 		   users[i].save(function(err) {
                 			   if(err) return res.send(500, err.message);
                               //console.log("user: " + users[i].username + ", connected=false");
                           });
                        }
                    }
                }
        	}

    	});


        lastIntervalDate= new Date();
    }, 60000);//every minute
};
