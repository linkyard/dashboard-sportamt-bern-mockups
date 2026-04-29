import {faCircleInfo} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {TextField, Tooltip} from "@mui/material"
import {useEffect, useState} from "react"
import {EditButton} from "./edit-button"
import styles from "./page-title.module.scss"

function getPageTitleHeadingClassName(isSubTitle: boolean, usePlaceholderAppearance: boolean): string {
    if (isSubTitle) {
        return usePlaceholderAppearance
            ? `${styles.pageTitle} ${styles.subTitle} ${styles.placeholderTitle}`
            : `${styles.pageTitle} ${styles.subTitle}`
    }

    return usePlaceholderAppearance ? `${styles.pageTitle} ${styles.placeholderTitle}` : styles.pageTitle
}

interface PageTitleProps {
    title: string
    editable?: boolean
    onTitleChange?: (value: string) => void
    isSubTitle?: boolean
    hasInfoButton?: boolean
    /** Shown when `title` is empty (e.g. new entity); also used as the TextField hint while editing. */
    placeholder?: string
}

export const PageTitle = ({
    title,
    editable = false,
    onTitleChange,
    isSubTitle = false,
    hasInfoButton = false,
    placeholder,
}: PageTitleProps) => {
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
            <h2 className={getPageTitleHeadingClassName(isSubTitle, !value.trim() && !!placeholder)}>
                {value.trim() ? value : (placeholder ?? "")}
            </h2>
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
                    placeholder={placeholder}
                />
            ) : (
                titleContent(draftTitle)
            )}
            <EditButton onClick={() => setIsEditing((previous) => !previous)} />
        </div>
    )
}
