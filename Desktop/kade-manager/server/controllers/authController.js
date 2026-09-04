const asyncWrapper = require('../middleware/asyncWrapper');
const authService = require('../services/authService');

const register = asyncWrapper(async (req, res) => {
  const { name, email, password, role } = req.body;
  const result = await authService.registerUser({ name, email, password, role });
  res.status(201).json({ message: 'User registered successfully', ...result });
});

const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });
  res.status(200).json({ message: 'Login successful', ...result });
});

const getMe = asyncWrapper(async (req, res) => {
  // req.user is already populated by protect middleware
  res.status(200).json({ user: req.user });
});

module.exports = { register, login, getMe };
