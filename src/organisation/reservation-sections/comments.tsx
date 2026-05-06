import {type ReactElement, useState} from "react"
import {useTranslation} from "react-i18next"
import {EditButton} from "../../components/edit-button"
import {PageTitle} from "../../components/page-title"
import styles from "../reservation.editor.module.scss"

export function CommentsSection(): ReactElement {
    const {t} = useTranslation("dashboard")
    const [isEditing, setIsEditing] = useState(false)
    const [comment, setComment] = useState("")

    return (
        <section className={styles.sectionCard}>
            <div className={styles.sectionHeadingRow}>
                <div className={styles.sectionHeadingTitle}>
                    <PageTitle title={t("organisation-public.reservation.comments-title")} isSubTitle />
                </div>
                <EditButton onClick={() => setIsEditing((prev) => !prev)} isActive={isEditing} />
            </div>
            <textarea
                className={styles.commentsBox}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                readOnly={!isEditing}
                aria-label={t("organisation-public.reservation.comments-title")}
            />
        </section>
    )
}
