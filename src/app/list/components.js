import styles from './components.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'

const ListSectionDiv = ({title}) => {
    return (
        <div className={styles.sectionDiv}>
            <h2 className={styles.sectionTitle}>{title}</h2>
            <FontAwesomeIcon icon={faPencil} />
        </div>
    )
}

export { ListSectionDiv}