const router = require('express').Router();
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');

// Register

router.post('/register', async (req, res) => {
  // VALIDATING DATA BEOFRE
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking if a user is already registered

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send('Email already registered');

  // Hash the password

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Creating a new User

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });

  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Login

router.post('/login', async (req, res) => {
  // VALIDATING DATA BEOFRE
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking if the user exists

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('The email is not found.');

  // Checking the password

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid password.');

  res.send('Logged in');
});

module.exports = router;
