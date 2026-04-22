import {faCircleInfo} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {TextField, Tooltip} from "@mui/material"
import {useEffect, useState} from "react"
import {EditButton} from "./edit-button"
import styles from "./page-title.module.scss"

interface PageTitleProps {
    title: string
    editable?: boolean
    onTitleChange?: (value: string) => void
    isSubTitle?: boolean
    hasInfoButton?: boolean
}

export const PageTitle = ({title, editable = false, onTitleChange, isSubTitle = false, hasInfoButton = false}: PageTitleProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [draftTitle, setDraftTitle] = useState(title)

    useEffect(() => {
        setDraftTitle(title)
    }, [title])

    const handleTitleChange = (value: string) => {
        setDraftTitle(value)
        onTitleChange?.(value)
    }

    const titleContent = (value: string) => (
        <>
            <h2 className={isSubTitle ? `${styles.pageTitle} ${styles.subTitle}` : styles.pageTitle}>{value}</h2>
            {hasInfoButton ? (
                <Tooltip title="hier angezeigte Informationen">
                    <span>
                        <FontAwesomeIcon icon={faCircleInfo} className={styles.infoIcon} />
                    </span>
                </Tooltip>
            ) : null}
        </>
    )

    if (!editable) {
        return <div className={styles.titleRow}>{titleContent(title)}</div>
    }

    return (
        <div className={styles.titleRow}>
            {isEditing ? (
                <TextField
                    variant="standard"
                    size="small"
                    className={`${styles.titleInput} ${isSubTitle ? styles.subTitleInput : ""}`}
                    value={draftTitle}
                    onChange={(event) => handleTitleChange(event.target.value)}
                />
            ) : (
                titleContent(draftTitle)
            )}
            <EditButton onClick={() => setIsEditing((previous) => !previous)} />
        </div>
    )
}
