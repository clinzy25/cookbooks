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
  cardBackgroundColor: '#fcfcfc',
  navBackgroundColor: '#212529',

  mainBackgroundColorHover: '#f0f0f0',
  secondaryBackgroundColor: '#e4e4e4',
  secondaryBackgroundColorHover: '#d0d0d0',

  headerTextColor: '#121420',
  mainTextColor: '#fff',
  mainTextColorInverse: '#000',
  mainTextColorHover: '#e36414',
  secondaryTextColor: '#494949',

  buttonBackground: '#e36414',
  buttonBackgroundHover: '#ef7f39',
  iconBackgroundHover: '#ffd100',

  buttonBackgroundActive: '#d3d3d3',
  buttonTransition: 'all 0.1s ease-out;',
  cardTransition: 'all 0.15s ease-out',
  softBorder: '#bfbfbf',
  lightBoxShadowColor: '#e3e3e3',
  darkBoxShadowColor: '#d2d2d2',
  darkBoxShadowColorHover: '#b5b5b5',
  boxShadowOverOtherElements: '0 2px 24px 0 rgba(0,0,0,.24)',

  pageHeaderFont: '2.4rem Montserrat, sans-serif',
  pageHeaderFontMobile: '1.8rem Montserrat, sans-serif',
  cardHeaderFont: '1.7rem Montserrat, sans-serif',
  modalHeaderFont: '1.7rem Montserrat, sans-serif',
  modalHeaderFontMobile: '1.5rem Montserrat, sans-serif',
  modalSubHeaderFont: '1.3rem Montserrat, sans-serif',
}
