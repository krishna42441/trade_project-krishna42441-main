const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sendSchema = new Schema(
    {
        user_id: {type: String},
        user_trade_id: {type: String},
        receiver_id: {type: String},
        receiver_trade_id: {type: String}
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Send', sendSchema);