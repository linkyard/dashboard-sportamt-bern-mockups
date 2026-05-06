import {faUpload} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Alert, Button} from "@mui/material"
import {useRef, useState} from "react"
import {useTranslation} from "react-i18next"

import styles from "./upload-section.module.scss"

interface UploadSectionProps {
    onFilesChange: (fileList: FileList | null) => void
    onLoadTestData?: () => void
    isUploadSuccess: boolean
    /** Omits default top margin when the block sits below a section heading inside a card. */
    flushTop?: boolean
    variant?: "excel" | "pdf"
}

export const UploadSection = ({onFilesChange, onLoadTestData, isUploadSuccess, flushTop, variant = "excel"}: UploadSectionProps) => {
    const {t} = useTranslation("dashboard")
    const [isDragging, setIsDragging] = useState(false)
    const [isDragInvalid, setIsDragInvalid] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const inputAccept = variant === "pdf" ? ".pdf,application/pdf" : ".xls"

    const fileNameAccepted = (name: string): boolean => {
        const lower = name.toLowerCase()
        return variant === "pdf" ? lower.endsWith(".pdf") : lower.endsWith(".xls")
    }

    const uploadTitleKey =
        variant === "pdf"
            ? ("organisation-public.reservation.participants-list-upload.upload-title" as const)
            : ("board-detail.upload.upload-title" as const)
    const uploadTextKey =
        variant === "pdf"
            ? ("organisation-public.reservation.participants-list-upload.upload-text" as const)
            : ("board-detail.upload.upload-text" as const)
    const fileMetaKey =
        variant === "pdf"
            ? ("organisation-public.reservation.participants-list-upload.file-meta" as const)
            : ("board-detail.upload.file-meta" as const)
    const errorFileTypeKey =
        variant === "pdf"
            ? ("organisation-public.reservation.participants-list-upload.error-file-type" as const)
            : ("board-detail.upload.error-file-type" as const)

    const handleFileList = (fileList: FileList | null) => {
        if (!fileList?.length) return
        const file = fileList[0]
        if (!fileNameAccepted(file.name)) {
            setUploadError(t(errorFileTypeKey))
            return
        }
        setUploadError(null)
        onFilesChange(fileList)
    }

    const isDraggedFileAccepted = (dataTransfer: DataTransfer): boolean | null => {
        const draggedItem = dataTransfer.items?.[0]
        if (!draggedItem || draggedItem.kind !== "file") return null
        const fileName = draggedItem.getAsFile()?.name
        if (!fileName) return null
        return fileNameAccepted(fileName)
    }

    let dropzoneClassName = styles.uploadDropzone
    if (isDragging && !isDragInvalid) {
        dropzoneClassName = `${styles.uploadDropzoneActive} ${dropzoneClassName}`
    }
    if (isDragInvalid) {
        dropzoneClassName = `${styles.uploadDropzoneInvalid} ${dropzoneClassName}`
    }
    if (isUploadSuccess) {
        dropzoneClassName = `${styles.uploadDropzoneSuccess} ${dropzoneClassName}`
    }

    return (
        <div className={flushTop ? `${styles.uploadSectionFlush} ${styles.uploadSection}` : styles.uploadSection}>
            <input ref={fileInputRef} type="file" accept={inputAccept} hidden onChange={(event) => handleFileList(event.target.files)} />
            <div
                className={dropzoneClassName}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => {
                    event.preventDefault()
                    setIsDragging(true)
                    const isAccepted = isDraggedFileAccepted(event.dataTransfer)
                    setIsDragInvalid(isAccepted === false)
                }}
                onDragLeave={() => {
                    setIsDragging(false)
                    setIsDragInvalid(false)
                }}
                onDrop={(event) => {
                    event.preventDefault()
                    setIsDragging(false)
                    setIsDragInvalid(false)
                    handleFileList(event.dataTransfer.files)
                }}
            >
                <div className={styles.emptyDropzone}>
                    <div className={styles.iconCircle}>
                        <FontAwesomeIcon icon={faUpload} size="lg" className={styles.uploadIcon} />
                    </div>
                    <p className={styles.uploadTitle}>{t(uploadTitleKey)}</p>
                    <p className={styles.uploadText}>
                        {t(uploadTextKey)}{" "}
                        <button
                            type="button"
                            className={styles.browseLink}
                            onClick={(event) => {
                                event.stopPropagation()
                                fileInputRef.current?.click()
                            }}
                        >
                            {t("board-detail.upload.browse-link")}
                        </button>
                    </p>
                    <p className={styles.uploadMeta}>{t(fileMetaKey)}</p>
                </div>
            </div>
            {uploadError ? (
                <Alert severity="error" sx={{mt: 1.5}} onClose={() => setUploadError(null)}>
                    {uploadError}
                </Alert>
            ) : null}
            {onLoadTestData ? (
                <Button onClick={onLoadTestData} size="small" variant="text" sx={{mt: 1}}>
                    Load test file
                </Button>
            ) : null}
        </div>
    )
}
