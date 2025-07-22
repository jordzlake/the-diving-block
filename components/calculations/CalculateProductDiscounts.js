const CalculateProductDiscounts = (products, settings) => {
  const { sales, sitesale, categorysales } = settings;
  const discountedProductsMap = new Map(
    products.map((product) => [product._id, { ...product, discount: 0 }]) // Initialize discount to 0
  );

  // Apply site-wide discount first as a base, if enabled
  const siteWideBaseDiscount =
    sitesale && sitesale.enabled ? sitesale.discount || 0 : 0;

  discountedProductsMap.forEach((product) => {
    product.discount = siteWideBaseDiscount; // Start with site-wide discount
  });

  // Apply individual item sales
  if (sales && Array.isArray(sales)) {
    sales.forEach((sale) => {
      if (sale.enabled && sale.items && Array.isArray(sale.items)) {
        const saleDiscount = sale.discount || 0;
        const combinedSaleDiscount = saleDiscount + siteWideBaseDiscount; // Add site-wide discount

        sale.items.forEach((item) => {
          const productInMap = discountedProductsMap.get(item._id);
          if (productInMap) {
            // Apply the higher of the current discount or the combined sale discount
            productInMap.discount = Math.max(
              productInMap.discount,
              combinedSaleDiscount
            );
          }
        });
      }
    });
  }

  // Apply category sales
  if (categorysales && Array.isArray(categorysales)) {
    categorysales.forEach((categorySale) => {
      if (categorySale.enabled && categorySale.category) {
        const categorySaleDiscount = categorySale.discount || 0;
        const combinedCategorySaleDiscount =
          categorySaleDiscount + siteWideBaseDiscount; // Add site-wide discount

        discountedProductsMap.forEach((product) => {
          // Check if product's main category matches
          if (product.category === categorySale.category) {
            // Check subcategories: if categorySale.subCategories is empty, it applies to all subcategories
            // Otherwise, check if any of the product's subcategories are in the sale's subCategories
            const appliesToSubcategory =
              categorySale.subCategories.length === 0 ||
              (product.subCategory &&
                categorySale.subCategories.some(
                  (saleSubCat) => (product.subCategory = saleSubCat)
                ));

            if (appliesToSubcategory) {
              const currentProduct = discountedProductsMap.get(product._id);
              if (currentProduct) {
                // Apply the higher of the current discount or the combined category sale discount
                currentProduct.discount = Math.max(
                  currentProduct.discount,
                  combinedCategorySaleDiscount
                );
              }
            }
          }
        });
      }
    });
  }

  return Array.from(discountedProductsMap.values());
};

const CalculateSingleProductDiscount = (product, settings) => {
  const { sales, sitesale, categorysales } = settings;
  let maxDiscount = 0;

  // Start with site-wide discount as a base if enabled
  if (sitesale && sitesale.enabled) {
    maxDiscount = sitesale.discount || 0;
  }

  // Check individual item sales
  if (sales && Array.isArray(sales)) {
    sales.forEach((sale) => {
      if (sale.enabled && sale.items && Array.isArray(sale.items)) {
        const itemFound = sale.items.find((item) => item._id === product._id);

        if (itemFound) {
          const baseDiscount = sale.discount || 0;
          const combinedDiscount =
            baseDiscount +
            (sitesale && sitesale.enabled ? sitesale.discount || 0 : 0);
          maxDiscount = Math.max(maxDiscount, combinedDiscount);
        }
      }
    });
  }

  // Check category sales
  if (categorysales && Array.isArray(categorysales)) {
    categorysales.forEach((categorySale) => {
      if (categorySale.enabled && categorySale.category) {
        // Check if product's main category matches
        if (product.category === categorySale.category) {
          // Check subcategories: if categorySale.subCategories is empty, it applies to all subcategories
          // Otherwise, check if any of the product's subcategories are in the sale's subCategories
          const appliesToSubcategory =
            categorySale.subCategories.length === 0 ||
            (product.subCategory &&
              categorySale.subCategories.some(
                (saleSubCat) => (product.subCategory = saleSubCat)
              ));

          if (appliesToSubcategory) {
            const baseDiscount = categorySale.discount || 0;
            const combinedDiscount =
              baseDiscount +
              (sitesale && sitesale.enabled ? sitesale.discount || 0 : 0);
            maxDiscount = Math.max(maxDiscount, combinedDiscount);
          }
        }
      }
    });
  }

  // Assign the calculated maxDiscount to the product
  const discountedProduct = { ...product, discount: maxDiscount };

  return discountedProduct;
};

export { CalculateProductDiscounts, CalculateSingleProductDiscount };
