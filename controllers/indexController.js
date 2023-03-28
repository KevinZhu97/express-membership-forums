const User = require('../models/user')
const Message = require('../models/message')
const passport = require("passport");
const bcrypt = require('bcryptjs')
const { body, validationResult } = require("express-validator");

exports.logout_get = (req, res) => {
  req.logout();
  res.redirect("/");
}

exports.sign_up_page_get = function(req, res, next) {
    res.render('sign_up')
}

exports.sign_up_page_post = [
    body("username").trim().isLength({ min: 1 }).escape().withMessage("Username must be at least 6 characters."),
	body("password").trim().isLength({ min: 1 }).escape().withMessage("Password must be at least 6 characters."),
    body("confirmPassword").trim().isLength({ min: 1 }).escape().withMessage("Password must be at least 6 characters.")
    .custom(async (value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Passwords must be the same')
        } else {
            return true;
        }
    }), 
    
    async function(req, res, next) {
    
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log("Password aint matching, fool"); //errors is not empty?
            return res.render("sign_up", { title: "Sign Up", passwordConfirmationError: "Password does not match" });
        } else {
            bcrypt.hash(req.body.password, 10, async (err, hashedPassword) =>{
                if (err) {
                    return next (err)
                } else {
                    const user = new User({
                        username: req.body.username,
                        password: hashedPassword,
                    });
                    const result = user.save()
                    res.redirect('/')   
                }
            })
        }  
        }
]

exports.login_get = async  function(req, res, next) {
    try {
        const messages = await Message.find().sort([["timestamp", "descending"]]).populate("user");
        res.render('index', {
            title: "The Forums",
            user: req.user,
            messages: messages
        });
    } catch (err) {
        return next(err)
    }
}
exports.login_post = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
    // failureFlash: true
  });

  exports.access_get = function(req, res,  next) {
    // NOT REGISTERIG RES.LOCALS.CURRENTUSER
    if (req.user) { 
        res.render('member_form', {
            user: req.user
        })
    } else {
        res.redirect('/')
    }
  }

  //redirect to login if not logged in yet
  exports.access_post = [
    body("access").trim().isLength({ min: 1 }).escape().withMessage("Passcode must be specified."),
    
    async (req, res, next) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        // If there is an error submitting the member validation form, re-render the form with an error
        return res.render("member_form", { title: "Become a Member", user: req.user._id, errors: errors.array() });
      } else if (req.body.access != "dickwad69") {
        return res.render("member_form", { title: "Become a Member", user: req.user._id, passcodeError: "Wrong Passcode" });
      }
  
      const user = new User(req.user);
      user.membership = true;
  
      await User.findByIdAndUpdate(req.user._id, user, {}, (err) => {
        if (err) return next(err);
        return res.redirect("/");
      });
    },
  ];