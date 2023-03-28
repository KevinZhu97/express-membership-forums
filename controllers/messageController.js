const Message = require('../models/message')

exports.create_message_get = function(req, res, next) {
    if (!req.user) {
        res.redirect('/')
    }

    res.render('create_message')
} 

exports.create_message_post = async function(req, res, next) {
    const message = new Message({
        user: req.user._id,
        title: req.body.title,
        message: req.body.message,
        timestamp: Date.now()
    })

    await message.save((err) => {
        if (err) return next(err);
        res.redirect("/");
    });
};