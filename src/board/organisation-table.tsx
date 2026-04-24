import {MaterialReactTable, type MRT_ColumnDef, useMaterialReactTable} from "material-react-table"
import {useMemo} from "react"
import {useTranslation} from "react-i18next"
import {useNavigate} from "react-router"
import {dummyOrganisations} from "../dashboard/dummyData"
import styles from "./board-detail.module.scss"
import type {Organisation} from "./organisation"

export interface OrganisationTableProps {
    selectedFileName: string
}

export const OrganisationTable: React.FC<OrganisationTableProps> = () => {
    const navigate = useNavigate()
    const {t} = useTranslation("dashboard")

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
            onClick: () => navigate(`/organisation-admin/${row.original.id}`),
            sx: {
                cursor: "pointer",
            },
        }),
        initialState: {showGlobalFilter: true},
        positionGlobalFilter: "right",
        muiTableHeadCellProps: {
            sx: {
                py: 0.75,
                "& .Mui-TableHeadCell-Content, & .MuiTableSortLabel-root, & .MuiTableSortLabel-root .MuiTableSortLabel-icon": {
                    letterSpacing: "0.09em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                },
            },
        },
        muiTableBodyCellProps: {
            sx: {
                py: 0.75,
            },
        },
        muiTableContainerProps: {
            sx: {
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
                {row.original.anlaesse.map((anlass) => {
                    const statusKey = anlass.status ?? "pending"
                    return (
                        <div key={anlass.id} className={styles.anlassRow}>
                            <div className={styles.anlassDetail}>
                                <span className={styles.anlassName}>{anlass.name}</span>
                                <span className={styles.anlassMeta}>{[anlass.period, anlass.location].filter(Boolean).join(" · ")}</span>
                                {(anlass.times?.length ?? 0) > 0 ? (
                                    <span className={styles.anlassMeta}>{anlass.times!.join(" · ")}</span>
                                ) : null}
                            </div>
                            <span className={styles.anlassStatus}>{t(`organisation-admin.anlaesse.status.${statusKey}`)}</span>
                        </div>
                    )
                })}
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
