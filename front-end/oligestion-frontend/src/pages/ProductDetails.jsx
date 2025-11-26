import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { products } from "../data/products";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = useMemo(() => products.find((item) => item.id === id), [id]);

  if (!product) {
    return (
      <section className="product-details">
        <div className="page-head">
          <div>
            <p className="eyebrow">Produit</p>
            <h1>Introuvable</h1>
          </div>
          <button className="ghost" onClick={() => navigate("/products")}>
            Retour
          </button>
        </div>
        <p>Le produit demandé n'existe pas.</p>
      </section>
    );
  }

  const allFabricSuppliers = [...new Set(product.variants.map((variant) => variant.fabric.supplier))];
  const bomSuppliers = [
    ...new Set(
      product.variants.flatMap((variant) =>
        variant.bom.map((item) => item.supplier)
      )
    ),
  ];

  const activePrice = (variant) => {
    if (!variant.prices.length) return null;
    return variant.prices.find((price) => !price.endDate) || variant.prices[0];
  };

  return (
    <section className="product-details">
      <div className="page-head">
        <div>
          <p className="eyebrow">Produit</p>
          <h1>{product.name}</h1>
          <p className="muted">
            {product.category} · {product.id}
          </p>
        </div>
        <div className="actions">
          <button className="ghost" onClick={() => navigate("/products")}>
            Retour
          </button>
          <button className="primary">Modifier</button>
        </div>
      </div>

      <div className="detail-grid">
        <article>
          <h3>Informations produit</h3>
          <div className="info-grid">
            <div>
              <span>Nom</span>
              <p>{product.name}</p>
            </div>
            <div>
              <span>Catégorie</span>
              <p>{product.category}</p>
            </div>
            <div className="full">
              <span>Description</span>
              <p>{product.description}</p>
            </div>
          </div>
        </article>

        <article className="full">
          <header>
            <h3>Variantes</h3>
            <button className="ghost small">Ajouter une variante</button>
          </header>
          <div className="variant-cards">
            {product.variants.map((variant) => (
              <div className="variant-card" key={variant.id}>
                <div className="variant-header">
                  <div>
                    <h4>{variant.sku}</h4>
                    <span>{variant.dimension} • {variant.color}</span>
                  </div>
                  <button className="ghost small">Modifier</button>
                </div>
                <div className="variant-info">
                  <dl>
                    <dt>Tissu</dt>
                    <dd>{variant.fabric.name}</dd>
                  </dl>
                  <dl>
                    <dt>Fournisseur tissu</dt>
                    <dd>{variant.fabric.supplier}</dd>
                  </dl>
                  <dl>
                    <dt>Extra cost</dt>
                    <dd>{variant.extraCost.toLocaleString("fr-MG")} Ar</dd>
                  </dl>
                  <dl>
                    <dt>Prix actif</dt>
                    <dd>
                      {(() => {
                        const price = activePrice(variant);
                        return price ? `${price.sellingPrice.toLocaleString("fr-MG")} Ar` : "—";
                      })()}
                    </dd>
                  </dl>
                </div>
                <div className="price-history">
                  <strong>Historique des prix</strong>
                  <table>
                    <thead>
                      <tr>
                        <th>Coût</th>
                        <th>Vente</th>
                        <th>Période</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {variant.prices.map((price) => (
                        <tr key={price.id}>
                          <td>{price.costPrice.toLocaleString("fr-MG")} Ar</td>
                          <td>{price.sellingPrice.toLocaleString("fr-MG")} Ar</td>
                          <td>
                            {new Date(price.startDate).toLocaleDateString("fr-FR")} →
                            {price.endDate ? new Date(price.endDate).toLocaleDateString("fr-FR") : "Actuel"}
                          </td>
                          <td>
                            <button className="ghost small">Modifier</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bom-table">
                  <strong>BOM / Variante</strong>
                  <table>
                    <thead>
                      <tr>
                        <th>Matière</th>
                        <th>Quantité</th>
                        <th>Fournisseur</th>
                        <th>PU (Ar)</th>
                        <th>Total (Ar)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variant.bom.map((entry) => (
                        <tr key={entry.id}>
                          <td>{entry.rawMaterial}</td>
                          <td>
                            {entry.quantity} {entry.unit}
                          </td>
                          <td>{entry.supplier}</td>
                          <td>{entry.unitPrice.toLocaleString("fr-MG")}</td>
                          <td>{(entry.unitPrice * entry.quantity).toLocaleString("fr-MG")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article>
          <h3>Fournisseurs</h3>
          <div className="info-grid">
            <div>
              <span>Tissus</span>
              <ul>
                {allFabricSuppliers.map((supplier) => (
                  <li key={supplier}>{supplier}</li>
                ))}
              </ul>
            </div>
            <div>
              <span>Matières premières</span>
              <ul>
                {bomSuppliers.map((supplier) => (
                  <li key={supplier}>{supplier}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default ProductDetails;

