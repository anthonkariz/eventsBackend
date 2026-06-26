const { signToken } = require('../config/passport');
const userService = require('../services/user.service');

async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedName = String(name).trim();

  const existingUser = await userService.findByEmail(normalizedEmail);

  if (existingUser) {
    return res.status(409).json({ error: 'Email is already registered' });
  }

  try {
    const user = await userService.createUser({
      name: normalizedName,
      email: normalizedEmail,
      password,
    });
    const token = signToken({ email: user.email, user_id: user.id });

    console.log('User registered:', user.email);
    return res.status(201).json({ user, token });
  } catch (error) {
    // PostgreSQL unique_violation (e.g. duplicate email)
    if (error && error.code === '23505') {
      return res.status(409).json({ error: 'Email is already registered' });
    }

    throw error;
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await userService.findByCredentials(email, password);

  if (!user) {
    console.log('Invalid login attempt:', email);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signToken({ email: user.email, user_id: user.id });
  const userData = { id: user.id, name: user.name, email: user.email };
  console.log('User logged in:', user.email);
  return res.json({ token, user: userData });
}

module.exports = {
  register,
  login,
};