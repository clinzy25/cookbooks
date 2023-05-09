import { css } from 'styled-components'

export const TagMixin = css`
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.softBorder};
  border-radius: 25px;
  background-color: ${({ theme }) => theme.tagBackground};
  margin: 0 5px;
  padding: 0 7px;
  font-family: 'DM Mono', monospace;
  box-shadow: 2px 2px 2px ${({ theme }) => theme.boxShadowColor};
  transition: ${({ theme }) => theme.buttonTransition};
  white-space: nowrap;
  &:hover {
    text-decoration: underline;
    transition: ${({ theme }) => theme.buttonTransition};
    background-color: ${({ theme }) => theme.buttonBackgroundHover};
  }
`

export const IconMixin = css`
  font-size: 2.2rem;
  background-color: ${({ theme }) => theme.buttonBackground};
  border: 1px solid ${({ theme }) => theme.softBorder};
  border-radius: 25px;
  padding: 5px;
  transition: ${({ theme }) => theme.buttonTransition};
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.buttonBackgroundHover};
  }
`

export const AddBtnMixin = css`
  position: fixed;
  right: 50px;
  bottom: 50px;
  cursor: pointer;
  background-color: white;
  border-radius: 50px;
  font-size: 4.5rem;
  transition: ${({ theme }) => theme.buttonTransition};
  border: 1px solid ${({ theme }) => theme.softBorder};
  padding: 0;
  z-index: 10;
  &:hover {
    ${({ theme }) => theme.buttonTransition};
    transform: scale(1.05);
  }
`

export const AvatarMixin = css`
  border: 1px solid ${({ theme }) => theme.softBorder};
  border-radius: 25px;
  padding: 3px;
`

export const CardGradient = css`
  background: linear-gradient(
    top,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.97) 70%,
    rgba(255, 255, 255, 1) 100%
  );
  background: -moz-linear-gradient(
    top,
    rgba(0, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.97) 70%,
    rgba(255, 255, 255, 1) 100%
  );
  background: -ms-linear-gradient(
    top,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.97) 70%,
    rgba(255, 255, 255, 1) 100%
  );
  background: -o-linear-gradient(
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.97) 70%,
    rgba(255, 255, 255, 1) 100%
  );
  background: -webkit-linear-gradient(
    top,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.97) 70%,
    rgba(255, 255, 255, 1) 100%
  );
`

export const CardGradientHover = css`
  background: linear-gradient(
    top,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.97) 70%,
    rgba(255, 255, 255, 1) 100% 100%
  );
  background: -moz-linear-gradient(
    top,
    rgba(0, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.97) 70%,
    rgba(255, 255, 255, 1) 100% 100%
  );
  background: -ms-linear-gradient(
    top,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.97) 70%,
    rgba(255, 255, 255, 1) 100% 100%
  );
  background: -o-linear-gradient(
    top,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.97) 70%,
    rgba(255, 255, 255, 1) 100% 100%
  );
  background: -webkit-linear-gradient(
    top,
    rgba(10, 10, 10, 0) 0%,
    rgba(240, 240, 240, 0.97) 70%,
    rgba(240, 240, 240, 1) 100%
  );
`
