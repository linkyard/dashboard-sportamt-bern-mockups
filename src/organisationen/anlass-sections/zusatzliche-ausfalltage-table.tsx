import {faPenToSquare, faTrash} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Tooltip} from "@mui/material"
import {type MRT_ColumnDef, type MRT_TableOptions} from "material-react-table"
import {useMemo, useState, type ReactElement} from "react"
import {useTranslation} from "react-i18next"
import {PageTitle} from "../../components/page-title"
import {organisationPublicSeedAusfalltage, type AusfalltagRowData} from "../../dummyData"
import {SportamtMaterialReactTableBase} from "../../lib/material-react-table-base"
import mrt from "../../lib/material-react-table-styles.module.scss"
import organisationenTableStyles from "../../stammdaten/organisationen/orgs-table.module.scss"
import {formatDateSwissLongWeekday} from "../../util/date"
import styles from "../org-public-anlass-editor.module.scss"

function AusfalltageTableActions({onEdit, onDelete}: {onEdit: () => void; onDelete: () => void}) {
    const {t} = useTranslation(["dashboard", "common"])

    return (
        <Box className={organisationenTableStyles.rowActions}>
            <Tooltip title={t("common:actions.edit")}>
                <IconButton size="small" aria-label={t("common:actions.edit")} onClick={onEdit}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                </IconButton>
            </Tooltip>
            <Tooltip title={t("common:actions.delete")}>
                <IconButton size="small" aria-label={t("common:actions.delete")} onClick={onDelete}>
                    <FontAwesomeIcon icon={faTrash} />
                </IconButton>
            </Tooltip>
        </Box>
    )
}

