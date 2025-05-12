const CalculateProductDiscounts = (products, settings) => {
  const { sales, sitesale } = settings;
  const discountedProductsMap = new Map(
    products.map((product) => [product._id, { ...product }])
  );

  if (sales && Array.isArray(sales)) {
    sales.forEach((sale) => {
      if (sale.enabled && sale.items && Array.isArray(sale.items)) {
        const baseDiscount = sale.discount || 0;
        const siteDiscount = sitesale?.discount || 0;
        const totalDiscount = baseDiscount + siteDiscount;

        const discountedItemIds = new Set(sale.items.map((item) => item._id));

        discountedProductsMap.forEach((product) => {
          if (discountedItemIds.has(product._id)) {
            const currentProduct = discountedProductsMap.get(product._id);
            currentProduct.discount = totalDiscount;
          }
        });
      }
    });
  }

  return Array.from(discountedProductsMap.values());
};

const CalculateSingleProductDiscount = (product, settings) => {
  const { sales, sitesale } = settings;
  let discountedProduct = { ...product };
  let maxDiscount = 0;

  if (sales && Array.isArray(sales)) {
    sales.forEach((sale) => {
      if (sale.enabled && sale.items && Array.isArray(sale.items)) {
        const itemFound = sale.items.find((item) => item._id === product._id);

        if (itemFound) {
          const baseDiscount = sale.discount || 0;
          const siteDiscount = sitesale?.discount || 0;
          const totalDiscount = baseDiscount + siteDiscount;

          if (totalDiscount > maxDiscount) {
            maxDiscount = totalDiscount;
          }
        }
      }
    });
  }

  if (maxDiscount > 0) {
    discountedProduct.discount = maxDiscount;
  }

  return discountedProduct;
};

export { CalculateProductDiscounts, CalculateSingleProductDiscount };
