import styles from './index.module.scss'

type EditInputProps = {
  onClose: () => void
  type: '' | 'photo' | 'gender'
  onSubmit: (type: string, val: number) => void
}
const EditList = ({ onClose, type, onSubmit }: EditInputProps) => {
  return (
    <div className={styles.root}>
      {type === 'photo' && (
        <>
          <div className="list-item" onClick={() => onSubmit(type, 0)}>
            本地上传
          </div>
          <div className="list-item" onClick={() => onSubmit(type, 0)}>
            拍照
          </div>
        </>
      )}
      {type === 'gender' && (
        <>
          <div className="list-item" onClick={() => onSubmit(type, 0)}>
            男
          </div>
          <div className="list-item" onClick={() => onSubmit(type, 1)}>
            女
          </div>
        </>
      )}
      <div className="list-item" onClick={onClose}>
        取消
      </div>
    </div>
  )
}

export default EditList
