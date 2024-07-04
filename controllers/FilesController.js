const { ObjectId } = require('mongodb');

const {
  getUserByToken,
  findFileById,
  updateFile
} = require('../utils');

exports.putPublish = async (req, res) => {
  const token = req.headers['x-token'];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await getUserByToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const fileId = req.params.id;
  if (!ObjectId.isValid(fileId)) {
    return res.status(400).json({ error: 'Invalid file ID' });
  }

  const file = await findFileById(fileId);
  if (!file || file.userId.toString() !== user._id.toString()) {
    return res.status(404).json({ error: 'Not found' });
  }

  const updatedFile = {
    ...file,
    isPublic: true,
  };

  await updateFile(updatedFile);

  res.status(200).json(updatedFile);
};

exports.putUnpublish = async (req, res) => {
  const token = req.headers['x-token'];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await getUserByToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const fileId = req.params.id;
  if (!ObjectId.isValid(fileId)) {
    return res.status(400).json({ error: 'Invalid file ID' });
  }

  const file = await findFileById(fileId);
  if (!file || file.userId.toString() !== user._id.toString()) {
    return res.status(404).json({ error: 'Not found' });
  }

  const updatedFile = {
    ...file,
    isPublic: false,
  };

  await updateFile(updatedFile);

  res.status(200).json(updatedFile);
};
