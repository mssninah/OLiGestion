-- =======================================
-- 1️⃣ ROLES & PERMISSIONS
-- =======================================
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE permission (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE role_permission (
    role_id INT REFERENCES role(id),
    permission_id INT REFERENCES permission(id),
    assigned_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY(role_id, permission_id)
);

-- =======================================
-- 2️⃣ EMPLOYEES
-- =======================================
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    hire_date DATE,
    phone VARCHAR(50),
    email VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE employee_action (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employee(id),
    action_type VARCHAR(50),
    action_date DATE,
    comment TEXT
);

-- =======================================
-- 3️⃣ USERS (OPTIONNEL)
-- =======================================
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    employee_id INT REFERENCES employee(id),
    role_id INT REFERENCES role(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- =======================================
-- 4️⃣ PRODUCTS, VARIANTS & RAW MATERIALS
-- =======================================
CREATE TABLE product_category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id INT REFERENCES product_category(id),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE supplier (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE fabric (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    supplier_id INT REFERENCES supplier(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE product_variant (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES product(id),
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    dimension VARCHAR(50),
    color VARCHAR(50),
    fabric_id INT REFERENCES fabric(id),
    extra_cost DECIMAL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE variant_price (
    id SERIAL PRIMARY KEY,
    variant_id INT REFERENCES product_variant(id),
    cost_price DECIMAL NOT NULL,
    selling_price DECIMAL NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE raw_material (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(50),
    min_quantity_alert DECIMAL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE raw_material_price (
    id SERIAL PRIMARY KEY,
    raw_material_id INT REFERENCES raw_material(id),
    supplier_id INT REFERENCES supplier(id),
    price DECIMAL NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE variant_bom (
    id SERIAL PRIMARY KEY,
    variant_id INT REFERENCES product_variant(id),
    raw_material_id INT REFERENCES raw_material(id),
    quantity DECIMAL NOT NULL
);

-- =======================================
-- 5️⃣ JOBS & PRODUCTION
-- =======================================
CREATE TABLE job_type (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    requires_materials BOOLEAN DEFAULT FALSE
);

CREATE TABLE job (
    id SERIAL PRIMARY KEY,
    job_type_id INT REFERENCES job_type(id),
    description VARCHAR(255) NOT NULL,
    price_per_unit DECIMAL,
    product_variant_id INT REFERENCES product_variant(id),
    estimated_time DECIMAL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE job_status (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    label VARCHAR(100) NOT NULL
);

CREATE TABLE job_employee (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employee(id),
    job_id INT REFERENCES job(id),
    job_status_id INT REFERENCES job_status(id) DEFAULT 1,
    quantity INT DEFAULT 1,
    note DECIMAL,
    is_product_ok BOOLEAN DEFAULT FALSE,
    job_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE job_payment (
    id SERIAL PRIMARY KEY,
    job_employee_id INT REFERENCES job_employee(id),
    payment_method_id INT REFERENCES payment_method(id),
    total_price DECIMAL,
    payment_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE salary_sheet (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employee(id),
    date DATE NOT NULL,
    total_products INT DEFAULT 0,
    bonus DECIMAL DEFAULT 0,
    penalty DECIMAL DEFAULT 0,
    total_salary DECIMAL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =======================================
-- 6️⃣ STOCK MANAGEMENT
-- =======================================
CREATE TABLE item_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE stock_movement (
    id SERIAL PRIMARY KEY,
    item_type_id INT REFERENCES item_type(id) NOT NULL,
    item_id INT NOT NULL,
    movement_type VARCHAR(10) NOT NULL,
    quantity DECIMAL NOT NULL,
    unit_price DECIMAL,
    document_id INT REFERENCES document(id),
    date_movement TIMESTAMP DEFAULT NOW()
);

CREATE TABLE stock_current (
    id SERIAL PRIMARY KEY,
    item_type_id INT REFERENCES item_type(id) NOT NULL,
    item_id INT NOT NULL,
    quantity DECIMAL DEFAULT 0 NOT NULL,
    last_update TIMESTAMP DEFAULT NOW(),
    UNIQUE(item_type_id, item_id)
);

-- =======================================
-- 7️⃣ CLIENTS & DOCUMENTS
-- =======================================
CREATE TABLE tax (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    rate DECIMAL NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE document_tax (
    id SERIAL PRIMARY KEY,
    document_id INT REFERENCES document(id),
    tax_id INT REFERENCES tax(id),
    amount DECIMAL NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE client (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    facebook_link TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE category_document (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE status_document (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE document (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category_id INT REFERENCES category_document(id),
    status_id INT REFERENCES status_document(id),
    client_id INT REFERENCES client(id),
    date_creation TIMESTAMP DEFAULT NOW(),
    total_ht DECIMAL DEFAULT 0,
    total_tax DECIMAL DEFAULT 0,
    frais_livraison DECIMAL DEFAULT 0,
    remise DECIMAL DEFAULT 0,
    grand_total DECIMAL DEFAULT 0,
    apply_tax BOOLEAN DEFAULT TRUE
);

CREATE TABLE document_line (
    id SERIAL PRIMARY KEY,
    document_id INT REFERENCES document(id),
    variant_id INT REFERENCES product_variant(id),
    quantity INT NOT NULL,
    unit_price DECIMAL NOT NULL,
    total_line DECIMAL
);

-- =======================================
-- 8️⃣ PAYMENTS
-- =======================================
CREATE TABLE payment_method (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    details TEXT
);

CREATE TABLE payment (
    id SERIAL PRIMARY KEY,
    document_id INT REFERENCES document(id),
    payment_method_id INT REFERENCES payment_method(id),
    date_payment TIMESTAMP DEFAULT NOW(),
    amount DECIMAL NOT NULL,
    transaction_reference VARCHAR(255)
);

-- =======================================
-- 9️⃣ NOTIFICATIONS
-- =======================================
CREATE TABLE notification (
    id SERIAL PRIMARY KEY,
    type VARCHAR(100),
    message TEXT,
    receiver_id INT REFERENCES "user"(id),
    is_read BOOLEAN DEFAULT FALSE,
    automatique BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
