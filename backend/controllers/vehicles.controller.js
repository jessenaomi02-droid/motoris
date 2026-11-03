
const pool = require('../config/db');

const ALLOWED_STATUSES = [
  'active',
  'inactive',
  'under_maintenance',
  'unavailable',
];

const has = (obj, key) =>
  Object.prototype.hasOwnProperty.call(obj, key);

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validateVehicleFields(body, isUpdate = false) {
  const allowedFields = [
    'registration_no',
    'make',
    'model',
    'year',
    'fuel_type',
    'current_mileage',
    'status',
    'ownership',
  ];

  const unknownFields = Object.keys(body).filter(
    key => !allowedFields.includes(key)
  );

  if (unknownFields.length) {
    return { error: `Unknown field(s): ${unknownFields.join(', ')}` };
  }

  if (!isUpdate) {
    for (const field of ['registration_no', 'make', 'model']) {
      if (
        typeof body[field] !== 'string' ||
        !body[field].trim()
      ) {
        return { error: `${field} is required` };
      }
    }
  }

  if (isUpdate && !Object.keys(body).length) {
    return { error: 'Provide at least one field to update' };
  }

  const data = {};

  for (const field of ['registration_no', 'make', 'model']) {
    if (!has(body, field)) continue;

    if (typeof body[field] !== 'string' || !body[field].trim()) {
      return { error: `${field} must be a non-empty string` };
    }

    const value = body[field].trim();

    const limits = {
      registration_no: 20,
      make: 50,
      model: 50,
    };

    if (value.length > limits[field]) {
      return { error: `${field} cannot exceed ${limits[field]} characters` };
    }

    data[field] =
      field === 'registration_no' ? value.toUpperCase() : value;
  }

  if (has(body, 'year')) {
    if (body.year === null) {
      data.year = null;
    } else {
      const year = Number(body.year);

      if (
        !Number.isInteger(year) ||
        year < 1886 ||
        year > 2100
      ) {
        return { error: 'year must be a valid integer between 1886 and 2100' };
      }

      data.year = year;
    }
  }

  if (has(body, 'fuel_type')) {
    if (body.fuel_type === null || body.fuel_type === '') {
      data.fuel_type = null;
    } else if (
      typeof body.fuel_type !== 'string' ||
      body.fuel_type.trim().length > 20
    ) {
      return { error: 'fuel_type must not exceed 20 characters' };
    } else {
      data.fuel_type = body.fuel_type.trim();
    }
  }

  if (has(body, 'current_mileage')) {
    const mileage = Number(body.current_mileage);

    if (
      body.current_mileage === null ||
      body.current_mileage === '' ||
      !Number.isFinite(mileage) ||
      mileage < 0 ||
      mileage > 99999999.9
    ) {
      return { error: 'current_mileage must be a non-negative number within the database limit' };
    }

    data.current_mileage = mileage;
  }

  if (has(body, 'status')) {
    if (!ALLOWED_STATUSES.includes(body.status)) {
      return { error: `status must be one of: ${ALLOWED_STATUSES.join(', ')}` };
    }

    data.status = body.status;
  }

  if (has(body, 'ownership')) {
    if (body.ownership === null || body.ownership === '') {
      data.ownership = null;
    } else if (
      typeof body.ownership !== 'string' ||
      body.ownership.trim().length > 100
    ) {
      return { error: 'ownership must not exceed 100 characters' };
    } else {
      data.ownership = body.ownership.trim();
    }
  }

  return { data };
}

// GET /api/vehicles
exports.getAll = async (req, res, next) => {
  try {
    const { status } = req.query;

    if (status && !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Use: ${ALLOWED_STATUSES.join(', ')}`,
      });
    }

    const result = status
      ? await pool.query(
          'SELECT * FROM vehicles WHERE status = $1 ORDER BY id DESC',
          [status]
        )
      : await pool.query(
          'SELECT * FROM vehicles ORDER BY id DESC'
        );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// GET /api/vehicles/:id
exports.getOne = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({ message: 'Invalid vehicle ID' });
    }

    const { rows } = await pool.query(
      'SELECT * FROM vehicles WHERE id = $1',
      [id]
    );

    if (!rows[0]) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// POST /api/vehicles
exports.create = async (req, res, next) => {
  try {
    const { data, error } = validateVehicleFields(req.body);

    if (error) {
      return res.status(400).json({ message: error });
    }

    const {
      registration_no,
      make,
      model,
      year = null,
      fuel_type = null,
      current_mileage = 0,
      status = 'active',
      ownership = null,
    } = data;

    const { rows } = await pool.query(
      `INSERT INTO vehicles
       (registration_no, make, model, year, fuel_type,
        current_mileage, status, ownership)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        registration_no,
        make,
        model,
        year,
        fuel_type,
        current_mileage,
        status,
        ownership,
      ]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// PUT /api/vehicles/:id
exports.update = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({ message: 'Invalid vehicle ID' });
    }

    const { data, error } = validateVehicleFields(req.body, true);

    if (error) {
      return res.status(400).json({ message: error });
    }

    const fields = Object.keys(data);

    if (!fields.length) {
      return res.status(400).json({
        message: 'Provide at least one valid field to update',
      });
    }

    const values = fields.map(field => data[field]);

    const setClause = fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(', ');

    values.push(id);

    const { rows } = await pool.query(
      `UPDATE vehicles
       SET ${setClause}
       WHERE id = $${values.length}
       RETURNING *`,
      values
    );

    if (!rows[0]) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/vehicles/:id
exports.remove = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({ message: 'Invalid vehicle ID' });
    }

    const { rowCount } = await pool.query(
      'DELETE FROM vehicles WHERE id = $1',
      [id]
    );

    if (!rowCount) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    if (err.code === '23503') {
      return res.status(409).json({
        message: 'This vehicle has related records and cannot be deleted.',
      });
    }

    next(err);
  }
};
