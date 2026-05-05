import {faCircleInfo} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {TextField, Tooltip} from "@mui/material"
import {useEffect, useState, type ReactNode} from "react"
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
    /**
     * When set, shows an info icon with this tooltip content.
     */
    toolTipContent?: ReactNode
    /** Shown when `title` is empty (e.g. new entity); also used as the TextField hint while editing. */
    placeholder?: string
}

export const PageTitle = ({title, editable = false, onTitleChange, isSubTitle = false, toolTipContent, placeholder}: PageTitleProps) => {
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
            {toolTipContent ? (
                <Tooltip title={toolTipContent} placement="top-start">
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
                    className={isSubTitle ? `${styles.subTitleInput} ${styles.titleInput}` : styles.titleInput}
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
