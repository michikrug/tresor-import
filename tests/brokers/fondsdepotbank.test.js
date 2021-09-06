import { findImplementation } from '@/index';
import * as fondsdepotbank from '../../src/brokers/fondsdepotbank';
import {
  buySamples,
  sellSamples,
  dividendSamples,
  allSamples,
} from './__mocks__/fondsdepotbank';

describe('Broker: fondsdepotbank', () => {
  let consoleErrorSpy;

  describe('Check all documents', () => {
    test('Can one page parsed with fondsdepotbank', () => {
      allSamples.forEach(pages => {
        expect(fondsdepotbank.canParseDocument(pages, 'pdf')).toEqual(true);
      });
    });

    test('Can identify a broker from one page as fondsdepotbank', () => {
      allSamples.forEach(pages => {
        const implementations = findImplementation(pages, 'pdf');

        expect(implementations.length).toEqual(1);
        expect(implementations[0]).toEqual(fondsdepotbank);
      });
    });
  });

  describe('Validate buys', () => {
    test('Can the order parsed from single buy', () => {
      const activities = fondsdepotbank.parsePages(buySamples[0]).activities;

      expect(activities.length).toEqual(1);
      expect(activities[0]).toEqual({
        broker: 'fondsdepotbank',
        type: 'Buy',
        date: '2018-08-22',
        datetime: '2018-08-22T' + activities[0].datetime.substring(11),
        isin: 'DE1234512345',
        wkn: 'ABCDEF',
        company: 'Testfond',
        shares: 11.867,
        price: 200.6303,
        amount: 2380.88,
        fee: 119.12,
        tax: 0,
      });
    });

    test('Can the order parsed from single buy by exchange', () => {
      const activities = fondsdepotbank.parsePages(buySamples[1]).activities;

      expect(activities.length).toEqual(1);
      expect(activities[0]).toEqual({
        broker: 'fondsdepotbank',
        type: 'Buy',
        date: '2020-05-12',
        datetime: '2020-05-12T' + activities[0].datetime.substring(11),
        isin: 'DE1234512345',
        wkn: 'ABCDEF',
        company: 'Testfond',
        shares: 103.7,
        price: 25.3001,
        amount: 2623.62,
        fee: 0,
        tax: 0,
      });
    });

    test('Can the order parsed from multiple savings', () => {
      const activities = fondsdepotbank.parsePages(buySamples[2]).activities;

      expect(activities.length).toEqual(5);
      expect(activities[0]).toEqual({
        broker: 'fondsdepotbank',
        type: 'Buy',
        date: '2021-02-10',
        datetime: '2021-02-10T' + activities[0].datetime.substring(11),
        isin: 'DE1234512345',
        wkn: 'ABCDEF',
        company: 'Testfond',
        shares: 0.196,
        price: 218.1122,
        amount: 42.75,
        fee: 2.25,
        tax: 0,
      });
    });

    test('Can the order parsed from buy with reinvest', () => {
      const activities = fondsdepotbank.parsePages(buySamples[3]).activities;

      expect(activities.length).toEqual(3);
      expect(activities[2]).toEqual({
        broker: 'fondsdepotbank',
        type: 'Buy',
        date: '2020-12-22',
        datetime: '2020-12-22T' + activities[0].datetime.substring(11),
        isin: 'DE1234512345',
        wkn: 'ABCDEF',
        company: 'Testfond',
        shares: 0.477,
        price: 208.3438,
        amount: 99.38,
        fee: 0,
        tax: 0,
      });
    });
  });

  describe('Validate sells', () => {
    test('Can the order parsed from single sell as exchange', () => {
      const activities = fondsdepotbank.parsePages(sellSamples[0]).activities;

      expect(activities.length).toEqual(1);
      expect(activities[0]).toEqual({
        broker: 'fondsdepotbank',
        type: 'Sell',
        date: '2020-05-11',
        datetime: '2020-05-11T' + activities[0].datetime.substring(11),
        isin: 'DE1234512345',
        wkn: 'ABCDEF',
        company: 'Testfond',
        shares: 22.496,
        price: 147.2902,
        amount: 3313.44,
        fee: 0,
        tax: 0,
      });
    });

    test('Can the order parsed from single sell with taxes', () => {
      const activities = fondsdepotbank.parsePages(sellSamples[1]).activities;

      expect(activities.length).toEqual(1);
      expect(activities[0]).toEqual({
        broker: 'fondsdepotbank',
        type: 'Sell',
        date: '2020-06-30',
        datetime: '2020-06-30T' + activities[0].datetime.substring(11),
        isin: 'DE1234512345',
        wkn: 'ABCDEF',
        company: 'Testfond',
        shares: 180.379,
        price: 96.31,
        amount: 17372.3,
        fee: 0,
        tax: 139.57,
      });
    });
  });

  describe('Validate dividends', () => {
    test('Can the dividend in EUR parsed from the document', () => {
      const activities = fondsdepotbank.parsePages(dividendSamples[0])
        .activities;

      expect(activities.length).toEqual(1);
      expect(activities[0]).toEqual({
        broker: 'fondsdepotbank',
        type: 'Dividend',
        date: '2018-11-15',
        datetime: '2018-11-15T' + activities[0].datetime.substring(11),
        isin: 'DE1234512345',
        wkn: 'ABCDEF',
        company: 'Testfond',
        shares: 176.987,
        price: 1,
        amount: 176.99,
        fee: 0,
        tax: 0,
      });
    });

    test('Can the dividend in EUR parsed from the document with taxes', () => {
      const activities = fondsdepotbank.parsePages(dividendSamples[1])
        .activities;

      expect(activities.length).toEqual(1);
      expect(activities[0]).toEqual({
        broker: 'fondsdepotbank',
        type: 'Dividend',
        date: '2018-11-15',
        datetime: '2018-11-15T' + activities[0].datetime.substring(11),
        isin: 'DE1234512345',
        wkn: 'ABCDEF',
        company: 'Testfond',
        shares: 176.987,
        price: 1,
        amount: 176.99,
        fee: 0,
        tax: 8.55,
      });
    });
  });

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });
});
