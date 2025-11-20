-- =======================================
-- TRIGGERS POUR STOCK
-- =======================================

-- Objectif : mettre à jour le stock actuel automatiquement à chaque mouvement
-- Pourquoi : éviter des erreurs manuelles et garder le stock à jour pour reporting et ventes

-- Trigger function pour INSERT/UPDATE/DELETE sur stock_movement
CREATE OR REPLACE FUNCTION fn_update_stock_current()
RETURNS TRIGGER AS $$
BEGIN
    -- INSERT ou UPDATE
    IF (TG_OP = 'INSERT') THEN
        -- Vérifie si stock_current existe pour cet item_type + item
        IF EXISTS (SELECT 1 FROM stock_current 
                   WHERE item_type_id = NEW.item_type_id AND item_id = NEW.item_id) THEN
            -- Ajuste la quantité selon movement_type
            IF NEW.movement_type = 'in' THEN
                UPDATE stock_current
                SET quantity = quantity + NEW.quantity,
                    last_update = NOW()
                WHERE item_type_id = NEW.item_type_id AND item_id = NEW.item_id;
            ELSE
                UPDATE stock_current
                SET quantity = quantity - NEW.quantity,
                    last_update = NOW()
                WHERE item_type_id = NEW.item_type_id AND item_id = NEW.item_id;
            END IF;
        ELSE
            -- Si stock_current n'existe pas, on crée la ligne
            INSERT INTO stock_current(item_type_id, item_id, quantity, last_update)
            VALUES (NEW.item_type_id, NEW.item_id,
                CASE WHEN NEW.movement_type='in' THEN NEW.quantity ELSE -NEW.quantity END,
                NOW());
        END IF;
    ELSIF (TG_OP = 'UPDATE') THEN
        -- Pour simplification, on peut recalculer en soustrayant l'ancien et ajoutant le nouveau
        UPDATE stock_current
        SET quantity = quantity - OLD.quantity + NEW.quantity,
            last_update = NOW()
        WHERE item_type_id = NEW.item_type_id AND item_id = NEW.item_id;
    ELSIF (TG_OP = 'DELETE') THEN
        -- Retirer la quantité du stock_current
        UPDATE stock_current
        SET quantity = quantity - OLD.quantity,
            last_update = NOW()
        WHERE item_type_id = OLD.item_type_id AND item_id = OLD.item_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger sur INSERT/UPDATE/DELETE
CREATE TRIGGER trg_stock_movement
AFTER INSERT OR UPDATE OR DELETE ON stock_movement
FOR EACH ROW EXECUTE FUNCTION fn_update_stock_current();

-- =======================================
-- TRIGGERS POUR JOBS & SALAIRES
-- =======================================

-- Objectif : calcul automatique du total_price d'un job_payment
-- Pourquoi : éviter erreur de saisie et automatiser la facturation des jobs
CREATE OR REPLACE FUNCTION fn_calc_job_payment_total()
RETURNS TRIGGER AS $$
DECLARE
    job_price DECIMAL;
    qty INT;
BEGIN
    SELECT j.price_per_unit, je.quantity
    INTO job_price, qty
    FROM job_employee je
    JOIN job j ON je.job_id = j.id
    WHERE je.id = NEW.job_employee_id;

    NEW.total_price := job_price * qty;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_job_payment_before_insert
BEFORE INSERT OR UPDATE ON job_payment
FOR EACH ROW EXECUTE FUNCTION fn_calc_job_payment_total();

-- Objectif : recalculer le salaire total à chaque ajout/modif d'un job_employee ou job_payment
-- Pourquoi : feuille de salaire à jour automatiquement, centralisée
CREATE OR REPLACE FUNCTION fn_update_salary_sheet()
RETURNS TRIGGER AS $$
DECLARE
    total_prod INT;
    total_payment DECIMAL;
BEGIN
    SELECT SUM(quantity) INTO total_prod
    FROM job_employee
    WHERE employee_id = NEW.employee_id;

    SELECT SUM(total_price) INTO total_payment
    FROM job_payment jp
    JOIN job_employee je ON jp.job_employee_id = je.id
    WHERE je.employee_id = NEW.employee_id;

    UPDATE salary_sheet
    SET total_products = total_prod,
        total_salary = COALESCE(total_payment,0) + COALESCE(bonus,0) - COALESCE(penalty,0),
        updated_at = NOW()
    WHERE employee_id = NEW.employee_id AND date = NEW.job_date;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_job_employee_salary
AFTER INSERT OR UPDATE ON job_employee
FOR EACH ROW EXECUTE FUNCTION fn_update_salary_sheet();

CREATE TRIGGER trg_job_payment_salary
AFTER INSERT OR UPDATE ON job_payment
FOR EACH ROW EXECUTE FUNCTION fn_update_salary_sheet();

-- =======================================
-- TRIGGERS POUR DOCUMENTS & TAXES
-- =======================================

-- Objectif : calcul automatique du grand_total d'un document à l'insert/update de lignes ou taxes
-- Pourquoi : éviter erreur humaine et garder le document cohérent
CREATE OR REPLACE FUNCTION fn_update_document_totals()
RETURNS TRIGGER AS $$
DECLARE
    sum_lines DECIMAL;
    sum_tax DECIMAL;
BEGIN
    SELECT COALESCE(SUM(total_line),0) INTO sum_lines
    FROM document_line
    WHERE document_id = NEW.document_id;

    SELECT COALESCE(SUM(amount),0) INTO sum_tax
    FROM document_tax
    WHERE document_id = NEW.document_id;

    UPDATE document
    SET total_ht = sum_lines,
        total_tax = sum_tax,
        grand_total = sum_lines + sum_tax + COALESCE(frais_livraison,0) - COALESCE(remise,0)
    WHERE id = NEW.document_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger sur document_line et document_tax
CREATE TRIGGER trg_document_line_totals
AFTER INSERT OR UPDATE OR DELETE ON document_line
FOR EACH ROW EXECUTE FUNCTION fn_update_document_totals();

CREATE TRIGGER trg_document_tax_totals
AFTER INSERT OR UPDATE OR DELETE ON document_tax
FOR EACH ROW EXECUTE FUNCTION fn_update_document_totals();
