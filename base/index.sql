-- =======================================
-- INDEXES POUR STOCK
-- =======================================

-- Accélère les requêtes sur les mouvements d’un item spécifique
CREATE INDEX idx_stock_movement_item
ON stock_movement(item_type_id, item_id);

-- Accélère les recherches par date de mouvement (ex: reporting, audit)
CREATE INDEX idx_stock_movement_date
ON stock_movement(date_movement);

-- Index pour lecture rapide du stock actuel par item
CREATE UNIQUE INDEX idx_stock_current_item
ON stock_current(item_type_id, item_id);


-- =======================================
-- INDEXES POUR JOBS & SALAIRES
-- =======================================

-- Recherche rapide des jobs exécutés par un employé
CREATE INDEX idx_job_employee_employee
ON job_employee(employee_id);

-- Recherche rapide des jobs pour une variante ou type
CREATE INDEX idx_job_employee_job
ON job_employee(job_id);

-- Reporting par date
CREATE INDEX idx_job_employee_job_date
ON job_employee(employee_id, job_date);

-- Rechercher les paiements d’un job
CREATE INDEX idx_job_payment_job_employee
ON job_payment(job_employee_id);


-- =======================================
-- INDEXES POUR DOCUMENTS & TAXES
-- =======================================

-- Accélère l’accès aux lignes d’un document
CREATE INDEX idx_document_line_document
ON document_line(document_id);

-- Accélère l’accès aux taxes appliquées à un document
CREATE INDEX idx_document_tax_document
ON document_tax(document_id);

-- Recherche rapide des documents par client
CREATE INDEX idx_document_client
ON document(client_id);

-- Recherche par date de création
CREATE INDEX idx_document_date
ON document(date_creation);

-- Accélère les paiements sur un document
CREATE INDEX idx_payment_document
ON payment(document_id);

-- Recherche rapide par méthode de paiement
CREATE INDEX idx_payment_method
ON payment(payment_method_id);

-- Recherche rapide des notifications non lues
CREATE INDEX idx_notification_receiver
ON notification(receiver_id, is_read);


-- =======================================
-- INDEXES POUR PRODUITS & VARIANTS
-- =======================================

-- Accélère les recherches par catégorie
CREATE INDEX idx_product_category
ON product(category_id);

-- Accélère la recherche des variantes d’un produit
CREATE INDEX idx_product_variant_product
ON product_variant(product_id);

-- Historique des prix des variantes
CREATE INDEX idx_variant_price_variant
ON variant_price(variant_id);

-- BOM (composition) par variante
CREATE INDEX idx_variant_bom_variant
ON variant_bom(variant_id);

-- Prix matières premières par fournisseur
CREATE INDEX idx_raw_material_price_supplier
ON raw_material_price(raw_material_id, supplier_id);


-- =======================================
-- INDEXES POUR EMPLOYES & ACTIONS
-- =======================================

-- Rechercher les actions d’un employé
CREATE INDEX idx_employee_action_employee
ON employee_action(employee_id);

-- Rechercher rapidement un employé actif
CREATE INDEX idx_employee_active
ON employee(active);


-- =======================================
-- INDEXES POUR ROLES & PERMISSIONS
-- =======================================

-- Recherche des permissions par rôle
CREATE INDEX idx_role_permission_role
ON role_permission(role_id);

-- Recherche rapide des rôles assignés à un utilisateur
CREATE INDEX idx_user_role_user
ON user_role(user_id);
