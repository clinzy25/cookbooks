import Modal from '@/components/Modal'
import React, { FC, useEffect } from 'react'
import styled from 'styled-components'
import { useForm, ValidationError } from '@formspree/react'
import { ModalBtnMixin, ModalFieldMixin, ModalHeaderMixin } from '@/styles/mixins'
import Loader from '@/components/Loader'
import useAppContext from '@/context/app.context'
import { IAppContext } from '@/types/@types.context'

type Props = {
  closeModal: () => void
}

const ReportBugModal: FC<Props> = ({ closeModal }) => {
  const { setSnackbar } = useAppContext() as IAppContext
  const [state, handleSubmit] = useForm('mrgvwyqp')

  useEffect(() => {
    if (state.succeeded) {
      setSnackbar({ state: 'success', msg: 'Thank You!' })
      setTimeout(() => {
        closeModal()
      }, 2000)
    }
  }, [state.succeeded])

  return (
    <Modal type='bug' closeModal={closeModal}>
      <Style>
        <h2>Report a Bug</h2>
        <p id='prompt'>
          Thanks for using Cookbooks! Let me know if you something doesn't work right, or if
          you'd like to recommend improvements or features. I'll take a look as soon as I can!
        </p>
        <form onSubmit={handleSubmit}>
          <input placeholder='Email' id='email' type='email' name='email' />
          <ValidationError prefix='Email' field='email' errors={state.errors} />
          <textarea rows={10} placeholder='Message' id='message' name='message' />
          <ValidationError prefix='Message' field='message' errors={state.errors} />
          <button type='submit' disabled={state.submitting}>
            {state.submitting ? <Loader size={14} /> : 'Submit'}
          </button>
        </form>
      </Style>
    </Modal>
  )
}

const Style = styled.div`
  ${ModalHeaderMixin}
  ${ModalFieldMixin}
  ${ModalBtnMixin}
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
    button {
      margin: 0 auto;
    }
    textarea {
      height: 100%;
      padding-top: 10px;
      &::placeholder {
        font-family: 'Nunito Sans', sans-serif;
      }
    }
  }
`

export default ReportBugModal
