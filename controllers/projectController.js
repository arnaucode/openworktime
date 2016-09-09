//File: controllers/projectController.js
var mongoose = require('mongoose');
var moment = require('moment');
var projectModel  = mongoose.model('projectModel');

var userModel  = mongoose.model('userModel');

//GET
exports.findAllProjects = function(req, res) {

	projectModel.find(function(err, projects) {
	    if(err) res.send(500, err.message);

		res.status(200).jsonp(projects);
	});


};

//GET
exports.findById = function(req, res) {
	projectModel.findById(req.params.id, function(err, project) {
    if(err) return res.send(500, err.message);

    console.log('GET /project/' + req.params.id);
		res.status(200).jsonp(project);
	});
};

exports.findAllProjectsFromUsername = function(req, res) {
    projectModel.find({
      owner: req.params.username
  }, function(err, projects) {

      if (err) throw err;

      if (!projects) {
        res.json({ success: false, message: 'no projects for user' });
    } else if (projects) {
        console.log(projects);
          // return the information including token as JSON
          res.jsonp(projects);


      }

    });
};

exports.addProject = function(req, res) {
	console.log('POST new project, title: ' + req.body.title);
	var project = new projectModel({
		title: req.body.title,
	    description:   req.body.description,
	    icon:   req.body.icon,
	    users:   req.body.users,
	    chart:   req.body.chart,
	    dateCreation:   req.body.dateCreation,
	    github:   req.body.github,
	    refnum:   req.body.refnum
	});

	project.save(function(err, project) {
		if(err) return res.send(500, err.message);
	    /*res.status(200).jsonp(project);*/
		projectModel.find(function(err, projects) {
			if(err) res.send(500, err.message);

			res.status(200).jsonp(projects);
		});
	});
};

exports.addUserToProject = function(req, res) {
	console.log("addUserToProject");
	console.log(req.body);
	projectModel.findById(req.params.id, function(err, project) {
		console.log(project);
		var auxUser={
			username: req.body.username,
			time: 0
		};
		project.users.push(auxUser);
		console.log(project.users);
		project.save(function(err) {
			if(err) return res.send(500, err.message);

			projectModel.find(function(err, projects) {
			    if(err) res.send(500, err.message);

				res.status(200).jsonp(projects);
			});
		});
	});
};
exports.userStartWorking = function(req, res) {
	console.log("userStartWorking");
	projectModel.findById(req.params.id, function(err, project) {
		var workstrike={
			username: req.body.username,
			start: new Date(),
			end: "",
		};
		project.workStrikes.push(workstrike);
		console.log(project);
		project.save(function(err) {
			if(err) return res.send(500, err.message);

			projectModel.find(function(err, projects) {
			    if(err) res.send(500, err.message);

				res.status(200).jsonp(projects);
			});
		});
	});
};
exports.userStopWorking = function(req, res) {
	console.log("userStopWorking");
	projectModel.findById(req.params.id, function(err, project) {
		for(var i=0; i<project.workStrikes.length; i++)
		{
			if((project.workStrikes[i].username==req.body.username)&&(project.workStrikes[i].end==null))
			{
				project.workStrikes[i].end= new Date();
				project.workStrikes[i].time=moment(project.workStrikes[i].end).diff(project.workStrikes[i].start, 'seconds');
				for(var j=0; j<project.users.length; j++)
				{
					if(project.users[j].username==req.body.username)
					{
						project.users[j].time+=project.workStrikes[i].time;
					}
				}
			}
		}
		console.log(project);
		project.save(function(err) {
			if(err) return res.send(500, err.message);

			projectModel.find(function(err, projects) {
			    if(err) res.send(500, err.message);

				res.status(200).jsonp(projects);
			});
		});
	});
};
//PUT
exports.updateProject = function(req, res) {
	ActivityModel.findById(req.params.id, function(err, tvshow) {
		tvshow.title   = req.body.petId;
		tvshow.year    = req.body.year;
		tvshow.country = req.body.country;
		tvshow.poster  = req.body.poster;
		tvshow.seasons = req.body.seasons;
		tvshow.genre   = req.body.genre;
		tvshow.summary = req.body.summary;

		tvshow.save(function(err) {
			if(err) return res.send(500, err.message);
      res.status(200).jsonp(tvshow);
		});
	});
};

//DELETE
exports.deleteProject = function(req, res) {
	projectModel.findById(req.params.id, function(err, project) {
		project.remove(function(err) {
			if(err) return res.send(500, err.message);

      		/*res.status(200).jsonp(req.params.id);*/
		    console.log('DELETE /projects/' + req.params.id);
			projectModel.find(function(err, projects) {
			    if(err) res.send(500, err.message);

				res.status(200).jsonp(projects);
			});
		})
	});
};
