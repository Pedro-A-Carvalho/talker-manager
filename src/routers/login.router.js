const express = require('express');

const router = express.Router();

const validateLogin = (req, res, next) => {
  const requiredProperties = ['email', 'password'];

  const hasProperties = requiredProperties.every((property) => property in req.body);

  if (!hasProperties) return res.status(400).json({ message: 'Invalid data' });

  const { email, password } = req.body;

  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (password.lenght <= 6) {
    return res.status(400).json({ message: 'Password must be more than 6 characters' });
  }
  next();
};

function generateToken(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

router.post('/', validateLogin, async (req, res) => {
//   const { email, password } = req.body;
  const data = {
    token: generateToken(16),
  };
  res.status(200).json(data);
});

module.exports = router;