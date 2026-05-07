import {faPenToSquare, faTrash} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Box, Button, IconButton, Snackbar, Tooltip} from "@mui/material"
import {type MRT_ColumnDef, type MRT_TableOptions} from "material-react-table"
import {useCallback, useMemo, useState} from "react"
import {useTranslation} from "react-i18next"
import {useNavigate} from "react-router"
import {ConfirmDeleteDialog} from "../../../components/confirm-delete-dialog"
import {stammdatenSeedOrganisationen} from "../../../dummyData"
import {MaterialReactTableBase} from "../../../lib/material-react-table-base"
import mrt from "../../../lib/material-react-table-styles.module.scss"
import type {OrganisationRowData} from "./organisation-types"
import {CreateOrgDialog} from "./organisation.list.dialogs"
import styles from "./organisation.table.module.scss"

function filterOrganisationenForSearch(organisationen: OrganisationRowData[], query: string): OrganisationRowData[] {
    const q = query.trim().toLowerCase()
    if (!q) {
        return organisationen
    }
    return organisationen.filter((v) => {
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

export const OrganisationenTable: React.FC = () => {
    const {t} = useTranslation("dashboard")
    const navigate = useNavigate()
    const [organisationen, setOrganisationen] = useState<OrganisationRowData[]>(() => structuredClone(stammdatenSeedOrganisationen))
    const [snackbar, setSnackbar] = useState<string | null>(null)
    const [orgDialog, setOrgDialog] = useState<null | {mode: "create"}>(null)
    const [deleteOrgId, setDeleteOrgId] = useState<string | null>(null)
    const [createOrgDialogKey, setCreateOrgDialogKey] = useState(0)
    const [searchQuery, setSearchQuery] = useState("")

    const showError = useCallback((message: string) => setSnackbar(message), [])

    const tableData = useMemo(() => filterOrganisationenForSearch(organisationen, searchQuery), [organisationen, searchQuery])

    const columns = useMemo<MRT_ColumnDef<OrganisationRowData>[]>(
        () => [
            {
                accessorKey: "name",
                header: t("master-data.organisations-table.columns.name"),
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
                header: t("master-data.organisations-table.columns.contact-person"),
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

    const showNoSearchResults = organisationen.length > 0 && tableData.length === 0 && Boolean(searchQuery.trim())

    const organisationenTableOptions = useMemo((): Partial<MRT_TableOptions<OrganisationRowData>> => {
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
                "aria-label": t("master-data.organisations-table.list-aria-label"),
            },
            muiTableBodyRowProps: {
                hover: true,
            },
            renderRowActions: ({row}) => (
                <OrganisationenTableActions
                    onEdit={() => navigate(`/admin/stammdaten/organisationen/${row.original.id}/edit`)}
                    onDelete={() => setDeleteOrgId(row.original.id)}
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
            <MaterialReactTableBase
                columns={columns}
                data={tableData}
                options={organisationenTableOptions}
                toolbarActionButtons={
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => {
                            setCreateOrgDialogKey((k) => k + 1)
                            setOrgDialog({mode: "create"})
                        }}
                    >
                        {t("master-data.organisations-table.add-organisation")}
                    </Button>
                }
            />
            {showNoSearchResults ? <p className={styles.organisationenSearchEmpty}>{t("common:no-search-results")}</p> : null}

            {orgDialog?.mode === "create" ? (
                <CreateOrgDialog
                    key={createOrgDialogKey}
                    open
                    onClose={() => setOrgDialog(null)}
                    onSave={(v) => {
                        setOrganisationen((prev) => [...prev, v])
                        setOrgDialog(null)
                    }}
                    onValidationError={showError}
                />
            ) : null}

            <ConfirmDeleteDialog
                open={Boolean(deleteOrgId)}
                onClose={() => setDeleteOrgId(null)}
                onConfirm={() => setDeleteOrgId(null)}
                title={t("master-data.organisations-table.delete-organisation-title")}
            >
                {t("master-data.organisations-table.delete-organisation-body")}
            </ConfirmDeleteDialog>

            <Snackbar open={Boolean(snackbar)} autoHideDuration={5000} onClose={() => setSnackbar(null)} message={snackbar} />
        </>
    )
}

interface OrganisationenTableActionsProps {
    onEdit: () => void
    onDelete: () => void
}

function OrganisationenTableActions({onEdit, onDelete}: OrganisationenTableActionsProps) {
    const {t} = useTranslation("dashboard")

    return (
        <Box className={styles.rowActions}>
            <Tooltip title={t("master-data.organisations-table.edit")}>
                <IconButton size="small" aria-label={t("master-data.organisations-table.edit")} onClick={onEdit}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                </IconButton>
            </Tooltip>
            <Tooltip title={t("master-data.organisations-table.delete")}>
                <IconButton size="small" aria-label={t("master-data.organisations-table.delete")} onClick={onDelete}>
                    <FontAwesomeIcon icon={faTrash} />
                </IconButton>
            </Tooltip>
        </Box>
    )
}
