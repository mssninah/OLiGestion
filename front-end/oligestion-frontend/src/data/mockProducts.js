export const categories = [
  { id: "cat-upholstery", name: "Tête de lit" },
  { id: "cat-bed", name: "Lit complet" },
  { id: "cat-sofa", name: "Canapé" },
];

export const suppliers = [
  { id: "sup-fabrics", name: "Textiluxe", type: "fabric" },
  { id: "sup-raw", name: "Bois & Co", type: "raw" },
  { id: "sup-metal", name: "Metallika", type: "raw" },
];

export const fabrics = [
  { id: "fab-linen", name: "Lin Premium", supplierId: "sup-fabrics", colorways: ["Beige", "Bleu nuit"] },
  { id: "fab-velvet", name: "Velours Royal", supplierId: "sup-fabrics", colorways: ["Vert sauge", "Terracotta"] },
];

export const rawMaterials = [
  {
    id: "rm-wood-oak",
    name: "Panneaux chêne",
    unit: "m²",
    supplierId: "sup-raw",
    prices: [
      { cost: 120000, startDate: "2025-01-01" },
      { cost: 135000, startDate: "2025-02-15" },
    ],
  },
  {
    id: "rm-foam",
    name: "Mousse haute densité",
    unit: "m³",
    supplierId: "sup-metal",
    prices: [{ cost: 95000, startDate: "2025-01-10" }],
  },
];

export const initialProducts = [
  {
    id: "prod-1",
    name: "Tête de lit Olana",
    categoryId: "cat-upholstery",
    description: "Tête de lit capitonnée personnalisable (coloris et dimensions).",
    variants: [
      {
        id: "var-101",
        sku: "OLANA-QUEEN-BEIGE",
        color: "Beige",
        dimension: "160 x 120 cm",
        fabricId: "fab-linen",
        fabricSupplierId: "sup-fabrics",
        extraCost: 45000,
        prices: [
          { id: "price-1", costPrice: 320000, sellingPrice: 560000, startDate: "2025-01-01" },
          { id: "price-2", costPrice: 340000, sellingPrice: 590000, startDate: "2025-02-10" },
        ],
        bom: [
          { id: "bom-1", materialId: "rm-wood-oak", quantity: 1.2 },
          { id: "bom-2", materialId: "rm-foam", quantity: 0.5 },
        ],
      },
      {
        id: "var-102",
        sku: "OLANA-KING-SAGE",
        color: "Vert sauge",
        dimension: "180 x 125 cm",
        fabricId: "fab-velvet",
        fabricSupplierId: "sup-fabrics",
        extraCost: 60000,
        prices: [{ id: "price-3", costPrice: 360000, sellingPrice: 620000, startDate: "2025-02-01" }],
        bom: [
          { id: "bom-3", materialId: "rm-wood-oak", quantity: 1.5 },
          { id: "bom-4", materialId: "rm-foam", quantity: 0.6 },
        ],
      },
    ],
  },
  {
    id: "prod-2",
    name: "Lit complet Maraina",
    categoryId: "cat-bed",
    description: "Structure complète avec coffre de rangement intégré.",
    variants: [
      {
        id: "var-201",
        sku: "MARAINA-QUEEN-TERRA",
        color: "Terracotta",
        dimension: "160 x 200 cm",
        fabricId: "fab-velvet",
        fabricSupplierId: "sup-fabrics",
        extraCost: 75000,
        prices: [{ id: "price-4", costPrice: 520000, sellingPrice: 890000, startDate: "2025-01-15" }],
        bom: [
          { id: "bom-5", materialId: "rm-wood-oak", quantity: 1.8 },
          { id: "bom-6", materialId: "rm-foam", quantity: 0.8 },
        ],
      },
    ],
  },
];

export const findCategory = (id) => categories.find((cat) => cat.id === id);
export const findFabric = (id) => fabrics.find((fab) => fab.id === id);
export const findSupplier = (id) => suppliers.find((sup) => sup.id === id);
export const findRawMaterial = (id) => rawMaterials.find((rm) => rm.id === id);

export const getActivePrice = (prices = []) =>
  prices.reduce((latest, price) => {
    if (!latest) return price;
    return new Date(price.startDate) > new Date(latest.startDate) ? price : latest;
  }, null);

