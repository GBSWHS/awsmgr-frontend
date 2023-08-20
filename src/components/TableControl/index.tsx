import { useState, type FC } from 'react'
import CreateModal from '../CreateModal'
import { useSearchParams } from 'react-router-dom'
import style from './style.module.scss'
import { Button } from '@cloudscape-design/components'

interface Props {
  title: string
  max: number
  prices?: number
}

const TableControl: FC<Props> = ({ max, prices, title }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [createModalStatus, setCreateModal] = useState(false)

  const page = parseInt(searchParams.get('page') ?? '0')
  const isPrevDisabled = page < 1
  const isNextDisabled = page + 1 >= max

  const onPrevClick = (): void => {
    if (isPrevDisabled)
      return

    searchParams.set('page', (page - 1).toString())
    setSearchParams(searchParams)
  }

  const onNextClick = (): void => {
    if (isNextDisabled)
      return

    searchParams.set('page', (page + 1).toString())
    setSearchParams(searchParams)
  }

  return (
    <>
      <div className={style.tableControl}>
        <h1>{title}</h1>
        <p>총 <b>{prices ?? '...'}</b>$/월</p>

        <div className={style.pageBtns}>
          <button className={style.pageBtn} disabled={isPrevDisabled} onClick={onPrevClick}>
            <img src="/assets/icon/prev.svg" alt="Previous" />
          </button>

          <b>{page + 1}</b>

          <button className={style.pageBtn} disabled={isNextDisabled} onClick={onNextClick}>
            <img src="/assets/icon/next.svg" alt="Next" />
          </button>
        </div>

        <Button
          className="orangeButton"
          variant="primary"
          onClick={() => { setCreateModal(true) }}>
            인스턴스 생성
        </Button>
      </div>

      <CreateModal display={createModalStatus} action={setCreateModal} />
    </>
  )
}

export default TableControl
