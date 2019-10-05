const router = require('express').Router();
const User = require('../models/User');
const { registerValidation } = require('../validation');

router.post('/register', async (req, res) => {
  // VALIDATING DATA BEOFRE
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking if a user is already registered

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send('Email already registered');

  // Creating a new User

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
