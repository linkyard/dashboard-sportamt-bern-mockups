import {faPen} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {IconButton} from "@mui/material"
import styles from "./edit-button.module.scss"

interface EditButtonProps {
    onClick: () => void
}

export const EditButton = ({onClick}: EditButtonProps) => {
    return (
        <IconButton className={styles.editButton} onClick={onClick} size="small">
            <FontAwesomeIcon icon={faPen} className={styles.editIcon} />
        </IconButton>
    )
}
