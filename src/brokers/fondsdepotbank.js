import Big from 'big.js';
import {
  parseGermanNum,
  validateActivity,
  createActivityDateTime,
} from '@/helper';

const findISINAndWKN = content => {
  return content[content.indexOf('ISIN/WKN:') + 1].split(/\//);
};

const findCompany = content => {
  return content[content.indexOf('Fondsbezeichnung:') + 1];
};

const findAmount = (content, type) => {
  if (type === 'Buy' || type === 'Sell') {
    return parseGermanNum(content[1]);
  } else if (type === 'Dividend') {
    return parseGermanNum(content[content.indexOf('Ausschüttungsbetrag') + 2]);
  }
};

const findDate = (content, type) => {
  let dateLine;
  if (type === 'Buy') {
    dateLine = content[4];
  } else if (type === 'Sell') {
    dateLine = content[2];
  } else if (type === 'Dividend') {
    dateLine = content[
      content.findIndex(t => t.includes('Ausschüttung per '))
    ].split(/\s+/)[2];
  }
  return dateLine.match(/[0-9]{2}.[0-9]{2}.[1-2][0-9]{3}/)[0];
};

/* We do not need this as the price will be calculated from the amount and shares
const findPrice = (content, type) => {
  if (type === 'Buy') {
    return parseGermanNum(content[5]);
  } else if (type === 'Sell') {
    return parseGermanNum(content[3]);
  } else if (type === 'Dividend') {
    return parseGermanNum(content[content.indexOf('Ausschüttungsbetrag') + 1]);
  }
  return 0;
};
*/

const findFee = (content, type) => {
  if (type === 'Buy') {
    return parseGermanNum(content[6]);
  }
  return 0;
};

const findShares = (content, type) => {
  if (type === 'Buy') {
    return Math.abs(parseGermanNum(content[7]));
  } else if (type === 'Sell') {
    return Math.abs(parseGermanNum(content[4]));
  } else if (type === 'Dividend') {
    return parseGermanNum(
      content[content.findIndex(t => t.includes('Anteile '))].split(/\s+/)[1]
    );
  }
  return 0;
};

const findTaxes = (content, type) => {
  if (type === 'Sell' || type === 'Dividend') {
    const gainsTax = parseGermanNum(
      content[content.indexOf('Kapitalertragsteuer') + 1]
    );
    const solidarySur = parseGermanNum(
      content[content.indexOf('Solidaritätszuschlag') + 1]
    );
    let churchTax = 0;
    const churchIdx = content.findIndex(t => t.includes('Kirchensteuer '));
    if (churchIdx !== -1) {
      churchTax = parseGermanNum(content[churchIdx + 1]);
    }
    return +Big(gainsTax).plus(solidarySur).plus(churchTax).abs();
  }
  return 0;
};

const getDocumentType = content => {
  if (content.includes('Anlagebetrag')) {
    return 'Buy';
  } else if (content.includes('Abrechnungsbetrag')) {
    return 'Sell';
  } else if (content.includes('Ausschüttungsbetrag')) {
    return 'Dividend';
  } else if (content.some(line => line.includes('Kosteninformation'))) {
    return 'Ignored';
  }
  return undefined;
};

export const canParseDocument = (pages, extension) => {
  const firstPageContent = pages[0];
  return (
    extension === 'pdf' &&
    firstPageContent.some(line => line.includes('Fondsdepot Bank GmbH')) &&
    firstPageContent.some(line => line.includes('Depotabrechnung')) &&
    getDocumentType(firstPageContent) !== undefined
  );
};

const parseData = (fondInfo, transactionInfo, type) => {
  let activity = {
    broker: 'fondsdepotbank',
    type,
  };

  activity.company = findCompany(fondInfo);
  [activity.isin, activity.wkn] = findISINAndWKN(fondInfo);
  [activity.date, activity.datetime] = createActivityDateTime(
    findDate(transactionInfo, type)
  );
  activity.shares = findShares(transactionInfo, type);
  activity.fee = findFee(transactionInfo, type);
  activity.amount = +Big(findAmount(transactionInfo, type)).minus(activity.fee);
  // rounding the price to 4 digits after the decimal point
  activity.price = Number(
    Math.round(Number(+Big(activity.amount).div(activity.shares) + 'e4')) +
      'e-4'
  );
  // activity.price = findPrice(transactionInfo, type);
  activity.tax = findTaxes(transactionInfo, type);

  return validateActivity(activity);
};

export const parsePages = contents => {
  const activities = [];
  const type = getDocumentType(contents[0]);

  if (type === 'Ignored') {
    // We know this type and we don't want to support it.
    return {
      activities: [],
      status: 7,
    };
  }

  const blockList = [
    '1)',
    '2)',
    'Rabatt',
    '100 %',
    'gesamt',
    'für Tausch',
    'aus Tausch',
    'Ertrag',
  ];

  for (const pageContent of contents) {
    const fondInfo = pageContent.slice(
      pageContent.indexOf('Depotabrechnung'),
      pageContent.indexOf('Transaktion') ||
        pageContent.findIndex(c => c.includes('Ausschüttung per '))
    );

    let transactionInfo;
    if (type === 'Buy') {
      transactionInfo = pageContent.map(c => c.replace('Wiederanlage', 'Kauf'));
      transactionInfo = transactionInfo.slice(
        transactionInfo.indexOf('Kauf'),
        transactionInfo.indexOf('Konto-')
      );
    } else if (type === 'Sell') {
      transactionInfo = pageContent.slice(
        pageContent.indexOf('Verkauf'),
        pageContent.indexOf('Konto-')
      );
    } else if (type === 'Dividend') {
      transactionInfo = pageContent.slice(
        pageContent.findIndex(c => c.includes('Ausschüttung per ')),
        pageContent.indexOf('Konto-')
      );
    }

    if (transactionInfo.length) {
      transactionInfo = transactionInfo.filter(c => !blockList.includes(c));
      if (type === 'Buy') {
        let idx = transactionInfo.indexOf('Kauf');
        const first = idx;
        while (idx !== -1) {
          activities.push(
            parseData(
              fondInfo,
              [
                ...transactionInfo.slice(0, first),
                ...transactionInfo.slice(idx, idx + 10),
              ],
              type
            )
          );
          idx = transactionInfo.indexOf('Kauf', idx + 1);
        }
      } else {
        activities.push(parseData(fondInfo, transactionInfo, type));
      }
    }
  }

  return {
    activities: activities,
    status: 0,
  };
};
