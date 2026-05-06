import SearchIcon from "@mui/icons-material/Search"
import {InputAdornment, TextField} from "@mui/material"
import {DatePicker} from "@mui/x-date-pickers/DatePicker"
import dayjs, {type Dayjs} from "dayjs"
import {useCallback, useMemo, useState} from "react"
import {useTranslation} from "react-i18next"
import {Navigate, useParams} from "react-router"
import {AppBreadcrumbs} from "../../../components/breadcrumbs"
import {FieldLabel} from "../../../components/field-label"
import {PageTitle} from "../../../components/page-title"
import {stammdatenSeedHolidays, stammdatenSeedLocations} from "../../../dummyData"
import {parseIsoToDayjs} from "../../../util/date"
import {
    aggregateWeekColumnForAllEntities,
    computeClosedObjekteCount,
    cycleWeekColumnHeader,
    ensureHolidayClosure,
    parseIsoDateParts,
    rebuildClosureForNewRange,
    setWeekIncludedWithColumnCascade,
    splitIntoFerienwochen,
} from "./holiday-closure"
import {FerienClosuresEditorWeekColumnGrid} from "./holiday-closures.editor.table"
import styles from "./holiday-closures.module.scss"
import type {HolidayClosureState, HolidayRowData} from "./holiday-types"

const LOCATIONS = stammdatenSeedLocations

