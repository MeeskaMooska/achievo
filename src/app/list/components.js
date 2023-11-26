import styles from './components.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faFloppyDisk, faPencil, faPlus, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons'

const ListOptionsContainer = ({ handleSaveClick, handleLoadClick }) => {
    return (
        <div className={styles.listOptionsContainer}>
            <button className={styles.listOptionsBlock} onClick={handleSaveClick}>
                <FontAwesomeIcon icon={faFloppyDisk} />
                <p>Save</p>
            </button>
            <button className={styles.listOptionsBlock} onClick={handleLoadClick}>
                <FontAwesomeIcon icon={faDownload} />
                <p>Load</p>
            </button>
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

const ListTitleBlock = ({ title = '', onChange }) => {
    const handleEditButtonPressed = (e) => {
        const inputParent = e.target.previousSibling
        inputParent.lastChild.focus()
    }

    return (
        <div className={`${styles.listTitleBlock} ${styles.listBlock}`}>
            <div>
                <h3>Title:</h3>
                <input type="text" defaultValue={title} onChange={onChange}></input>
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

const ListItemBlock = ({ value = '', onChange, onDeleteClick, onCompleteClick }) => {
    const handleEditButtonPressed = (e) => {
        e.target.previousSibling.focus()
    }

    return (
        <div className={`${styles.listItemBlock} ${styles.listBlock}`}>
            <div className={styles.completedToggleButton} onClick={onCompleteClick}></div>
            <input type="text" defaultValue={value} onChange={onChange}></input>
            <FontAwesomeIcon icon={faPencil} className={styles.editButton} onClick={handleEditButtonPressed} />
            <FontAwesomeIcon icon={faTrashCan} className={styles.editButton} onClick={onDeleteClick} />
        </div>
    )
}

const LoadListModal = ({ lists = [], closeModal, loadList }) => {
    return (
        <div className={styles.loadListModalBox} id="loadListModalBox" onClick={closeModal}>
            <div className={styles.loadListModal}>
                <div className={styles.loadListModalHeader}>
                    <h3>Load List</h3>
                    <FontAwesomeIcon icon={faXmark} className={styles.xmarkButton} id="loadListModalCloseButton" onClick={closeModal} />
                </div>
                <div className={styles.listsContainer}>
                {lists.map(list => {
                    return (
                        <div className={styles.loadListModalItem} data-listid={list.id} key={list.id} onClick={loadList}>
                            <p data-listid={list.id}>{list.title}</p>
                        </div>
                    )
                })}
                </div>
            </div>
        </div>
    )
}

export { ListOptionsContainer, ListContainer, ListTitleBlock, NewListItemBlock, ListItemBlock, LoadListModal }