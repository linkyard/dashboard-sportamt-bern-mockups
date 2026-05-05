import {type MRT_ColumnDef, type MRT_DensityState} from "material-react-table"
import {useMemo} from "react"
import {useTranslation} from "react-i18next"
import {useNavigate} from "react-router"
import {allDummyOrganisations} from "../dummyData"
import {SportamtMaterialReactTableBase} from "../lib/material-react-table-base"
import mrt from "../lib/material-react-table-styles.module.scss"
import styles from "./board-detail.module.scss"
import {AnlassInlineRow} from "./components/anlass-inline-row"
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
                header: t("board-detail.organisation-table.columns.organisation") as string,
                sortDescFirst: false,
                grow: false,
                size: 350,
                maxSize: 350,
                minSize: 350,
            },
            {
                accessorFn: (row) =>
                    `${row.contact.contactPerson} ${row.contact.phone} ${row.contact.street} ${row.contact.postalCode} ${row.contact.city}`,
                id: "contact",
                header: t("board-detail.organisation-table.columns.contact") as string,
                grow: false,
                Cell: ({row}) => {
                    const {contactPerson, phone, street, postalCode, city} = row.original.contact
                    const plzOrt = [postalCode, city].filter(Boolean).join(" ")
                    return (
                        <div>
                            <div>{contactPerson}</div>
                            <div>{phone}</div>
                            <div>{street}</div>
                            {plzOrt ? <div>{plzOrt}</div> : null}
                        </div>
                    )
                },
                size: 300,
                maxSize: 300,
                minSize: 300,
            },
            {
                accessorFn: (row) => row.anlaesse.length,
                id: "anlaesseCount",
                header: t("dashboard:board-detail.organisation-table.columns.anlaesse-count") as string,
                grow: true,
                minSize: 80,
                size: 120,
            },
        ],
        [t]
    )

    const organisationsTable = {
        defaultColumn: {
            grow: false,
            minSize: 0,
        },
        enableSorting: true,
        enableExpanding: true,
        enableExpandAll: false,
        muiDetailPanelProps: {
            className: mrt.detailPanelRail,
        },
        muiTableBodyRowProps: ({row, isDetailPanel = false}) => ({
            onClick: isDetailPanel ? undefined : () => navigate(`/organisation-admin/${row.original.id}`),
            hover: !isDetailPanel,
            sx: {
                ...(!isDetailPanel ? {cursor: "pointer"} : {}),
            },
        }),
        displayColumnDefOptions: {
            "mrt-row-expand": {
                grow: false,
                size: 50,
                maxSize: 50,
                minSize: 50,
                header: "",
                Header: () => "",
                muiTableHeadCellProps: {
                    className: `${mrt.headCell} ${mrt.treeColumnPadding}`,
                },
            },
        },
        initialState: {
            density: "comfortable" as MRT_DensityState,
            showGlobalFilter: true,
            sorting: [{id: "organisation", desc: false}],
        },
        muiTableContainerProps: {
            sx: {
                maxHeight: {xs: "none", sm: "calc(100vh - 575px)"},
                overflowX: "auto",
                overflowY: {xs: "visible", sm: "auto"},
            },
        },
        renderDetailPanel: ({row}) => (
            <div className={styles.anlaesseList}>
                {row.original.anlaesse.map((anlass) => (
                    <AnlassInlineRow key={anlass.id} anlass={anlass} organisationId={row.original.id} />
                ))}
            </div>
        ),
    }

    return (
        <>
            <SportamtMaterialReactTableBase columns={organisationColumns} data={allDummyOrganisations} options={organisationsTable} />
        </>
    )
}
