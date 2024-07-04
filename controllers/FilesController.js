const { ObjectId } = require('mongodb');

const {
  getUserByToken,
  findFileById,
  getFilesByUserAndParentId
} = require('../utils');

exports.getShow = async (req, res) => {
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

  res.status(200).json(file);
};

exports.getIndex = async (req, res) => {
  const token = req.headers['x-token'];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await getUserByToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const parentId = req.query.parentId || 0;
  const page = parseInt(req.query.page || 0, 10);

  const files = await getFilesByUserAndParentId(user._id, parentId, page);

  res.status(200).json(files);
};
