import {faXmark} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Button, Chip, FormControl, MenuItem, Select, Tab, Tabs} from "@mui/material"
import {useMemo, useState, type ReactElement, type ReactNode} from "react"
import {useTranslation} from "react-i18next"
import {ConfirmDeleteDialog} from "../../components/confirm-delete-dialog"
import {PageTitle} from "../../components/page-title"
import {trainerOptions, trainingObjectsByTimeBlockSeed, trainingTimeBlocks, type TrainingTimeBlock} from "../../dummyData"
import editorStyles from "../reservation.editor.module.scss"
import styles from "./training-section.module.scss"

function TabLabel({weekdayKey, timeRange}: {weekdayKey: TrainingTimeBlock["weekdayKey"]; timeRange: string}) {
    const {t} = useTranslation("dashboard")

    return (
        <div className={styles.tabLabelWrap}>
            <div className={styles.tabDay}>{t(`organisation-public.reservation.trainings.${weekdayKey}`)}</div>
            <div className={styles.tabTime}>{timeRange}</div>
        </div>
    )
}

function TabPanel({trainingTimeBlockId, tabsValue, children}: {trainingTimeBlockId: string; tabsValue: string; children: ReactNode}) {
    const active = tabsValue === trainingTimeBlockId

    return (
        <div
            role="tabpanel"
            hidden={!active}
            id={`organisation-training-panel-${trainingTimeBlockId}`}
            aria-labelledby={`organisation-training-tab-${trainingTimeBlockId}`}
        >
            {active ? children : null}
        </div>
    )
}

export function TrainingSection(): ReactElement {
    const {t} = useTranslation("dashboard")
    const [activeTrainingTabId, setActiveTrainingTabId] = useState(trainingTimeBlocks[0]?.id ?? "")
    const [trainersByTrainingTimeBlock, setTrainersByTrainingTimeBlock] = useState<Record<string, string>>(() => ({
        "training-1": "roman-frey",
        "training-2": "",
    }))
    const [objectsByTrainingTimeBlock] = useState(() => structuredClone(trainingObjectsByTimeBlockSeed))

    const [deleteObjektId, setDeleteObjektId] = useState<string | null>(null)

    //TODO: This wont be needed anymore when Graphql is set up
    const objektPendingDeletion = useMemo(() => {
        if (!deleteObjektId) {
            return undefined
        }
        for (const blockObjects of Object.values(objectsByTrainingTimeBlock)) {
            const o = blockObjects.find((z) => z.id === deleteObjektId)
            if (o) {
                return o
            }
        }
        return undefined
    }, [deleteObjektId, objectsByTrainingTimeBlock])

    return (
        <section className={editorStyles.sectionCard}>
            <div className={editorStyles.sectionHeading}>
                <PageTitle
                    title={t("organisation-public.reservation.trainings.title")}
                    isSubTitle
                    toolTipContent={t("organisation-public.reservation.section-info-tooltip")}
                />
            </div>

            <Tabs
                className={styles.tabs}
                value={activeTrainingTabId}
                onChange={(_, value: string) => setActiveTrainingTabId(value)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label={t("organisation-public.reservation.trainings.tabs-aria")}
            >
                {trainingTimeBlocks.map((trainingTimeBlock) => (
                    <Tab
                        key={trainingTimeBlock.id}
                        value={trainingTimeBlock.id}
                        id={`organisation-training-tab-${trainingTimeBlock.id}`}
                        aria-controls={`organisation-training-panel-${trainingTimeBlock.id}`}
                        label={<TabLabel weekdayKey={trainingTimeBlock.weekdayKey} timeRange={trainingTimeBlock.timeRange} />}
                    />
                ))}
            </Tabs>

            {trainingTimeBlocks.map((trainingTimeBlock) => {
                const trainerValue = trainersByTrainingTimeBlock[trainingTimeBlock.id] ?? ""
                const objects = objectsByTrainingTimeBlock[trainingTimeBlock.id] ?? []

                return (
                    <TabPanel key={trainingTimeBlock.id} trainingTimeBlockId={trainingTimeBlock.id} tabsValue={activeTrainingTabId}>
                        <div className={styles.panel}>
                            <p className={styles.startDate}>Startdatum: 18.08.2026</p>
                            <div className={styles.fieldBlock}>
                                <span className={styles.fieldLabel}>{t("organisation-public.reservation.trainings.trainer-label")}</span>
                                <div className={styles.trainerRow}>
                                    <FormControl size="small" fullWidth className={styles.trainerSelectWrap}>
                                        <Select
                                            displayEmpty
                                            value={trainerValue}
                                            onChange={(e) =>
                                                setTrainersByTrainingTimeBlock((prev) => ({
                                                    ...prev,
                                                    [trainingTimeBlock.id]: e.target.value,
                                                }))
                                            }
                                            aria-label={t("organisation-public.reservation.trainings.trainer-label")}
                                            renderValue={(value) => {
                                                if (!value) {
                                                    return (
                                                        <span className={styles.mutedText}>
                                                            {t("organisation-public.reservation.trainings.trainer-placeholder")}
                                                        </span>
                                                    )
                                                }
                                                const opt = trainerOptions.find((o) => o.id === value)
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
                                                <em>{t("organisation-public.reservation.trainings.trainer-placeholder")}</em>
                                            </MenuItem>
                                            {trainerOptions.map((opt) => (
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
                                        {t("organisation-public.reservation.trainings.trainer-add")}
                                    </Button>
                                </div>
                            </div>

                            <div className={styles.fieldBlock}>
                                <span className={styles.fieldLabel}>{t("organisation-public.reservation.trainings.objects-label")}</span>
                                <div className={styles.objekteChips}>
                                    {objects.map((o) => (
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
                                            aria-label={t("organisation-public.reservation.trainings.object-remove-aria", {
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
                title={t("organisation-public.reservation.trainings.object-delete-title")}
            >
                {objektPendingDeletion
                    ? t("organisation-public.reservation.trainings.object-delete-body", {label: objektPendingDeletion.label})
                    : null}
            </ConfirmDeleteDialog>
        </section>
    )
}
