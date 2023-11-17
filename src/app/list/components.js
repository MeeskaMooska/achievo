import styles from './components.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faFloppyDisk, faPencil, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons'

const ListOptionsContainer = () => {
    return (
        <div className={styles.listOptionsContainer}>
            <div className={styles.listOptionsBlock}>
                <FontAwesomeIcon icon={faFloppyDisk} />
                <p>Save</p>
            </div>
            <div className={styles.listOptionsBlock}>
                <FontAwesomeIcon icon={faDownload} />
                <p>Load</p>
            </div>
        </div>
    )
}

const ListContainer = ({ children = null }) => {
    return (
        <div className={styles.listContainer}>
            {children}
        </div>
    )
}

const ListTitleBlock = ({ title = '' }) => {
    const handleEditButtonPressed = (e) => {
        const inputParent = e.target.previousSibling
        inputParent.lastChild.focus()
    }

    return (
        <div className={`${styles.listTitleBlock} ${styles.listBlock}`}>
            <div>
                <h3>Title:</h3>
                <input type="text" defaultValue={title}></input>
            </div>
            <FontAwesomeIcon icon={faPencil} className={styles.editButton} onClick={handleEditButtonPressed} />
        </div>
    )
}

const NewListItemBlock = ({ onClick }) => {
    return (
        <div className={`${styles.newListItemBlock} ${styles.listBlock}`} onClick={onClick}>
            <p>New item</p>
            <FontAwesomeIcon icon={faPlus} />
        </div>
    )
}

const ListItemBlock = ({ id, title = '', onChange, onDeleteClick, onCompleteClick }) => {
    const handleEditButtonPressed = (e) => {
        e.target.previousSibling.focus()
    }

    return (
        <div className={`${styles.listItemBlock} ${styles.listBlock}`}>
            <div className={styles.completedToggleButton} onClick={onCompleteClick}></div>
            <input type="text" defaultValue={title} onChange={onChange}></input>
            <FontAwesomeIcon icon={faPencil} className={styles.editButton} onClick={handleEditButtonPressed} />
            <FontAwesomeIcon icon={faTrashCan} className={styles.editButton} onClick={onDeleteClick} />
        </div>
    )
}

export { ListOptionsContainer, ListContainer, ListTitleBlock, NewListItemBlock, ListItemBlock }