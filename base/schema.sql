-- SCHEMA ERP Atelier Meubles & Décoration (PostgreSQL)
-- Version : MCD final -> MPD SQL

-- =========================
-- 0. Extensions utiles
-- =========================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================
-- 1. USERS / ROLES
-- =========================
CREATE TABLE role (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  role_id INTEGER REFERENCES role(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);
ALTER TABLE users DROP COLUMN role_id;

CREATE TABLE user_role (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER NOT NULL REFERENCES role(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);
CREATE INDEX idx_user_role_user ON user_role(user_id);
CREATE INDEX idx_user_role_role ON user_role(role_id);

-- =========================
-- 2. EMPLOYEES
-- =========================
CREATE TABLE employee (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(250) NOT NULL,
  date_of_birth DATE,
  hire_date DATE,
  phone VARCHAR(50),
  email VARCHAR(150),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Index utile
CREATE INDEX idx_employee_user ON employee(user_id);

-- =========================
-- 3. JOBS / JOB TYPES / ASSOCIATIONS
-- =========================
CREATE TABLE job_type (
  id SERIAL PRIMARY KEY,
  code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  requires_materials BOOLEAN DEFAULT FALSE
);

CREATE TABLE job (
  id SERIAL PRIMARY KEY,
  job_type_id INTEGER REFERENCES job_type(id) ON DELETE SET NULL,
  name VARCHAR(250) NOT NULL,
  description TEXT,
  price_per_unit NUMERIC(18,4) DEFAULT 0,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Liaison job <-> product (si un job est lié à un ou plusieurs produits)
CREATE TABLE job_product (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES job(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE,
  UNIQUE(job_id, product_id)
);

-- Job <-> Employee (exécution d'un job)
CREATE TABLE job_employee (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES job(id) ON DELETE CASCADE,
  employee_id INTEGER NOT NULL REFERENCES employee(id) ON DELETE CASCADE,
  job_date DATE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  job_status VARCHAR(50) DEFAULT 'NOT_DONE',
  duration_minutes INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  UNIQUE(job_id, employee_id, job_date)
);

CREATE INDEX idx_job_employee_emp_date ON job_employee(employee_id, job_date);
CREATE INDEX idx_job_employee_job ON job_employee(job_id);

-- =========================
-- 4. PRODUCTS / VARIANTS / FABRICS / PRICE HISTORY / BOM
-- =========================
CREATE TABLE product_category (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL UNIQUE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE product (
  id SERIAL PRIMARY KEY,
  name VARCHAR(250) NOT NULL,
  category_id INTEGER REFERENCES product_category(id) ON DELETE SET NULL,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Each product is expected to have variants; we model variants separately.
CREATE TABLE fabric (
  id SERIAL PRIMARY KEY,
  name VARCHAR(250) NOT NULL,
  description TEXT,
  supplier_id INTEGER REFERENCES supplier(id) ON DELETE SET NULL
);

CREATE TABLE product_variant (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE,
  sku VARCHAR(150) NOT NULL UNIQUE,
  dimension VARCHAR(200),
  color VARCHAR(100),
  fabric_id INTEGER REFERENCES fabric(id) ON DELETE SET NULL,
  extra_price NUMERIC(18,4) DEFAULT 0,
  default_cost NUMERIC(18,4) DEFAULT 0,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Historique des prix par variante (gestion de l'évolution)
CREATE TABLE product_variant_price_history (
  id SERIAL PRIMARY KEY,
  product_variant_id INTEGER NOT NULL REFERENCES product_variant(id) ON DELETE CASCADE,
  cost_price NUMERIC(18,4) NOT NULL,
  selling_price NUMERIC(18,4) NOT NULL,
  effective_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  effective_end TIMESTAMP WITHOUT TIME ZONE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE INDEX idx_price_variant_date ON product_variant_price_history(product_variant_id, effective_date);

-- BOM (Bill of Materials) par VARIANTE
CREATE TABLE unit (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  symbol VARCHAR(10)
);

CREATE TABLE material (
  id SERIAL PRIMARY KEY,
  name VARCHAR(250) NOT NULL,
  unit_id INTEGER REFERENCES unit(id) ON DELETE SET NULL,
  description TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE bom (
  id SERIAL PRIMARY KEY,
  product_variant_id INTEGER NOT NULL REFERENCES product_variant(id) ON DELETE CASCADE,
  material_id INTEGER NOT NULL REFERENCES material(id) ON DELETE CASCADE,
  qty_needed NUMERIC(18,6) NOT NULL CHECK (qty_needed > 0),
  CONSTRAINT uq_bom_variant_material UNIQUE (product_variant_id, material_id)
);

-- =========================
-- 5. SUPPLIERS
-- =========================
CREATE TABLE supplier (
  id SERIAL PRIMARY KEY,
  name VARCHAR(250) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(150),
  address TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- =========================
-- 6. STOCK (materiels) & STOCK MOVEMENTS
-- =========================
CREATE TABLE stock (
  id SERIAL PRIMARY KEY,
  material_id INTEGER NOT NULL REFERENCES material(id) ON DELETE CASCADE,
  quantity NUMERIC(18,6) NOT NULL DEFAULT 0,
  unit_price NUMERIC(18,6),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  UNIQUE(material_id)
);

CREATE INDEX idx_stock_material ON stock(material_id);

CREATE TABLE stock_movement (
  id SERIAL PRIMARY KEY,
  material_id INTEGER NOT NULL REFERENCES material(id) ON DELETE CASCADE,
  movement_type VARCHAR(10) NOT NULL CHECK (movement_type IN ('IN','OUT')),
  quantity NUMERIC(18,6) NOT NULL,
  unit_price NUMERIC(18,6),
  reference_document VARCHAR(200),
  note TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE INDEX idx_stock_movement_material_date ON stock_movement(material_id, created_at);

-- =========================
-- 7. CLIENTS / DOCUMENTS / ITEMS / STATUSES
-- =========================
CREATE TABLE client (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(250) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(150),
  address TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE document_type (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL
);

CREATE TABLE document_status (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL
);

CREATE TABLE document (
  id SERIAL PRIMARY KEY,
  reference VARCHAR(120) NOT NULL UNIQUE,
  document_type_id INTEGER NOT NULL REFERENCES document_type(id),
  document_status_id INTEGER NOT NULL REFERENCES document_status(id),
  client_id INTEGER REFERENCES client(id) ON DELETE SET NULL,
  date_creation TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  date_update TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  total_ht NUMERIC(18,4) DEFAULT 0,
  total_ttc NUMERIC(18,4) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'MGA',
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_document_reference ON document(reference);
CREATE INDEX idx_document_client ON document(client_id);

-- Document items: **FORCE** usage of variant (product_variant_id NOT NULL).
CREATE TABLE document_item (
  id SERIAL PRIMARY KEY,
  document_id INTEGER NOT NULL REFERENCES document(id) ON DELETE CASCADE,
  product_variant_id INTEGER NOT NULL REFERENCES product_variant(id) ON DELETE RESTRICT,
  description TEXT,
  quantity NUMERIC(18,6) NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(18,4) NOT NULL,
  remise NUMERIC(18,4) DEFAULT 0,
  total_line_ht NUMERIC(18,4) NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE INDEX idx_document_item_document ON document_item(document_id);
CREATE INDEX idx_document_item_variant ON document_item(product_variant_id);

-- =========================
-- 8. TAXES / DOCUMENT TAX
-- =========================
CREATE TABLE tax (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  rate NUMERIC(8,4) NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE document_tax (
  id SERIAL PRIMARY KEY,
  document_id INTEGER NOT NULL REFERENCES document(id) ON DELETE CASCADE,
  tax_id INTEGER NOT NULL REFERENCES tax(id),
  amount NUMERIC(18,4) NOT NULL
);

-- =========================
-- 9. PAYMENTS
-- =========================
CREATE TABLE payment_method (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  details TEXT
);

CREATE TABLE payment_status (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL
);

CREATE TABLE payment (
  id SERIAL PRIMARY KEY,
  document_id INTEGER NOT NULL REFERENCES document(id) ON DELETE CASCADE,
  payment_method_id INTEGER REFERENCES payment_method(id),
  payment_status_id INTEGER NOT NULL REFERENCES payment_status(id),
  currency VARCHAR(10) DEFAULT 'MGA',
  date_payment TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  amount NUMERIC(18,4) NOT NULL,
  transaction_reference VARCHAR(255),
  validated BOOLEAN DEFAULT FALSE,
  validated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  validated_at TIMESTAMP WITHOUT TIME ZONE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE INDEX idx_payment_document ON payment(document_id);
CREATE INDEX idx_payment_status ON payment(payment_status_id);

-- =========================
-- 10. NOTIFICATIONS (simple)
-- =========================
CREATE TABLE notification_type (
  id SERIAL PRIMARY KEY,
  code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL
);

CREATE TABLE notification (
  id SERIAL PRIMARY KEY,
  notification_type_id INTEGER REFERENCES notification_type(id),
  message TEXT,
  receiver_id INTEGER REFERENCES users(id),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- =========================
-- 11. CONTRAINTES & VALEURS INITIALES UTILES
-- =========================

-- Valeurs par défaut pour document types / statuses / payment statuses / job types (exemples)
INSERT INTO document_type (code, name) VALUES
  ('QUOTE', 'Devis'),
  ('ORDER', 'Bon de commande'),
  ('DELIVERY', 'Bon de livraison'),
  ('INVOICE', 'Facture')
ON CONFLICT DO NOTHING;

INSERT INTO document_status (code, name) VALUES
  ('DRAFT', 'Brouillon'),
  ('VALIDATED', 'Validé'),
  ('CANCELED', 'Annulé'),
  ('PAID', 'Payé'),
  ('PARTIALLY_PAID', 'Payé partiellement')
ON CONFLICT DO NOTHING;

INSERT INTO payment_status (code, name) VALUES
  ('PENDING', 'En attente'),
  ('PARTIAL', 'Partiel'),
  ('PAID', 'Payé'),
  ('FAILED', 'Échoué')
ON CONFLICT DO NOTHING;

INSERT INTO job_type (code, name, requires_materials) VALUES
  ('CUT', 'Découpe tissu', TRUE),
  ('SEW', 'Couture', TRUE),
  ('IRON', 'Repassage', FALSE),
  ('CLEAN', 'Nettoyage atelier', FALSE)
ON CONFLICT DO NOTHING;

-- =========================
-- 12. INDEXS SUPPLÉMENTAIRES (PERF)
-- =========================
CREATE INDEX IF NOT EXISTS idx_product_category ON product(category_id);
CREATE INDEX IF NOT EXISTS idx_variant_product ON product_variant(product_id);
CREATE INDEX IF NOT EXISTS idx_variant_sku ON product_variant(sku);
CREATE INDEX IF NOT EXISTS idx_bom_variant ON bom(product_variant_id);
CREATE INDEX IF NOT EXISTS idx_material_name ON material(name);
CREATE INDEX IF NOT EXISTS idx_client_name ON client(full_name);


CREATE TABLE product_variant_eco (
    id SERIAL PRIMARY KEY,
    variant_id INTEGER REFERENCES product_variant(id) ON DELETE CASCADE,
    estimated_co2 DECIMAL(18,4),
    created_at TIMESTAMP DEFAULT now()
);

-- =========================
-- 13. EXEMPLES D'AIDE (OPTIONNEL)
-- =========================
-- Tu peux ensuite insérer prix actif par variante en ajoutant product_variant_price_history avec effective_end = NULL
-- Exemple d'usage : créer une ligne de document_item -> utilise product_variant_id et unit_price tiré du product_variant_price_history actif.

-- =========================
-- FIN DU SCHEMA
-- =========================
