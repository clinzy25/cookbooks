import { ThemeProps } from '@/types/@types.theme'

export const Globals: ThemeProps = {
  breakpointMobile: '800',
  successColor: '#16a500',
  errorColor: '#d80000',
  neutralColor: '#bababa',
  nullifiedColor: '#4c4c4c',
  linkColor: '#0000ee',
}

export const LightTheme: ThemeProps = {
  ...Globals,
  mainBackgroundColor: '#fcfcfc',
  secondaryBackgroundColor: '#e4e4e4',
  cardBackgroundColor: '#fcfcfc',
  navBackgroundColor: '#212529',
  tagBackgroundColor: '#e9ecef',

  mainBackgroundColorHover: '#f0f0f0',
  secondaryBackgroundColorHover: '#d0d0d0',
  navBackgroundColorHover: '#454c54',

  headerTextColor: '#121420',
  mainTextColor: '#fff',
  mainTextColorInverse: '#000',
  mainTextColorHover: '#e36414',
  secondaryTextColor: '#494949',

  buttonBackground: '#e56a1d',
  buttonBackgroundHover: '#ef7f39',
  iconBackgroundHover: '#ffd100',
  buttonBackgroundActive: '#d15e17',

  buttonTransition: 'all 0.1s ease-out;',
  cardTransition: 'all 0.15s ease-out',

  softBorder: '#bfbfbf',
  boxShadowOverOtherElements: '0 2px 24px 0 rgba(0,0,0,.24)',
  superSoftBoxShadow: '0 5px 15px 0 rgba(0,0,0,.1)',

  pageHeaderFont: '2.4rem Montserrat, sans-serif',
  pageHeaderFontMobile: '1.8rem Montserrat, sans-serif',
  cardHeaderFont: '1.7rem Montserrat, sans-serif',
  modalHeaderFont: '1.7rem Montserrat, sans-serif',
  modalHeaderFontMobile: '1.5rem Montserrat, sans-serif',
  modalSubHeaderFont: '1.3rem Montserrat, sans-serif',
}
