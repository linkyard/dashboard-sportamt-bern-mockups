import {faCheck, faPen} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {IconButton} from "@mui/material"
import {useTranslation} from "react-i18next"
import styles from "./edit-button.module.scss"

interface EditButtonProps {
    onClick: () => void
    isActive?: boolean
}

export const EditButton = ({onClick, isActive = false}: EditButtonProps) => {
    const {t} = useTranslation("common")
    return (
        <IconButton
            className={`${styles.editButton}${isActive ? ` ${styles.editButtonActive}` : ""}`}
            onClick={onClick}
            size="small"
            aria-label={t("common:edit")}
            aria-pressed={isActive}
        >
            <FontAwesomeIcon icon={isActive ? faCheck : faPen} className={styles.editIcon} aria-hidden />
        </IconButton>
    )
}
