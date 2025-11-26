import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { products, categories } from "../data/products";

const defaultForm = {
  name: "",
  category: "",
  description: "",
};

const defaultVariant = {
  sku: "",
  color: "",
  dimension: "",
  fabric: "",
  supplier: "",
  extraCost: 0,
};

const Modal = ({ title, onClose, children }) => (
  <div className="modal-backdrop">
    <div className="modal-card">
      <header>
        <h3>{title}</h3>
        <button onClick={onClose} className="ghost">
          ✕
        </button>
      </header>
      <div className="modal-body">{children}</div>
    </div>
  </div>
);

const Products = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: "",
    dimension: "",
    color: "",
    fabricSupplier: "",
    query: "",
  });
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState(defaultForm);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [variantForm, setVariantForm] = useState(defaultVariant);

  const dimensionOptions = useMemo(
    () => [...new Set(products.flatMap((product) => product.variants.map((variant) => variant.dimension)))],
    []
  );
  const colorOptions = useMemo(
    () => [...new Set(products.flatMap((product) => product.variants.map((variant) => variant.color)))],
    []
  );
  const fabricSuppliers = useMemo(
    () => [...new Set(products.flatMap((product) => product.variants.map((variant) => variant.fabric.supplier)))],
    []
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = filters.category ? product.category === filters.category : true;
      const matchesQuery = filters.query
        ? product.name.toLowerCase().includes(filters.query.toLowerCase()) ||
          product.variants.some((variant) => variant.sku.toLowerCase().includes(filters.query.toLowerCase()))
        : true;
      const matchesDimension = filters.dimension
        ? product.variants.some((variant) => variant.dimension === filters.dimension)
        : true;
      const matchesColor = filters.color
        ? product.variants.some((variant) => variant.color === filters.color)
        : true;
      const matchesSupplier = filters.fabricSupplier
        ? product.variants.some((variant) => variant.fabric.supplier === filters.fabricSupplier)
        : true;

      return matchesCategory && matchesQuery && matchesDimension && matchesColor && matchesSupplier;
    });
  }, [filters]);

  const activePrice = (variant) => {
    if (!variant.prices.length) return null;
    return variant.prices.find((price) => !price.endDate) || variant.prices[0];
  };

  const handleOpenProductForm = (product) => {
    setEditingProduct(product);
    setProductForm(product ?? defaultForm);
    setShowProductForm(true);
  };

  const handleOpenVariantForm = (variant) => {
    setVariantForm(
      variant ?? {
        sku: "",
        color: "",
        dimension: "",
        fabric: "",
        supplier: "",
        extraCost: 0,
      }
    );
    setShowVariantForm(true);
  };

  const FilterSelect = ({ label, value, onChange, options, placeholder }) => (
    <label className="filter-field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );

  const FilterInput = ({ label, value, onChange, placeholder }) => (
    <label className="filter-field">
      <span>{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  );

  return (
    <section className="products-page">
      <div className="page-head">
        <div>
          <p className="eyebrow">Catalogue</p>
          <h1>Produits</h1>
        </div>
        <div className="actions">
          <button className="ghost">Importer</button>
          <button className="primary" onClick={() => handleOpenProductForm(null)}>
            + Ajouter un produit
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <FilterInput
          label="Recherche"
          value={filters.query}
          onChange={(value) => setFilters((f) => ({ ...f, query: value }))}
          placeholder="Nom produit ou SKU"
        />
        <FilterSelect
          label="Catégorie"
          value={filters.category}
          onChange={(value) => setFilters((f) => ({ ...f, category: value }))}
          options={categories.map((category) => category.name)}
          placeholder="Toutes les catégories"
        />
        <FilterSelect
          label="Dimension"
          value={filters.dimension}
          onChange={(value) => setFilters((f) => ({ ...f, dimension: value }))}
          options={dimensionOptions}
          placeholder="Toutes les dimensions"
        />
        <FilterSelect
          label="Couleur"
          value={filters.color}
          onChange={(value) => setFilters((f) => ({ ...f, color: value }))}
          options={colorOptions}
          placeholder="Toutes les couleurs"
        />
        <FilterSelect
          label="Fournisseur tissu"
          value={filters.fabricSupplier}
          onChange={(value) => setFilters((f) => ({ ...f, fabricSupplier: value }))}
          options={fabricSuppliers}
          placeholder="Tous les fournisseurs"
        />
        <button className="ghost small" onClick={() => setFilters({ category: "", dimension: "", color: "", fabricSupplier: "", query: "" })}>
          Réinitialiser
        </button>
      </div>

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Produit</th>
              <th>Catégorie</th>
              <th>Description</th>
              <th>Variantes</th>
              <th>Dernier prix</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="product-info">
                    <strong>{product.name}</strong>
                    <span>{product.id}</span>
                  </div>
                </td>
                <td>{product.category}</td>
                <td>{product.description}</td>
                <td>{product.variants.length}</td>
                <td>
                  {(() => {
                    const variant = product.variants[0];
                    const price = variant ? activePrice(variant) : null;
                    return price ? `${price.sellingPrice.toLocaleString("fr-MG")} Ar` : "—";
                  })()}
                </td>
                <td>
                  <div className="table-actions">
                    <button className="ghost" onClick={() => navigate(`/products/${product.id}`)}>
                      Voir
                    </button>
                    <button className="ghost" onClick={() => handleOpenProductForm(product)}>
                      Modifier
                    </button>
                    <button className="ghost destructive">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showProductForm && (
        <Modal title={editingProduct ? "Modifier le produit" : "Créer un produit"} onClose={() => setShowProductForm(false)}>
          <div className="form-grid">
            <label>
              <span>Nom</span>
              <input value={productForm.name} onChange={(e) => setProductForm((form) => ({ ...form, name: e.target.value }))} />
            </label>
            <label>
              <span>Catégorie</span>
              <select value={productForm.category} onChange={(e) => setProductForm((form) => ({ ...form, category: e.target.value }))}>
                <option value="">Choisir</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="full">
              <span>Description</span>
              <textarea
                rows={3}
                value={productForm.description}
                onChange={(e) => setProductForm((form) => ({ ...form, description: e.target.value }))}
              />
            </label>
          </div>
          <div className="modal-footer">
            <button className="ghost" onClick={() => setShowProductForm(false)}>
              Annuler
            </button>
            <button className="primary">Enregistrer</button>
          </div>
          <div className="variant-section">
            <header>
              <h4>Variantes</h4>
              <button className="ghost small" onClick={() => handleOpenVariantForm(null)}>
                + Ajouter une variante
              </button>
            </header>
            <p>Ajoute les variantes après avoir enregistré le produit.</p>
          </div>
        </Modal>
      )}

      {showVariantForm && (
        <Modal title="Variante" onClose={() => setShowVariantForm(false)}>
          <div className="form-grid">
            <label>
              <span>SKU</span>
              <input value={variantForm.sku} onChange={(e) => setVariantForm((form) => ({ ...form, sku: e.target.value }))} />
            </label>
            <label>
              <span>Couleur</span>
              <input value={variantForm.color} onChange={(e) => setVariantForm((form) => ({ ...form, color: e.target.value }))} />
            </label>
            <label>
              <span>Dimension</span>
              <input value={variantForm.dimension} onChange={(e) => setVariantForm((form) => ({ ...form, dimension: e.target.value }))} />
            </label>
            <label>
              <span>Tissu</span>
              <input value={variantForm.fabric} onChange={(e) => setVariantForm((form) => ({ ...form, fabric: e.target.value }))} />
            </label>
            <label>
              <span>Fournisseur tissu</span>
              <input value={variantForm.supplier} onChange={(e) => setVariantForm((form) => ({ ...form, supplier: e.target.value }))} />
            </label>
            <label>
              <span>Extra cost (Ar)</span>
              <input
                type="number"
                value={variantForm.extraCost}
                onChange={(e) => setVariantForm((form) => ({ ...form, extraCost: Number(e.target.value) }))}
              />
            </label>
          </div>
          <div className="price-history">
            <header>
              <h4>Prix de vente</h4>
              <button className="ghost small">+ Ajouter un prix</button>
            </header>
            <table>
              <thead>
                <tr>
                  <th>Coût</th>
                  <th>Prix de vente</th>
                  <th>Période</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>520 000 Ar</td>
                  <td>840 000 Ar</td>
                  <td>01/01/2025 → Actuel</td>
                  <td>
                    <button className="ghost small">Modifier</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="modal-footer">
            <button className="ghost" onClick={() => setShowVariantForm(false)}>
              Fermer
            </button>
            <button className="primary">Sauvegarder</button>
          </div>
        </Modal>
      )}
    </section>
  );
};

export default Products;

