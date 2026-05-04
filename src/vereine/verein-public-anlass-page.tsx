import {faCalendar} from "@fortawesome/free-regular-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Button} from "@mui/material"
import {useTranslation} from "react-i18next"
import {useParams} from "react-router"

import anlassDetailStyles from "../board/anlass-detail.module.scss"
import {resolveAnlassFromOrganisation} from "../board/organisation"
import {AppBreadcrumbs} from "../components/breadcrumbs"
import {PageTitle} from "../components/page-title"
import {SportIconBadge} from "../components/sport-icon-badge"
import {UploadSection} from "../components/upload-section"
import {getOrganisationForPublicVereinPage} from "../dashboard/dummyData"
import {TeilnehmendeInputs} from "./anlass-sections/teilnehmende-inputs"
import styles from "./verein-public-anlass-page.module.scss"

export const VereinPublicAnlassPage: React.FC = () => {
    const {organisationId, anlassId} = useParams<{organisationId: string; anlassId: string}>()
    const organisation = getOrganisationForPublicVereinPage(organisationId)
    const anlassClicked = organisation && anlassId ? organisation.anlaesse.find((a) => a.id === anlassId) : undefined
    const anlassInfo = anlassClicked ? resolveAnlassFromOrganisation(anlassClicked, organisation) : undefined
    const {t} = useTranslation("dashboard")

    const title = anlassInfo ? `${anlassInfo.name} - ${anlassInfo.location ?? "-"}` : t("verein-public.anlass.not-found-title")

    if (!organisation || !anlassInfo) {
        const badge =
            organisation && anlassClicked ? (
                <SportIconBadge icon={resolveAnlassFromOrganisation(anlassClicked, organisation).sportIcon} />
            ) : null

        return (
            <>
                <div className={anlassDetailStyles.topBar}>
                    <div className={anlassDetailStyles.breadcrumbsWrapper}>
                        <AppBreadcrumbs
                            variant="verein-public-anlass"
                            organisationId={organisationId}
                            organisation={organisation}
                            anlass={anlassClicked}
                        />
                    </div>
                    {badge}
                </div>
                <PageTitle title={title} editable />
                <p>{t("verein-public.anlass.not-found-body")}</p>
            </>
        )
    }

    const periodLabel = anlassInfo.period ?? "—"

    return (
        <>
            <div className={anlassDetailStyles.topBar}>
                <div className={anlassDetailStyles.breadcrumbsWrapper}>
                    <AppBreadcrumbs
                        variant="verein-public-anlass"
                        organisationId={organisationId}
                        organisation={organisation}
                        anlass={anlassClicked}
                    />
                </div>
                <SportIconBadge icon={anlassInfo.sportIcon} />
            </div>

            <div className={styles.titleBand}>
                <div className={styles.titleBandMain}>
                    <PageTitle title={title} editable />
                    <div className={styles.periodRow}>
                        <FontAwesomeIcon icon={faCalendar} className={styles.periodIcon} aria-hidden />
                        <span>{periodLabel}</span>
                    </div>
                </div>
                <div className={styles.titleBandActions}>
                    <Button variant="outlined" color="inherit" sx={{borderColor: "#c4c4c4", color: "#222"}}>
                        {t("verein-public.anlass.actions.cancel-reservation")}
                    </Button>
                    <Button variant="contained" color="primary">
                        {t("verein-public.anlass.actions.confirm-reservation")}
                    </Button>
                </div>
            </div>

            <TeilnehmendeInputs />

            <section className={styles.sectionCard}>
                <div className={styles.sectionHeading}>
                    <PageTitle title={t("verein-public.anlass.teilnehmerliste-title")} isSubTitle hasInfoButton />
                </div>
                <UploadSection onFilesChange={() => undefined} isUploadSuccess={false} flushTop />
            </section>
        </>
    )
}
