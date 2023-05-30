// @ts-nocheck
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { AppProvider } from './app.context'

export default function withContext(Component: any) {
  return (props: JSX.IntrinsicAttributes) => (
    <UserProvider>
      <AppProvider>
        <Component {...props} />
      </AppProvider>
    </UserProvider>
  )
}
