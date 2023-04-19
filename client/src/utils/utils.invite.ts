import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { serverErrorMessage } from '@/utils/utils.server.errors'
import { SnackbarType } from '@/types/@types.context'
import { api } from '@/api'

type Body = {
  cookbook_guid: string
  user_guid: string
  invite_guid: string
}

export const handleInviteLink = async (
  body: Body,
  setSnackbar: (config: SnackbarType) => void
) => {
  body['invite_guid'] = uuidv4()
  try {
    const res = await axios.post(`${api}/user/invites/create`, body)
    if (res.status === 201) {
      const link = `http://localhost:3000/api/auth/login/${res.data.guid}`
      navigator.clipboard.writeText(link)
      setSnackbar({
        msg: 'Invite link copied to clipboard',
        state: 'success',
        duration: 3000,
      })
    }
  } catch (e) {
    serverErrorMessage(e, setSnackbar)
  }
}
