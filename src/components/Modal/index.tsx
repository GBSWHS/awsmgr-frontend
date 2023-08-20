import { AnimatePresence, motion } from 'framer-motion'
import { type ReactNode, type FC } from 'react'
import style from './style.module.scss'

interface Props {
  display: boolean
  action: React.Dispatch<React.SetStateAction<boolean>>
  children: ReactNode
  title: string
}

const Modal: FC<Props> = ({ display, action, children, title }) => {
  return (
    <AnimatePresence mode="wait">
      {display && (
        <motion.div
          className={style.modal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          <div className={style.background} onClick={() => { action(false) }} />
          <div className={style.content}>
            <div className={style.title}>
              <h1>{title}</h1>
              <img
                onClick={() => { action(false) }}
                src="/assets/icon/close.svg" alt="Close" />
            </div>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal
