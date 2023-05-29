export default function handler(req: { url: string }, res: { redirect: (arg0: any) => any }) {
  const backend =
    process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_DEV_API
      : process.env.NEXT_PUBLIC_PROD_API
      
  const path = req.url.replace('/api', '')

  return res.redirect(backend + path)
}
