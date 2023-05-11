import { createGlobalStyle } from 'styled-components'

export const ModalGlobalStyles = createGlobalStyle`
  body {
    overflow: hidden;
  }
  #recipe-page-wrapper > *:not(#modal), 
  #breadcrumb-wrapper > *:not(#modal), 
  #cookbook-detail-page-wrapper > *:not(#modal), 
  #cookbook-page-wrapper > *:not(#modal) {
    pointer-events: none;
    filter: blur(4px);
  }
`
