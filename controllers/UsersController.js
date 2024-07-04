const { getUserByToken } = require('../utils');

exports.getMe = async (req, res) => {
  const token = req.headers['x-token'];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await getUserByToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.status(200).json({ id: user._id, email: user.email });
};
