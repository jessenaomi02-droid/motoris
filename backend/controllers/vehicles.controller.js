const pool = require('../config/db');

exports.getAll = async (req, res, next) => {
  try {
    const { status } = req.query;
    const { rows } = status
      ? await pool.query('SELECT * FROM vehicles WHERE status = $1 ORDER BY id DESC', [status])
      : await pool.query('SELECT * FROM vehicles ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM vehicles WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { registration_no, make, model, year, fuel_type, current_mileage, status, ownership } = req.body;
    if (!registration_no || !make || !model) {
      return res.status(400).json({ message: 'registration_no, make and model are required' });
    }
    const { rows } = await pool.query(
      `INSERT INTO vehicles (registration_no, make, model, year, fuel_type, current_mileage, status, ownership)
       VALUES ($1, $2, $3, $4, $5, COALESCE($6, 0), COALESCE($7, 'active'), $8) RETURNING *`,
      [registration_no.toUpperCase(), make, model, year, fuel_type, current_mileage, status, ownership]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { registration_no, make, model, year, fuel_type, current_mileage, status, ownership } = req.body;
    const { rows } = await pool.query(
      `UPDATE vehicles SET
         registration_no = COALESCE($1, registration_no),
         make            = COALESCE($2, make),
         model           = COALESCE($3, model),
         year            = COALESCE($4, year),
         fuel_type       = COALESCE($5, fuel_type),
         current_mileage = COALESCE($6, current_mileage),
         status          = COALESCE($7, status),
         ownership       = COALESCE($8, ownership)
       WHERE id = $9 RETURNING *`,
      [registration_no && registration_no.toUpperCase(), make, model, year, fuel_type, current_mileage, status, ownership, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM vehicles WHERE id = $1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ message: 'Vehicle not found' });
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    next(err);
  }
};
