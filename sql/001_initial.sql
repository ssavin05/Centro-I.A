PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, email TEXT NOT NULL COLLATE NOCASE UNIQUE,
  name TEXT NOT NULL, password_hash TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK(account_type IN ('user','company')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  csrf_token TEXT NOT NULL, expires_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE TABLE IF NOT EXISTS businesses (
  id TEXT PRIMARY KEY, owner_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, category TEXT NOT NULL DEFAULT 'Otro',
  description TEXT NOT NULL DEFAULT '', city TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '', phone TEXT NOT NULL DEFAULT '',
  brand_color TEXT NOT NULL DEFAULT '#d4a83d',
  timezone TEXT NOT NULL DEFAULT 'America/Tijuana',
  plan TEXT NOT NULL DEFAULT 'Gratis' CHECK(plan IN ('Gratis','Pro')),
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','disabled')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_business_owner ON businesses(owner_id);
CREATE TABLE IF NOT EXISTS team_members (
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK(role IN ('owner','admin','staff')),
  joined_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY(business_id,user_id)
);
CREATE TABLE IF NOT EXISTS invitations (
  id TEXT PRIMARY KEY, business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  email TEXT NOT NULL COLLATE NOCASE, role TEXT NOT NULL CHECK(role IN ('admin','staff')),
  token_hash TEXT NOT NULL UNIQUE, expires_at TEXT NOT NULL,
  accepted_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY, business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL, address TEXT NOT NULL DEFAULT '', city TEXT NOT NULL DEFAULT '',
  hours TEXT NOT NULL DEFAULT '', active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY, business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  location_id TEXT REFERENCES locations(id) ON DELETE SET NULL,
  title TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Evento', date TEXT NOT NULL, time TEXT NOT NULL,
  capacity INTEGER NOT NULL CHECK(capacity BETWEEN 1 AND 100000),
  price_cents INTEGER NOT NULL DEFAULT 0 CHECK(price_cents >= 0),
  status TEXT NOT NULL DEFAULT 'published' CHECK(status IN ('published','cancelled','draft')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_events_business_date ON events(business_id,date,time);
CREATE TABLE IF NOT EXISTS reservations (
  id TEXT PRIMARY KEY, event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK(status IN ('confirmed','cancelled','attended','no_show')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_reservation_one_active ON reservations(event_id,user_id) WHERE status IN ('confirmed','attended','no_show');
CREATE INDEX IF NOT EXISTS idx_reservation_event_status ON reservations(event_id,status);
CREATE TABLE IF NOT EXISTS memberships (
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL DEFAULT 0 CHECK(points >= 0),
  visits INTEGER NOT NULL DEFAULT 0 CHECK(visits >= 0),
  last_visit_at TEXT, joined_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY(business_id,user_id)
);
CREATE TABLE IF NOT EXISTS visits (
  id TEXT PRIMARY KEY, business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  location_id TEXT REFERENCES locations(id) ON DELETE SET NULL,
  points INTEGER NOT NULL CHECK(points BETWEEN 0 AND 1000),
  note TEXT NOT NULL DEFAULT '',
  idempotency_key TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(business_id,idempotency_key)
);
CREATE INDEX IF NOT EXISTS idx_visits_business_date ON visits(business_id,created_at);
CREATE TABLE IF NOT EXISTS rewards (
  id TEXT PRIMARY KEY, business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
  cost INTEGER NOT NULL CHECK(cost BETWEEN 1 AND 1000000),
  stock INTEGER CHECK(stock >= 0),
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS redemptions (
  id TEXT PRIMARY KEY, reward_id TEXT NOT NULL REFERENCES rewards(id),
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cost INTEGER NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_redemptions_business ON redemptions(business_id,created_at);
CREATE TABLE IF NOT EXISTS ledger (
  id TEXT PRIMARY KEY, business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  delta INTEGER NOT NULL, reason TEXT NOT NULL,
  ref_id TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_ledger_member ON ledger(business_id,user_id,created_at);
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY, business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL, message TEXT NOT NULL,
  audience TEXT NOT NULL DEFAULT 'Todos', channel TEXT NOT NULL DEFAULT 'Correo',
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status='draft'),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL, detail TEXT NOT NULL DEFAULT '',
  read INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY, business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  action TEXT NOT NULL, detail TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_audit_business ON audit_log(business_id,created_at);
CREATE TABLE IF NOT EXISTS follows (
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY(business_id,user_id)
);