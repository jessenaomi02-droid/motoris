-- Safe to run repeatedly (IF NOT EXISTS). Run with: npm run migrate

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          VARCHAR(20) NOT NULL CHECK (role IN ('admin','driver','mechanic','finance','manager')),
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicles (
  id              SERIAL PRIMARY KEY,
  registration_no VARCHAR(20) NOT NULL UNIQUE,
  make            VARCHAR(50) NOT NULL,
  model           VARCHAR(50) NOT NULL,
  year            INTEGER,
  fuel_type       VARCHAR(20),
  current_mileage NUMERIC(10,1) NOT NULL DEFAULT 0,
  status          VARCHAR(20) NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active','inactive','under_maintenance','unavailable')),
  ownership       VARCHAR(100),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS drivers (
  id                  SERIAL PRIMARY KEY,
  user_id             INTEGER UNIQUE REFERENCES users(id) ON DELETE SET NULL,
  name                VARCHAR(100) NOT NULL,
  phone               VARCHAR(30),
  licence_no          VARCHAR(50) UNIQUE,
  licence_expiry      DATE,
  assigned_vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS trips (
  id             SERIAL PRIMARY KEY,
  vehicle_id     INTEGER NOT NULL REFERENCES vehicles(id),
  driver_id      INTEGER NOT NULL REFERENCES drivers(id),
  destination    VARCHAR(200) NOT NULL,
  purpose        TEXT,
  departure_time TIMESTAMPTZ,
  arrival_time   TIMESTAMPTZ,
  start_mileage  NUMERIC(10,1),
  end_mileage    NUMERIC(10,1),
  CHECK (end_mileage IS NULL OR end_mileage >= start_mileage)
);

CREATE TABLE IF NOT EXISTS fuel_logs (
  id         SERIAL PRIMARY KEY,
  vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
  date       DATE NOT NULL,
  fuel_type  VARCHAR(20),
  quantity   NUMERIC(8,2) NOT NULL CHECK (quantity > 0),
  cost       NUMERIC(12,2) NOT NULL CHECK (cost >= 0),
  station    VARCHAR(100),
  mileage    NUMERIC(10,1)
);

CREATE TABLE IF NOT EXISTS maintenance (
  id                SERIAL PRIMARY KEY,
  vehicle_id        INTEGER NOT NULL REFERENCES vehicles(id),
  service_type      VARCHAR(100) NOT NULL,
  date              DATE NOT NULL,
  mileage           NUMERIC(10,1),
  parts_replaced    TEXT,
  labour_cost       NUMERIC(12,2) DEFAULT 0,
  total_cost        NUMERIC(12,2) DEFAULT 0,
  provider          VARCHAR(100),
  next_service_date DATE
);

CREATE TABLE IF NOT EXISTS documents (
  id          SERIAL PRIMARY KEY,
  vehicle_id  INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  type        VARCHAR(30) NOT NULL CHECK (type IN ('insurance','inspection','licence','other')),
  number      VARCHAR(100),
  issue_date  DATE,
  expiry_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS incidents (
  id           SERIAL PRIMARY KEY,
  vehicle_id   INTEGER NOT NULL REFERENCES vehicles(id),
  driver_id    INTEGER REFERENCES drivers(id),
  problem      VARCHAR(150) NOT NULL,
  location     VARCHAR(150),
  description  TEXT,
  status       VARCHAR(30) NOT NULL DEFAULT 'pending_inspection'
               CHECK (status IN ('pending_inspection','in_repair','resolved')),
  action_taken TEXT,
  reported_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
  id          SERIAL PRIMARY KEY,
  vehicle_id  INTEGER REFERENCES vehicles(id),
  category    VARCHAR(30) NOT NULL
              CHECK (category IN ('fuel','repairs','spare_parts','maintenance','insurance','licensing','other')),
  amount      NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  date        DATE NOT NULL,
  description TEXT
);
