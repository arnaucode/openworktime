var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;


var projectSchema = new Schema({
    title: { type: String },
    description: { type: String },
    icon: { type: String },
    users: [{
        username: { type: String },
        time: { type: Number }
     }],
    chart: [{
        labels: [{ type: String }],
        series: [{ type: String }],
        data: [{type: String }]
    }],
    workStrikes: [{
        username: { type: String },
        start: { type: Date },
        end: { type: Date },
        time: { type: Number }
    }],
    dateCreation: { type: Date },
    github: { type: String },
    refnum: { type: String }
})
module.exports = mongoose.model('projectModel', projectSchema);


//modality can be: offering, asking, package
