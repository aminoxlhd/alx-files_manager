const { checkRedisHealth, checkDbHealth, countUsers, countFiles } = require('../utils');

exports.getStatus = async (req, res) => {
  const redisAlive = await checkRedisHealth();
  const dbAlive = await checkDbHealth();
  res.status(200).json({ redis: redisAlive, db: dbAlive });
};

exports.getStats = async (req, res) => {
  const userCount = await countUsers();
  const fileCount = await countFiles();
  res.status(200).json({ users: userCount, files: fileCount });
};
