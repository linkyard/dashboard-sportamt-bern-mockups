import {faUserPlus, faXmark} from "@fortawesome/free-solid-svg-icons"
import {faCalendarClock} from "@fortawesome/pro-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Button, Chip, FormControl, MenuItem, Select, Tooltip} from "@mui/material"
import {useMemo, useState, type ReactElement} from "react"
import {useTranslation} from "react-i18next"
import {ConfirmDeleteDialog} from "../../components/confirm-delete-dialog"
import {PageTitle} from "../../components/page-title"
import {trainerOptions, trainingObjectsByTimeBlockSeed, trainingTimeBlocks} from "../../dummyData"
import editorStyles from "../reservation.editor.module.scss"
import styles from "./training-section.module.scss"

export function TrainingSection(): ReactElement {
    const {t} = useTranslation("dashboard")
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

            <div className={styles.trainingCardsGrid}>
                {trainingTimeBlocks.map((trainingTimeBlock) => {
                    const trainerValue = trainersByTrainingTimeBlock[trainingTimeBlock.id] ?? ""
                    const objects = objectsByTrainingTimeBlock[trainingTimeBlock.id] ?? []

                    return (
                        <article key={`card-${trainingTimeBlock.id}`} className={styles.trainingCard}>
                            <header className={styles.trainingCardHeader}>
                                <div className={styles.trainingCardTitleRow}>
                                    <FontAwesomeIcon icon={faCalendarClock} className={styles.trainingCardIcon} aria-hidden />
                                    <span className={styles.trainingCardTitleText}>
                                        <span className={styles.trainingCardDay}>
                                            {t(`organisation-public.reservation.trainings.${trainingTimeBlock.weekdayKey}`)}
                                        </span>
                                        <span className={styles.trainingCardTime}>{trainingTimeBlock.timeRange}</span>
                                    </span>
                                </div>
                            </header>
                            <div className={styles.trainingCardContent}>
                                {/* //TODO: Hardcoded start date - needs to be replaced with actual start date */}
                                <p className={styles.startDate}>Startdatum: 18.08.2026</p>
                                <div className={styles.fieldBlock}>
                                    <span className={styles.fieldLabel}>
                                        {t("organisation-public.reservation.trainings.trainer-label")}
                                    </span>
                                    <div className={`${styles.trainerRow} ${styles.trainerRowFullWidth}`}>
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
                                        <Tooltip title={t("organisation-public.reservation.trainings.trainer-add")} enterDelay={500}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                onClick={() => undefined}
                                                aria-label={t("organisation-public.reservation.trainings.trainer-add")}
                                                startIcon={<FontAwesomeIcon icon={faUserPlus} aria-hidden style={{fontSize: "0.9rem"}} />}
                                            >
                                                {t("organisation-public.reservation.trainings.trainer-add-button")}
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </div>

                                <div className={styles.fieldBlock}>
                                    <span className={styles.fieldLabel}>
                                        {t("organisation-public.reservation.trainings.objects-label")}
                                    </span>
                                    <div className={styles.objekteChips}>
                                        {objects.length === 0 ? (
                                            <span className={styles.emptyObjekteHint}>
                                                {t("organisation-public.reservation.trainings.objects-empty")}
                                            </span>
                                        ) : (
                                            objects.map((o) => (
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
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </article>
                    )
                })}
            </div>

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
