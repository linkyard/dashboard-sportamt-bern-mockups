import {faPenToSquare, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import SearchIcon from "@mui/icons-material/Search"
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    Paper,
    Snackbar,
    Stack,
    TextField,
    Tooltip,
} from "@mui/material"
import {useCallback, useState} from "react"
import {useTranslation} from "react-i18next"
import {CreateVereinDialog, EditVereinDialog, TrainerDialog} from "./verein-list-dialogs"
import styles from "./vereine-list.module.scss"
import {type TrainerRowData, type VereinRowData} from "./vereine-types"

export interface VereineCardsListProps {
    initialVereine: VereinRowData[]
}

export const VereineCardsList = ({initialVereine}: VereineCardsListProps) => {
    const {t} = useTranslation("dashboard")
    const [vereine, setVereine] = useState<VereinRowData[]>(() => structuredClone(initialVereine))
    const [snackbar, setSnackbar] = useState<string | null>(null)

    const [vereinDialog, setVereinDialog] = useState<null | {mode: "create" | "edit"; verein?: VereinRowData}>(null)
    const [trainerDialog, setTrainerDialog] = useState<null | {mode: "create" | "edit"; vereinId: string; trainer?: TrainerRowData}>(null)
    const [deleteTarget, setDeleteTarget] = useState<null | {kind: "verein"; id: string} | {kind: "trainer"; id: string; vereinId: string}>(
        null
    )
    const [createVereinDialogKey, setCreateVereinDialogKey] = useState(0)

    const showError = useCallback((message: string) => setSnackbar(message), [])

    return (
        <>
            <div className={styles.tableToolbar}>
                <div className={styles.tableToolbarSearch}>
                    <TextField
                        size="small"
                        disabled
                        placeholder={t("common:actions.search")}
                        fullWidth
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" color="action" aria-hidden />
                                    </InputAdornment>
                                ),
                            },
                            htmlInput: {
                                "aria-label": t("common:actions.search"),
                                style: {
                                    paddingTop: "4px",
                                    paddingBottom: "4px",
                                },
                            },
                        }}
                    />
                </div>
                <div className={styles.toolbarActions}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => {
                            setCreateVereinDialogKey((k) => k + 1)
                            setVereinDialog({mode: "create"})
                        }}
                    >
                        {t("stammdaten.vereine-table.add-verein")}
                    </Button>
                </div>
            </div>

            <Stack
                component="section"
                spacing={1.5}
                className={styles.vereinList}
                aria-label={t("stammdaten.vereine-table.list-aria-label")}
            >
                {vereine.length === 0 ? <p className={styles.emptyState}>{t("stammdaten.vereine-table.empty-vereine")}</p> : null}
                {vereine.map((verein) => {
                    const trainers = verein.subRows
                    return (
                    <Paper key={verein.id} variant="outlined" elevation={0} className={styles.vereinPaper}>
                        <Accordion defaultExpanded disableGutters className={styles.vereinAccordion}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />} className={styles.accordionSummary}>
                                <Box className={styles.accordionSummaryInner}>
                                    <span className={styles.vereinTitle}>{verein.name}</span>
                                    <span className={styles.trainerCount}>
                                        {t("stammdaten.vereine-table.trainers-count-label", {count: trainers.length})}
                                    </span>
                                    <Box className={styles.headerActions} onClick={(e) => e.stopPropagation()}>
                                        <Tooltip title={t("stammdaten.vereine-table.add-trainer")}>
                                            <IconButton
                                                component="span"
                                                size="small"
                                                aria-label={t("stammdaten.vereine-table.add-trainer")}
                                                onClick={() => setTrainerDialog({mode: "create", vereinId: verein.id})}
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t("stammdaten.vereine-table.edit")}>
                                            <IconButton
                                                component="span"
                                                size="small"
                                                aria-label={t("stammdaten.vereine-table.edit")}
                                                onClick={() => {
                                                    const full = vereine.find((v) => v.id === verein.id) ?? verein
                                                    setVereinDialog({mode: "edit", verein: full})
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faPenToSquare} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t("stammdaten.vereine-table.delete")}>
                                            <IconButton
                                                component="span"
                                                size="small"
                                                aria-label={t("stammdaten.vereine-table.delete")}
                                                onClick={() => setDeleteTarget({kind: "verein", id: verein.id})}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails className={styles.accordionDetails}>
                                <p className={styles.trainersSectionLabel}>{t("stammdaten.vereine-table.trainers-section")}</p>
                                {trainers.length === 0 ? (
                                    <p className={styles.noTrainers}>{t("stammdaten.vereine-table.no-trainers")}</p>
                                ) : (
                                    <Stack spacing={1} className={styles.trainerStack}>
                                        {trainers.map((tr) => (
                                            <Paper key={tr.id} elevation={0} className={styles.trainerCard}>
                                                <Box className={styles.trainerCardMain}>
                                                    <p className={styles.trainerName}>
                                                        {tr.firstName} {tr.lastName}
                                                    </p>
                                                    <div className={styles.trainerContact}>
                                                        {tr.phone ? <p className={styles.trainerContactLine}>{tr.phone}</p> : null}
                                                        {tr.email ? (
                                                            <p className={`${styles.trainerContactLine} ${styles.trainerEmail}`}>
                                                                {tr.email}
                                                            </p>
                                                        ) : null}
                                                        {!tr.phone && !tr.email ? (
                                                            <p className={`${styles.trainerContactLine} ${styles.trainerNoContact}`}>
                                                                {t("stammdaten.vereine-table.trainer-no-contact")}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </Box>
                                                <Box className={styles.trainerCardActions}>
                                                    <Tooltip title={t("stammdaten.vereine-table.edit")}>
                                                        <IconButton
                                                            size="small"
                                                            aria-label={t("stammdaten.vereine-table.edit")}
                                                            onClick={() =>
                                                                setTrainerDialog({mode: "edit", vereinId: verein.id, trainer: tr})
                                                            }
                                                        >
                                                            <FontAwesomeIcon icon={faPenToSquare} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title={t("stammdaten.vereine-table.delete")}>
                                                        <IconButton
                                                            size="small"
                                                            aria-label={t("stammdaten.vereine-table.delete")}
                                                            onClick={() =>
                                                                setDeleteTarget({kind: "trainer", id: tr.id, vereinId: verein.id})
                                                            }
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </Paper>
                                        ))}
                                    </Stack>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    </Paper>
                    )
                })}
            </Stack>

            {vereinDialog?.mode === "create" ? (
                <CreateVereinDialog
                    key={createVereinDialogKey}
                    open
                    onClose={() => setVereinDialog(null)}
                    onSave={(v) => {
                        setVereine((prev) => [...prev, v])
                        setVereinDialog(null)
                    }}
                    onValidationError={showError}
                />
            ) : null}

            {vereinDialog?.mode === "edit" && vereinDialog.verein ? (
                <EditVereinDialog
                    key={vereinDialog.verein.id}
                    open
                    verein={vereinDialog.verein}
                    onClose={() => setVereinDialog(null)}
                    onSave={(updated) => {
                        setVereine((prev) => prev.map((v) => (v.id === updated.id ? updated : v)))
                        setVereinDialog(null)
                    }}
                    onValidationError={showError}
                />
            ) : null}

            {trainerDialog ? (
                <TrainerDialog
                    key={trainerDialog.mode === "edit" && trainerDialog.trainer ? trainerDialog.trainer.id : "new-trainer"}
                    open
                    mode={trainerDialog.mode}
                    trainer={trainerDialog.trainer}
                    onClose={() => setTrainerDialog(null)}
                    onSave={(tr) => {
                        if (trainerDialog.mode === "create") {
                            setVereine((prev) =>
                                prev.map((v) => (v.id === trainerDialog.vereinId ? {...v, subRows: [...v.subRows, tr]} : v))
                            )
                        } else {
                            setVereine((prev) =>
                                prev.map((v) =>
                                    v.id === trainerDialog.vereinId ? {...v, subRows: v.subRows.map((s) => (s.id === tr.id ? tr : s))} : v
                                )
                            )
                        }
                        setTrainerDialog(null)
                    }}
                    onValidationError={showError}
                />
            ) : null}

            {deleteTarget ? (
                <Dialog open onClose={() => setDeleteTarget(null)}>
                    <DialogTitle>
                        {deleteTarget.kind === "verein"
                            ? t("stammdaten.vereine-table.delete-verein-title")
                            : t("stammdaten.vereine-table.delete-trainer-title")}
                    </DialogTitle>
                    <DialogContent>
                        {deleteTarget.kind === "verein"
                            ? t("stammdaten.vereine-table.delete-verein-body")
                            : t("stammdaten.vereine-table.delete-trainer-body")}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteTarget(null)}>{t("stammdaten.vereine-table.cancel")}</Button>
                        <Button
                            color="error"
                            variant="contained"
                            onClick={() => {
                                if (deleteTarget.kind === "verein") {
                                    setVereine((prev) => prev.filter((v) => v.id !== deleteTarget.id))
                                } else {
                                    setVereine((prev) =>
                                        prev.map((v) =>
                                            v.id === deleteTarget.vereinId
                                                ? {...v, subRows: v.subRows.filter((s) => s.id !== deleteTarget.id)}
                                                : v
                                        )
                                    )
                                }
                                setDeleteTarget(null)
                            }}
                        >
                            {t("stammdaten.vereine-table.delete")}
                        </Button>
                    </DialogActions>
                </Dialog>
            ) : null}

            <Snackbar open={Boolean(snackbar)} autoHideDuration={5000} onClose={() => setSnackbar(null)} message={snackbar} />
        </>
    )
}
