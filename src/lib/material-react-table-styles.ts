import type {PaperProps} from "@mui/material"
import {alpha, type Theme} from "@mui/material/styles"
import type {MRT_Theme} from "material-react-table"

/** Brand accent — keep in sync with `src/variables.module.scss` `$sportamtGreen`. */
const SPORTAMT_GREEN = "#d7e054"
/** Rail opacity — lower = softer on grey table backgrounds. */
const NESTED_RAIL_COLOR = alpha(SPORTAMT_GREEN, 0.5)

export const mrtSharedMrtTheme: Partial<MRT_Theme> = {
    baseBackgroundColor: "#f8f8f8",
}

//Note: Needed separately for header and body cells to avoid visual inconsistency
export const mrtSharedHeaderPaddingX = "0.75rem" as const

export function mrtSharedTableHeadCellSx(theme: Theme) {
    const py = theme.spacing(0.75)
    const px = theme.spacing(2)
    return {
        backgroundColor: theme.palette.grey[100],
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        pt: py,
        pb: py,
        pl: px,
        pr: px,
        "& .Mui-TableHeadCell-Content": {
            letterSpacing: "0.09em",
            textTransform: "uppercase" as const,
            fontWeight: 700,
            fontSize: "0.8rem",
        },
        "& .MuiTableSortLabel-root, & .MuiTableSortLabel-root .MuiTableSortLabel-icon": {
            fontSize: "1rem",
        },
    }
}

export function mrtSharedTableBodyCellSx(theme: Theme) {
    return {
        borderBottom: `1px solid ${theme.palette.divider}`,
        py: 0.75,
        fontSize: "0.875rem",
    }
}

/** Nested tree rows: inset accent rail (option 2) — hierarchy cue without changing row fill. */
export function mrtNestedRowRailSx(_theme: Theme, depth: number) {
    if (depth > 0) {
        return {
            boxShadow: `inset 3px 0 0 ${NESTED_RAIL_COLOR}`,
        }
    }
    return {}
}

/** Detail-panel cell (full-width): same rail as nested rows. */
export function mrtDetailPanelRailSx(_theme: Theme) {
    return {
        boxShadow: `inset 3px 0 0 ${NESTED_RAIL_COLOR}`,
    }
}

export const mrtSharedTablePaperProps: PaperProps = {
    elevation: 0,
    sx: {
        backgroundColor: "#f8f8f8",
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        overflow: "hidden",
    },
}
