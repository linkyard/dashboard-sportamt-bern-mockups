import {Button, Chip, FormControl, MenuItem, Select, Tab, Tabs} from "@mui/material"
import {useMemo, useState, type ReactElement} from "react"
import {useTranslation} from "react-i18next"
import {PageTitle} from "../../components/page-title"
import {
    type KursSlotSeed,
    vereinPublicKursSlots,
    vereinPublicObjekteCatalog,
    vereinPublicTrainerOptions,
} from "../../dummyData"
import editorStyles from "../verein-public-anlass-editor.module.scss"
import styles from "./kurse-section.module.scss"

function TabLabel({weekdayKey, timeRange}: {weekdayKey: KursSlotSeed["weekdayKey"]; timeRange: string}) {
    const {t} = useTranslation("dashboard")

    return (
        <div className={styles.tabLabelWrap}>
            <div className={styles.tabDay}>{t(`verein-public.anlass.kurse.${weekdayKey}`)}</div>
            <div className={styles.tabTime}>{timeRange}</div>
        </div>
    )
}

export function KurseSection(): ReactElement {
    const {t} = useTranslation("dashboard")
    const [activeSlotId, setActiveSlotId] = useState(vereinPublicKursSlots[0]?.id ?? "")
    const [trainerBySlot, setTrainerBySlot] = useState<Record<string, string>>(() => ({
        "kurs-1": "roman-frey",
        "kurs-2": "",
    }))
    const [objekteBySlot, setObjekteBySlot] = useState<Record<string, string[]>>(() => ({
        "kurs-1": ["Bahn 1", "Bahn 2"],
        "kurs-2": [],
    }))

    const activeSlot = useMemo(() => vereinPublicKursSlots.find((s) => s.id === activeSlotId), [activeSlotId])

    const selectedTrainerId = activeSlot ? (trainerBySlot[activeSlot.id] ?? "") : ""
    const selectedObjekte = activeSlot ? (objekteBySlot[activeSlot.id] ?? []) : []
    const availableObjekte = vereinPublicObjekteCatalog.filter((o) => !selectedObjekte.includes(o))

    const setTrainerForActive = (trainerId: string) => {
        if (!activeSlot) {
            return
        }
        setTrainerBySlot((prev) => ({...prev, [activeSlot.id]: trainerId}))
    }

    const addObjekt = (label: string) => {
        if (!activeSlot || !label) {
            return
        }
        setObjekteBySlot((prev) => {
            const cur = prev[activeSlot.id] ?? []
            if (cur.includes(label)) {
                return prev
            }
            return {...prev, [activeSlot.id]: [...cur, label]}
        })
    }

    const removeObjekt = (label: string) => {
        if (!activeSlot) {
            return
        }
        setObjekteBySlot((prev) => ({
            ...prev,
            [activeSlot.id]: (prev[activeSlot.id] ?? []).filter((x) => x !== label),
        }))
    }

    return (
        <section className={editorStyles.sectionCard}>
            <div className={editorStyles.sectionHeading}>
                <PageTitle title={t("verein-public.anlass.kurse.title")} isSubTitle hasInfoButton />
            </div>

            <Tabs
                className={styles.tabs}
                value={activeSlotId}
                onChange={(_, value: string) => setActiveSlotId(value)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label={t("verein-public.anlass.kurse.tabs-aria")}
            >
                {vereinPublicKursSlots.map((slot) => (
                    <Tab
                        key={slot.id}
                        value={slot.id}
                        id={`verein-kurs-tab-${slot.id}`}
                        aria-controls={`verein-kurs-panel-${slot.id}`}
                        label={<TabLabel weekdayKey={slot.weekdayKey} timeRange={slot.timeRange} />}
                    />
                ))}
            </Tabs>

            {activeSlot ? (
                <div
                    className={styles.panel}
                    role="tabpanel"
                    id={`verein-kurs-panel-${activeSlot.id}`}
                    aria-labelledby={`verein-kurs-tab-${activeSlot.id}`}
                >
                    <div className={styles.fieldBlock}>
                        <span className={styles.fieldLabel}>{t("verein-public.anlass.kurse.trainer-label")}</span>
                        <div className={styles.trainerRow}>
                            <FormControl size="small" fullWidth className={styles.trainerSelectWrap}>
                                <Select
                                    displayEmpty
                                    value={selectedTrainerId}
                                    onChange={(e) => setTrainerForActive(e.target.value)}
                                    aria-label={t("verein-public.anlass.kurse.trainer-label")}
                                    renderValue={(value) => {
                                        if (!value) {
                                            return (
                                                <span className={styles.mutedText}>
                                                    {t("verein-public.anlass.kurse.trainer-placeholder")}
                                                </span>
                                            )
                                        }
                                        const opt = vereinPublicTrainerOptions.find((t) => t.id === value)
                                        if (!opt) {
                                            return value
                                        }
                                        return (
                                            <div className={styles.selectValueWrap}>
                                                <span className={styles.selectTrainerName}>{opt.name}</span>
                                                <span className={styles.selectTrainerMeta}>
                                                    {opt.phone}, {opt.email}
                                                </span>
                                            </div>
                                        )
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>{t("verein-public.anlass.kurse.trainer-placeholder")}</em>
                                    </MenuItem>
                                    {vereinPublicTrainerOptions.map((opt) => (
                                        <MenuItem key={opt.id} value={opt.id}>
                                            <span className={styles.menuItemInner}>
                                                <span className={styles.selectTrainerName}>{opt.name}</span>
                                                <span className={styles.selectTrainerMeta}>
                                                    {opt.phone}, {opt.email}
                                                </span>
                                            </span>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button variant="contained" color="primary" size="medium" onClick={() => undefined}>
                                {t("verein-public.anlass.kurse.trainer-add")}
                            </Button>
                        </div>
                    </div>

                    <div className={styles.fieldBlock}>
                        <span className={styles.fieldLabel}>{t("verein-public.anlass.kurse.objekte-label")}</span>
                        <p className={styles.fieldHint}>{t("verein-public.anlass.kurse.objekte-helper")}</p>
                        <div className={styles.objekteChips}>
                            {availableObjekte.length > 0 ? (
                                <FormControl size="small" className={styles.objectAddControl}>
                                    <Select
                                        displayEmpty
                                        value=""
                                        onChange={(e) => {
                                            const v = e.target.value as string
                                            if (v) {
                                                addObjekt(v)
                                            }
                                        }}
                                        aria-label={t("verein-public.anlass.kurse.objekt-add-placeholder")}
                                    >
                                        <MenuItem value="" disabled>
                                            <span className={styles.mutedText}>
                                                {t("verein-public.anlass.kurse.objekt-add-placeholder")}
                                            </span>
                                        </MenuItem>
                                        {availableObjekte.map((o) => (
                                            <MenuItem key={o} value={o}>
                                                {o}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) : selectedObjekte.length > 0 ? (
                                <p className={styles.mutedText}>{t("verein-public.anlass.kurse.objekte-all-assigned")}</p>
                            ) : (
                                <p className={styles.mutedText}>{t("verein-public.anlass.kurse.objekte-none-available")}</p>
                            )}
                            {selectedObjekte.map((label) => (
                                <Chip
                                    key={label}
                                    label={label}
                                    variant="outlined"
                                    onDelete={() => removeObjekt(label)}
                                    className={styles.objektChip}
                                    aria-label={t("verein-public.anlass.kurse.objekt-remove-aria", {label})}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    )
}
