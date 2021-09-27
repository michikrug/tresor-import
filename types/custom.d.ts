export enum ActivityType {
  BUY = 'Buy',
  SELL = 'Sell',
  DIVIDEND = 'Dividend',
  TRANSFER_IN = 'TransferIn',
  TRANSFER_OUT = 'TransferOut',
  PAYBACK = 'Payback',
  TAX_DIVIDEND = 'TaxDividend',
}

export type ActivityTypeUnion = `${ActivityType}`;

export enum ParserStatus {
  SUCCESS = 0,
  UNKNOWN_IMPLEMENTATION = 1,
  AMBIGUOUS_IMPLEMENTATION = 2,
  FATAL_ERROR = 3,
  UNSUPPORTED_FILETYPE = 4,
  NO_ACTIVITIES = 5,
  MISSING_IMPLEMENTATION = 6,
  INVALID_DOCUMENT = 7,
}

export interface Activity {
  broker: string;
  type: ActivityTypeUnion;
  /** @deprecated */
  date: Date | string;
  datetime: Date | string;
  isin?: string;
  wkn?: string;
  company: string;
  shares?: number;
  price?: number;
  amount: number;
  fee: number = 0;
  tax: number = 0;
  foreignCurrency?: string;
  fxRate?: number;
}

export interface Implementation {
  canParseDocument(pages: page[], extension: string);
  parsePages(contents);
}

export interface ParserResult {
  activities?: Activity[];
  status: ParserStatus;
}

export type page = string[];

export interface ParsedFile {
  pages: page[];
  extension: string;
}

export as namespace Importer;
