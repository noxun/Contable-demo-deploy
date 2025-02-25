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

export const getMessageROA = (num: number) => {
  let messageExtra = ''
  switch (true) {
    case num > 0 && num < 25:
      messageExtra = 'un bajo retorno'
      break
    case num >= 25 && num < 50:
      messageExtra = 'un retorno moderado'
      break
    case num >= 50 && num < 75:
      messageExtra = 'un buen retorno'
      break
    case num >= 75:
      messageExtra = 'un excelente retorno'
      break
    default:
      messageExtra = 'ningún retorno';
  }
  return `Con un ROA de ${num}%, la empresa genera ${messageExtra} por cada Bs 100 de activos.`;
}

export const getMessageROE = (num: number) => {
  let messageExtra = ''

  switch (true) {
    case num > 0 && num < 25:
      messageExtra = 'una baja rentabilidad sobre los recursos propios'
      break
    case num >= 25 && num < 50:
      messageExtra = 'una rentabilidad moderada sobre los recursos propios'
      break
    case num >= 50 && num < 75:
      messageExtra = 'una buena rentabilidad sobre los recursos propios'
      break
    case num >= 75:
      messageExtra = 'una excelente rentabilidad sobre los recursos propios'
      break
    default:
      messageExtra = 'ninguna rentabilidad sobre los recursos propios'
  }

  return `Con un ROE de ${num}%, la empresa tiene ${messageExtra}.`
};

export const getMessageROI = (num: number) => {
  let messageExtra = ''

  switch (true) {
    case num > 0 && num < 25:
      messageExtra = 'una baja rentabilidad por cada Bs 100 invertidos'
      break
    case num >= 25 && num < 50:
      messageExtra = 'una rentabilidad moderada por cada Bs 100 invertidos'
      break
    case num >= 50 && num < 75:
      messageExtra = 'una buena rentabilidad por cada Bs 100 invertidos'
      break
    case num >= 75:
      messageExtra = 'una excelente rentabilidad por cada Bs 100 invertidos'
      break
    default:
      messageExtra = 'ninguna rentabilidad por cada Bs 100 invertidos'
  }

  return `Con un ROI de ${num}%, la empresa tiene ${messageExtra}.`
};

export const getMessageProfitability = (num: number) => {
  let messageExtra = ''

  switch (true) {
    case num > 0 && num < 25:
      messageExtra = 'una baja rentabilidad en relación con el capital social'
      break
    case num >= 25 && num < 50:
      messageExtra = 'una rentabilidad moderada en relación con el capital social'
      break
    case num >= 50 && num < 75:
      messageExtra = 'una buena rentabilidad en relación con el capital social'
      break
    case num >= 75:
      messageExtra = 'una excelente rentabilidad en relación con el capital social'
      break
    default:
      messageExtra = 'pérdidas, lo que indica que la empresa no está generando beneficios en relación con el capital social'
  }

  return `Con una rentabilidad de ${num}%, la empresa tiene ${messageExtra}.`
};

