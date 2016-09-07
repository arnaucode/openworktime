//File: controllers/projectController.js
var mongoose = require('mongoose');
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
    res.status(200).jsonp(project);
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
	ActivityModel.findById(req.params.id, function(err, activity) {
		activity.remove(function(err) {
			if(err) return res.send(500, err.message);
      		res.status(200).jsonp(req.params.id);
		    console.log('DELETE /activities/' + req.params.id);
		})
	});
};
