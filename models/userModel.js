var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;


var userSchema = new Schema({
    username: { type: String },
    password: { type: String },
    description:   { type: String },
    mail:   { type: String },
    avatar:   { type: String },
    github: { type: String },
    web: { type: String },
    projects: { type: String },
    connected: { type: Boolean },
    working: { type: Boolean },
    lastConnection: { type: Date }
})
module.exports = mongoose.model('userModel', userSchema);
