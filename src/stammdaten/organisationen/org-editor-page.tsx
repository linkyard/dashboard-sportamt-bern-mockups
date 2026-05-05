import {faPenToSquare, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Snackbar, Tooltip} from "@mui/material"
import {type MRT_ColumnDef, type MRT_TableOptions} from "material-react-table"
import {useCallback, useMemo, useState} from "react"
import {useTranslation} from "react-i18next"
import {Navigate, useParams} from "react-router"
import {ContactDetails} from "../../board/components/contact-box"
import orgStyles from "../../board/organisation-admin.module.scss"
import {AppBreadcrumbs} from "../../components/breadcrumbs"
import {PageTitle} from "../../components/page-title"
import {stammdatenSeedOrganisationen} from "../../dummyData"
import {SportamtMaterialReactTableBase} from "../../lib/material-react-table-base"
import mrt from "../../lib/material-react-table-styles.module.scss"
import {TrainerDialog} from "./orgs-list-dialogs"
import tableStyles from "./orgs-table.module.scss"
import type {OrganisationRowData, TrainerRowData} from "./orgs-types"

type OrganisationEditorBodyProps = {
    initialOrg: OrganisationRowData
}

/** Session-only edits; `key={orgId}` on the parent remounts when the route id changes. */
function OrganisationEditorBody({initialOrg}: OrganisationEditorBodyProps) {
    const {t} = useTranslation(["dashboard", "common"])
    const [organisation, setOrganisationRow] = useState(initialOrg)
    const [snackbar, setSnackbar] = useState<string | null>(null)
    const [trainerDialog, setTrainerDialog] = useState<null | {mode: "create" | "edit"; trainer?: TrainerRowData}>(null)
    const [deleteTrainerId, setDeleteTrainerId] = useState<string | null>(null)

    const patchOrganisation = useCallback((recipe: (v: OrganisationRowData) => OrganisationRowData) => {
        setOrganisationRow((prev) => recipe(prev))
    }, [])

    const showError = useCallback((message: string) => setSnackbar(message), [])

    const trainerColumns = useMemo<MRT_ColumnDef<TrainerRowData>[]>(
        () => [
            {
                accessorKey: "firstName",
                header: t("dashboard:stammdaten.organisationen-table.columns.first-name"),
                grow: true,
                Cell: ({row}) => <span className={tableStyles.ellipsis}>{row.original.firstName}</span>,
            },
            {
                accessorKey: "lastName",
                header: t("dashboard:stammdaten.organisationen-table.columns.last-name"),
                grow: true,
                Cell: ({row}) => <span className={tableStyles.ellipsis}>{row.original.lastName}</span>,
            },
            {
                accessorKey: "phone",
                header: t("dashboard:stammdaten.organisationen-table.columns.phone"),
                grow: true,
                Cell: ({row}) => <span className={tableStyles.ellipsis}>{row.original.phone}</span>,
            },
            {
                accessorKey: "email",
                header: t("dashboard:stammdaten.organisationen-table.columns.email"),
                grow: true,
                Cell: ({row}) => <span className={tableStyles.ellipsis}>{row.original.email}</span>,
            },
        ],
        [t]
    )

    const trainerTableOptions = useMemo((): Partial<MRT_TableOptions<TrainerRowData>> => {
        return {
            getRowId: (row) => row.id,
            defaultColumn: {minSize: 80},
            initialState: {density: "comfortable"},
            enableSorting: false,
            enableGlobalFilter: false,
            enableStickyHeader: true,
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
                sx: {maxHeight: "min(50vh, 420px)"},
                "aria-label": t("dashboard:stammdaten.organisationen-editor.trainers-list-aria"),
            },
            muiTableBodyRowProps: {hover: true},
            renderRowActions: ({row}) => (
                <Box className={tableStyles.rowActions}>
                    <Tooltip title={t("dashboard:stammdaten.organisationen-table.edit")}>
                        <IconButton
                            size="small"
                            aria-label={t("dashboard:stammdaten.organisationen-table.edit")}
                            onClick={() => setTrainerDialog({mode: "edit", trainer: row.original})}
                        >
                            <FontAwesomeIcon icon={faPenToSquare} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t("dashboard:stammdaten.organisationen-table.delete")}>
                        <IconButton
                            size="small"
                            aria-label={t("dashboard:stammdaten.organisationen-table.delete")}
                            onClick={() => setDeleteTrainerId(row.original.id)}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        }
    }, [t])

    return (
        <div className={orgStyles.orgAdminPage}>
            <AppBreadcrumbs variant="organisation-editor" organisationName={organisation.name} />
            <div className={orgStyles.paperTop}>
                <PageTitle title={organisation.name} editable onTitleChange={(value) => patchOrganisation((v) => ({...v, name: value}))} />
                <div className={orgStyles.contactGrid}>
                    <ContactDetails title={t("dashboard:organisation-admin.contact-address-title")} contact={organisation.contact} />
                    <ContactDetails
                        title={t("dashboard:organisation-admin.billing-address-title")}
                        contact={organisation.billingContact}
                        billingAddressMode
                    />
                </div>
            </div>

            <div className={tableStyles.trainersSection}>
                <SportamtMaterialReactTableBase
                    disableSearch
                    toolbarStart={
                        <h2 className={tableStyles.trainersHeading}>{t("dashboard:stammdaten.organisationen-table.trainers-section")}</h2>
                    }
                    toolbarActionButtons={
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<FontAwesomeIcon icon={faPlus} />}
                            onClick={() => setTrainerDialog({mode: "create"})}
                        >
                            {t("dashboard:stammdaten.organisationen-table.add-trainer")}
                        </Button>
                    }
                    columns={trainerColumns}
                    data={organisation.subRows}
                    options={trainerTableOptions}
                />
            </div>

            {trainerDialog ? (
                <TrainerDialog
                    key={trainerDialog.mode === "edit" && trainerDialog.trainer ? trainerDialog.trainer.id : "new-trainer"}
                    open
                    mode={trainerDialog.mode}
                    trainer={trainerDialog.trainer}
                    onClose={() => setTrainerDialog(null)}
                    onSave={(tr) => {
                        if (trainerDialog.mode === "create") {
                            patchOrganisation((v) => ({...v, subRows: [...v.subRows, tr]}))
                        } else {
                            patchOrganisation((v) => ({...v, subRows: v.subRows.map((s) => (s.id === tr.id ? tr : s))}))
                        }
                        setTrainerDialog(null)
                    }}
                    onValidationError={showError}
                />
            ) : null}

            {deleteTrainerId ? (
                <Dialog open onClose={() => setDeleteTrainerId(null)}>
                    <DialogTitle>{t("dashboard:stammdaten.organisationen-table.delete-trainer-title")}</DialogTitle>
                    <DialogContent>{t("dashboard:stammdaten.organisationen-table.delete-trainer-body")}</DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteTrainerId(null)}>{t("dashboard:stammdaten.organisationen-table.cancel")}</Button>
                        <Button
                            color="error"
                            variant="contained"
                            onClick={() => {
                                patchOrganisation((v) => ({...v, subRows: v.subRows.filter((s) => s.id !== deleteTrainerId)}))
                                setDeleteTrainerId(null)
                            }}
                        >
                            {t("dashboard:stammdaten.organisationen-table.delete")}
                        </Button>
                    </DialogActions>
                </Dialog>
            ) : null}

            <Snackbar open={Boolean(snackbar)} autoHideDuration={5000} onClose={() => setSnackbar(null)} message={snackbar} />
        </div>
    )
}

export const OrganisationEditorPage: React.FC = () => {
    const {orgId} = useParams<{orgId: string}>()

    const initialOrg = useMemo((): OrganisationRowData | null => {
        if (!orgId) {
            return null
        }
        const raw = stammdatenSeedOrganisationen.find((v) => v.id === orgId)
        return raw ? structuredClone(raw) : null
    }, [orgId])

    if (!orgId || !initialOrg) {
        return <Navigate to="/admin/stammdaten/organisationen" replace />
    }

    return <OrganisationEditorBody key={orgId} initialOrg={initialOrg} />
}
