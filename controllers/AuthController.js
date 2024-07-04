const { v4: uuidv4 } = require('uuid');
const { redisClient, findUserByEmailAndPassword, getUserByToken } = require('../utils');

exports.getConnect = async (req, res) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const [email, password] = Buffer.from(authorization.slice(6), 'base64').toString().split(':');

  const user = await findUserByEmailAndPassword(email, password);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = uuidv4();
  const key = `auth_${token}`;
  await redisClient.set(key, user._id, 'EX', 60 * 60 * 24);

  res.status(200).json({ token });
};

exports.getDisconnect = async (req, res) => {
  const token = req.headers['x-token'];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const key = `auth_${token}`;
  await redisClient.del(key);

  res.status(204).send();
};
