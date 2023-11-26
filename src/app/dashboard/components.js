import styles from './components.module.css'
import { useRouter } from 'next/navigation'

const ListViewer = ({ listsList = [], onCardClick }) => {
    return (
        <div className={styles.listsViewer}>
            <NewListCard />
            {listsList.map((list) => (
                <ListCard
                    key={list.id}
                    title={list.title}
                    desc={list.description}
                    list_id={list.list_id}
                    onCardClick={onCardClick}
                />
            ))}
        </div>
    )
}

const ListPreviewBlock = ({ details }) => {
    return (
        <div className={styles.previewContainer} data-details={JSON.stringify(details)}>
            <div className={styles.previewBlock} data-details={JSON.stringify(details)}>
                <div className={styles.previewBlockTitle} data-details={JSON.stringify(details)}></div>
                <div className={styles.previewBlockItemSection} data-details={JSON.stringify(details)}>
                    <div className={styles.previewBlockTitle} data-details={JSON.stringify(details)}></div>
                    <div className={styles.previewBlockTitle} data-details={JSON.stringify(details)}></div>
                    <div className={styles.previewBlockTitle} data-details={JSON.stringify(details)}></div>
                </div>
            </div>
        </div>
    )
}

const NewListCard = () => {
    const router = useRouter()

    return (
        <div className={styles.listCard} style={{ textAlign: 'center', height: '100%' }}
        onClick={() => router.push('../list/new')}>
            <div className={styles.previewContainer}>
                <div className={styles.plusLineContainer}>
                    <div className={`${styles.plusLine} ${styles.plusLineOne}`}></div>
                    <div className={`${styles.plusLine} ${styles.plusLineTwo}`}></div>
                </div>
            </div>
            <h3 style={{ margin: '0', padding: '16px' }}>New List</h3>
        </div>
    )
}

const ListCard = ({ title, desc, list_id, onCardClick }) => {
    let details = {
        title: title,
        desc: desc,
    }

    return (
        <div className={styles.listCard} data-details={details} onClick={onCardClick}>
            <ListPreviewBlock details={details} />
            <h3 data-details={JSON.stringify(details)}>{title}</h3>
            <p data-details={JSON.stringify(details)}>{desc}</p>
        </div>
    )
}

const LoadingContainer = () => {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.loadingCircle}></div>
            <p>Loading your lists...</p>
        </div>
    )
}

export { ListViewer, ListCard, ListPreviewBlock, LoadingContainer }