export interface Bank {
  value: string;
  label: string;
  code?: string;
}

export const nigerianBanks: Bank[] = [
  { value: 'access-bank', label: 'Access Bank', code: '044' },
  { value: 'citibank', label: 'Citibank', code: '023' },
  { value: 'diamond-bank', label: 'Diamond Bank', code: '063' },
  { value: 'ecobank', label: 'Ecobank Nigeria', code: '050' },
  { value: 'fidelity-bank', label: 'Fidelity Bank', code: '070' },
  { value: 'first-bank', label: 'First Bank of Nigeria', code: '011' },
  { value: 'first-city-monument', label: 'First City Monument Bank', code: '214' },
  { value: 'guaranty-trust', label: 'Guaranty Trust Bank', code: '058' },
  { value: 'heritage-bank', label: 'Heritage Bank', code: '030' },
  { value: 'keystone-bank', label: 'Keystone Bank', code: '082' },
  { value: 'polaris-bank', label: 'Polaris Bank', code: '076' },
  { value: 'providus-bank', label: 'Providus Bank', code: '101' },
  { value: 'stanbic-ibtc', label: 'Stanbic IBTC Bank', code: '221' },
  { value: 'standard-chartered', label: 'Standard Chartered Bank', code: '068' },
  { value: 'sterling-bank', label: 'Sterling Bank', code: '232' },
  { value: 'suntrust-bank', label: 'Suntrust Bank', code: '100' },
  { value: 'union-bank', label: 'Union Bank of Nigeria', code: '032' },
  { value: 'united-bank-for-africa', label: 'United Bank for Africa', code: '033' },
  { value: 'unity-bank', label: 'Unity Bank', code: '215' },
  { value: 'wema-bank', label: 'Wema Bank', code: '035' },
  { value: 'zenith-bank', label: 'Zenith Bank', code: '057' },
];
