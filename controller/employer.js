const Employer = require('../model/employer');
const jwt = require('jsonwebtoken');
const { validate } = require('../helpers/utilities');
const { registerEmployerSchema, loginEmployerSchema } = require('../validation/employer');

const generateToken = (employer) => {
  return jwt.sign(
    { id: employer._id, role: 'employer' },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

exports.registerEmployer = async (req, res) => {
  try {
    const validatedData = await validate(req.body, registerEmployerSchema);
    if (validatedData.error) {
      return res.status(400).json({
        message: validatedData.error.details[0].message
      });
    }
    const { name, email, password } = validatedData;
    let employer = await Employer.findOne({ email });
    if (employer) {
      return res.status(400).json({ message: 'Employer already exists' });
    }
    employer = new Employer({
      name,
      email,
      password
    });
    await employer.save();
    const token = generateToken(employer);
    res.status(201).json({
      message: "Employer Registered Successfully",
      token,
      data: employer
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.loginEmployer = async (req, res) => {
  try {
    const validatedData = await validate(req.body, loginEmployerSchema);
    if (validatedData.error) {
      return res.status(400).json({
        message: validatedData.error.details[0].message
      });
    }
    const { email, password } = validatedData;
    const employer = await Employer.findOne({ email });
    if (!employer) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await employer.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(employer);
    res.status(200).json({
      message: 'Login Successful',
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
