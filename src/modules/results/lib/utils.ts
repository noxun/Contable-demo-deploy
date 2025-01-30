interface PDFPaginationConfig {
  firstPageCapacity: number;
  otherPagesCapacity: number;
  signatureFooterHeight: number;
}

export const paginatePDFContent = <T>(
  items: T[],
  config: PDFPaginationConfig
): T[][] => {
  const { firstPageCapacity, otherPagesCapacity, signatureFooterHeight } = config;
  const pages: T[][] = [];
  let currentPage: T[] = [];
  let isFirstPage = true;

  const calculateContentHeight = () => {
    return isFirstPage
      ? firstPageCapacity - signatureFooterHeight
      : otherPagesCapacity - signatureFooterHeight;
  };

  items.forEach((item, index) => {
    const maxContentHeight = calculateContentHeight();

    if (currentPage.length >= maxContentHeight) {
      pages.push(currentPage);
      currentPage = [];
      isFirstPage = false;
    }

    currentPage.push(item);

    // Manejar último elemento
    if (index === items.length - 1) {
      const finalContentHeight = calculateContentHeight();

      if (currentPage.length > finalContentHeight) {
        const remainingItems = currentPage.splice(finalContentHeight);
        pages.push(currentPage);
        pages.push(remainingItems);
      } else {
        pages.push(currentPage);
      }
    }
  });

  return pages;
};