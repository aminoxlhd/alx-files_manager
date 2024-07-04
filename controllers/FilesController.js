const { v4: uuidv4 } = require('uuid');
const { fs, createWriteStream, mkdirSync, existsSync } = require('fs');
const { promisify } = require('util');
const {
  getUserByToken,
  createFile,
  findFileById,
  findParentFile
} = require('../utils');
const { FOLDER_PATH = '/tmp/files_manager' } = process.env;

const writeFileAsync = promisify(fs.writeFile);

exports.postUpload = async (req, res) => {
  const token = req.headers['x-token'];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await getUserByToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { name, type, data, parentId, isPublic = false } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Missing name' });
  }

  const acceptedTypes = ['folder', 'file', 'image'];
  if (!type || !acceptedTypes.includes(type)) {
    return res.status(400).json({ error: 'Missing type' });
  }

  if (type !== 'folder' && !data) {
    return res.status(400).json({ error: 'Missing data' });
  }

  if (parentId) {
    const parentFile = await findFileById(parentId);
    if (!parentFile) {
      return res.status(400).json({ error: 'Parent not found' });
    }
    if (parentFile.type !== 'folder') {
      return res.status(400).json({ error: 'Parent is not a folder' });
    }
  }

  const newFile = {
    userId: user._id,
    name,
    type,
    isPublic,
    parentId: parentId || 0,
  };

  if (type === 'folder') {
    await createFile(newFile);
    return res.status(201).json(newFile);
  }

  const filename = `${uuidv4()}`;
  const filePath = `${FOLDER_PATH}/${filename}`;

  if (!existsSync(FOLDER_PATH)) {
    mkdirSync(FOLDER_PATH, { recursive: true });
  }

  const writeStream = createWriteStream(filePath);
  await writeFileAsync(writeStream, Buffer.from(data, 'base64'));

  newFile.localPath = filePath;
  await createFile(newFile);

  return res.status(201).json(newFile);
};
