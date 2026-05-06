import {faCheck, faPaperPlane} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Button, Chip, Tooltip} from "@mui/material"
import {type MRT_ColumnDef} from "material-react-table"
import {useMemo} from "react"
import {useTranslation} from "react-i18next"
import {NavLink, useNavigate} from "react-router"
import {PageTitle} from "../components/page-title"
import {type Board, boardLabelDateRanges, type BoardStatus, dummyBoards} from "../dummyData"
import {SportamtMaterialReactTableBase} from "../lib/material-react-table-base"
import {formatDateSwiss} from "../util/date"
import styles from "./dashboard.module.scss"

const dashboardBoardStatusIcons = {
    erstellt: faCheck,
    versandBereit: faPaperPlane,
} as const

const DashboardBoardStatusPill = ({status}: {status: BoardStatus}) => {
    const {t} = useTranslation(["dashboard"])
    const label = t(`dashboard:dashboard.table.status.${status}`)
    const variantClass = status === "erstellt" ? styles.dashboardBoardStatusErstellt : styles.dashboardBoardStatusVersandBereit

    return (
        <div className={`${styles.dashboardBoardStatusPill} ${variantClass}`} role="status" aria-label={label}>
            <span>{label}</span>
            <span className={styles.dashboardBoardStatusIconDisc} aria-hidden>
                <FontAwesomeIcon icon={dashboardBoardStatusIcons[status]} />
            </span>
        </div>
    )
}

export const Dashboard = () => {
    const {t} = useTranslation(["common", "dashboard"])
    const navigate = useNavigate()

    const columns = useMemo<MRT_ColumnDef<Board>[]>(
        () => [
            {
                accessorKey: "name",
                header: t("dashboard:dashboard.table.columns.name"),
                size: 200,
                sortDescFirst: false,
            },
            {
                accessorKey: "bemerkung",
                header: t("dashboard:dashboard.table.columns.bemerkung"),
                size: 300,
                Cell: ({row}) => <span className={styles.ellipsisText}>{row.original.bemerkung}</span>,
            },
            {
                accessorKey: "startDate",
                header: t("dashboard:dashboard.table.columns.start-date"),
                size: 100,
                Cell: ({row}) => formatDateSwiss(row.original.startDate),
            },
            {
                accessorKey: "endDate",
                header: t("dashboard:dashboard.table.columns.end-date"),
                size: 100,
                Cell: ({row}) => formatDateSwiss(row.original.endDate),
            },
            {
                accessorKey: "status",
                header: t("dashboard:dashboard.table.columns.status"),
                size: 150,
                Cell: ({row}) => <DashboardBoardStatusPill status={row.original.status} />,
            },
            {
                id: "anlaesseBestaetigt",
                accessorFn: (row) => `${row.anlaesseConfirmed} / ${row.anlaesseTotal}`,
                header: t("dashboard:dashboard.table.columns.bestaetigt"),
                size: 120,
                Cell: ({row}) => {
                    const c = row.original.anlaesseConfirmed
                    const n = row.original.anlaesseTotal
                    const label = t("dashboard:dashboard.table.reservations-fraction", {confirmed: c, total: n})
                    const detail = t("dashboard:dashboard.table.reservations-fraction-detail", {confirmed: c, total: n})
                    return (
                        <Tooltip title={detail} arrow>
                            <span className={styles.bestaetigtFraction}>{label}</span>
                        </Tooltip>
                    )
                },
            },
            {
                accessorFn: (row) => row.labels.join(" "),
                id: "labels",
                header: t("dashboard:dashboard.table.columns.labels"),
                Cell: ({row}) => (
                    <div className={styles.labelsCell}>
                        {row.original.labels.map((label) => (
                            <Tooltip key={`${row.original.name}-${label}`} title={`${label} ${boardLabelDateRanges[label]}`} arrow>
                                <Chip label={label} size="small" />
                            </Tooltip>
                        ))}
                    </div>
                ),
            },
        ],
        [t]
    )

    return (
        <>
            <PageTitle title={t("dashboard:dashboard.title")} />

            <SportamtMaterialReactTableBase
                columns={columns}
                data={dummyBoards}
                options={{
                    initialState: {
                        density: "comfortable",
                        showGlobalFilter: true,
                        sorting: [
                            {id: "startDate", desc: true},
                            {id: "endDate", desc: true},
                            {id: "name", desc: false},
                        ],
                    },
                    enableColumnResizing: true,
                    muiTableBodyRowProps: ({row}) => ({
                        onClick: () => navigate(`/board/${row.original.id}`),
                        sx: {
                            cursor: "pointer",
                        },
                    }),
                    muiTableContainerProps: {
                        sx: {
                            maxHeight: {xs: "none", sm: "calc(100vh - 300px)"},
                            overflowX: "auto",
                            overflowY: {xs: "visible", sm: "auto"},
                        },
                    },
                }}
                toolbarActionButtons={
                    <Button component={NavLink} to="/board" variant="contained" size="small">
                        {t("dashboard:dashboard.table.create-new-board-button")}
                    </Button>
                }
            />
        </>
    )
}
