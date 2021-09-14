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
    const cap = parseGermanNum(
      content[content.indexOf('Kapitalertragsteuer') + 1]
    );
    const soli = parseGermanNum(
      content[content.indexOf('Solidaritätszuschlag') + 1]
    );
    let church = 0;
    const churchIdx = content.findIndex(t => t.includes('Kirchensteuer '));
    if (churchIdx !== -1) {
      church = parseGermanNum(content[churchIdx + 1]);
    }
    return +Big(cap).plus(soli).plus(church).abs();
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

const parseData = (fondInfo, transaktionInfo, type) => {
  let activity = {
    broker: 'fondsdepotbank',
    type,
  };

  activity.company = findCompany(fondInfo);
  [activity.isin, activity.wkn] = findISINAndWKN(fondInfo);
  [activity.date, activity.datetime] = createActivityDateTime(
    findDate(transaktionInfo, type)
  );
  activity.shares = findShares(transaktionInfo, type);
  // activity.price = findPrice(transaktionInfo, type);
  activity.fee = findFee(transaktionInfo, type);
  activity.amount = +Big(findAmount(transaktionInfo, type)).minus(activity.fee);
  activity.price = Number(
    Math.round(Number(+Big(activity.amount).div(activity.shares) + 'e4')) +
      'e-4'
  );
  activity.tax = findTaxes(transaktionInfo, type);

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

    let transaktionInfo;
    if (type === 'Buy') {
      transaktionInfo = pageContent.map(c => c.replace('Wiederanlage', 'Kauf'));
      transaktionInfo = transaktionInfo.slice(
        transaktionInfo.indexOf('Kauf'),
        transaktionInfo.indexOf('Konto-')
      );
    } else if (type === 'Sell') {
      transaktionInfo = pageContent.slice(
        pageContent.indexOf('Verkauf'),
        pageContent.indexOf('Konto-')
      );
    } else if (type === 'Dividend') {
      transaktionInfo = pageContent.slice(
        pageContent.findIndex(c => c.includes('Ausschüttung per ')),
        pageContent.indexOf('Konto-')
      );
    }

    if (transaktionInfo.length) {
      transaktionInfo = transaktionInfo.filter(c => !blockList.includes(c));
      if (type === 'Buy') {
        let idx = transaktionInfo.indexOf('Kauf');
        const first = idx;
        while (idx !== -1) {
          activities.push(
            parseData(
              fondInfo,
              [
                ...transaktionInfo.slice(0, first),
                ...transaktionInfo.slice(idx, idx + 10),
              ],
              type
            )
          );
          idx = transaktionInfo.indexOf('Kauf', idx + 1);
        }
      } else {
        activities.push(parseData(fondInfo, transaktionInfo, type));
      }
    }
  }

  return {
    activities: activities,
    status: 0,
  };
};
