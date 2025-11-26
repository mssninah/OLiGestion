export const products = [
  {
    id: "prd-001",
    name: "Lit Scandinave Mila",
    category: "Chambre",
    description: "Lit minimaliste en chêne massif avec tête de lit capitonnée.",
    variants: [
      {
        id: "var-001",
        sku: "MILA-160-BLUE",
        color: "Bleu Nuit",
        dimension: "160 x 200",
        fabric: { name: "Velours premium", supplier: "Tissus Mada" },
        extraCost: 120000,
        prices: [
          {
            id: "price-001",
            costPrice: 520000,
            sellingPrice: 840000,
            startDate: "2025-01-01",
            endDate: null,
          },
          {
            id: "price-002",
            costPrice: 500000,
            sellingPrice: 800000,
            startDate: "2024-09-01",
            endDate: "2024-12-31",
          },
        ],
        bom: [
          {
            id: "bom-001",
            rawMaterial: "Chêne massif",
            quantity: 12,
            unit: "planches",
            supplier: "Bois & Co",
            unitPrice: 35000,
          },
          {
            id: "bom-002",
            rawMaterial: "Mousse HR",
            quantity: 2,
            unit: "plaques",
            supplier: "FoamWorks",
            unitPrice: 25000,
          },
        ],
      },
      {
        id: "var-002",
        sku: "MILA-180-TAUPE",
        color: "Taupe",
        dimension: "180 x 200",
        fabric: { name: "Linen smooth", supplier: "Maison du Tissu" },
        extraCost: 180000,
        prices: [
          {
            id: "price-003",
            costPrice: 560000,
            sellingPrice: 900000,
            startDate: "2025-02-10",
            endDate: null,
          },
        ],
        bom: [
          {
            id: "bom-003",
            rawMaterial: "Chêne massif",
            quantity: 14,
            unit: "planches",
            supplier: "Bois & Co",
            unitPrice: 35000,
          },
          {
            id: "bom-004",
            rawMaterial: "Lattes en acier",
            quantity: 30,
            unit: "unités",
            supplier: "MetalMada",
            unitPrice: 12000,
          },
        ],
      },
    ],
  },
  {
    id: "prd-002",
    name: "Canapé L-Sofa Tana",
    category: "Salon",
    description: "Canapé modulable 4 places avec méridienne et coffre de rangement.",
    variants: [
      {
        id: "var-003",
        sku: "LSOFA-4P-GREY",
        color: "Gris perle",
        dimension: "280 x 180",
        fabric: { name: "Tissu anti-tâche", supplier: "Textiluxe" },
        extraCost: 95000,
        prices: [
          {
            id: "price-004",
            costPrice: 630000,
            sellingPrice: 990000,
            startDate: "2025-01-15",
            endDate: null,
          },
        ],
        bom: [
          {
            id: "bom-005",
            rawMaterial: "Pin raboté",
            quantity: 10,
            unit: "planches",
            supplier: "Bois & Co",
            unitPrice: 28000,
          },
          {
            id: "bom-006",
            rawMaterial: "Tissu anti-tâche",
            quantity: 12,
            unit: "mètres",
            supplier: "Textiluxe",
            unitPrice: 18000,
          },
        ],
      },
    ],
  },
];

export const categories = [
  { id: "cat-1", name: "Chambre" },
  { id: "cat-2", name: "Salon" },
  { id: "cat-3", name: "Salle à manger" },
];

