import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import {Checkbox, IconButton, Paper} from "@mui/material"
import type {TFunction} from "i18next"
import {type Dispatch, type SetStateAction, useMemo} from "react"
import type {LocationRowData, ObjektRowData} from "../location/location-types"
import {aggregateLocationWeekForObjects, formatDeShort, toggleLocationWeekCascade, toggleObjectWeekClosure} from "./holiday-closure"
import styles from "./holiday-closures.module.scss"
import type {HolidayClosureState} from "./holiday-types"

type WeekMeta = {id: string; startDate: string; endDate: string}

export function FerienClosuresEditorWeekColumnGrid({
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
        return `minmax(220px, 1.4fr) ${weekMetas.map(() => "minmax(72px, 1fr)").join(" ")}`
    }, [weekMetas])

    const gridStyle = useMemo(() => ({gridTemplateColumns}), [gridTemplateColumns])

    return (
        <Paper className={styles.tableCard} elevation={0}>
            <div className={styles.tableScroll}>
                <div className={styles.weekTable} role="table" aria-label={t("dashboard:master-data.holidays-editor.column-location-only")}>
                    {weekMetas.length > 0 ? (
                        <div className={`${styles.tableRow} ${styles.closedGroupHeaderRow}`} style={gridStyle} role="row">
                            <div className={`${styles.firstCell} ${styles.closedGroupCorner}`} role="presentation" />
                            <div className={styles.closedGroupHeader} style={{gridColumn: "2 / -1"}} role="columnheader">
                                {t("dashboard:master-data.holidays-editor.column-closed")}
                            </div>
                        </div>
                    ) : null}
                    <div className={`${styles.tableRow} ${styles.headerRow}`} style={gridStyle} role="row">
                        <div className={styles.firstCell} role="columnheader">
                            <div className={styles.topLeft}>
                                <span className={styles.topLeftTitle}>{t("dashboard:master-data.holidays-editor.column-location-only")}</span>
                                <span className={styles.allWeeksHint}>
                                    <Checkbox
                                        size="small"
                                        checked={allWeeksIncluded}
                                        indeterminate={masterWeekIndeterminate}
                                        onChange={toggleAllWeeksIncluded}
                                        slotProps={{input: {"aria-label": t("dashboard:master-data.holidays-editor.weeks-master-aria")}}}
                                    />
                                    <span>{t("dashboard:master-data.holidays-editor.weeks-short-label")}</span>
                                </span>
                            </div>
                        </div>
                        {weekMetas.map((w, wi) => {
                            const weekHdr = weekColumnHeaderAgg[w.id] ?? {checked: false, indeterminate: false}
                            return (
                                <div key={w.id} className={styles.weekHead} role="columnheader">
                                    <div className={styles.weekHeadInner}>
                                        <Checkbox
                                            size="small"
                                            checked={weekHdr.checked}
                                            indeterminate={weekHdr.indeterminate}
                                            onChange={() => toggleOneWeek(w.id)}
                                            slotProps={{
                                                input: {
                                                    "aria-label": t("dashboard:master-data.holidays-editor.week-aria", {
                                                        week: wi + 1,
                                                        range: `${formatDeShort(w.startDate)}–${formatDeShort(w.endDate)}`,
                                                    }),
                                                },
                                            }}
                                        />
                                        <div className={styles.weekHeadTitle}>
                                            <span>{t("dashboard:master-data.holidays-editor.column-week-n", {week: wi + 1})}</span>
                                            <span className={styles.weekHeadSub}>
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
                            <div
                                key={`${loc.id}-location`}
                                className={`${styles.tableRow} ${styles.rowLocation}`}
                                style={gridStyle}
                                role="row"
                            >
                                <div className={styles.firstCell} role="rowheader">
                                    <div className={styles.locationRowTitle}>
                                        <IconButton
                                            size="small"
                                            aria-expanded={expanded}
                                            aria-label={
                                                expanded
                                                    ? t("dashboard:master-data.holidays-editor.collapse-aria", {name: loc.name})
                                                    : t("dashboard:master-data.holidays-editor.expand-aria", {name: loc.name})
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
                                            className={inactive ? `${styles.inactiveCell} ${styles.weekCell}` : styles.weekCell}
                                            role="cell"
                                        >
                                            <Checkbox
                                                size="small"
                                                checked={!inactive && locWeekAgg.checked}
                                                indeterminate={!inactive && locWeekAgg.indeterminate}
                                                disabled={inactive}
                                                onChange={() => applyMutation((c) => toggleLocationWeekCascade(c, locations, loc.id, w.id))}
                                                slotProps={{
                                                    input: {
                                                        "aria-label": t("dashboard:master-data.holidays-editor.cell-location-week-aria", {
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

                        const objRows = expanded
                            ? loc.subRows.map((obj: ObjektRowData) => (
                                  <div key={obj.id} className={`${styles.tableRow} ${styles.rowObjekt}`} style={gridStyle} role="row">
                                      <div className={`${styles.firstCell} ${styles.objektFirstCell}`} role="rowheader">
                                          <span className={styles.objektIconWrap}>
                                              {obj.sportIcon ? (
                                                  <FontAwesomeIcon icon={obj.sportIcon} className={styles.objektSportIcon} aria-hidden />
                                              ) : (
                                                  <span className={styles.iconSpacer} aria-hidden />
                                              )}
                                          </span>
                                          <span className={`${styles.ellipsis} ${styles.objektRowTitle}`}>{obj.name}</span>
                                      </div>
                                      {weekMetas.map((w) => {
                                          const inactive = closure.weekIncluded[w.id] === false
                                          const ov = closure.objectClosedByWeek[obj.id]?.[w.id]
                                          const checked = ov ?? false
                                          return (
                                              <div
                                                  key={`${obj.id}-${w.id}`}
                                                  className={inactive ? `${styles.inactiveCell} ${styles.weekCell}` : styles.weekCell}
                                                  role="cell"
                                              >
                                                  <Checkbox
                                                      size="small"
                                                      checked={!inactive && checked}
                                                      disabled={inactive}
                                                      onChange={() => applyMutation((c) => toggleObjectWeekClosure(c, obj.id, w.id))}
                                                      slotProps={{
                                                          input: {
                                                              "aria-label": t("dashboard:master-data.holidays-editor.cell-object-week-aria", {
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
                            : []

                        return [locRow, ...objRows]
                    })}
                </div>
            </div>
        </Paper>
    )
}
