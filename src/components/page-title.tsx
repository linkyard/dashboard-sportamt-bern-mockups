import {faCircleInfo} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {TextField, Tooltip} from "@mui/material"
import {useEffect, useState, type ReactNode} from "react"
import {useTranslation} from "react-i18next"
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
    const {t} = useTranslation("common")
    const [isEditing, setIsEditing] = useState(false)
    const [draftTitle, setDraftTitle] = useState(title)

    useEffect(() => {
        setDraftTitle(title)
    }, [title])

    const handleTitleChange = (value: string) => {
        setDraftTitle(value)
        onTitleChange?.(value)
    }

    const tooltipNode = toolTipContent ? (
        <Tooltip title={toolTipContent} placement="top-start">
            <span>
                <FontAwesomeIcon icon={faCircleInfo} className={styles.infoIcon} />
            </span>
        </Tooltip>
    ) : null

    const titleHeading = (value: string) => (
        <h2 className={getPageTitleHeadingClassName(isSubTitle, !value && !!placeholder)}>{value.trim() ? value : (placeholder ?? "")}</h2>
    )

    const titleGroupClass = `${styles.titleGroup} ${isSubTitle ? styles.titleGroupSub : styles.titleGroupMain}`

    const fieldClass = [
        styles.titleInput,
        isSubTitle ? styles.titleInputSub : styles.titleInputMain,
        isSubTitle ? styles.subTitleInput : "",
        styles.titleInputEditing,
    ]
        .filter(Boolean)
        .join(" ")

    if (!editable) {
        return (
            <div className={styles.titleRow}>
                <div className={titleGroupClass}>
                    {titleHeading(title)}
                    {tooltipNode}
                </div>
            </div>
        )
    }

    return (
        <div className={styles.titleRow}>
            <div className={titleGroupClass}>
                {isEditing ? (
                    <TextField
                        variant="standard"
                        className={fieldClass}
                        value={draftTitle}
                        onChange={(event) => handleTitleChange(event.target.value)}
                        placeholder={placeholder}
                        autoFocus
                        slotProps={{input: {disableUnderline: true}}}
                    />
                ) : (
                    titleHeading(draftTitle)
                )}
                {tooltipNode}
            </div>
            <Tooltip title={isEditing ? t("actions.finish-editing") : t("actions.edit")}>
                <span>
                    <EditButton isActive={isEditing} onClick={() => setIsEditing((previous) => !previous)} />
                </span>
            </Tooltip>
        </div>
    )
}
