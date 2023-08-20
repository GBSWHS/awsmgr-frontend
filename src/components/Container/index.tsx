import style from './style.module.scss'
import { motion } from 'framer-motion'
import { type ReactNode, type FC } from 'react'

interface Props {
  children: ReactNode
}

const Container: FC<Props> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ bounce: 0 }}
      className={style.container}>
      {children}
    </motion.div>
  )
}

export default Container
