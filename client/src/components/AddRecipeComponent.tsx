import React, { FC, useRef, useState } from 'react'
import styled from 'styled-components'
import Loader from './Loader'
import { AiFillCamera, AiOutlineEdit } from 'react-icons/ai'
import { RecipeSourceTypes } from '@/types/@types.recipes'
import {
  ModalBtnMixin,
  ModalFieldMixin,
  ModalHeaderMixin,
  PlannedFeatureMixin,
} from '@/styles/mixins'
import { BiLink } from 'react-icons/bi'

type Props = {
  loading: boolean
  handleSubmit: (url: string, selection: RecipeSourceTypes) => void
  sourceType: RecipeSourceTypes
}

const AddRecipeComponent: FC<Props> = ({ handleSubmit, loading, sourceType }) => {
  const [selection, setSelection] = useState<RecipeSourceTypes>(sourceType)
  const linkFieldRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    if (linkFieldRef.current) {
      handleSubmit(linkFieldRef.current?.value, selection)
      linkFieldRef.current.value = ''
    }
  }

  return (
    <Style>
      <h1>Add Recipe</h1>
      <div className='tab-ctr'>
        <input defaultChecked={selection === 'link'} id='tab1' type='radio' name='tab' />
        <input defaultChecked={selection === 'camera'} id='tab2' type='radio' name='tab' />
        <input defaultChecked={selection === 'manual'} id='tab3' type='radio' name='tab' />
        <nav>
          <ul>
            <li className='tab1'>
              <label className='nav-label' htmlFor='tab1' onClick={() => setSelection('link')}>
                <div>
                  <BiLink className='tab-icon' />
                </div>
                Paste Link
              </label>
            </li>
            <li className='tab2' onClick={() => setSelection('camera')}>
              <label className='nav-label' htmlFor='tab2'>
                <div>
                  <AiFillCamera className='tab-icon' />
                </div>
                Take Picture
              </label>
            </li>
            <li className='tab3' onClick={() => setSelection('manual')}>
              <label className='nav-label' htmlFor='tab3'>
                <div>
                  <AiOutlineEdit className='tab-icon' />
                </div>
                Create
              </label>
            </li>
          </ul>
        </nav>
        <section>
          <div className='tab1 paste-link'>
            <label htmlFor='paste-link'>
              <div className='input-ctr'>
                <input
                  onPaste={e => handleSubmit(e.clipboardData?.getData('Text'), selection)}
                  placeholder='Paste a link with a recipe...'
                  type='text'
                  ref={linkFieldRef}
                  name='paste-link'
                />
                <button type='button' onClick={handleClick}>
                  {loading ? <Loader size={15} /> : 'Add'}
                </button>
              </div>
              Paste a link to a web page that contains a recipe and we&apos;ll extract the
              recipe and save it in your cookbook.
            </label>
          </div>
          <div className='tab2 camera'>
            <div className='feature'>
              This feature is coming soon!!!
              <AiFillCamera className='feature-icon' />
            </div>
          </div>
          <div className='tab3 manual'>
            <div className='feature'>
              This feature is coming soon!!!
              <AiOutlineEdit className='feature-icon' />
            </div>
          </div>
        </section>
      </div>
    </Style>
  )
}

const Style = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 50%;
  background-color: ${({ theme }) => theme.mainBackgroundColor};
  ${ModalHeaderMixin}
  .tab-ctr {
    flex-direction: column;
    display: flex;
    justify-content: space-between;
    gap: 20px;
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
            background-color: ${({ theme }) => theme.navBackgroundColor};
            color: ${({ theme }) => theme.mainTextColor};
            margin: 0;
            cursor: pointer;
            white-space: nowrap;
            transition: ${({ theme }) => theme.buttonTransition};
            &:hover {
              transition: ${({ theme }) => theme.buttonTransition};
              background-color: ${({ theme }) => theme.navBackgroundColorHover};
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
        background: ${({ theme }) => theme.buttonBackground};
        position: relative;
      }
    }
    section {
      display: flex;
      align-items: flex-end;
      & > * {
        width: 100%;
      }
      .paste-link {
        width: 100%;
        label {
          height: 50px;
          .input-ctr {
            display: flex;
            margin: 10px 0 10px 0;
            ${ModalFieldMixin}
            ${ModalBtnMixin}
          }
        }
      }
      .camera,
      .manual {
        height: 100%;
        ${PlannedFeatureMixin}
      }
    }
  }
  @media screen and (max-width: ${({ theme }) => theme.breakpointMobile}px) {
    h2 {
      font-size: 1.4rem;
    }
    .tab-ctr {
      width: 100%;
      .nav-label {
        font-size: 0.7rem;
        .tab-icon {
          font-size: 1.2rem;
          margin-right: 5px;
        }
      }
      section {
        .paste-link {
          label {
            .input-ctr {
              flex-wrap: wrap;
              justify-content: center;
              button {
                margin: 20px 0 0 0;
              }
            }
          }
        }
      }
    }
  }
`

export default AddRecipeComponent
