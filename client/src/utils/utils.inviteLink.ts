import { SnackbarType } from '@/types/@types.context'
import { v4 as uuidv4 } from 'uuid'

export const generateInviteLink = () => `http://localhost:3000/api/auth/login/${uuidv4()}`

export const handleInviteLink = (setSnackbar: (config: SnackbarType) => void) => {
  const link = generateInviteLink()
  navigator.clipboard.writeText(link)
  setSnackbar({
    msg: 'Invite link copied to clipboard',
    state: 'success',
    duration: 3000,
  })
}
