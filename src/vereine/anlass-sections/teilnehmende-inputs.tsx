import {useState} from "react"
import {useTranslation} from "react-i18next"
import {FieldLabel} from "../../components/field-label"
import {DetailsTextInput} from "../../components/inputs"
import {PageTitle} from "../../components/page-title"
import styles from "../verein-public-anlass-editor.module.scss"

export const TeilnehmendeInputs: React.FC = () => {
    const {t} = useTranslation("dashboard")

    const [totalPersons, setTotalPersons] = useState("")
    const [maleCount, setMaleCount] = useState("")
    const [femaleCount, setFemaleCount] = useState("")
    const [under20Count, setUnder20Count] = useState("")
    return (
        <section className={styles.sectionCard}>
            <div className={styles.sectionHeading}>
                <PageTitle title={t("verein-public.anlass.teilnehmende-title")} isSubTitle hasInfoButton />
            </div>
            <div className={styles.teilnehmerFields}>
                <div className={styles.fieldGroup}>
                    <FieldLabel htmlFor="public-anlass-total">{t("verein-public.anlass.teilnehmende-fields.total-persons")}</FieldLabel>
                    <DetailsTextInput
                        id="public-anlass-total"
                        value={totalPersons}
                        onChange={(e) => setTotalPersons(e.target.value)}
                        className={styles.countInput}
                        slotProps={{
                            htmlInput: {inputMode: "numeric", "aria-label": t("verein-public.anlass.teilnehmende-fields.total-persons")},
                        }}
                    />
                </div>
                <div className={styles.fieldGroup}>
                    <FieldLabel htmlFor="public-anlass-male">{t("verein-public.anlass.teilnehmende-fields.male")}</FieldLabel>
                    <DetailsTextInput
                        id="public-anlass-male"
                        value={maleCount}
                        onChange={(e) => setMaleCount(e.target.value)}
                        className={styles.countInput}
                        slotProps={{
                            htmlInput: {inputMode: "numeric", "aria-label": t("verein-public.anlass.teilnehmende-fields.male")},
                        }}
                    />
                </div>
                <div className={styles.fieldGroup}>
                    <FieldLabel htmlFor="public-anlass-female">{t("verein-public.anlass.teilnehmende-fields.female")}</FieldLabel>
                    <DetailsTextInput
                        id="public-anlass-female"
                        value={femaleCount}
                        onChange={(e) => setFemaleCount(e.target.value)}
                        className={styles.countInput}
                        slotProps={{
                            htmlInput: {inputMode: "numeric", "aria-label": t("verein-public.anlass.teilnehmende-fields.female")},
                        }}
                    />
                </div>
                <div className={styles.fieldGroup}>
                    <FieldLabel htmlFor="public-anlass-under20">{t("verein-public.anlass.teilnehmende-fields.under-20")}</FieldLabel>
                    <DetailsTextInput
                        id="public-anlass-under20"
                        value={under20Count}
                        onChange={(e) => setUnder20Count(e.target.value)}
                        className={styles.countInput}
                        slotProps={{
                            htmlInput: {inputMode: "numeric", "aria-label": t("verein-public.anlass.teilnehmende-fields.under-20")},
                        }}
                    />
                </div>
            </div>
        </section>
    )
}
