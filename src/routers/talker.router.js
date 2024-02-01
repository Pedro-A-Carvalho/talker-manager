const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const router = express.Router();

const getTalkers = async () => {
  const talkers = JSON.parse(await fs.readFile(path.resolve('src', 'talker.json'), 'utf-8'));
  return talkers;
};

router.get('/', async (req, res) => {
  const talkers = await getTalkers();
  res.status(200).json(talkers);
});

module.exports = router;