import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import {Box, Checkbox, Collapse, IconButton, Paper} from "@mui/material"
import type {TFunction} from "i18next"
import {type Dispatch, type SetStateAction, useMemo} from "react"
import {SHOW_SPORT_ICONS} from "../../config/show-sport-icons"
import type {LocationRowData, ObjektRowData} from "../locations/locations-types"
import {
    aggregateLocationRowForObjects,
    aggregateLocationWeekForObjects,
    aggregateWeekChecks,
    formatDeShort,
    toggleLocationClosedCascade,
    toggleEntityActiveWeeks,
    toggleLocationWeekCascade,
    toggleObjectWeekClosure,
} from "./ferien-closure"
import type {HolidayClosureState} from "./ferien-types"
import styles from "./holiday-editor-page.module.scss"

type WeekMeta = {id: string; startDate: string; endDate: string}

/** Left “Ferienwochen” list + location / single “Geschlossen” column (existing layout). */
export function HolidayEditorClassicView({
    t,
    weekMetas,
    closure,
    visibleLocations,
    expandedLocIds,
    setExpandedLocIds,
    allWeeksIncluded,
    masterWeekIndeterminate,
    toggleAllWeeksIncluded,
    toggleOneWeek,
    weekColumnHeaderAgg,
    applyMutation,
    locations,
}: {
    t: TFunction
    weekMetas: WeekMeta[]
    closure: HolidayClosureState
    visibleLocations: LocationRowData[]
    expandedLocIds: Set<string>
    setExpandedLocIds: Dispatch<SetStateAction<Set<string>>>
    allWeeksIncluded: boolean
    masterWeekIndeterminate: boolean
    toggleAllWeeksIncluded: () => void
    toggleOneWeek: (weekId: string) => void
    weekColumnHeaderAgg: Record<string, {checked: boolean; indeterminate: boolean}>
    applyMutation: (recipe: (prev: HolidayClosureState) => HolidayClosureState) => void
    locations: LocationRowData[]
}) {
    return (
        <div className={styles.layout}>
            <Paper className={styles.weeksCard} elevation={0}>
                <div className={`${styles.weeksHeader} ${styles.weeksHeaderActive}`}>
                    <Checkbox
                        size="small"
                        className={styles.checkAccent}
                        checked={allWeeksIncluded}
                        indeterminate={masterWeekIndeterminate}
                        onChange={toggleAllWeeksIncluded}
                        slotProps={{input: {"aria-label": t("dashboard:stammdaten.ferien-editor.weeks-master-aria")}}}
                    />
                    <span>{t("dashboard:stammdaten.ferien-editor.weeks-master")}</span>
                </div>
                {weekMetas.map((w, i) => {
                    const weekHdr = weekColumnHeaderAgg[w.id] ?? {checked: false, indeterminate: false}
                    return (
                    <div key={w.id} className={styles.weekRow}>
                        <Checkbox
                            size="small"
                            className={styles.checkAccent}
                            checked={weekHdr.checked}
                            indeterminate={weekHdr.indeterminate}
                            onChange={() => toggleOneWeek(w.id)}
                            slotProps={{
                                input: {
                                    "aria-label": t("dashboard:stammdaten.ferien-editor.week-aria", {
                                        week: i + 1,
                                        range: `${formatDeShort(w.startDate)}–${formatDeShort(w.endDate)}`,
                                    }),
                                },
                            }}
                        />
                        <span>
                            {t("dashboard:stammdaten.ferien-editor.week-label", {
                                week: i + 1,
                                range: `${formatDeShort(w.startDate)}–${formatDeShort(w.endDate)}`,
                            })}
                        </span>
                    </div>
                    )
                })}
            </Paper>

            <Paper className={styles.mainCard} elevation={0}>
                <div className={styles.tableHeader}>
                    <div>{t("dashboard:stammdaten.ferien-editor.column-location")}</div>
                    <div className={styles.closedHead}>{t("dashboard:stammdaten.ferien-editor.column-closed")}</div>
                </div>
                {visibleLocations.map((loc) => {
                    const expanded = expandedLocIds.has(loc.id)
                    const locAgg = aggregateLocationRowForObjects(closure, loc)
                    return (
                        <Box key={loc.id}>
                            <div className={styles.locationRow}>
                                <div className={styles.locationNameCell}>
                                    <IconButton
                                        size="small"
                                        aria-expanded={expanded}
                                        aria-label={
                                            expanded
                                                ? t("dashboard:stammdaten.ferien-editor.collapse-aria", {name: loc.name})
                                                : t("dashboard:stammdaten.ferien-editor.expand-aria", {name: loc.name})
                                        }
                                        onClick={() =>
                                            setExpandedLocIds((prev) => {
                                                const next = new Set(prev)
                                                if (next.has(loc.id)) {
                                                    next.delete(loc.id)
                                                } else {
                                                    next.add(loc.id)
                                                }
                                                return next
                                            })
                                        }
                                    >
                                        <ExpandMoreIcon
                                            fontSize="small"
                                            sx={{transform: expanded ? "rotate(180deg)" : "none", transition: "0.2s"}}
                                        />
                                    </IconButton>
                                    <span className={styles.ellipsis}>{loc.name}</span>
                                </div>
                                <div className={styles.closedCell}>
                                    <Checkbox
                                        size="small"
                                        className={styles.checkAccent}
                                        checked={locAgg.checked}
                                        indeterminate={locAgg.indeterminate}
                                        onChange={() => applyMutation((c) => toggleLocationClosedCascade(c, locations, loc.id))}
                                        slotProps={{
                                            input: {
                                                "aria-label": t("dashboard:stammdaten.ferien-editor.location-closed-aria", {
                                                    name: loc.name,
                                                }),
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                            <Collapse in={expanded}>
                                {loc.subRows.map((obj: ObjektRowData) => {
                                    const objAgg = aggregateWeekChecks(closure.objectClosedByWeek[obj.id], closure)
                                    return (
                                        <div key={obj.id} className={styles.objektRow}>
                                            <div className={styles.objektNameCell}>
                                                <span className={styles.objektIconWrap}>
                                                    {SHOW_SPORT_ICONS && obj.sportIcon ? (
                                                        <FontAwesomeIcon icon={obj.sportIcon} className={styles.objektSportIcon} aria-hidden />
                                                    ) : null}
                                                </span>
                                                <span className={styles.ellipsis}>{obj.name}</span>
                                            </div>
                                            <div className={styles.closedCell}>
                                                <Checkbox
                                                    size="small"
                                                    className={styles.checkAccent}
                                                    checked={objAgg.checked}
                                                    indeterminate={objAgg.indeterminate}
                                                    onChange={() =>
                                                        applyMutation((c) => toggleEntityActiveWeeks(c, "objectClosedByWeek", obj.id))
                                                    }
                                                    slotProps={{
                                                        input: {
                                                            "aria-label": t("dashboard:stammdaten.ferien-editor.objekt-closed-aria", {
                                                                name: obj.name,
                                                            }),
                                                        },
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </Collapse>
                        </Box>
                    )
                })}
            </Paper>
        </div>
    )
}

/** Standort × Ferien week matrix (weeks as column headers — presentation alternative). */
export function HolidayEditorWeekColumnGrid({
    t,
    weekMetas,
    closure,
    visibleLocations,
    expandedLocIds,
    setExpandedLocIds,
    allWeeksIncluded,
    masterWeekIndeterminate,
    toggleAllWeeksIncluded,
    toggleOneWeek,
    weekColumnHeaderAgg,
    applyMutation,
    locations,
}: {
    t: TFunction
    weekMetas: WeekMeta[]
    closure: HolidayClosureState
    visibleLocations: LocationRowData[]
    expandedLocIds: Set<string>
    setExpandedLocIds: Dispatch<SetStateAction<Set<string>>>
    allWeeksIncluded: boolean
    masterWeekIndeterminate: boolean
    toggleAllWeeksIncluded: () => void
    toggleOneWeek: (weekId: string) => void
    weekColumnHeaderAgg: Record<string, {checked: boolean; indeterminate: boolean}>
    applyMutation: (recipe: (prev: HolidayClosureState) => HolidayClosureState) => void
    locations: LocationRowData[]
}) {
    /** Explicit grid columns so week headers don’t collapse (HTML tables were sizing to a single label column). */
    const gridTemplateColumns = useMemo(() => {
        if (weekMetas.length === 0) {
            return "minmax(220px, 1.4fr)"
        }
        return `minmax(220px, 1.4fr) ${weekMetas.map(() => "minmax(96px, 1fr)").join(" ")}`
    }, [weekMetas])

    const gridStyle = useMemo(() => ({gridTemplateColumns}), [gridTemplateColumns])

    return (
        <Paper className={styles.weekColumnsCard} elevation={0}>
            <div className={styles.weekGridScroll}>
                <div className={styles.weekMatrix} role="table" aria-label={t("dashboard:stammdaten.ferien-editor.column-location-only")}>
                    <div className={`${styles.weekMatrixRow} ${styles.weekMatrixHeaderRow}`} style={gridStyle} role="row">
                        <div className={styles.weekMatrixFirstCell} role="columnheader">
                            <div className={styles.weekGridLocationHead}>
                                <span className={styles.weekGridLocationHeadTitle}>
                                    {t("dashboard:stammdaten.ferien-editor.column-location-only")}
                                </span>
                                <span className={styles.weekGridMasterHint}>
                                    <Checkbox
                                        size="small"
                                        className={styles.checkAccent}
                                        checked={allWeeksIncluded}
                                        indeterminate={masterWeekIndeterminate}
                                        onChange={toggleAllWeeksIncluded}
                                        slotProps={{input: {"aria-label": t("dashboard:stammdaten.ferien-editor.weeks-master-aria")}}}
                                    />
                                    <span>{t("dashboard:stammdaten.ferien-editor.weeks-short-label")}</span>
                                </span>
                            </div>
                        </div>
                        {weekMetas.map((w, wi) => {
                            const inactive = closure.weekIncluded[w.id] === false
                            const weekHdr = weekColumnHeaderAgg[w.id] ?? {checked: false, indeterminate: false}
                            return (
                                <div
                                    key={w.id}
                                    className={`${styles.weekMatrixWeekHead} ${inactive ? styles.weekGridMuted : ""}`}
                                    role="columnheader"
                                >
                                    <div className={styles.weekGridWeekHeadInner}>
                                        <Checkbox
                                            size="small"
                                            className={styles.checkAccent}
                                            checked={weekHdr.checked}
                                            indeterminate={weekHdr.indeterminate}
                                            onChange={() => toggleOneWeek(w.id)}
                                            slotProps={{
                                                input: {
                                                    "aria-label": t("dashboard:stammdaten.ferien-editor.week-aria", {
                                                        week: wi + 1,
                                                        range: `${formatDeShort(w.startDate)}–${formatDeShort(w.endDate)}`,
                                                    }),
                                                },
                                            }}
                                        />
                                        <div className={styles.weekGridWeekTitle}>
                                            <span>{t("dashboard:stammdaten.ferien-editor.column-week-n", {week: wi + 1})}</span>
                                            <span className={styles.weekGridWeekSub}>
                                                {`${formatDeShort(w.startDate)}–${formatDeShort(w.endDate)}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {visibleLocations.flatMap((loc) => {
                        const expanded = expandedLocIds.has(loc.id)
                        const locRow = (
                            <div key={`${loc.id}-standort`} className={`${styles.weekMatrixRow} ${styles.weekMatrixLocRow}`} style={gridStyle} role="row">
                                <div className={styles.weekMatrixFirstCell} role="rowheader">
                                    <div className={styles.weekGridLocName}>
                                        <IconButton
                                            size="small"
                                            aria-expanded={expanded}
                                            aria-label={
                                                expanded
                                                    ? t("dashboard:stammdaten.ferien-editor.collapse-aria", {name: loc.name})
                                                    : t("dashboard:stammdaten.ferien-editor.expand-aria", {name: loc.name})
                                            }
                                            onClick={() =>
                                                setExpandedLocIds((prev) => {
                                                    const next = new Set(prev)
                                                    if (next.has(loc.id)) {
                                                        next.delete(loc.id)
                                                    } else {
                                                        next.add(loc.id)
                                                    }
                                                    return next
                                                })
                                            }
                                        >
                                            <ExpandMoreIcon
                                                fontSize="small"
                                                sx={{transform: expanded ? "rotate(180deg)" : "none", transition: "0.2s"}}
                                            />
                                        </IconButton>
                                        <span className={styles.ellipsis}>{loc.name}</span>
                                    </div>
                                </div>
                                {weekMetas.map((w) => {
                                    const inactive = closure.weekIncluded[w.id] === false
                                    const locWeekAgg = aggregateLocationWeekForObjects(closure, loc, w.id)
                                    return (
                                        <div
                                            key={w.id}
                                            className={`${styles.weekMatrixWeekCell} ${inactive ? styles.weekGridMutedTd : ""}`}
                                            role="cell"
                                        >
                                            <Checkbox
                                                size="small"
                                                className={styles.checkAccent}
                                                checked={!inactive && locWeekAgg.checked}
                                                indeterminate={!inactive && locWeekAgg.indeterminate}
                                                disabled={inactive}
                                                onChange={() =>
                                                    applyMutation((c) => toggleLocationWeekCascade(c, locations, loc.id, w.id))
                                                }
                                                slotProps={{
                                                    input: {
                                                        "aria-label": t("dashboard:stammdaten.ferien-editor.cell-location-week-aria", {
                                                            location: loc.name,
                                                            range: `${formatDeShort(w.startDate)}–${formatDeShort(w.endDate)}`,
                                                        }),
                                                    },
                                                }}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                        )

                        const objRows =
                            expanded ?
                                loc.subRows.map((obj: ObjektRowData) => (
                                    <div
                                        key={obj.id}
                                        className={`${styles.weekMatrixRow} ${styles.weekMatrixObjRow}`}
                                        style={gridStyle}
                                        role="row"
                                    >
                                        <div className={`${styles.weekMatrixFirstCell} ${styles.weekMatrixObjLabel}`} role="rowheader">
                                            <span className={styles.objektIconWrap}>
                                                {SHOW_SPORT_ICONS && obj.sportIcon ? (
                                                    <FontAwesomeIcon icon={obj.sportIcon} className={styles.objektSportIcon} aria-hidden />
                                                ) : (
                                                    <span className={styles.weekGridObjSpacer} aria-hidden />
                                                )}
                                            </span>
                                            <span className={`${styles.ellipsis} ${styles.weekGridObjName}`}>{obj.name}</span>
                                        </div>
                                        {weekMetas.map((w) => {
                                            const inactive = closure.weekIncluded[w.id] === false
                                            const ov = closure.objectClosedByWeek[obj.id]?.[w.id]
                                            const checked = ov ?? false
                                            return (
                                                <div
                                                    key={`${obj.id}-${w.id}`}
                                                    className={`${styles.weekMatrixWeekCell} ${inactive ? styles.weekGridMutedTd : ""}`}
                                                    role="cell"
                                                >
                                                    <Checkbox
                                                        size="small"
                                                        className={styles.checkAccent}
                                                        checked={!inactive && checked}
                                                        disabled={inactive}
                                                        onChange={() => applyMutation((c) => toggleObjectWeekClosure(c, obj.id, w.id))}
                                                        slotProps={{
                                                            input: {
                                                                "aria-label": t("dashboard:stammdaten.ferien-editor.cell-objekt-week-aria", {
                                                                    objekt: obj.name,
                                                                    range: `${formatDeShort(w.startDate)}–${formatDeShort(w.endDate)}`,
                                                                }),
                                                            },
                                                        }}
                                                    />
                                                </div>
                                            )
                                        })}
                                    </div>
                                ))
                            :   []

                        return [locRow, ...objRows]
                    })}
                </div>
            </div>
        </Paper>
    )
}
