import { ThemeProps } from '@/types/@types.theme'
import { createGlobalStyle, withTheme } from 'styled-components'

type GlobalThemeProps = {
  theme: ThemeProps
}

const globalStyle = createGlobalStyle`
  :root {
    --max-width: 1100px;
    --border-radius: 12px;
    --font-mono: ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono',
      'Roboto Mono', 'Oxygen Mono', 'Ubuntu Monospace', 'Source Code Pro',
      'Fira Mono', 'Droid Sans Mono', 'Courier New', monospace;

    --foreground-rgb: 0, 0, 0;
    --background-start-rgb: 214, 219, 220;
    --background-end-rgb: 255, 255, 255;

    --primary-glow: conic-gradient(
      from 180deg at 50% 50%,
      #16abff33 0deg,
      #0885ff33 55deg,
      #54d6ff33 120deg,
      #0071ff33 160deg,
      transparent 360deg
    );
    --secondary-glow: radial-gradient(
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 0)
    );

    --tile-start-rgb: 239, 245, 249;
    --tile-end-rgb: 228, 232, 233;
    --tile-border: conic-gradient(
      #00000080,
      #00000040,
      #00000030,
      #00000020,
      #00000010,
      #00000010,
      #00000080
    );

    --callout-rgb: 238, 240, 241;
    --callout-border-rgb: 172, 175, 176;
    --card-rgb: 180, 185, 188;
    --card-border-rgb: 131, 134, 135;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --foreground-rgb: 255, 255, 255;
      --background-start-rgb: 0, 0, 0;
      --background-end-rgb: 0, 0, 0;

      --primary-glow: radial-gradient(rgba(1, 65, 255, 0.4), rgba(1, 65, 255, 0));
      --secondary-glow: linear-gradient(
        to bottom right,
        rgba(1, 65, 255, 0),
        rgba(1, 65, 255, 0),
        rgba(1, 65, 255, 0.3)
      );

      --tile-start-rgb: 2, 13, 46;
      --tile-end-rgb: 2, 5, 19;
      --tile-border: conic-gradient(
        #ffffff80,
        #ffffff40,
        #ffffff30,
        #ffffff20,
        #ffffff10,
        #ffffff10,
        #ffffff80
      );

      --callout-rgb: 20, 20, 20;
      --callout-border-rgb: 108, 108, 108;
      --card-rgb: 100, 100, 100;
      --card-border-rgb: 200, 200, 200;
    }
  }
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
  html {
    height: 100%;
  }
  body {
    max-width: 100vw;
    min-height: 100%;
    overflow-x: hidden;
    position: relative;
    font-family: 'Nunito Sans', sans-serif;
    letter-spacing: 0.7px;
    background-color: ${({ theme }: GlobalThemeProps) => theme.mainBackgroundColor};
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  .page-wrapper {
    flex-grow: 1;
    padding: 15px 60px 100px 60px;
  }
  #simplifyJobsContainer {
    position: absolute;
  }
  #__next {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  @media screen and (max-width: ${({ theme }) => theme.breakpointMobile}px) {
    .page-wrapper {
      padding: 10px 15px 80px 15px;
    }
  }
`

export default withTheme(globalStyle)
