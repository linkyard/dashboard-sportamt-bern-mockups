import {faFileExcel} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Alert, Container, Paper} from "@mui/material"
import {DatePicker} from "@mui/x-date-pickers/DatePicker"
import dayjs, {Dayjs} from "dayjs"
import {type ReactNode, useEffect, useRef, useState} from "react"
import {Trans, useTranslation} from "react-i18next"
import commonStyles from "../common.module.scss"
import {FieldLabel} from "../components/field-label"
import {DetailsTextarea, DetailsTextInput} from "../components/inputs"
import {PageTitle} from "../components/page-title"
import {OrganisationTable} from "./organisation-table"
import {UploadSection} from "./components/upload-section"
import styles from "./new-board.module.scss"

const AlertFileName = ({children}: {children?: ReactNode}) => (
    <span className={styles.alertFileName}>
        <FontAwesomeIcon icon={faFileExcel} size="xs" className={styles.alertFileIcon} />
        <strong>{children}</strong>
    </span>
)

export const NewBoard = () => {
    const {t} = useTranslation("dashboard")
    const [name, setName] = useState("")
    const [bemerkung, setBemerkung] = useState("")
    const [startDate, setStartDate] = useState<Dayjs | null>(null)
    const [endDate, setEndDate] = useState<Dayjs | null>(null)
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
                <PageTitle title={t("dashboard:new-board.title")} />

                <div className={styles.formSection}>
                    <div className={styles.detailsCard}>
                        <div className={styles.topRow}>
                            <div className={styles.fieldGroup}>
                                <FieldLabel htmlFor="new-board-name">{t("new-board.fields.name")}</FieldLabel>
                                <DetailsTextInput
                                    id="new-board-name"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    placeholder={t("new-board.fields.name-placeholder")}
                                />
                            </div>
                            <div className={styles.fieldGroup}>
                                <FieldLabel htmlFor="new-board-start-date">{t("new-board.fields.start-date")}</FieldLabel>
                                <DatePicker
                                    value={startDate}
                                    onChange={(date) => setStartDate(date ? dayjs(date) : null)}
                                    slotProps={{
                                        textField: {
                                            id: "new-board-start-date",
                                            className: styles.dateInput,
                                            size: "small",
                                            slotProps: {htmlInput: {placeholder: "mm/dd/yyyy"}},
                                        },
                                    }}
                                />
                            </div>
                            <div className={styles.fieldGroup}>
                                <FieldLabel htmlFor="new-board-end-date">{t("new-board.fields.end-date")}</FieldLabel>
                                <DatePicker
                                    value={endDate}
                                    onChange={(date) => setEndDate(date ? dayjs(date) : null)}
                                    slotProps={{
                                        textField: {
                                            id: "new-board-end-date",
                                            className: styles.dateInput,
                                            size: "small",
                                            slotProps: {htmlInput: {placeholder: "mm/dd/yyyy"}},
                                        },
                                    }}
                                />
                            </div>
                        </div>
                        <div className={`${styles.fieldGroup} ${styles.comment}`}>
                            <FieldLabel htmlFor="new-board-bemerkung">{t("new-board.fields.bemerkung")}</FieldLabel>
                            <DetailsTextarea
                                id="new-board-bemerkung"
                                value={bemerkung}
                                onChange={(event) => setBemerkung(event.target.value)}
                                placeholder={t("new-board.fields.bemerkung-placeholder")}
                            />
                        </div>
                    </div>
                </div>

                <PageTitle title={t("new-board.upload.title")} isSubTitle />
                {selectedFileName ? (
                    <>
                        {showUploadSuccessAlert ? (
                            <Alert severity="success" sx={{mt: 2}} onClose={() => setShowUploadSuccessAlert(false)}>
                                <Trans
                                    t={t}
                                    i18nKey="new-board.upload.success-created-from-file"
                                    values={{fileName: selectedFileName}}
                                    components={{
                                        file: <AlertFileName />,
                                    }}
                                />
                            </Alert>
                        ) : null}
                        <OrganisationTable selectedFileName={selectedFileName} />
                    </>
                ) : (
                    <UploadSection onFilesChange={handleFiles} onLoadTestData={handleLoadTestData} isUploadSuccess={isUploadSuccess} />
                )}
            </Paper>
        </Container>
    )
}