export function ZusatzlicheAusfalltageTable(): ReactElement {
    const {t} = useTranslation(["dashboard", "common"])

    const [rows, setRows] = useState<AusfalltagRowData[]>(() => structuredClone(organisationPublicSeedAusfalltage))
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [editDraft, setEditDraft] = useState<AusfalltagRowData | null>(null)

    const columns = useMemo<MRT_ColumnDef<AusfalltagRowData>[]>(
        () => [
            {
                accessorKey: "grund",
                header: t("organisation-public.anlass.ausfalltage.columns.grund"),
                grow: true,
                size: 200,
                minSize: 140,
                muiTableHeadCellProps: {align: "left"},
                muiTableBodyCellProps: {align: "left"},
                Cell: ({renderedCellValue}) => <span className={organisationenTableStyles.ellipsis}>{renderedCellValue}</span>,
            },
            {
                accessorKey: "vonDate",
                header: t("organisation-public.anlass.ausfalltage.columns.von"),
                size: 220,
                grow: false,
                enableSorting: false,
                muiTableHeadCellProps: {align: "left"},
                muiTableBodyCellProps: {align: "left"},
                Cell: ({row}) => formatDateSwissLongWeekday(row.original.vonDate),
            },
            {
                accessorKey: "bisDate",
                header: t("organisation-public.anlass.ausfalltage.columns.bis"),
                size: 220,
                grow: false,
                enableSorting: false,
                muiTableHeadCellProps: {align: "left"},
                muiTableBodyCellProps: {align: "left"},
                Cell: ({row}) => formatDateSwissLongWeekday(row.original.bisDate),
            },
        ],
        [t]
    )

    const tableOptions = useMemo((): Partial<MRT_TableOptions<AusfalltagRowData>> => {
        return {
            getRowId: (row) => row.id,
            initialState: {density: "comfortable"},
            enableExpanding: false,
            enableSorting: false,
            enableStickyHeader: true,
            enableRowDragging: false,
            enableRowOrdering: false,
            positionToolbarAlertBanner: "none",
            positionGlobalFilter: "none",
            enableRowActions: true,
            positionActionsColumn: "last",
            displayColumnDefOptions: {
                "mrt-row-actions": {
                    size: 88,
                    maxSize: 88,
                    minSize: 88,
                    grow: false,
                    muiTableHeadCellProps: {
                        align: "right",
                        className: `${mrt.headCell} ${mrt.treeColumnPadding}`,
                        sx: {textAlign: "right"},
                    },
                    muiTableBodyCellProps: {
                        align: "right",
                        className: mrt.bodyCell,
                        sx: {verticalAlign: "middle"},
                    },
                },
            },
            muiTableContainerProps: {
                sx: {maxHeight: "min(70vh, 560px)"},
                "aria-label": t("organisation-public.anlass.ausfalltage.list-aria-label"),
            },
            muiTableBodyRowProps: {hover: true},
            renderRowActions: ({row}) => (
                <AusfalltageTableActions onEdit={() => setEditDraft({...row.original})} onDelete={() => setDeleteId(row.original.id)} />
            ),
        }
    }, [t])

    return (
        <>
            <section className={styles.sectionCard}>
                <div className={styles.sectionHeadingRow}>
                    <div className={`${styles.sectionHeading} ${styles.sectionHeadingTitle}`}>
                        <PageTitle title={t("organisation-public.anlass.ausfalltage.title")} isSubTitle toolTipContent={t("organisation-public.anlass.section-info-tooltip")} />
                    </div>
                    <Button variant="contained" color="primary" size="small" onClick={() => undefined}>
                        {t("organisation-public.anlass.ausfalltage.add-button")}
                    </Button>
                </div>
                <SportamtMaterialReactTableBase columns={columns} data={rows} options={tableOptions} disableSearch />
            </section>

            {editDraft ? (
                <Dialog open onClose={() => setEditDraft(null)} fullWidth maxWidth="sm">
                    <DialogTitle>{t("organisation-public.anlass.ausfalltage.edit-title")}</DialogTitle>
                    <DialogContent sx={{display: "flex", flexDirection: "column", gap: 2, pt: 1}}>
                        <TextField
                            label={t("organisation-public.anlass.ausfalltage.grund-label")}
                            value={editDraft.grund}
                            onChange={(e) => setEditDraft((d) => (d ? {...d, grund: e.target.value} : d))}
                            fullWidth
                            margin="dense"
                        />
                        <TextField
                            label={t("organisation-public.anlass.ausfalltage.von-label")}
                            type="date"
                            value={editDraft.vonDate}
                            onChange={(e) => setEditDraft((d) => (d ? {...d, vonDate: e.target.value} : d))}
                            fullWidth
                            margin="dense"
                            slotProps={{inputLabel: {shrink: true}}}
                        />
                        <TextField
                            label={t("organisation-public.anlass.ausfalltage.bis-label")}
                            type="date"
                            value={editDraft.bisDate}
                            onChange={(e) => setEditDraft((d) => (d ? {...d, bisDate: e.target.value} : d))}
                            fullWidth
                            margin="dense"
                            slotProps={{inputLabel: {shrink: true}}}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditDraft(null)}>{t("common:actions.cancel")}</Button>
                        <Button
                            variant="contained"
                            onClick={() => {
                                setRows((prev) => prev.map((r) => (r.id === editDraft.id ? editDraft : r)))
                                setEditDraft(null)
                            }}
                        >
                            {t("common:actions.save")}
                        </Button>
                    </DialogActions>
                </Dialog>
            ) : null}

            {deleteId ? (
                <Dialog open onClose={() => setDeleteId(null)}>
                    <DialogTitle>{t("organisation-public.anlass.ausfalltage.delete-title")}</DialogTitle>
                    <DialogContent>{t("organisation-public.anlass.ausfalltage.delete-body")}</DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteId(null)}>{t("common:actions.cancel")}</Button>
                        <Button
                            color="error"
                            variant="contained"
                            onClick={() => {
                                setRows((prev) => prev.filter((r) => r.id !== deleteId))
                                setDeleteId(null)
                            }}
                        >
                            {t("common:actions.delete")}
                        </Button>
                    </DialogActions>
                </Dialog>
            ) : null}
        </>
    )
}
