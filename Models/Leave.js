const { Schema} = require('mongoose');
const { model} = require('mongoose')
const demo = new Schema({
    id : {type:String, require:true},
    name: {type:String, require:true},
    subject: {type:String, require:true},
    description: {type:String, require:true}
});

const sample = model('applications', demo);
module.exports = sample;

