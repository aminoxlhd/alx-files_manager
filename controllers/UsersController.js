const { hashPassword, createUser } = require('../utils');
const { ValidationError } = require('express-validator');

exports.postNew = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { email, password } = req.body;

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ error: 'Already exist' });
  }

  const hashedPassword = await hashPassword(password);

  const user = await createUser({ email, password: hashedPassword });

  res.status(201).json({ id: user._id, email: user.email });
};
