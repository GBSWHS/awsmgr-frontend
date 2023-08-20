import { Alert } from '@cloudscape-design/components'
import { useEffect, type FC } from 'react'
import { toast } from 'react-hot-toast'
import { io } from 'socket.io-client'
import { useRefreshNotifier } from '../RefreshNotifier'

const SocketWatcher: FC = () => {
  const { refresh } = useRefreshNotifier()

  useEffect(() => {
    const socket = io(window.location.origin)

    socket.on('connect', () => {
      console.log('Socket connected.')
    })

    socket.on('message', (data) => {
      toast(() => (
        <Alert type={data.type.toLowerCase()}>
          {data.message}
        </Alert>
      ))

      refresh()
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return <></>
}

export default SocketWatcher
