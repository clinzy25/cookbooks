import { createGlobalStyle } from 'styled-components'

export const ModalGlobalStyles = createGlobalStyle`
  body {
    overflow: hidden;
  }
  .page-wrapper > *:not(#modal), 
  #breadcrumb-wrapper > *:not(#modal) {
    pointer-events: none;
    filter: blur(4px);
  }
`
