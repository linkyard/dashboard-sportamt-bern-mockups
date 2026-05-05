import {faCalendar} from "@fortawesome/free-regular-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Button} from "@mui/material"
import {useTranslation} from "react-i18next"
import {useParams} from "react-router"
import anlassDetailStyles from "../board/anlass-detail.module.scss"
import {resolveAnlassFromOrganisation} from "../board/organisation"
import {AppBreadcrumbs} from "../components/breadcrumbs"
import {LocationSelect} from "../components/location-select"
import {PageTitle} from "../components/page-title"
import {SportIconBadge} from "../components/sport-icon-badge"
import {UploadSection} from "../components/upload-section"
import {getOrganisationForPublicPage} from "../dummyData"
import {FerienBenutzungTable} from "./anlass-sections/ferien-benutzung-table"
import {KurseSection} from "./anlass-sections/kurse-section"
import {TeilnehmendeInputs} from "./anlass-sections/teilnehmende-inputs"
import {ZusatzlicheAusfalltageTable} from "./anlass-sections/zusatzliche-ausfalltage-table"
import styles from "./org-public-anlass-editor.module.scss"

export const OrganisationPublicAnlassEditor: React.FC = () => {
    const {orgId, anlassId} = useParams<{orgId: string; anlassId: string}>()
    const organisation = getOrganisationForPublicPage(orgId)
    const anlassClicked = organisation && anlassId ? organisation.anlaesse.find((a) => a.id === anlassId) : undefined
    const anlassInfo = anlassClicked ? resolveAnlassFromOrganisation(anlassClicked, organisation) : undefined
    const {t} = useTranslation("dashboard")

    const title = anlassInfo ? anlassInfo.name : t("organisation-public.anlass.not-found-title")

    const organisationLocationOptions = [
        ...new Set((organisation?.anlaesse ?? []).flatMap(({location}) => (location ? [location] : []))),
    ].sort((a, b) => a.localeCompare(b, "de"))

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
                            variant="organisation-public-anlass"
                            orgId={orgId}
                            organisation={organisation}
                            anlass={anlassClicked}
                        />
                    </div>
                    {badge}
                </div>
                <PageTitle title={title} />
                <p>{t("organisation-public.anlass.not-found-body")}</p>
            </>
        )
    }

    const periodLabel = anlassInfo.period ?? "—"

    return (
        <>
            <div className={anlassDetailStyles.topBar}>
                <div className={anlassDetailStyles.breadcrumbsWrapper}>
                    <AppBreadcrumbs variant="organisation-public-anlass" orgId={orgId} organisation={organisation} anlass={anlassClicked} />
                </div>
                <SportIconBadge icon={anlassInfo.sportIcon} />
            </div>

            <div className={styles.titleBand}>
                <div className={styles.titleBandMain}>
                    <PageTitle title={title} editable />
                    <LocationSelect value={anlassInfo.location ?? ""} locationOptions={organisationLocationOptions} />
                    <div className={styles.periodRow}>
                        <FontAwesomeIcon icon={faCalendar} className={styles.periodIcon} aria-hidden />
                        <span>{periodLabel}</span>
                    </div>
                </div>
                <div className={styles.titleBandActions}>
                    <Button variant="outlined" color="inherit" sx={{borderColor: "#c4c4c4", color: "#222"}}>
                        {t("organisation-public.anlass.actions.cancel-reservation")}
                    </Button>
                    <Button variant="contained" color="primary">
                        {t("organisation-public.anlass.actions.confirm-reservation")}
                    </Button>
                </div>
            </div>
            <TeilnehmendeInputs />

            <section className={styles.sectionCard}>
                <div className={styles.sectionHeading}>
                    <PageTitle
                        title={t("organisation-public.anlass.teilnehmerliste-title")}
                        isSubTitle
                        toolTipContent={t("organisation-public.anlass.section-info-tooltip")}
                    />
                </div>
                <UploadSection variant="pdf" onFilesChange={() => undefined} isUploadSuccess={false} flushTop />
            </section>
            <FerienBenutzungTable periodLabel={periodLabel} />
            <ZusatzlicheAusfalltageTable />
            <KurseSection />
        </>
    )
}
