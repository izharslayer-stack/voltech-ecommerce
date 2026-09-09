-- ============================================================
--  Voltech E-Commerce — PostgreSQL Schema
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── CUSTOMERS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customers (
  id            TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  email         TEXT        NOT NULL UNIQUE,
  first_name    TEXT        NOT NULL,
  last_name     TEXT        NOT NULL,
  password_hash TEXT        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── ADMIN USERS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id            TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  email         TEXT        NOT NULL UNIQUE,
  name          TEXT        NOT NULL,
  password_hash TEXT        NOT NULL,
  avatar        TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed the demo admin account (password: admin123)
INSERT INTO admin_users (email, name, password_hash)
VALUES (
  'admin@voltech.com',
  'Admin User',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' -- bcrypt of 'admin123'
)
ON CONFLICT (email) DO NOTHING;

-- ─── PRODUCTS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id               TEXT        PRIMARY KEY,
  name             TEXT        NOT NULL,
  slug             TEXT        NOT NULL UNIQUE,
  category         TEXT        NOT NULL,
  price            NUMERIC(10,2) NOT NULL,
  original_price   NUMERIC(10,2),
  description      TEXT        NOT NULL DEFAULT '',
  long_description TEXT,
  image            TEXT        NOT NULL DEFAULT '',
  images           TEXT[]      NOT NULL DEFAULT '{}',
  stock            INTEGER     NOT NULL DEFAULT 0,
  sku              TEXT,
  rating           NUMERIC(3,2),
  featured         BOOLEAN     NOT NULL DEFAULT FALSE,
  status           TEXT        NOT NULL DEFAULT 'active' CHECK (status IN ('active','draft')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug     ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_status   ON products(status);

-- ─── CARTS ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS carts (
  id          TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  customer_id TEXT        REFERENCES customers(id) ON DELETE CASCADE,
  session_id  TEXT,  -- for guest carts
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT cart_owner CHECK (customer_id IS NOT NULL OR session_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS cart_items (
  id         TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  cart_id    TEXT        NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id TEXT        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity   INTEGER     NOT NULL DEFAULT 1 CHECK (quantity > 0),
  added_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(cart_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);

-- ─── ORDERS ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               TEXT        PRIMARY KEY,
  customer_id      TEXT        REFERENCES customers(id) ON DELETE SET NULL,
  -- Contact / shipping snapshot (for guest + logged-in)
  customer_name    TEXT        NOT NULL,
  customer_email   TEXT        NOT NULL,
  customer_phone   TEXT,
  shipping_address TEXT        NOT NULL,
  shipping_city    TEXT        NOT NULL,
  shipping_state   TEXT,
  shipping_postal  TEXT        NOT NULL,
  shipping_country TEXT        NOT NULL,
  -- Financials
  subtotal         NUMERIC(10,2) NOT NULL,
  shipping_cost    NUMERIC(10,2) NOT NULL DEFAULT 0,
  total            NUMERIC(10,2) NOT NULL,
  -- Status
  status           TEXT        NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','processing','shipped','delivered')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id    ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status         ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at     ON orders(created_at DESC);

-- ─── ORDER ITEMS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id               TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  order_id         TEXT        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id       TEXT        REFERENCES products(id) ON DELETE SET NULL,
  -- Snapshot at time of purchase (price may change later)
  product_name     TEXT        NOT NULL,
  product_image    TEXT        NOT NULL DEFAULT '',
  product_category TEXT        NOT NULL DEFAULT '',
  unit_price       NUMERIC(10,2) NOT NULL,
  quantity         INTEGER     NOT NULL DEFAULT 1 CHECK (quantity > 0),
  line_total       NUMERIC(10,2) GENERATED ALWAYS AS (unit_price * quantity) STORED
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id   ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- ─── UPDATED_AT TRIGGER ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_carts_updated_at
  BEFORE UPDATE ON carts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
