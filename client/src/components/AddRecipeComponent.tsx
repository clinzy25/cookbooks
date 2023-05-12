import React, { ClipboardEvent, FC, RefObject, forwardRef } from 'react'
import styled from 'styled-components'
import Loader from './Loader'
import { AiFillCamera, AiOutlineEdit } from 'react-icons/ai'
import { RecipeSourceTypes } from '@/types/@types.recipes'
import { ModalBtnMixin, ModalFieldMixin, ModalHeaderMixin } from '@/styles/mixins'
import { BiLink } from 'react-icons/bi'

type Props = {
  ref: RefObject<HTMLInputElement>
  handlePaste: (e: ClipboardEvent) => void
  handleClick: () => void
  loading: boolean
  setSelection: (selection: RecipeSourceTypes) => void
}

const AddRecipeComponent = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { handlePaste, handleClick, loading, setSelection } = props
  return (
    <Style>
      <h2>Add Recipes</h2>
      <div className='tab-ctr'>
        <input defaultChecked id='tab1' type='radio' name='tab' />
        <input id='tab2' type='radio' name='tab' />
        <input id='tab3' type='radio' name='tab' />
        <nav>
          <ul>
            <li className='tab1'>
              <label htmlFor='tab1' onClick={() => setSelection('link')}>
                <div>
                  <BiLink className='tab-icon' />
                </div>
                Paste Link
              </label>
            </li>
            <li className='tab2' onClick={() => setSelection('camera')}>
              <label htmlFor='tab2'>
                <div>
                  <AiFillCamera className='tab-icon' />
                </div>
                From Camera
              </label>
            </li>
            <li className='tab3' onClick={() => setSelection('manual')}>
              <label htmlFor='tab3'>
                <div>
                  <AiOutlineEdit className='tab-icon' />
                </div>
                Enter Manually
              </label>
            </li>
          </ul>
        </nav>
        <section>
          <div className='tab1 paste-link'>
            <label htmlFor='paste-link'>
              Paste a link to a web page that contains a recipe and we&apos;ll extract the
              recipe and save it in your cookbook.
              <div className='input-ctr'>
                <input
                  autoFocus
                  onPaste={e => handlePaste(e)}
                  placeholder='Paste a link with a recipe...'
                  type='text'
                  ref={ref}
                  name='paste-link'
                />
                <button type='button' onClick={handleClick}>
                  {loading ? <Loader size={15} /> : 'Add'}
                </button>
              </div>
            </label>
          </div>
          <div className='tab2 camera'>
            <div>
              This feature is coming soon!!!
              <AiFillCamera className='icon' />
            </div>
          </div>
          <div className='tab3 manual'>
            <div>
              This feature is coming soon!!!
              <AiOutlineEdit className='icon' />
            </div>
          </div>
        </section>
      </div>
    </Style>
  )
})

AddRecipeComponent.displayName = 'AddRecipeComponent'

const Style = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.mainBackgroundColor};
  ${ModalHeaderMixin}
  .tab-ctr {
    flex-direction: column;
    display: flex;
    width: 75%;
    height: 100%;
    & > input,
    & section > div {
      display: none;
    }
    #tab1:checked ~ section .tab1,
    #tab2:checked ~ section .tab2,
    #tab3:checked ~ section .tab3 {
      display: block;
    }
    nav {
      ul {
        display: grid;
        grid-auto-columns: minmax(0, 1fr);
        grid-auto-flow: column;
        overflow: hidden;
        border-radius: 50px;
        border: 1px solid ${({ theme }) => theme.softBorder};
        list-style: none;
        li {
          label {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            padding: 15px 25px;
            background-color: ${({ theme }) => theme.buttonBackground};
            margin: 0;
            cursor: pointer;
            white-space: nowrap;
            transition: ${({ theme }) => theme.buttonTransition};
            &:hover {
              transition: ${({ theme }) => theme.buttonTransition};
              background-color: ${({ theme }) => theme.buttonBackgroundHover};
            }
            &:active {
              background-color: ${({ theme }) => theme.buttonBackgroundActive};
            }
            .tab-icon {
              display: flex;
              font-size: 1.5rem;
              margin-right: 10px;
            }
          }
          &:not(:last-child) label {
            border-right-width: 0;
          }
        }
      }
    }
    #tab1:checked ~ nav .tab1,
    #tab2:checked ~ nav .tab2,
    #tab3:checked ~ nav .tab3 {
      label {
        background: ${({ theme }) => theme.mainBackgroundColor};
        position: relative;
      }
    }
    section {
      height: 70%;
      display: flex;
      justify-content: center;
      align-items: center;
      & > * {
        width: 100%;
      }
      .paste-link {
        width: 100%;
        label {
          text-align: center;
          .input-ctr {
            display: flex;
            margin-top: 10px;
            ${ModalFieldMixin}
            ${ModalBtnMixin}
          }
        }
      }
      .camera,
      .manual {
        height: 100%;
        div {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .icon {
            font-size: 8rem;
            color: ${({ theme }) => theme.buttonBackground};
          }
        }
      }
    }
  }
  @media screen and (max-width: ${({ theme }) => theme.breakpointMobile}px) {
    h2 {
      font-size: 1.4rem;
    }
    .tab-ctr {
      width: 100%;
      nav {
        ul {
          li {
            label {
              font-size: 0.8rem;
              .tab-icon {
                font-size: 1.2rem;
                margin-right: 5px;
              }
            }
          }
        }
      }
    }
  }
`

export default AddRecipeComponent
