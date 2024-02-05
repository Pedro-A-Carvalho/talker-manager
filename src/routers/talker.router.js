const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const router = express.Router();

const getTalkers = async () => {
  const talkers = JSON.parse(await fs.readFile(path.resolve('src', 'talker.json'), 'utf-8'));
  return talkers;
};

const validateUserLogged = (req, res, next) => {
  if (!('authorization' in req.headers)) {
    return res.status(401).json({ message: 'Token não encontrado' }); 
  }
  const { authorization } = req.headers;
  if (authorization.length !== 16) {
    return res.status(401).json({ message: 'Token inválido' }); 
  }
  next();
};

const validateName = (req, res, next) => {
  if (!('name' in req.body)) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' }); 
  }
  const { name } = req.body;
  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' }); 
  }
  next();
};

const validateAge = (req, res, next) => {
  if (!('age' in req.body)) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' }); 
  }
  const { age } = req.body;
  if (!Number.isInteger(age) || age <= 18) {
    return res.status(400)
      .json({ message: 'O campo "age" deve ser um número inteiro igual ou maior que 18' }); 
  }
  next();
};

const validateTalk = (req, res, next) => {
  if (!('talk' in req.body)) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' }); 
  }
  next();
};

const validateWatched = (req, res, next) => {
  const { talk } = req.body;
  if (!('watchedAt' in talk)) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' }); 
  }
  const { watchedAt } = talk;
  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/;
  if (!regex.test(watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

const validateRate = (req, res, next) => {
  const { talk } = req.body;
  if (!('rate' in talk)) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' }); 
  }
  const { rate } = talk;
  if (!Number.isInteger(rate) || rate < 1 || rate > 5) {
    return res.status(400)
      .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }
  next();
};

router.get('/', async (req, res) => {
  const talkers = await getTalkers();
  res.status(200).json(talkers);
});

router.post('/', 
  validateUserLogged,
  validateName, 
  validateAge, 
  validateTalk, 
  validateWatched, 
  validateRate, async (req, res) => {
    const { name, age, talk } = req.body;
    const talkers = await getTalkers();
    const newTalker = {
      id: talkers.length + 1,
      name,
      age,
      talk,
    };
    talkers.push(newTalker);
    await fs.writeFile(path.resolve('src', 'talker.json'), JSON.stringify(talkers, null, 2));
    res.status(201).json(newTalker);
  });

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await getTalkers();
  const talker = talkers.find((aTalker) => aTalker.id === Number(id));
  if (!talker) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  res.status(200).json(talker);
});

router.put('/:id', 
  validateUserLogged,
  validateName, 
  validateAge, 
  validateTalk, 
  validateWatched, 
  validateRate, async (req, res) => {
    const { id } = req.params;
    const { name, age, talk } = req.body;
    const talkers = await getTalkers();
    const talker = talkers.find((aTalker) => aTalker.id === Number(id));
    if (!talker) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    talkers.filter((oneTalker) => oneTalker.id !== talker.id);
    talker.name = name;
    talker.age = age;
    talker.talk = talk;
    talkers.push(talker);
    await fs.writeFile(path.resolve('src', 'talker.json'), JSON.stringify(talkers, null, 2));
    res.status(200).json(talker);
  });

module.exports = router;