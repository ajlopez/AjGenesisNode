
module.exports = function (model, args, ajgenesis, cb) {
    model.args = args;
    cb(null, model);
}