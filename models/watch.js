const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const watchSchema = new Schema(
    {
        user_id: {type: String},
        trade_id: {type: String}
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Watch', watchSchema);

