export type Donation = {
  id: 'btc' | 'usdt' | 'trx';
  coin: string;
  ticker: string;
  network: string;
  address: string;
};

export const donations: Donation[] = [
  {
    id: 'btc',
    coin: 'Bitcoin',
    ticker: 'BTC',
    network: 'Bitcoin',
    address: 'bc1qvql8zva7wpt7qeus539fx8uuqlcy0lsc5eqznt',
  },
  {
    id: 'usdt',
    coin: 'Tether USD',
    ticker: 'USDT',
    network: 'TON',
    address: 'UQAUc_wUPo6xQk-l-HrWUBpX1KxzUSWSEX-WN_FUF_8TWIkh',
  },
  {
    id: 'trx',
    coin: 'TRON',
    ticker: 'TRX',
    network: 'TRON',
    address: 'TCDYLZjD24qDUjuBb9DYCuicfGCojxhAB4',
  },
];
