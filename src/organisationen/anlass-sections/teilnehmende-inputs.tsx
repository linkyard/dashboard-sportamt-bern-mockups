import {useTranslation} from "react-i18next"
import {FieldLabel} from "../../components/field-label"
import {DetailsNumberInput} from "../../components/inputs"
import {PageTitle} from "../../components/page-title"
import styles from "../org-public-anlass-editor.module.scss"

export type TeilnehmendeInputsProps = {
    maleCount: string
    femaleCount: string
    under20Count: string
    totalPersonsDisplay: string
    onMaleCountChange: (value: string) => void
    onFemaleCountChange: (value: string) => void
    onUnder20CountChange: (value: string) => void
}

export const TeilnehmendeInputs: React.FC<TeilnehmendeInputsProps> = ({
    maleCount,
    femaleCount,
    under20Count,
    totalPersonsDisplay,
    onMaleCountChange,
    onFemaleCountChange,
    onUnder20CountChange,
}) => {
    const {t} = useTranslation("dashboard")

    return (
        <section className={styles.sectionCard}>
            <div className={styles.sectionHeading}>
                <PageTitle
                    title={t("organisation-public.anlass.teilnehmende-title")}
                    isSubTitle
                    toolTipContent={t("organisation-public.anlass.section-info-tooltip")}
                />
            </div>
            <div className={styles.teilnehmerFields}>
                <div className={styles.fieldGroup}>
                    <FieldLabel htmlFor="public-anlass-male">{t("organisation-public.anlass.teilnehmende-fields.male")}</FieldLabel>
                    <DetailsNumberInput
                        id="public-anlass-male"
                        value={maleCount}
                        onChange={(e) => onMaleCountChange(e.target.value)}
                        slotProps={{
                            htmlInput: {inputMode: "numeric", "aria-label": t("organisation-public.anlass.teilnehmende-fields.male")},
                        }}
                    />
                </div>
                <div className={styles.fieldGroup}>
                    <FieldLabel htmlFor="public-anlass-female">{t("organisation-public.anlass.teilnehmende-fields.female")}</FieldLabel>
                    <DetailsNumberInput
                        id="public-anlass-female"
                        value={femaleCount}
                        onChange={(e) => onFemaleCountChange(e.target.value)}
                        slotProps={{
                            htmlInput: {inputMode: "numeric", "aria-label": t("organisation-public.anlass.teilnehmende-fields.female")},
                        }}
                    />
                </div>
                <div className={styles.fieldGroup}>
                    <FieldLabel htmlFor="public-anlass-under20">{t("organisation-public.anlass.teilnehmende-fields.under-20")}</FieldLabel>
                    <DetailsNumberInput
                        id="public-anlass-under20"
                        value={under20Count}
                        onChange={(e) => onUnder20CountChange(e.target.value)}
                        slotProps={{
                            htmlInput: {inputMode: "numeric", "aria-label": t("organisation-public.anlass.teilnehmende-fields.under-20")},
                        }}
                    />
                </div>
                <div className={styles.fieldGroup}>
                    <FieldLabel htmlFor="public-anlass-total">
                        {t("organisation-public.anlass.teilnehmende-fields.total-persons")}
                    </FieldLabel>
                    <DetailsNumberInput
                        readOnly
                        id="public-anlass-total"
                        value={totalPersonsDisplay}
                        slotProps={{
                            htmlInput: {
                                inputMode: "numeric",
                                "aria-label": t("organisation-public.anlass.teilnehmende-fields.total-persons"),
                            },
                        }}
                    />
                </div>
            </div>
        </section>
    )
}
