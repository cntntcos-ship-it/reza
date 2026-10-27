CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id serial PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('gender', 'product')),
  description text,
  image_url text,
  banner_url text,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id serial PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  gender text NOT NULL CHECK (gender IN ('women', 'men', 'unisex')),
  category_slug text NOT NULL REFERENCES categories(slug),
  price integer NOT NULL CHECK (price >= 0),
  compare_at_price integer,
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sizes text[] NOT NULL DEFAULT '{}',
  colors jsonb NOT NULL DEFAULT '[]',
  images jsonb NOT NULL DEFAULT '[]',
  description text NOT NULL,
  details text,
  care text,
  is_featured boolean NOT NULL DEFAULT false,
  is_new boolean NOT NULL DEFAULT false,
  rating_avg numeric(2, 1),
  rating_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id serial PRIMARY KEY,
  order_number text UNIQUE NOT NULL,
  user_id integer REFERENCES users(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  address jsonb NOT NULL,
  items jsonb NOT NULL,
  subtotal integer NOT NULL,
  shipping_cost integer NOT NULL,
  total integer NOT NULL,
  shipping_method text NOT NULL,
  payment_status text NOT NULL DEFAULT 'unpaid',
  order_status text NOT NULL DEFAULT 'awaiting_payment',
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id serial PRIMARY KEY,
  email text UNIQUE NOT NULL,
  consent boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'subscribed',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_gender_idx ON products (gender);
CREATE INDEX IF NOT EXISTS products_category_idx ON products (category_slug);
CREATE INDEX IF NOT EXISTS orders_email_idx ON orders (customer_email);
