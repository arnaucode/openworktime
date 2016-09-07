var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;


var travelSchema = new Schema({
    title: { type: String },
    description: { type: String },
    icon: { type: String },
    users: { type: String },
    chart: { type: String },
    dateCreation: { type: Date },
    github: { type: String },
    refnum: { type: String }
})
module.exports = mongoose.model('projectModel', travelSchema);


//modality can be: offering, asking, package
