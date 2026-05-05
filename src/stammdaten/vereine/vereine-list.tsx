import {faPenToSquare, faTrash} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Snackbar, Tooltip} from "@mui/material"
import {type MRT_ColumnDef, type MRT_TableOptions} from "material-react-table"
import {useCallback, useMemo, useState} from "react"
import {useTranslation} from "react-i18next"
import {useNavigate} from "react-router"
import {stammdatenSeedVereine} from "../../dummyData"
import {SportamtMaterialReactTableBase} from "../../lib/material-react-table-base"
import mrt from "../../lib/material-react-table-styles.module.scss"
import {CreateVereinDialog} from "./verein-list-dialogs"
import styles from "./vereine-table.module.scss"
import type {VereinRowData} from "./vereine-types"

function filterVereineForSearch(vereine: VereinRowData[], query: string): VereinRowData[] {
    const q = query.trim().toLowerCase()
    if (!q) {
        return vereine
    }
    return vereine.filter((v) => {
        if (v.name.toLowerCase().includes(q)) {
            return true
        }
        if (v.contact.contactPerson.toLowerCase().includes(q)) {
            return true
        }
        return v.subRows.some(
            (t) =>
                `${t.firstName} ${t.lastName}`.toLowerCase().includes(q) ||
                t.phone.toLowerCase().includes(q) ||
                t.email.toLowerCase().includes(q)
        )
    })
}

export const VereineTable: React.FC = () => {
    const {t} = useTranslation("dashboard")
    const navigate = useNavigate()
    const [vereine, setVereine] = useState<VereinRowData[]>(() => structuredClone(stammdatenSeedVereine))
    const [snackbar, setSnackbar] = useState<string | null>(null)
    const [vereinDialog, setVereinDialog] = useState<null | {mode: "create"}>(null)
    const [deleteVereinId, setDeleteVereinId] = useState<string | null>(null)
    const [createVereinDialogKey, setCreateVereinDialogKey] = useState(0)
    const [searchQuery, setSearchQuery] = useState("")

    const showError = useCallback((message: string) => setSnackbar(message), [])

    const tableData = useMemo(() => filterVereineForSearch(vereine, searchQuery), [vereine, searchQuery])

    const columns = useMemo<MRT_ColumnDef<VereinRowData>[]>(
        () => [
            {
                accessorKey: "name",
                header: t("stammdaten.vereine-table.columns.name"),
                grow: true,
                size: 200,
                minSize: 160,
                muiTableHeadCellProps: {align: "left"},
                muiTableBodyCellProps: {align: "left"},
                Cell: ({renderedCellValue}) => <span className={styles.ellipsis}>{renderedCellValue}</span>,
            },
            {
                id: "contactPerson",
                accessorFn: (row) => row.contact.contactPerson.trim(),
                header: t("stammdaten.vereine-table.columns.contact-person"),
                grow: true,
                size: 180,
                minSize: 140,
                muiTableHeadCellProps: {align: "left"},
                muiTableBodyCellProps: {align: "left"},
                Cell: ({renderedCellValue}) => <span className={styles.ellipsis}>{renderedCellValue}</span>,
            },
        ],
        [t]
    )

    const showNoSearchResults = vereine.length > 0 && tableData.length === 0 && Boolean(searchQuery.trim())

    const vereineTableOptions = useMemo((): Partial<MRT_TableOptions<VereinRowData>> => {
        return {
            getRowId: (row) => row.id,
            initialState: {
                density: "comfortable",
                showGlobalFilter: true,
            },
            enableExpanding: false,
            enableSorting: false,
            manualFiltering: true,
            enableStickyHeader: true,
            enableRowDragging: false,
            enableRowOrdering: false,
            positionToolbarAlertBanner: "none",
            positionGlobalFilter: "none",
            state: {globalFilter: searchQuery},
            onGlobalFilterChange: (updater) => {
                setSearchQuery((prev) => {
                    const resolved = typeof updater === "function" ? updater(prev) : updater
                    return resolved ?? ""
                })
            },
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
                "aria-label": t("stammdaten.vereine-table.list-aria-label"),
            },
            muiTableBodyRowProps: {
                hover: true,
            },
            renderRowActions: ({row}) => (
                <VereineTableActions
                    onEdit={() => navigate(`/admin/stammdaten/vereine/${row.original.id}/edit`)}
                    onDelete={() => setDeleteVereinId(row.original.id)}
                />
            ),
            ...(showNoSearchResults
                ? {
                      muiTablePaperProps: {elevation: 0, className: mrt.tablePaper, sx: {display: "none"}},
                  }
                : {}),
        }
    }, [searchQuery, showNoSearchResults, navigate, t])

    return (
        <>
            <SportamtMaterialReactTableBase
                columns={columns}
                data={tableData}
                options={vereineTableOptions}
                toolbarActionButtons={
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
                }
            />
            {showNoSearchResults ? <p className={styles.vereineSearchEmpty}>{t("common:no-search-results")}</p> : null}

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

            {deleteVereinId ? (
                <Dialog open onClose={() => setDeleteVereinId(null)}>
                    <DialogTitle>{t("stammdaten.vereine-table.delete-verein-title")}</DialogTitle>
                    <DialogContent>{t("stammdaten.vereine-table.delete-verein-body")}</DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteVereinId(null)}>{t("stammdaten.vereine-table.cancel")}</Button>
                        <Button
                            color="error"
                            variant="contained"
                            onClick={() => {
                                setVereine((prev) => prev.filter((v) => v.id !== deleteVereinId))
                                setDeleteVereinId(null)
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

interface VereineTableActionsProps {
    onEdit: () => void
    onDelete: () => void
}

function VereineTableActions({onEdit, onDelete}: VereineTableActionsProps) {
    const {t} = useTranslation("dashboard")

    return (
        <Box className={styles.rowActions}>
            <Tooltip title={t("stammdaten.vereine-table.edit")}>
                <IconButton size="small" aria-label={t("stammdaten.vereine-table.edit")} onClick={onEdit}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                </IconButton>
            </Tooltip>
            <Tooltip title={t("stammdaten.vereine-table.delete")}>
                <IconButton size="small" aria-label={t("stammdaten.vereine-table.delete")} onClick={onDelete}>
                    <FontAwesomeIcon icon={faTrash} />
                </IconButton>
            </Tooltip>
        </Box>
    )
}
