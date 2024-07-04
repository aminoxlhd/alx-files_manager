const { ObjectId } = require('mongodb');
const { fs } = require('fs');
const { promisify } = require('util');
const {
  getUserByToken,
  findFileById,
} = require('../utils');

const readFileAsync = promisify(fs.readFile);

exports.getFile = async (req, res) => {
  const fileId = req.params.id;
  if (!ObjectId.isValid(fileId)) {
    return res.status(400).json({ error: 'Invalid file ID' });
  }

  const file = await findFileById(fileId);

  if (!file) {
    return res.status(404).json({ error: 'Not found' });
  }

  if (!file.isPublic) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(404).json({ error: 'Not found' });
    }

    const user = await getUserByToken(token);
    if (!user || user._id.toString() !== file.userId.toString()) {
      return res.status(404).json({ error: 'Not found' });
    }
  }

  if (file.type === 'folder') {
    return res.status(400).json({ error: 'A folder doesn\'t have content' });
  }

  const filePath = file.localPath;
  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Not found' });
  }

  const contentType = mime.lookup(file.name);
  const fileContent = await readFileAsync(filePath);

  res.setHeader('Content-Type', contentType);
  res.send(fileContent);
};
