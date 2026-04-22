import {faFileExcel} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Alert, Container, Paper, TextField} from "@mui/material"
import {DatePicker} from "@mui/x-date-pickers/DatePicker"
import dayjs, {Dayjs} from "dayjs"
import {MaterialReactTable, type MRT_ColumnDef, useMaterialReactTable} from "material-react-table"
import {type ReactNode, useEffect, useMemo, useRef, useState} from "react"
import {Trans, useTranslation} from "react-i18next"
import {useNavigate} from "react-router"
import commonStyles from "../common.module.scss"
import {FieldLabel} from "../components/field-label"
import {PageTitle} from "../components/page-title"
import {UploadSection} from "./components/upload-section"
import styles from "./new-board.module.scss"
import type {Organisation} from "./organisation"

const dummyOrganisations: Organisation[] = [
    {
        id: "tv-nord",
        organisation: "Turnverein Nord",
        contact: {
            organisationName: "Turnverein Nord",
            contactPerson: "Mara Keller",
            phone: "+41 31 555 10 11",
            email: "mara.keller@tvnord.ch",
            street: "Breitenrainstrasse 20, 3013 Bern",
            city: "",
        },
        anlaesse: [
            {name: "Jugendtraining Halle", date: "12.09.2026"},
            {name: "Vereinsturnen Herbst", date: "28.09.2026"},
        ],
    },
    {
        id: "fc-bern-ost",
        organisation: "FC Bern Ost",
        contact: {
            organisationName: "FC Bern Ost",
            contactPerson: "Jonas Wyss",
            phone: "+41 31 555 21 34",
            email: "jonas.wyss@fc-bern-ost.ch",
            street: "Murifeldweg 8, 3006 Bern",
            city: "",
        },
        billingContact: {
            organisationName: "FC Bern Ost",
            contactPerson: "Buchhaltung FC Bern Ost",
            phone: "+41 31 555 21 40",
            email: "rechnung@fc-bern-ost.ch",
            street: "Murifeldweg 10, 3006 Bern",
            city: "",
        },
        anlaesse: [
            {name: "Saisonstart Turnier", date: "03.10.2026"},
            {name: "Juniorencup", date: "10.10.2026"},
            {name: "Abendspiel", date: "17.10.2026"},
        ],
    },
    {
        id: "sc-mitte",
        organisation: "Schwimmclub Mitte",
        contact: {
            organisationName: "Schwimmclub Mitte",
            contactPerson: "Lea Gerber",
            phone: "+41 31 555 44 90",
            email: "lea.gerber@sc-mitte.ch",
            street: "Aareweg 2, 3011 Bern",
            city: "",
        },
        anlaesse: [{name: "Wintermeeting", date: "21.11.2026"}],
    },
]

interface OrganisationTableProps {
    selectedFileName: string
}

const AlertFileName = ({children}: {children?: ReactNode}) => (
    <span className={styles.alertFileName}>
        <FontAwesomeIcon icon={faFileExcel} size="xs" className={styles.alertFileIcon} />
        <strong>{children}</strong>
    </span>
)

const OrganisationTable: React.FC<OrganisationTableProps> = () => {
    const navigate = useNavigate()

    const organisationColumns = useMemo<MRT_ColumnDef<Organisation>[]>(
        () => [
            {
                accessorKey: "organisation",
                header: "Organisation",
            },
            {
                accessorFn: (row) => `${row.contact.contactPerson} ${row.contact.phone} ${row.contact.street} ${row.contact.city}`,
                id: "contact",
                header: "Contact",
                Cell: ({row}) => (
                    <div>
                        <div>{row.original.contact.contactPerson}</div>
                        <div>{row.original.contact.phone}</div>
                        <div>{`${row.original.contact.street}, ${row.original.contact.city}`}</div>
                    </div>
                ),
            },
            {
                accessorFn: (row) => row.anlaesse.length,
                id: "anlaesseCount",
                header: "# of Anlaesse",
            },
        ],
        []
    )

    const organisationsTable = useMaterialReactTable({
        columns: organisationColumns,
        data: dummyOrganisations,
        enableColumnActions: false,
        enableGlobalFilter: true,
        enableSorting: true,
        enableColumnFilters: false,
        enableDensityToggle: false,
        enableHiding: false,
        enableFullScreenToggle: false,
        enableExpanding: true,
        enableExpandAll: false,
        muiTableBodyRowProps: ({row}) => ({
            onClick: () =>
                navigate("/organisation-admin", {
                    state: {organisation: row.original},
                }),
            sx: {
                cursor: "pointer",
            },
        }),
        initialState: {showGlobalFilter: true},
        positionGlobalFilter: "right",
        muiTableHeadCellProps: {
            sx: {
                py: 0.75,
            },
        },
        muiTableBodyCellProps: {
            sx: {
                py: 0.75,
            },
        },
        muiTableContainerProps: {
            sx: {
                //Customer scroll behavior with header not scrolling
                overflow: "hidden",
                "& table": {
                    tableLayout: "fixed",
                    width: "100%",
                },
                "& thead": {
                    display: "table",
                    width: "100%",
                    tableLayout: "fixed",
                },
                "& tbody": {
                    display: "block",
                    maxHeight: {xs: "none", sm: "calc(100vh - 575px)"},
                    overflowY: {xs: "visible", sm: "auto"},
                },
                "& tbody tr": {
                    display: "table",
                    width: "100%",
                    tableLayout: "fixed",
                },
            },
        },
        renderDetailPanel: ({row}) => (
            <div className={styles.anlaesseList}>
                {row.original.anlaesse.map((anlass) => (
                    <div key={`${row.original.organisation}-${anlass.name}-${anlass.date}`} className={styles.anlassRow}>
                        <span>{anlass.name}</span>
                        <span>{anlass.date}</span>
                    </div>
                ))}
            </div>
        ),
    })
    return (
        <div className={styles.uploadSection}>
            <div className={styles.organisationsTableWrapper}>
                <MaterialReactTable table={organisationsTable} />
            </div>
        </div>
    )
}

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
                                <TextField
                                    id="new-board-name"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    className={styles.detailsInput}
                                    size="small"
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
                            <TextField
                                id="new-board-bemerkung"
                                value={bemerkung}
                                onChange={(event) => setBemerkung(event.target.value)}
                                multiline
                                rows={4}
                                className={`${styles.detailsInput} ${styles.commentInput}`}
                                placeholder={t("new-board.fields.bemerkung-placeholder")}
                            />
                        </div>
                    </div>
                </div>

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
