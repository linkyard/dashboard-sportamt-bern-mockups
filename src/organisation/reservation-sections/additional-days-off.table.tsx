import {faPenToSquare, faTrash} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Tooltip} from "@mui/material"
import {type MRT_ColumnDef, type MRT_TableOptions} from "material-react-table"
import {useMemo, useState, type ReactElement} from "react"
import {useTranslation} from "react-i18next"
import organisationenTableStyles from "../../admin/master-data/organisation/organisation.table.module.scss"
import {ConfirmDeleteDialog} from "../../components/confirm-delete-dialog"
import {PageTitle} from "../../components/page-title"
import {organisationPublicSeedAusfalltage, type AusfalltagRowData} from "../../dummyData"
import {MaterialReactTableBase} from "../../lib/material-react-table-base"
import mrt from "../../lib/material-react-table-styles.module.scss"
import {formatDateSwiss} from "../../util/date"
import styles from "../reservation.editor.module.scss"

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

export function AdditionalDaysOffTable(): ReactElement {
    const {t} = useTranslation(["dashboard", "common"])

    const [rows, setRows] = useState<AusfalltagRowData[]>(() => structuredClone(organisationPublicSeedAusfalltage))
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [editDraft, setEditDraft] = useState<AusfalltagRowData | null>(null)

    const columns = useMemo<MRT_ColumnDef<AusfalltagRowData>[]>(
        () => [
            {
                accessorKey: "grund",
                header: t("organisation-public.reservation.additional-days-off.columns.grund"),
                grow: true,
                size: 200,
                minSize: 140,
                muiTableHeadCellProps: {align: "left"},
                muiTableBodyCellProps: {align: "left"},
                Cell: ({renderedCellValue}) => <span className={organisationenTableStyles.ellipsis}>{renderedCellValue}</span>,
            },
            {
                accessorKey: "vonDate",
                header: t("organisation-public.reservation.additional-days-off.columns.from"),
                size: 220,
                grow: false,
                enableSorting: false,
                muiTableHeadCellProps: {align: "left"},
                muiTableBodyCellProps: {align: "left"},
                Cell: ({row}) => formatDateSwiss(row.original.vonDate),
            },
            {
                accessorKey: "bisDate",
                header: t("organisation-public.reservation.additional-days-off.columns.to"),
                size: 220,
                grow: false,
                enableSorting: false,
                muiTableHeadCellProps: {align: "left"},
                muiTableBodyCellProps: {align: "left"},
                Cell: ({row}) => formatDateSwiss(row.original.bisDate),
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
                "aria-label": t("organisation-public.reservation.additional-days-off.list-aria-label"),
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
                        <PageTitle
                            title={t("organisation-public.reservation.additional-days-off.title")}
                            isSubTitle
                            toolTipContent={t("organisation-public.reservation.section-info-tooltip")}
                        />
                    </div>
                    <Button variant="contained" color="primary" size="small" onClick={() => undefined}>
                        {t("organisation-public.reservation.additional-days-off.add-button")}
                    </Button>
                </div>
                <MaterialReactTableBase columns={columns} data={rows} options={tableOptions} disableSearch />
            </section>

            {editDraft ? (
                <Dialog open onClose={() => setEditDraft(null)} fullWidth maxWidth="sm">
                    <DialogTitle>{t("organisation-public.reservation.additional-days-off.edit-title")}</DialogTitle>
                    <DialogContent sx={{display: "flex", flexDirection: "column", gap: 2, pt: 1}}>
                        <TextField
                            label={t("organisation-public.reservation.additional-days-off.reason-label")}
                            value={editDraft.grund}
                            onChange={(e) => setEditDraft((d) => (d ? {...d, grund: e.target.value} : d))}
                            fullWidth
                            margin="dense"
                        />
                        <TextField
                            label={t("organisation-public.reservation.additional-days-off.from-label")}
                            type="date"
                            value={editDraft.vonDate}
                            onChange={(e) => setEditDraft((d) => (d ? {...d, vonDate: e.target.value} : d))}
                            fullWidth
                            margin="dense"
                            slotProps={{inputLabel: {shrink: true}}}
                        />
                        <TextField
                            label={t("organisation-public.reservation.additional-days-off.to-label")}
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

            <ConfirmDeleteDialog
                open={Boolean(deleteId)}
                onClose={() => setDeleteId(null)}
                onConfirm={() => setDeleteId(null)}
                title={t("organisation-public.reservation.additional-days-off.delete-title")}
            >
                {t("organisation-public.reservation.additional-days-off.delete-body")}
            </ConfirmDeleteDialog>
        </>
    )
}
