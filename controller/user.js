const User = require('../model/user');
const jwt = require('jsonwebtoken');
const { validate } = require('../helpers/utilities')
const { registerUserSchema, loginUserSchema } = require('../validation/user');
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

exports.register = async (req, res) => {
  try {
    const validatedData = await validate(req.body, registerUserSchema)
    if (validatedData.error) {
      return res.status(400).json({ 
        message: validatedData.error.details[0].message 
      });
    }
    const { name, email, password } = validatedData;
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Name, email and password are required' 
      });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    user = new User({
      name,
      email,
      password
    });
    await user.save();
    const token = generateToken(user);
    res.status(201).json({
      message: "User Registered Successfully",
      token,
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const validatedData = await validate(req.body, loginUserSchema);

    if (validatedData.error) {
      return res.status(400).json({ message: validatedData.error.details[0].message });
    }

    const { email, password } = validatedData;
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.status(200).json({
      message: 'Login Successful',
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
