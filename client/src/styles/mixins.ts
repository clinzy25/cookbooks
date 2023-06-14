import { css } from 'styled-components'

export const CardMixin = css`
  transition: ${({ theme }) => theme.cardTransition};
  background-color: ${({ theme }) => theme.cardBackgroundColor};
  border-radius: 10px;
  animation: cardIn 0.3s ease-out;
  @keyframes cardIn {
    0% {
      opacity: 0;
      transform: translateY(25px);
      -webkit-transform: translateY(25px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
      -webkit-transform: translateY(0);
    }
  }
  &:hover {
    transition: ${({ theme }) => theme.cardTransition};
    background-color: ${({ theme }) => theme.mainBackgroundColorHover};
  }
`

export const TagMixin = ({ tagsEditMode }: { tagsEditMode?: boolean }) => css`
  display: flex;
  align-items: center;
  border-radius: 25px;
  margin: 0 5px;
  padding: 0 7px;
  font-family: 'DM Mono', monospace;
  transition: ${({ theme }) => theme.buttonTransition};
  white-space: nowrap;
  background-color: ${({ theme }) =>
    tagsEditMode ? theme.iconBackgroundHover : theme.tagBackgroundColor};
  color: ${({ theme }) => theme.mainTextColorInverse};
`

export const TagHoverMixin = css`
  &:hover {
    text-decoration: underline;
    transition: ${({ theme }) => theme.buttonTransition};
    background-color: ${({ theme }) => theme.iconBackgroundHover};
    color: ${({ theme }) => theme.mainTextColorInverse};
    transform: scale(1.2);
    padding: 3px 12px;
    margin: 0 10px;
  }
`

export const IconMixin = css`
  font-size: 2.5rem;
  background-color: ${({ theme }) => theme.buttonBackground};
  border-radius: 25px;
  padding: 5px;
  transition: ${({ theme }) => theme.buttonTransition};
  color: ${({ theme }) => theme.mainTextColor};
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.iconBackgroundHover};
    color: ${({ theme }) => theme.mainTextColorInverse};
  }
`

export const AddBtnMixin = css`
  display: flex;
  z-index: 5;
  overflow: hidden;
  border-radius: 50px;
  cursor: pointer;
  transition: ${({ theme }) => theme.buttonTransition};
  &:hover {
    transition: ${({ theme }) => theme.buttonTransition};
    transform: scale(1.2);
    .add-btn {
      background-color: ${({ theme }) => theme.iconBackgroundHover};
      color: ${({ theme }) => theme.mainTextColorInverse};
    }
  }
  .add-btn {
    background-color: white;
    font-size: 4.5rem;
    padding: 10px;
    background-color: ${({ theme }) => theme.buttonBackground};
    color: ${({ theme }) => theme.mainTextColor};
    transition: ${({ theme }) => theme.buttonTransition};
  }
`

export const AvatarMixin = css`
  border-radius: 25px;
  cursor: pointer;
  transition: ${({ theme }) => theme.buttonTransition};
  &:hover {
    transition: ${({ theme }) => theme.buttonTransition};
    filter: brightness(110%);
  }
`

export const ModalHeaderMixin = css`
  h1,
  h2 {
    margin-bottom: 10px;
    text-align: center;
    color: ${({ theme }) => theme.headerTextColor};
    font: ${({ theme }) => theme.modalHeaderFont};
  }
  h3 {
    font: ${({ theme }) => theme.modalSubHeaderFont};
  }
  @media screen and (max-width: ${({ theme }) => theme.breakpointMobile}px) {
    h1,
    h2 {
      font: ${({ theme }) => theme.modalHeaderFontMobile};
    }
  }
`

export const ModalFieldMixin = css`
  input,
  textarea {
    width: 100%;
    height: 48px;
    padding-left: 10px;
    border: 1px solid ${({ theme }) => theme.softBorder};
    border-radius: 10px;
    font-size: 1.1rem;
    font-weight: 600;
    letter-spacing: 1px;
    &::placeholder {
      margin-left: 10px;
      font-size: 1rem;
    }
  }
`
export const ModalBtnMixin = css`
  button {
    padding: 15px 30px;
    width: min-content;
    white-space: nowrap;
    border: 0;
    background-color: ${({ theme }) => theme.buttonBackground};
    color: ${({ theme }) => theme.mainTextColor};
    margin-left: 15px;
    border-radius: 10px;
    transition: ${({ theme }) => theme.buttonTransition};
    font-weight: 600;
    cursor: pointer;
    font-family: Montserrat, sans-serif;
    &:hover {
      transition: ${({ theme }) => theme.buttonTransition};
      background-color: ${({ theme }) => theme.buttonBackgroundHover};
    }
    &:active {
      background-color: ${({ theme }) => theme.buttonBackgroundActive};
    }
  }
`
export const PlannedFeatureMixin = css`
  .feature {
    height: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .feature-icon {
      font-size: 8rem;
      color: ${({ theme }) => theme.secondaryBackgroundColorHover};
    }
  }
`

export const DropdownAnimationMixin = css`
  animation: dropdown 0.1s ease-out;
  @keyframes dropdown {
    0% {
      opacity: 0;
      transform: translateY(-20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

export const CardGradientMixin = css`
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

export const PageHeaderMixin = css`
  header {
    white-space: nowrap;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    hr {
      margin: 0 20px;
      background-color: ${({ theme }) => theme.buttonBackground};
      color: ${({ theme }) => theme.buttonBackground};
      width: 100%;
      height: 3px;
      border: 0;
      border-radius: 25px;
    }
    h1 {
      color: ${({ theme }) => theme.headerTextColor};
      font: ${({ theme }) => theme.pageHeaderFont};
    }
  }
  @media screen and (max-width: ${({ theme }) => theme.breakpointMobile}px) {
    header {
      white-space: normal;
      hr {
        display: none;
      }
      h1 {
        font: ${({ theme }) => theme.pageHeaderFontMobile};
      }
    }
  }
`

export const CardFontMixin = css`
  font: ${({ theme }) => theme.cardHeaderFont};
  color: ${({ theme }) => theme.headerTextColor};
`

export const RecipeCardGridMixin = css`
  display: grid;
  width: 100%;
  gap: 12px;
  grid-template-rows: repeat(1fr);
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  margin-bottom: 50px;
`
