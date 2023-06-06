import React, { FC, useState } from 'react'
import styled from 'styled-components'
import ReportBugModal from './components/ReportBugModal'
import Link from 'next/link'

const Footer: FC = () => {
  const [bugModal, setBugModal] = useState(false)

  return (
    <Style>
      {bugModal && <ReportBugModal closeModal={() => setBugModal(false)} />}
      <p>© Conner Linzy 2023</p>
      <span className='dot'>•</span>
      <a
        className='coffee-btn pointer'
        target='_blank'
        href='https://www.buymeacoffee.com/clinzy'>
        <img
          src='https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg'
          alt='Buy me a coffee'
        />
        <span>Buy me a coffee</span>
      </a>
      <span className='dot'>•</span>
      <p className='pointer' onClick={() => setBugModal(true)}>
        Report a Bug
      </p>
      <span className='dot'>•</span>
      <Link className='pointer' target='_blank' href='https://github.com/clinzy25/cookbooks'>
        Contribute
      </Link>
      <span className='dot'>•</span>
      <Link className='pointer' target='_blank' href='/privacy.html'>
        Privacy Policy
      </Link>
    </Style>
  )
}

const Style = styled.footer`
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  height: 80px;
  width: 100%;
  font-size: 0.9rem;
  box-shadow: ${({ theme }) => theme.boxShadowOverOtherElements};
  .pointer {
    cursor: pointer;
    text-decoration: underline;
    &:hover {
      color: ${({ theme }) => theme.secondaryTextColor};
    }
  }
  .coffee-btn {
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    color: ${({ theme }) => theme.textColor};
    background-color: ${({ theme }) => theme.backgroundColor};
    text-decoration: underline;
    img {
      height: 20px;
      box-shadow: none;
      border: none;
      vertical-align: middle;
    }
    span {
      margin-left: 5px;
      vertical-align: middle;
    }
  }
  @media screen and (max-width: ${({ theme }) => theme.breakpointMobile}px) {
    padding: 20px;
    height: min-content;
    align-items: flex-start;
    flex-direction: column;
    .dot {
      display: none;
    }
  }
`

export default Footer
