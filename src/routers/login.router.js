const express = require('express');

const router = express.Router();

const validateLogin = (req, res, next) => {
  if (!('email' in req.body)) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' }); 
  }
  if (!('password' in req.body)) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' }); 
  }

  const { email, password } = req.body;

  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  if (password.length <= 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
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