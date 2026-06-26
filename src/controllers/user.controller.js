const userService = require('../services/user.service');

async function getEvents(req, res) {
  const events = await userService.getAllEvents();
  return res.json(events);
}

async function getUsers(req, res) {
  const users = await userService.getAllUsers();
  return res.json(users);
}

function getHealth(req, res) {
  return res.json({ status: 'ok' });
}

module.exports = {
  getEvents,
  getUsers,
  getHealth,
};