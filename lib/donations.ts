export type DonationPalette = {
  ink: string;
  paper: string;
  accent: string;
  glow: string;
};

export type Donation = {
  id: 'btc' | 'usdt' | 'trx';
  coin: string;
  ticker: string;
  network: string;
  address: string;
  palette: DonationPalette;
};

export const donations: Donation[] = [
  {
    id: 'btc',
    coin: 'Bitcoin',
    ticker: 'BTC',
    network: 'Bitcoin',
    address: 'bc1qvql8zva7wpt7qeus539fx8uuqlcy0lsc5eqznt',
    palette: {
      ink: '#3b2410',
      paper: '#f8efe0',
      accent: '#f7931a',
      glow: 'rgba(247, 147, 26, 0.14)',
    },
  },
  {
    id: 'usdt',
    coin: 'Tether USD',
    ticker: 'USDT',
    network: 'TON',
    address: 'UQAUc_wUPo6xQk-l-HrWUBpX1KxzUSWSEX-WN_FUF_8TWIkh',
    palette: {
      ink: '#0b332b',
      paper: '#e7f6f0',
      accent: '#26a17b',
      glow: 'rgba(38, 161, 123, 0.14)',
    },
  },
  {
    id: 'trx',
    coin: 'TRON',
    ticker: 'TRX',
    network: 'TRON',
    address: 'TCDYLZjD24qDUjuBb9DYCuicfGCojxhAB4',
    palette: {
      ink: '#3a0d12',
      paper: '#fae9ea',
      accent: '#eb0029',
      glow: 'rgba(235, 0, 41, 0.12)',
    },
  },
];