/** Ephemeral editor state keyed by holiday — resets when `holidayId` changes; not persisted. */
function HolidayEditorMockBody({initialHoliday}: {initialHoliday: HolidayRowData}) {
    const {t} = useTranslation(["dashboard", "common"])
    const [search, setSearch] = useState("")
    const [expandedLocIds, setExpandedLocIds] = useState<Set<string>>(() => new Set(LOCATIONS.map((l) => l.id)))
    const [holiday, setHoliday] = useState(() => structuredClone(initialHoliday))

    const patchHoliday = useCallback((updater: (h: HolidayRowData) => HolidayRowData) => {
        setHoliday((prev) => updater(prev))
    }, [])

    const applyMutation = useCallback(
        (recipe: (prev: HolidayClosureState) => HolidayClosureState) => {
            patchHoliday((h) => {
                const cur = h.closure!
                const nextClosure = recipe(cur)
                return {
                    ...h,
                    closure: nextClosure,
                    closedObjekteCount: computeClosedObjekteCount(LOCATIONS, nextClosure),
                }
            })
        },
        [patchHoliday]
    )

    const weekMetas = useMemo(() => {
        if (!holiday) {
            return []
        }
        return splitIntoFerienwochen(holiday.startDate, holiday.endDate)
    }, [holiday])

    const visibleLocations = useMemo(() => {
        const q = search.trim().toLowerCase()
        if (!q) {
            return LOCATIONS
        }
        return LOCATIONS.filter((loc) => {
            if (loc.name.toLowerCase().includes(q)) {
                return true
            }
            return loc.subRows.some((o) => o.name.toLowerCase().includes(q))
        }).map((loc) => {
            if (loc.name.toLowerCase().includes(q)) {
                return loc
            }
            return {...loc, subRows: loc.subRows.filter((o) => o.name.toLowerCase().includes(q))}
        })
    }, [search])

    const weekColumnHeaderAgg = useMemo(() => {
        const closure = holiday.closure
        const entries: Record<string, {checked: boolean; indeterminate: boolean}> = {}
        if (!closure) {
            return entries
        }
        for (const w of weekMetas) {
            entries[w.id] = aggregateWeekColumnForAllEntities(closure, LOCATIONS, w.id)
        }
        return entries
    }, [holiday.closure, weekMetas])

    if (!holiday.closure) {
        return null
    }

    const closure = holiday.closure
    const weekIds = weekMetas.map((w) => w.id)
    const allWeeksIncluded = weekIds.length > 0 && weekIds.every((id) => closure.weekIncluded[id])
    const someWeeksIncluded = weekIds.some((id) => closure.weekIncluded[id])
    const masterWeekIndeterminate = someWeeksIncluded && !allWeeksIncluded

    const toggleAllWeeksIncluded = () => {
        const nextVal = !allWeeksIncluded
        applyMutation((c) => {
            let next = c
            for (const id of weekIds) {
                next = setWeekIncludedWithColumnCascade(next, LOCATIONS, id, nextVal)
            }
            return next
        })
    }

    const toggleOneWeek = (weekId: string) => {
        applyMutation((c) => cycleWeekColumnHeader(c, LOCATIONS, weekId))
    }

    const compareIso = (a: string, b: string): number => {
        const pa = parseIsoDateParts(a)
        const pb = parseIsoDateParts(b)
        if (!pa || !pb) {
            return 0
        }
        if (pa.y !== pb.y) {
            return pa.y - pb.y
        }
        if (pa.m !== pb.m) {
            return pa.m - pb.m
        }
        return pa.d - pb.d
    }

    const onDatePickerChange = (field: "startDate" | "endDate", date: Dayjs | null) => {
        const value = date && date.isValid() ? date.format("YYYY-MM-DD") : ""
        const start = field === "startDate" ? value : holiday.startDate
        const end = field === "endDate" ? value : holiday.endDate
        if (!parseIsoDateParts(start) || !parseIsoDateParts(end)) {
            patchHoliday((h) => ({...h, [field]: value}))
            return
        }
        if (compareIso(end, start) < 0) {
            patchHoliday((h) => ({...h, [field]: value}))
            return
        }
        const nextClosure = rebuildClosureForNewRange(closure, LOCATIONS, start, end)
        patchHoliday((h) => ({
            ...h,
            startDate: start,
            endDate: end,
            closure: nextClosure,
            closedObjekteCount: computeClosedObjekteCount(LOCATIONS, nextClosure),
        }))
    }

    const layoutProps = {
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
        locations: LOCATIONS,
    }

    return (
        <div className={styles.page}>
            <AppBreadcrumbs variant="holidays-editor" holidayName={holiday.name} />
            <PageTitle title={holiday.name} editable onTitleChange={(value) => patchHoliday((h) => ({...h, name: value}))} />

            <div className={styles.formSection}>
                <div className={`${styles.detailsCard} ${styles.controlsRow}`}>
                    <div className={styles.dateRangeRow}>
                        <div className={styles.fieldGroup}>
                            <FieldLabel htmlFor="ferien-editor-start-date">
                                {t("dashboard:master-data.holidays-editor.start-label")}
                            </FieldLabel>
                            <DatePicker
                                value={parseIsoToDayjs(holiday.startDate)}
                                onChange={(date) => onDatePickerChange("startDate", date ? dayjs(date) : null)}
                                slotProps={{
                                    textField: {
                                        id: "ferien-editor-start-date",
                                        className: styles.dateInput,
                                        size: "small",
                                        slotProps: {htmlInput: {placeholder: "mm/dd/yyyy"}},
                                    },
                                }}
                            />
                        </div>
                        <div className={styles.fieldGroup}>
                            <FieldLabel htmlFor="ferien-editor-end-date">{t("dashboard:master-data.holidays-editor.end-label")}</FieldLabel>
                            <DatePicker
                                value={parseIsoToDayjs(holiday.endDate)}
                                onChange={(date) => onDatePickerChange("endDate", date ? dayjs(date) : null)}
                                slotProps={{
                                    textField: {
                                        id: "ferien-editor-end-date",
                                        className: styles.dateInput,
                                        size: "small",
                                        slotProps: {htmlInput: {placeholder: "mm/dd/yyyy"}},
                                    },
                                }}
                            />
                        </div>
                    </div>
                    <TextField
                        className={styles.controlsSearch}
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t("common:actions.search")}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" color="action" aria-hidden />
                                    </InputAdornment>
                                ),
                            },
                            htmlInput: {
                                "aria-label": t("common:actions.search"),
                                style: {paddingTop: "4px", paddingBottom: "4px"},
                            },
                        }}
                    />
                </div>
            </div>

            <FerienClosuresEditorWeekColumnGrid {...layoutProps} />
        </div>
    )
}

export const HolidayEditorPage = () => {
    const {holidayId} = useParams<{holidayId: string}>()

    const fromSeed = useMemo(() => {
        if (!holidayId) {
            return undefined
        }
        const raw = stammdatenSeedHolidays.find((h) => h.id === holidayId)
        return raw ? ensureHolidayClosure(raw, LOCATIONS) : undefined
    }, [holidayId])

    if (!holidayId || !fromSeed) {
        return <Navigate to="/admin/stammdaten/ferien" replace />
    }

    return <HolidayEditorMockBody key={holidayId} initialHoliday={fromSeed} />
}
