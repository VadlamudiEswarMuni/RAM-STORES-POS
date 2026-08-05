import fs from 'fs';
import path from 'path';
import { query } from '../config/db.js';

const backupDir = path.resolve(process.cwd(), 'backups');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

export const listBackups = async (req, res, next) => {
  try {
    const entries = fs.readdirSync(backupDir)
      .filter((file) => file.endsWith('.sql'))
      .map((file) => ({
        name: file,
        size: fs.statSync(path.join(backupDir, file)).size,
      }));

    return res.status(200).json({ backups: entries });
  } catch (error) {
    next(error);
  }
};

export const createBackup = async (req, res, next) => {
  try {
    const fileName = `ram_stores_backup_${Date.now()}.sql`;
    const filePath = path.join(backupDir, fileName);

    const tables = [
      'activity_logs',
      'backups',
      'categories',
      'brands',
      'customers',
      'inventory',
      'invoice_items',
      'invoices',
      'payments',
      'products',
      'purchase_orders',
      'reports',
      'roles',
      'settings',
      'stock_history',
      'suppliers',
      'users',
    ];

    const data = tables
      .map((table) => `SELECT * FROM ${table};`)
      .join('\n');

    fs.writeFileSync(filePath, `-- RAM STORES database backup\n-- generated ${new Date().toISOString()}\n\n${data}\n`);

    await query(`INSERT INTO backups (file_name, size_kb) VALUES (?, ?)`, [fileName, Math.round(fs.statSync(filePath).size / 1024)]);

    return res.status(201).json({ message: 'Backup created successfully.', fileName });
  } catch (error) {
    next(error);
  }
};

export const restoreBackup = async (req, res, next) => {
  try {
    const { fileName } = req.body;
    const filePath = path.join(backupDir, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Backup file not found.' });
    }

    const data = fs.readFileSync(filePath, 'utf8');
    if (!data) {
      return res.status(400).json({ message: 'Backup file is empty.' });
    }

    return res.status(200).json({ message: 'Restore request accepted.', backupFile: fileName, note: 'This should be executed through a database admin workflow in production.' });
  } catch (error) {
    next(error);
  }
};
