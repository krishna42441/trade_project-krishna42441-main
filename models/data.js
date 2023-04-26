const mongoose = require('mongoose');
const Schema = mongoose.Schema; 


let  tradeSchema =  new Schema({
        topic: {type: String, required: [true, 'title is required']},
        user_id: {type: String},
        title: {type: String, required: [true, 'title is required']},
        details: {type: String, required: [true, 'details is required'], 
                minLength: [10, 'The details should have atleast 10 characters']},
        image: {type: String, required: [false, 'image is required']}

    
},
{
    timestamps: true
}

);

module.exports = mongoose.model('trades', tradeSchema);

