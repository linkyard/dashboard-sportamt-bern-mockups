import {Alert, Container, Paper, Snackbar} from "@mui/material"
import {DatePicker} from "@mui/x-date-pickers/DatePicker"
import dayjs, {type Dayjs} from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import {useEffect, useRef, useState} from "react"
import {useTranslation} from "react-i18next"
import commonStyles from "../common.module.scss"
import {FieldLabel} from "../components/field-label"
import {DetailsTextarea} from "../components/inputs"
import {PageTitle} from "../components/page-title"
import {type Board} from "../dashboard/dummyData"
import styles from "./board-detail.module.scss"
import {UploadSection} from "./components/upload-section"
import {OrganisationTable} from "./organisation-table"

dayjs.extend(customParseFormat)

function parseBoardDate(value: string): Dayjs | null {
    const parsed = dayjs(value, "DD.MM.YYYY", true)
    return parsed.isValid() ? parsed : null
}

interface BoardDetailProps {
    board?: Board
    isNew: boolean
}

export const BoardDetail: React.FC<BoardDetailProps> = ({board, isNew}) => {
    const {t} = useTranslation("dashboard")
    const [name, setName] = useState(() => board?.name ?? "")
    const [bemerkung, setBemerkung] = useState(() => board?.bemerkung ?? "")
    const [startDate, setStartDate] = useState<Dayjs | null>(() => (board ? parseBoardDate(board.startDate) : null))
    const [endDate, setEndDate] = useState<Dayjs | null>(() => (board ? parseBoardDate(board.endDate) : null))
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
    const [showUploadSuccessAlert, setShowUploadSuccessAlert] = useState(false)
    const [isUploadSuccess, setIsUploadSuccess] = useState(false)
    const uploadAnimationTimeoutRef = useRef<number | null>(null)

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
        if (!fileList?.length) return
        handleUploadSuccess(fileList[0].name)
    }

    const handleLoadTestData = () => {
        handleUploadSuccess("test-organisations.xlsx")
    }

    return (
        <Container maxWidth="xl" className={commonStyles.pageContainer}>
            <Paper className={commonStyles.pagePaper}>
                <PageTitle title={isNew ? t("dashboard:board-detail.title") : name} editable onTitleChange={setName} />

                <div className={styles.formSection}>
                    <div className={styles.detailsCard}>
                        <div className={styles.topRow}>
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

                        <div className={`${styles.fieldGroup} ${styles.comment}`}>
                            <FieldLabel htmlFor="board-detail-bemerkung">{t("board-detail.fields.bemerkung")}</FieldLabel>
                            <DetailsTextarea
                                id="board-detail-bemerkung"
                                value={bemerkung}
                                onChange={(event) => setBemerkung(event.target.value)}
                                placeholder={t("board-detail.fields.bemerkung-placeholder")}
                            />
                        </div>
                    </div>
                </div>

                <PageTitle title={t("board-detail.upload.title")} isSubTitle />
                {selectedFileName ? (
                    <OrganisationTable selectedFileName={selectedFileName} />
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
            </Paper>
        </Container>
    )
}
