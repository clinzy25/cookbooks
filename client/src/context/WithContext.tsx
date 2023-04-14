import { UserProvider } from '@auth0/nextjs-auth0/client'
import { AppProvider } from './app.context'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function withContext(Component: any) {
  // eslint-disable-next-line react/display-name
  return (props: JSX.IntrinsicAttributes) => (
    <UserProvider>
      <AppProvider>
        <Component {...props} />
      </AppProvider>
    </UserProvider>
  )
}
