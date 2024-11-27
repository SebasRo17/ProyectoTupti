const express = require('express');
const passport = require('passport');

class AuthController {
  async googleAuth(req, res, next) {
    passport.authenticate('google', { 
      scope: ['profile', 'email'] 
    })(req, res, next);
  }

  async googleCallback(req, res, next) {
    passport.authenticate('google', {
      successRedirect: '/dashboard',
      failureRedirect: '/login'
    })(req, res, next);
  }

  async getDashboard(req, res) {
    if (!req.user) {
      return res.redirect('/login');
    }
    res.json({ message: 'Logged in successfully', user: req.user });
  }
}

module.exports = new AuthController();