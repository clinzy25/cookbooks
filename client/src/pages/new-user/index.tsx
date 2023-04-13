import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import React from 'react'

const NewUserPage = () => {
  return <div>NewUserPage</div>
}

export default withPageAuthRequired(NewUserPage)
