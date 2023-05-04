import { css } from 'styled-components'

export const TagMixin = css`
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.softBorder};
  border-radius: 25px;
  background-color: ${({ theme }) => theme.tagColor};
  margin: 0 5px;
  padding: 0 7px;
  font-family: 'DM Mono', monospace;
  box-shadow: 2px 2px 2px #d2d2d2;
  transition: all 0.1s ease-out;
  &:hover {
    text-decoration: underline;
    transition: all 0.1s ease-out;
  }
`

export const IconMixin = css`
  font-size: 2.2rem;
  background-color: whitesmoke;
  border: 1px solid ${({ theme }) => theme.softBorder};
  border-radius: 25px;
  padding: 5px;
  transition: all 0.1s ease-out;
  cursor: pointer;
  &:hover {
    background-color: #d2d2d2;
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
  transition: all 0.1s ease-out;
  border: 1px solid ${({ theme }) => theme.softBorder};
  padding: 0;
  &:hover {
    transition: all 0.1s ease-out;
    transform: scale(1.05);
  }
`