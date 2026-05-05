import {faCheck} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Alert, Button, Snackbar} from "@mui/material"
import {DatePicker} from "@mui/x-date-pickers/DatePicker"
import dayjs, {type Dayjs} from "dayjs"
import {useEffect, useRef, useState} from "react"
import {useTranslation} from "react-i18next"
import {Navigate, useParams} from "react-router"
import {AppBreadcrumbs} from "../components/breadcrumbs"
import {FieldLabel} from "../components/field-label"
import {DetailsTextarea} from "../components/inputs"
import {PageTitle} from "../components/page-title"
import {getBoardById, type Board} from "../dummyData"
import {parseIsoToDayjs} from "../util/date"
import styles from "./board-detail.module.scss"
import {UploadSection} from "../components/upload-section"
import {OrganisationTable} from "./organisation-table"

export const BoardDetail: React.FC = () => {
    const {boardId} = useParams<{boardId: string | undefined}>()
    const board = boardId ? getBoardById(boardId) : undefined

    if (boardId && !board) {
        return <Navigate to="/" replace />
    }

    return <BoardDetailContent key={board?.id ?? "new"} board={board} isNew={!boardId} />
}

interface BoardDetailContentProps {
    board?: Board
    isNew: boolean
}

const BoardDetailContent: React.FC<BoardDetailContentProps> = ({board, isNew}) => {
    const {t} = useTranslation(["dashboard", "common"])
    const [name, setName] = useState(() => board?.name ?? "")
    const [bemerkung, setBemerkung] = useState(() => board?.bemerkung ?? "")
    const [startDate, setStartDate] = useState<Dayjs | null>(() => (board ? parseIsoToDayjs(board.startDate) : null))
    const [endDate, setEndDate] = useState<Dayjs | null>(() => (board ? parseIsoToDayjs(board.endDate) : null))
    const [selectedFileName, setSelectedFileName] = useState<string | null>(() => (isNew || !board ? null : "test-organisations.xls"))
    const [showUploadSuccessAlert, setShowUploadSuccessAlert] = useState(false)
    const [isUploadSuccess, setIsUploadSuccess] = useState(false)
    const [newBoardSaved, setNewBoardSaved] = useState(false)
    const uploadAnimationTimeoutRef = useRef<number | null>(null)

    const uploadEnabled = !isNew || newBoardSaved
    const uploadLocked = isNew && !newBoardSaved && !selectedFileName

    const canSaveNewBoard = name.trim().length > 0 && startDate != null && endDate != null

    useEffect(() => {
        return () => {
            if (uploadAnimationTimeoutRef.current !== null) {
                window.clearTimeout(uploadAnimationTimeoutRef.current)
            }
        }
    }, [])

    const handleUploadSuccess = (fileName: string) => {
        if (uploadAnimationTimeoutRef.current !== null) {
            window.clearTimeout(uploadAnimationTimeoutRef.current)
        }

        setIsUploadSuccess(true)

        uploadAnimationTimeoutRef.current = window.setTimeout(() => {
            setSelectedFileName(fileName)
            setShowUploadSuccessAlert(true)
            setIsUploadSuccess(false)
            uploadAnimationTimeoutRef.current = null
        }, 850)
    }

    const handleFiles = (fileList: FileList | null) => {
        if (!uploadEnabled || !fileList?.length) return
        handleUploadSuccess(fileList[0].name)
    }

    const handleLoadTestData = () => {
        if (!uploadEnabled) return
        handleUploadSuccess("test-organisations.xls")
    }

    return (
        <>
            <div className={styles.boardHeaderRow}>
                <div className={styles.boardHeaderMain}>
                    <AppBreadcrumbs variant="board-detail" boardName={name} isNew={isNew} />
                    <PageTitle
                        title={name}
                        editable
                        onTitleChange={setName}
                        placeholder={isNew ? t("dashboard:board-detail.title") : undefined}
                    />
                </div>
            </div>

            <div className={styles.formSection}>
                <div className={styles.detailsCard}>
                    <div className={styles.dateRangeRow}>
                        <div className={styles.dateRangePickers}>
                            <div className={styles.fieldGroup}>
                                <FieldLabel htmlFor="board-detail-start-date">{t("board-detail.fields.start-date")}</FieldLabel>
                                <DatePicker
                                    value={startDate}
                                    onChange={(date) => setStartDate(date ? dayjs(date) : null)}
                                    slotProps={{
                                        textField: {
                                            id: "board-detail-start-date",
                                            className: styles.dateInput,
                                            size: "small",
                                            slotProps: {htmlInput: {placeholder: "mm/dd/yyyy"}},
                                        },
                                    }}
                                />
                            </div>
                            <div className={styles.fieldGroup}>
                                <FieldLabel htmlFor="board-detail-end-date">{t("board-detail.fields.end-date")}</FieldLabel>
                                <DatePicker
                                    value={endDate}
                                    onChange={(date) => setEndDate(date ? dayjs(date) : null)}
                                    slotProps={{
                                        textField: {
                                            id: "board-detail-end-date",
                                            className: styles.dateInput,
                                            size: "small",
                                            slotProps: {htmlInput: {placeholder: "mm/dd/yyyy"}},
                                        },
                                    }}
                                />
                            </div>
                        </div>
                        <div className={styles.dateRangePill}>
                            <div className={styles.boardDetailStatusPill} role="status" aria-label={t("dashboard:board-detail.status-erstellt")}>
                                <span>{t("dashboard:board-detail.status-erstellt")}</span>
                                <span className={styles.boardDetailStatusIconDisc} aria-hidden>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.fieldGroup} ${styles.comment}`}>
                        <FieldLabel htmlFor="board-detail-bemerkung">{t("board-detail.fields.bemerkung")}</FieldLabel>
                        <DetailsTextarea
                            id="board-detail-bemerkung"
                            value={bemerkung}
                            onChange={(event) => setBemerkung(event.target.value)}
                            placeholder={t("board-detail.fields.bemerkung-placeholder")}
                        />
                    </div>

                    {isNew ? (
                        <div className={styles.newBoardSaveRow}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                disabled={newBoardSaved || !canSaveNewBoard}
                                onClick={() => setNewBoardSaved(true)}
                            >
                                {t("common:actions.save")}
                            </Button>
                        </div>
                    ) : null}
                </div>
            </div>

            <PageTitle title={t("board-detail.upload.title")} isSubTitle />
            {uploadLocked ? <p className={styles.uploadLockHint}>{t("board-detail.save-to-enable-upload")}</p> : null}
            {selectedFileName ? (
                <OrganisationTable selectedFileName={selectedFileName} />
            ) : uploadLocked ? (
                <div className={styles.uploadLockWrap} inert>
                    <UploadSection onFilesChange={handleFiles} onLoadTestData={handleLoadTestData} isUploadSuccess={isUploadSuccess} />
                    <div className={styles.uploadLockOverlay} aria-hidden />
                </div>
            ) : (
                <UploadSection onFilesChange={handleFiles} onLoadTestData={handleLoadTestData} isUploadSuccess={isUploadSuccess} />
            )}

            <Snackbar
                open={showUploadSuccessAlert}
                autoHideDuration={8000}
                onClose={(_, reason) => {
                    if (reason === "clickaway") return
                    setShowUploadSuccessAlert(false)
                }}
                anchorOrigin={{vertical: "top", horizontal: "right"}}
            >
                <Alert severity="success" onClose={() => setShowUploadSuccessAlert(false)} sx={{width: "100%"}}>
                    {t("board-detail.upload.success-message")}
                </Alert>
            </Snackbar>
        </>
    )
}
