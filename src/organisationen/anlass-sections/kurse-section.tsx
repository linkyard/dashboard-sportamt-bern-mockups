import {faXmark} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Button, Chip, FormControl, MenuItem, Select, Tab, Tabs} from "@mui/material"
import {useMemo, useState, type ReactElement, type ReactNode} from "react"
import {useTranslation} from "react-i18next"
import {ConfirmDeleteDialog} from "../../components/confirm-delete-dialog"
import {PageTitle} from "../../components/page-title"
import {
    organisationPublicKursObjekteByTimeBlockSeed,
    organisationPublicKursTimeBlocks,
    organisationPublicTrainerOptions,
    type KursTimeBlock,
} from "../../dummyData"
import editorStyles from "../org-public-anlass-editor.module.scss"
import styles from "./kurse-section.module.scss"

function TabLabel({weekdayKey, timeRange}: {weekdayKey: KursTimeBlock["weekdayKey"]; timeRange: string}) {
    const {t} = useTranslation("dashboard")

    return (
        <div className={styles.tabLabelWrap}>
            <div className={styles.tabDay}>{t(`organisation-public.anlass.kurse.${weekdayKey}`)}</div>
            <div className={styles.tabTime}>{timeRange}</div>
        </div>
    )
}

function TabPanel({kursTimeBlockId, tabsValue, children}: {kursTimeBlockId: string; tabsValue: string; children: ReactNode}) {
    const active = tabsValue === kursTimeBlockId

    return (
        <div
            role="tabpanel"
            hidden={!active}
            id={`organisation-kurs-panel-${kursTimeBlockId}`}
            aria-labelledby={`organisation-kurs-tab-${kursTimeBlockId}`}
        >
            {active ? children : null}
        </div>
    )
}

export function KurseSection(): ReactElement {
    const {t} = useTranslation("dashboard")
    const [activeKursTabId, setActiveKursTabId] = useState(organisationPublicKursTimeBlocks[0]?.id ?? "")
    const [trainersByKursTimeBlock, setTrainersByKursTimeBlock] = useState<Record<string, string>>(() => ({
        "kurs-1": "roman-frey",
        "kurs-2": "",
    }))
    const [objekteByKursTimeBlock] = useState(() => structuredClone(organisationPublicKursObjekteByTimeBlockSeed))

    const [deleteObjektId, setDeleteObjektId] = useState<string | null>(null)

    //TODO: This wont be needed anymore when Graphql is set up
    const objektPendingDeletion = useMemo(() => {
        if (!deleteObjektId) {
            return undefined
        }
        for (const blockObjekte of Object.values(objekteByKursTimeBlock)) {
            const o = blockObjekte.find((z) => z.id === deleteObjektId)
            if (o) {
                return o
            }
        }
        return undefined
    }, [deleteObjektId, objekteByKursTimeBlock])

    return (
        <section className={editorStyles.sectionCard}>
            <div className={editorStyles.sectionHeading}>
                <PageTitle
                    title={t("organisation-public.anlass.kurse.title")}
                    isSubTitle
                    toolTipContent={t("organisation-public.anlass.section-info-tooltip")}
                />
            </div>

            <Tabs
                className={styles.tabs}
                value={activeKursTabId}
                onChange={(_, value: string) => setActiveKursTabId(value)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label={t("organisation-public.anlass.kurse.tabs-aria")}
            >
                {organisationPublicKursTimeBlocks.map((kursTimeBlock) => (
                    <Tab
                        key={kursTimeBlock.id}
                        value={kursTimeBlock.id}
                        id={`organisation-kurs-tab-${kursTimeBlock.id}`}
                        aria-controls={`organisation-kurs-panel-${kursTimeBlock.id}`}
                        label={<TabLabel weekdayKey={kursTimeBlock.weekdayKey} timeRange={kursTimeBlock.timeRange} />}
                    />
                ))}
            </Tabs>

            {organisationPublicKursTimeBlocks.map((kursTimeBlock) => {
                const trainerValue = trainersByKursTimeBlock[kursTimeBlock.id] ?? ""
                const objekte = objekteByKursTimeBlock[kursTimeBlock.id] ?? []

                return (
                    <TabPanel key={kursTimeBlock.id} kursTimeBlockId={kursTimeBlock.id} tabsValue={activeKursTabId}>
                        <div className={styles.panel}>
                            <div className={styles.fieldBlock}>
                                <span className={styles.fieldLabel}>{t("organisation-public.anlass.kurse.trainer-label")}</span>
                                <div className={styles.trainerRow}>
                                    <FormControl size="small" fullWidth className={styles.trainerSelectWrap}>
                                        <Select
                                            displayEmpty
                                            value={trainerValue}
                                            onChange={(e) =>
                                                setTrainersByKursTimeBlock((prev) => ({
                                                    ...prev,
                                                    [kursTimeBlock.id]: e.target.value,
                                                }))
                                            }
                                            aria-label={t("organisation-public.anlass.kurse.trainer-label")}
                                            renderValue={(value) => {
                                                if (!value) {
                                                    return (
                                                        <span className={styles.mutedText}>
                                                            {t("organisation-public.anlass.kurse.trainer-placeholder")}
                                                        </span>
                                                    )
                                                }
                                                const opt = organisationPublicTrainerOptions.find((o) => o.id === value)
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
                                                <em>{t("organisation-public.anlass.kurse.trainer-placeholder")}</em>
                                            </MenuItem>
                                            {organisationPublicTrainerOptions.map((opt) => (
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
                                    <Button variant="contained" color="primary" size="small" onClick={() => undefined}>
                                        {t("organisation-public.anlass.kurse.trainer-add")}
                                    </Button>
                                </div>
                            </div>

                            <div className={styles.fieldBlock}>
                                <span className={styles.fieldLabel}>{t("organisation-public.anlass.kurse.objekte-label")}</span>
                                <div className={styles.objekteChips}>
                                    {objekte.map((o) => (
                                        <Chip
                                            key={o.id}
                                            label={o.label}
                                            variant="outlined"
                                            onDelete={() => setDeleteObjektId(o.id)}
                                            className={styles.objektChip}
                                            deleteIcon={
                                                <span className={styles.objektChipDelete} aria-hidden>
                                                    <FontAwesomeIcon icon={faXmark} className={styles.objektChipDeleteX} />
                                                </span>
                                            }
                                            aria-label={t("organisation-public.anlass.kurse.objekt-remove-aria", {
                                                label: o.label,
                                            })}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                )
            })}

            <ConfirmDeleteDialog
                open={deleteObjektId !== null}
                onClose={() => setDeleteObjektId(null)}
                onConfirm={() => setDeleteObjektId(null)}
                title={t("organisation-public.anlass.kurse.objekt-delete-title")}
            >
                {objektPendingDeletion
                    ? t("organisation-public.anlass.kurse.objekt-delete-body", {label: objektPendingDeletion.label})
                    : null}
            </ConfirmDeleteDialog>
        </section>
    )
}
