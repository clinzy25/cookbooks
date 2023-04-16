import { handleAuth, handleLogin } from '@auth0/nextjs-auth0'

export default handleAuth({
  async login(req: Request, res: Response) {
    await handleLogin(req, res, {
      returnTo: '/cookbooks',
    })
  },
})
