import React, { FC, useState } from 'react'
import styled from 'styled-components'
import ReportBugModal from './components/ReportBugModal'
import Link from 'next/link'

const Footer: FC = () => {
  const [bugModal, setBugModal] = useState(false)

  return (
    <Style>
      <ReportBugModal modalOpen={bugModal} closeModal={() => setBugModal(false)} />
      <a className='link' target='_blank' href='https://connerlinzy.com/'>
        © Conner Linzy 2023
      </a>
      <span className='dot'>•</span>
      <a
        className='coffee-btn link'
        target='_blank'
        href='https://www.buymeacoffee.com/clinzy'>
        <img
          src='https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg'
          alt='Buy Me a Coffee'
        />
        <span>Buy Me a Coffee</span>
      </a>
      <span className='dot'>•</span>
      <p className='link' onClick={() => setBugModal(true)}>
        Report a Bug
      </p>
      <span className='dot'>•</span>
      <Link className='link' target='_blank' href='https://github.com/clinzy25/cookbooks'>
        Contribute
      </Link>
      <span className='dot'>•</span>
      <Link className='link' target='_blank' href='/privacy.html'>
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
  position: absolute;
  bottom: -85px;
  background-color: ${({ theme }) => theme.navBackgroundColor};
  color: ${({ theme }) => theme.mainTextColor};
  .link {
    cursor: pointer;
    text-decoration: underline;
    &:hover {
      color: ${({ theme }) => theme.buttonBackgroundHover};
    }
  }
  .coffee-btn {
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    color: ${({ theme }) => theme.mainTextColor};
    text-decoration: underline;
    img {
      background-color: ${({ theme }) => theme.mainBackgroundColor};
      border-radius: 50px;
      width: 30px;
      height: 30px;
      padding: 6px;
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
    bottom: -230px;
    .dot {
      display: none;
    }
  }
`

export default Footer
