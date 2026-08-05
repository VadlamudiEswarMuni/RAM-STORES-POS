import { query, execute } from '../config/db.js';

export const getSettings = async (req, res, next) => {
  try {
    const rows = await query(`SELECT key_name, value_text FROM settings ORDER BY key_name ASC`);
    const settings = Object.fromEntries(rows.map((entry) => [entry.key_name, entry.value_text]));
    return res.status(200).json({ settings });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const updates = req.body;

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ message: 'Valid settings payload is required.' });
    }

    for (const [key, value] of Object.entries(updates)) {
      await execute(
        `INSERT INTO settings (key_name, value_text) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE value_text = VALUES(value_text)`,
        [key, String(value)]
      );
    }

    return res.status(200).json({ message: 'Settings updated successfully.' });
  } catch (error) {
    next(error);
  }
};
