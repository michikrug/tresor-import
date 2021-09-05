import { findImplementation } from '@/index';
import * as consorsbank from '../../src/brokers/consorsbank';
import {
  buySamples,
  sellSamples,
  dividendsSamples,
  ignoredSamples,
  allSamples,
} from './__mocks__/consorsbank';
console.error = jest.fn();

describe('Broker: Consorsbank', () => {
  describe('Check all documents', () => {
    test('Can the document parsed with Consorsbank', () => {
      allSamples.forEach(pages => {
        expect(consorsbank.canParseDocument(pages, 'pdf')).toEqual(true);
      });
    });

    test('Can identify a implementation from the document as Consorsbank', () => {
      allSamples.forEach(pages => {
        const implementations = findImplementation(pages, 'pdf');

        expect(implementations.length).toEqual(1);
        expect(implementations[0]).toEqual(consorsbank);
      });
    });
  });

  describe('Buy', () => {
    test('should map pdf data of sample 1 correctly', () => {
      const activity = consorsbank.parsePages(buySamples[0]).activities;

      expect(activity).toEqual([
        {
          broker: 'consorsbank',
          type: 'Buy',
          tax: 0,
          company: 'ALERIAN MLP ETF',
          date: '2020-02-12',
          datetime: '2020-02-12T14:57:49.000Z',
          fee: 17.46,
          isin: 'US00162Q8666',
          wkn: 'A1H99H',
          price: 7.414,
          amount: 5004.45,
          shares: 675,
        },
      ]);
    });

    test('should map pdf data of sample 2 correctly', () => {
      const activity = consorsbank.parsePages(buySamples[1]).activities;

      expect(activity).toEqual([
        {
          broker: 'consorsbank',
          type: 'Buy',
          company: 'GLOB.X SUPERDIVIDEND ETF',
          date: '2019-06-24',
          datetime: '2019-06-24T12:17:34.000Z',
          fee: 19.86,
          isin: 'US37950E5490',
          wkn: 'A1JJ54',
          price: 14.908,
          shares: 400,
          amount: 5963.2,
          tax: 0,
        },
      ]);
    });

    test('should map pdf data of sample 3 correctly', () => {
      const activity = consorsbank.parsePages(buySamples[2]).activities;

      expect(activity).toEqual([
        {
          broker: 'consorsbank',
          type: 'Buy',
          amount: 5044.28,
          company: 'ALERIAN MLP ETF',
          date: '2020-01-27',
          datetime: '2020-01-27T15:15:47.000Z',
          fee: 17.56,
          isin: 'US00162Q8666',
          wkn: 'A1H99H',
          price: 7.473007407407407,
          shares: 675,
          tax: 0,
        },
      ]);
    });

    test('should map pdf data of sample 4 correctly', () => {
      const activity = consorsbank.parsePages(buySamples[3]).activities;

      expect(activity).toEqual([
        {
          broker: 'consorsbank',
          type: 'Buy',
          company: 'GLOB.X SUPERDIVIDEND ETF',
          date: '2019-04-29',
          datetime: '2019-04-29T15:07:48.000Z',
          fee: 14.95,
          isin: 'US37950E5490',
          wkn: 'A1JJ54',
          price: 15.994,
          shares: 250,
          amount: 3998.5,
          tax: 0,
        },
      ]);
    });

    test('should map pdf data of old buy sample correctly', () => {
      const activity = consorsbank.parsePages(buySamples[4]).activities;

      expect(activity).toEqual([
        {
          broker: 'consorsbank',
          type: 'Buy',
          company: 'PAYPAL HDGS INC.DL-,0001',
          date: '2015-08-06',
          datetime: '2015-08-06T15:01:20.000Z',
          fee: 13.9,
          isin: 'US70450Y1038',
          wkn: 'A14R7U',
          price: 35.784,
          shares: 100,
          amount: 3578.4,
          tax: 0,
        },
      ]);
    });

    test('should map pdf data of buy sample from 2015 (ISHS)', () => {
      const activity = consorsbank.parsePages(buySamples[5]).activities;

      expect(activity).toEqual([
        {
          broker: 'consorsbank',
          type: 'Buy',
          company: 'ISHS-EO CO.BD LA.C.UTS DZ',
          date: '2015-08-03',
          datetime: '2015-08-03T06:00:48.000Z',
          isin: 'DE0002511243',
          wkn: '251124',
          price: 133.2393168997759,
          shares: 0.51764,
          amount: 68.97,
          tax: 0,
          fee: 1.03,
        },
      ]);
    });

    test('should map pdf data of limit buy sample from 2020', () => {
      const activity = consorsbank.parsePages(buySamples[6]).activities;

      expect(activity).toEqual([
        {
          broker: 'consorsbank',
          type: 'Buy',
          company: 'ADOBE INC.',
          date: '2020-12-09',
          datetime: '2020-12-09T20:18:29.000Z',
          isin: 'US00724F1012',
          wkn: '871981',
          price: 400,
          shares: 7,
          amount: 2800,
          tax: 0,
          fee: 11.95,
        },
      ]);
    });

    test('should map pdf data of fund buy sample from 2020', () => {
      const activity = consorsbank.parsePages(buySamples[7]).activities;

      expect(activity).toEqual([
        {
          broker: 'consorsbank',
          type: 'Buy',
          company: 'DWS IN.-AR.INT. LCEOA',
          date: '2020-11-17',
          datetime: '2020-11-17T09:51:08.000Z',
          isin: 'LU1863263346',
          wkn: 'DWS2W9',
          price: 152.42892587291965,
          shares: 1.60009,
          amount: 243.9,
          tax: 0,
          fee: 6.1,
        },
      ]);
    });

    test('should map pdf data of fund (without issue) buy sample from 2020', () => {
      const activity = consorsbank.parsePages(buySamples[8]).activities;

      expect(activity).toEqual([
        {
          broker: 'consorsbank',
          type: 'Buy',
          company: 'DWS IN.-AR.INT. LCEOA',
          date: '2020-09-16',
          datetime: '2020-09-16T06:24:08.000Z',
          isin: 'LU1863263346',
          wkn: 'DWS2W9',
          price: 143.31000246493204,
          shares: 1.74447,
          amount: 250,
          tax: 0,
          fee: 0,
        },
      ]);
    });

    test('Can parse buy from apple inc 2020', () => {
      const activity = consorsbank.parsePages(buySamples[9]).activities;

      expect(activity).toEqual([
        {
          broker: 'consorsbank',
          type: 'Buy',
          company: 'APPLE INC.',
          date: '2020-12-10',
          datetime: '2020-12-10T12:36:43.000Z',
          isin: 'US0378331005',
          wkn: '865985',
          price: 100,
          shares: 10,
          amount: 1000,
          tax: 0,
          fee: 9.95,
        },
      ]);
    });

    test('Can parse buy from ACATIS 2003', () => {
      const activity = consorsbank.parsePages(buySamples[10]).activities;
      expect(activity).toEqual([
        {
          broker: 'consorsbank',
          type: 'Buy',
          company: 'ACATIS AKT.GLOB.FONDS UI',
          date: '2003-12-15',
          datetime: '2003-12-15T' + activity[0].datetime.substring(11),
          wkn: '978174',
          price: 118.29099307159353,
          shares: 0.433,
          amount: 51.22,
          tax: 0,
          fee: -1.22,
        },
      ]);
    });

    test('Should map the document correctly: 2021_allianz_strategy_fond', () => {
      const activity = consorsbank.parsePages(buySamples[11]).activities;

      expect(activity).toEqual([
        {
          broker: 'consorsbank',
          type: 'Buy',
          company: 'ALL.STRATEG.WACHST.A2 EUR',
          date: '2021-01-05',
          datetime: '2021-01-05T' + activity[0].datetime.substring(11),
          isin: 'DE0009797639',
          wkn: '979763',
          price: 68.0605466623108,
          shares: 0.36732,
          amount: 25,
          tax: 0,
          fee: 0,
        },
      ]);
    });

    test('Should map the document correctly: 2021_janus_henderson_capital_funds', () => {
      const activity = consorsbank.parsePages(buySamples[12]).activities;

      expect(activity).toEqual([
        {
          broker: 'consorsbank',
          type: 'Buy',
          company: 'JHC-J.H.GL.LI.SC. AA',
          date: '2021-01-04',
          datetime: '2021-01-04T' + activity[0].datetime.substring(11),
          isin: 'IE0009355771',
          wkn: '935590',
          price: 38.58322401419863,
          shares: 0.64795,
          amount: 25,
          tax: 0,
          fee: 0,
          fxRate: 1.2254,
          foreignCurrency: 'USD',
        },
      ]);
    });

    test('Should map the document correctly: 2021 put on citi gl', () => {
      const activity = consorsbank.parsePages(buySamples[13]).activities;

      expect(activity).toEqual([
        {
          broker: 'consorsbank',
          type: 'Buy',
          company: 'CITI.GL.M. PUT21 PLUN',
          date: '2021-01-13',
          datetime: '2021-01-13T15:40:57.000Z',
          isin: 'DE000KE18UW0',
          wkn: 'KE18UW',
          price: 0.49,
          shares: 400,
          amount: 196,
          tax: 0,
          fee: 12.45,
        },
      ]);
    });

    test('Should map the document correctly: 2021_usd_churchill_cap_iv', () => {
      const activity = consorsbank.parsePages(buySamples[14]).activities;

      expect(activity).toEqual([
        {
          broker: 'consorsbank',
          type: 'Buy',
          company: 'CHURCHILL CAP.IV COMP.UT',
          date: '8830-12-06',
          datetime: '8830-12-06T14:57:10.000Z',
          isin: 'US1714392016',
          wkn: 'A2QAZC',
          price: 13.44,
          shares: 100,
          amount: 1344,
          tax: 0,
          fee: 24.95,
          foreignCurrency: 'USD',
          fxRate: 1.2128,
        },
      ]);
    });

    test('Should map the document correctly: 2019_cloudflare', () => {
      const activity = consorsbank.parsePages(buySamples[15]).activities;

      expect(activity).toEqual([
        {
          broker: 'consorsbank',
          type: 'Buy',
          company: 'CLOUDFLARE INC. A DL-,001',
          date: '2019-09-25',
          datetime: '2019-09-25T13:31:25.000Z',
          isin: 'US18915M1071',
          wkn: 'A2PQMN',
          price: 19.113877700476017,
          shares: 50,
          amount: 955.6938850238008,
          tax: 0,
          fee: 24.95,
          foreignCurrency: 'USD',
          fxRate: 1.0924,
        },
      ]);
    });

    test('Should map the document correctly: 2020_fraport', () => {
      const activity = consorsbank.parsePages(buySamples[16]).activities;

      expect(activity).toEqual([
        {
          broker: 'consorsbank',
          type: 'Buy',
          company: 'FRAPORT AG FFM.AIRPORT',
          date: '2020-04-06',
          datetime: '2020-04-06T13:29:58.000Z',
          isin: 'DE0005773303',
          wkn: '577330',
          price: 40.16,
          shares: 3,
          amount: 120.48,
          tax: 0,
          fee: 15.45,
        },
      ]);
    });

    test('Should map the document correctly: 2020_palantir', () => {
      const activity = consorsbank.parsePages(buySamples[17]).activities;

      expect(activity).toEqual([
        {
          broker: 'consorsbank',
          type: 'Buy',
          company: 'PALANTIR TECHNOLOGIES INC',
          date: '2020-12-04',
          datetime: '2020-12-04T10:21:02.000Z',
          isin: 'US69608A1088',
          wkn: 'A2QA4J',
          price: 20.2,
          shares: 300,
          amount: 6060,
          tax: 0,
          fee: 29.28,
        },
      ]);
    });

    test('Should map the document correctly: 2021_tui_special_buy', () => {
      const result = consorsbank.parsePages(buySamples[18]);
      expect(result.status).toEqual(0);
      expect(result.activities[0]).toEqual({
        broker: 'consorsbank',
        type: 'Buy',
        company: 'TUI AG NA O.N.',
        date: '2021-01-29',
        datetime: '2021-01-29' + result.activities[0].datetime.substr(10),
        isin: 'XX000XXXX000',
        wkn: 'TUAG00',
        price: 1.07,
        shares: 50,
        amount: 53.5,
        tax: 0,
        fee: 4.45,
      });
    });
  });

  describe('Sell', () => {
    test('should map pdf data of sample 1 correctly', () => {
      const activity = consorsbank.parsePages(sellSamples[0]).activities;

      expect(activity).toEqual([
        {
          amount: 22.59,
          broker: 'consorsbank',
          company: 'JOHNSON + JOHNSON    DL 1',
          date: '2019-10-24',
          datetime: '2019-10-24T16:31:22.000Z',
          fee: 0,
          isin: 'US4781601046',
          wkn: '853260',
          price: 116.44329896907216,
          shares: 0.194,
          tax: 0,
          type: 'Sell',
        },
      ]);
    });

    test('should map pdf data of sample 2 correctly', () => {
      expect(consorsbank.parsePages(sellSamples[1]).activities).toEqual([
        {
          amount: 22.59,
          broker: 'consorsbank',
          company: 'JOHNSON + JOHNSON    DL 1',
          date: '2019-10-24',
          datetime: '2019-10-24T16:31:22.000Z',
          fee: 0,
          isin: 'US4781601046',
          wkn: '853260',
          price: 116.44329896907216,
          shares: 0.194,
          tax: 0,
          type: 'Sell',
        },
      ]);
    });

    test('Should parse 2021 TUI priority Sell correctly', () => {
      const result = consorsbank.parsePages(sellSamples[2]);
      expect(result.status).toEqual(0);
      expect(result.activities).toEqual([
        {
          amount: 41.99,
          broker: 'consorsbank',
          company: 'TUI AG BZR',
          date: '2021-01-19',
          datetime: '2021-01-19' + result.activities[0].datetime.substr(10),
          fee: 2.5,
          isin: 'DE000TUAG109',
          wkn: 'TUAG10',
          price: 2.999285714285714,
          shares: 14,
          tax: 0,
          type: 'Sell',
        },
      ]);
    });

    test('Can parse document: 2021_DE0006047004', () => {
      const result = consorsbank.parsePages(sellSamples[3]);

      expect(result.status).toEqual(0);
      expect(result.activities).toEqual([
        {
          amount: 2180.22,
          broker: 'consorsbank',
          company: 'HEIDELBERGCEMENT AG O.N.',
          date: '2021-05-10',
          datetime: '2021-05-10T13:54:11.000Z',
          fee: 10.4,
          isin: 'DE0006047004',
          wkn: '604700',
          price: 75.18,
          shares: 29,
          tax: 117.66,
          type: 'Sell',
        },
      ]);
    });
  });

  describe('Dividend', () => {
    test('should map pdf data of ertrag_alerian_mlp_etf_1.json correctly', () => {
      const activities = consorsbank.parsePages(dividendsSamples[0]).activities;

      expect(activities).toEqual([
        {
          type: 'Dividend',
          broker: 'consorsbank',
          company: 'Alerian MLP ETF Registered Shares o.N.',
          date: '2020-05-14',
          datetime: '2020-05-14T' + activities[0].datetime.substring(11),
          isin: 'US00162Q8666',
          wkn: 'A1H99H',
          amount: 186.79,
          price: 0.13836296296296297,
          shares: 1350,
          tax: 47.72,
          fee: 0,
          foreignCurrency: 'USD',
          fxRate: 1.0841,
        },
      ]);
    });

    test('should map pdf data of ertrag_global_x_superdividend_etf correctly', () => {
      const activities = consorsbank.parsePages(dividendsSamples[1]).activities;

      expect(activities).toEqual([
        {
          amount: 71.02,
          broker: 'consorsbank',
          company: 'Global X SuperDividend ETF Registered Shares o.N.',
          date: '2020-03-12',
          datetime: '2020-03-12T' + activities[0].datetime.substring(11),
          fee: 0,
          isin: 'US37950E5490',
          wkn: 'A1JJ54',
          price: 0.10926153846153847,
          shares: 650,
          tax: 18.15,
          type: 'Dividend',
          foreignCurrency: 'USD',
          fxRate: 1.1184,
        },
      ]);
    });

    test('should map pdf data of dividend_vanguard ftse_etf.json correctly', () => {
      const activities = consorsbank.parsePages(dividendsSamples[2]).activities;

      expect(activities).toEqual([
        {
          amount: 9.75,
          broker: 'consorsbank',
          company: 'Vanguard FTSE D.A.P.x.J.U.ETF Registered Shares o.N.',
          date: '2018-10-10',
          datetime: '2018-10-10T' + activities[0].datetime.substring(11),
          fee: 0,
          isin: 'IE00B9F5YL18',
          wkn: 'A1T8FT',
          price: 0.21195652173913043,
          shares: 46,
          tax: 1.8,
          type: 'Dividend',
          foreignCurrency: 'USD',
          fxRate: 1.1604,
        },
      ]);
    });

    test('should map pdf data of ertrag_alerian_mlp_etf_2.json', () => {
      const activities = consorsbank.parsePages(dividendsSamples[3]).activities;

      expect(activities).toEqual([
        {
          amount: 236.73,
          broker: 'consorsbank',
          company: 'Alerian MLP ETF Registered Shares o.N.',
          date: '2020-02-20',
          datetime: '2020-02-20T' + activities[0].datetime.substring(11),
          fee: 0,
          isin: 'US00162Q8666',
          wkn: 'A1H99H',
          price: 0.17535555555555554,
          shares: 1350,
          tax: 60.48,
          type: 'Dividend',
          foreignCurrency: 'USD',
          fxRate: 1.0835,
        },
      ]);
    });

    test('should map pdf data of dividend_volkswagen_ag.json', () => {
      const activities = consorsbank.parsePages(dividendsSamples[4]).activities;

      expect(activities).toEqual([
        {
          amount: 67.2,
          broker: 'consorsbank',
          company: 'VOLKSWAGEN AG Inhaber-Stammaktien o.N.',
          date: '2019-05-17',
          datetime: '2019-05-17T' + activities[0].datetime.substring(11),
          fee: 0,
          isin: 'DE0007664005',
          wkn: '766400',
          price: 4.8,
          shares: 14,
          tax: 18.68,
          type: 'Dividend',
        },
      ]);
    });

    test('should map pdf data of dividend_diageo.json', () => {
      const activities = consorsbank.parsePages(dividendsSamples[5]).activities;

      expect(activities).toEqual([
        {
          type: 'Dividend',
          amount: 1.53,
          broker: 'consorsbank',
          company: 'DIAGEO PLC Reg. Shares LS -,28935185',
          date: '2020-10-08',
          datetime: '2020-10-08T' + activities[0].datetime.substring(11),
          fee: 0,
          isin: 'GB0002374006',
          wkn: '851247',
          price: 0.4625640560518797,
          shares: 3.30765,
          tax: 0,
          foreignCurrency: 'GBP',
          fxRate: 0.9134,
        },
      ]);
    });

    test('should map pdf data of dividend_cisco_system_inc.json', () => {
      const activities = consorsbank.parsePages(dividendsSamples[6]).activities;

      expect(activities).toEqual([
        {
          amount: 0.27,
          broker: 'consorsbank',
          company: 'CISCO SYSTEMS INC. Registered Shares DL-,001',
          date: '2020-04-22',
          datetime: '2020-04-22T' + activities[0].datetime.substring(11),
          fee: 0,
          isin: 'US17275R1023',
          wkn: '878841',
          price: 0.33889795406049955,
          shares: 0.7967,
          tax: 0.04,
          type: 'Dividend',
          foreignCurrency: 'USD',
          fxRate: 1.0814,
        },
      ]);
    });

    test('should map pdf data of dividend_pepsico.json', () => {
      const activities = consorsbank.parsePages(dividendsSamples[7]).activities;

      expect(activities).toEqual([
        {
          amount: 1.26,
          broker: 'consorsbank',
          company: 'PEPSICO INC. Registered Shares DL -,0166',
          date: '2020-09-30',
          datetime: '2020-09-30T' + activities[0].datetime.substring(11),
          fee: 0,
          isin: 'US7134481081',
          wkn: '851995',
          price: 0.8723949318008724,
          shares: 1.4443,
          tax: 0.19,
          type: 'Dividend',
          foreignCurrency: 'USD',
          fxRate: 1.1786,
        },
      ]);
    });

    test('should map pdf data of illinois tool works', () => {
      const activities = consorsbank.parsePages(dividendsSamples[8]).activities;

      expect(activities).toEqual([
        {
          amount: 23.29,
          broker: 'consorsbank',
          company: 'ILLINOIS TOOL WORKS INC. Registered Shares o.N.',
          date: '2020-10-14',
          datetime: '2020-10-14T' + activities[0].datetime.substring(11),
          fee: 0,
          isin: 'US4523081093',
          wkn: '861219',
          price: 0.9704166666666667,
          shares: 24,
          tax: 5.95,
          type: 'Dividend',
          foreignCurrency: 'USD',
          fxRate: 1.1749,
        },
      ]);
    });

    // This document is a funny one. First, there is a missmatch occuring during
    // USD-> EUR calculation. It states a gross dividend of 0.13€ and a tax of
    // 0.02€, however 0.12€ are payed out.
    // Secondly, it seems to be a cancellation of an allready payed out dividend
    // so the dividend is payed BACK to the Broker to recalculate something
    test('should map pdf data of realty income', () => {
      const activities = consorsbank.parsePages(dividendsSamples[9]).activities;

      expect(activities).toEqual([
        {
          broker: 'consorsbank',
          company: 'REALTY INCOME CORP. Registered Shares DL 1',
          date: '2020-02-19',
          datetime: '2020-02-19T' + activities[0].datetime.substring(11),
          isin: 'US7561091049',
          wkn: '899744',
          amount: 0.13,
          fee: 0,
          price: 0.1908256880733945,
          shares: 0.68125,
          tax: 0.01,
          type: 'Dividend',
          foreignCurrency: 'USD',
          fxRate: 1.1174,
        },
      ]);
    });

    test('should map pdf data of agnc investment corp', () => {
      const activities = consorsbank.parsePages(dividendsSamples[10])
        .activities;

      expect(activities).toEqual([
        {
          broker: 'consorsbank',
          company: 'AGNC Investment Corp. Registered Shares DL -,001',
          date: '2020-06-29',
          datetime: '2020-06-29T' + activities[0].datetime.substring(11),
          isin: 'US00123Q1040',
          wkn: 'A2AR58',
          amount: 5.87,
          fee: 0,
          price: 0.09171875,
          shares: 64,
          tax: 0.88,
          type: 'Dividend',
          foreignCurrency: 'USD',
          fxRate: 1.1263,
        },
      ]);
    });

    test('Can parse dividend from a 2015 total sa file', () => {
      const activities = consorsbank.parsePages(dividendsSamples[11])
        .activities;

      expect(activities).toEqual([
        {
          broker: 'consorsbank',
          company: 'Total S.A.',
          date: '2015-07-01',
          datetime: '2015-07-01T' + activities[0].datetime.substring(11),
          wkn: 'A14UJS',
          amount: 15.25,
          fee: 0,
          price: 0.61,
          shares: 25,
          tax: 4.58,
          type: 'Dividend',
        },
      ]);
    });

    test('Can parse dividend from a 2016 bmw file', () => {
      const activities = consorsbank.parsePages(dividendsSamples[12])
        .activities;

      expect(activities).toEqual([
        {
          broker: 'consorsbank',
          company: 'BAYERISCHE MOTOREN WERKE AG',
          date: '2016-05-13',
          datetime: '2016-05-13T' + activities[0].datetime.substring(11),
          wkn: '519000',
          amount: 489.6,
          fee: 0,
          price: 3.2,
          shares: 153,
          tax: 136.2,
          type: 'Dividend',
        },
      ]);
    });

    test('Can parse dividend from a 2018 total sa file', () => {
      const activities = consorsbank.parsePages(dividendsSamples[13])
        .activities;

      expect(activities).toEqual([
        {
          broker: 'consorsbank',
          company: 'Total S.A. Anrechte',
          date: '2018-06-28',
          datetime: '2018-06-28T' + activities[0].datetime.substring(11),
          wkn: 'A2JNEW',
          isin: 'FR0013333374',
          amount: 15.5,
          fee: 0,
          price: 0.62,
          shares: 25,
          tax: 4.65,
          type: 'Dividend',
        },
      ]);
    });

    test('Can parse dividend from a 2018 DEUTSCHE POST AG file', () => {
      const activities = consorsbank.parsePages(dividendsSamples[14])
        .activities;

      expect(activities).toEqual([
        {
          broker: 'consorsbank',
          company: 'DEUTSCHE POST AG NAMENS-AKTIEN O.N.',
          date: '2018-04-27',
          datetime: '2018-04-27T' + activities[0].datetime.substring(11),
          wkn: '555200',
          isin: 'DE0005552004',
          amount: 24.15,
          fee: 0,
          price: 1.15,
          shares: 21,
          tax: 0,
          type: 'Dividend',
        },
      ]);
    });

    test('The statement should be parsed: 2015_ishare_stoxx', () => {
      const activities = consorsbank.parsePages(dividendsSamples[15])
        .activities;

      expect(activities).toEqual([
        {
          broker: 'consorsbank',
          company: 'iSh.STOXX Europe 600 U.ETF DE',
          date: '2015-09-15',
          datetime: '2015-09-15T' + activities[0].datetime.substring(11),
          wkn: '263530',
          amount: 23.44,
          fee: 0,
          price: 0.37206349206349204,
          shares: 63,
          tax: 0,
          type: 'Dividend',
        },
      ]);
    });
  });

  describe('Validate all ignored statements', () => {
    test('All ignored statements return status 7 and no activities', () => {
      const ignoredResult = {
        activities: [],
        status: 7,
      };
      ignoredSamples.forEach(pages => {
        const result = consorsbank.parsePages(pages);
        expect(result).toEqual(ignoredResult);
      });
    });
  });
});
