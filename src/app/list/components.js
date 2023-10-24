import styles from './components.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faPlus } from '@fortawesome/free-solid-svg-icons'

const ListSectionDiv = ({title}) => {
    return (
        <div className={styles.sectionDiv}>
            <h2 className={styles.sectionTitle}>{title}</h2>
            <FontAwesomeIcon icon={faPencil} />
        </div>
    )
}

const NewListSectionButton = () => {
    return (
        <div className={`${styles.sectionDiv} ${styles.newItemButton} ${styles.listItemDiv}`}>
            <h2 className={styles.sectionTitle}><FontAwesomeIcon icon={faPlus} /> New Section</h2>
        </div>
    )
}

export { ListSectionDiv, NewListSectionButton }