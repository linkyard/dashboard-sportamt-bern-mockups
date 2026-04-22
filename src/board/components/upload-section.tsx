import {faUpload} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Alert, Button} from "@mui/material"
import {useRef, useState} from "react"
import {useTranslation} from "react-i18next"
import styles from "./upload-section.module.scss"

interface UploadSectionProps {
    onFilesChange: (fileList: FileList | null) => void
    onLoadTestData: () => void
    isUploadSuccess: boolean
}

export const UploadSection = ({onFilesChange, onLoadTestData, isUploadSuccess}: UploadSectionProps) => {
    const {t} = useTranslation("dashboard")
    const [isDragging, setIsDragging] = useState(false)
    const [isDragInvalid, setIsDragInvalid] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileList = (fileList: FileList | null) => {
        if (!fileList?.length) return
        const file = fileList[0]
        if (!file.name.toLowerCase().endsWith(".xlsx")) {
            setUploadError("Unsupported file type. Please upload an Excel file (.xlsx).")
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
        return fileName.toLowerCase().endsWith(".xlsx")
    }

    return (
        <div className={styles.uploadSection}>
            <input ref={fileInputRef} type="file" accept=".xlsx" hidden onChange={(event) => handleFileList(event.target.files)} />
            <div
                className={`${styles.uploadDropzone} ${isDragging && !isDragInvalid ? styles.uploadDropzoneActive : ""} ${isDragInvalid ? styles.uploadDropzoneInvalid : ""} ${isUploadSuccess ? styles.uploadDropzoneSuccess : ""}`}
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
                    <FontAwesomeIcon icon={faUpload} size="lg" className={styles.uploadIcon} />
                    <p className={styles.uploadHint}>{t("dashboard:new-board.upload.helpertext")}</p>
                </div>
            </div>
            {uploadError ? (
                <Alert severity="error" sx={{mt: 1.5}} onClose={() => setUploadError(null)}>
                    {uploadError}
                </Alert>
            ) : null}
            <Button onClick={onLoadTestData} size="small" variant="text" sx={{mt: 1}}>
                Load test file
            </Button>
        </div>
    )
}
