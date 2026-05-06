import {faCalendar} from "@fortawesome/free-regular-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Button} from "@mui/material"
import {useState} from "react"
import {useTranslation} from "react-i18next"
import {useParams} from "react-router"
import {resolveReservationFromOrganisation} from "../admin/board/organisation"
import anlassDetailStyles from "../admin/board/reservation-detail.module.scss"
import {AppBreadcrumbs} from "../components/breadcrumbs"
import {LocationSelect} from "../components/location-select"
import {PageTitle} from "../components/page-title"
import {SportIconBadge} from "../components/sport-icon-badge"
import {UploadSection} from "../components/upload-section"
import {getOrganisationForPublicPage} from "../dummyData"
import {ZusatzlicheAusfalltageTable} from "./reservation-sections/additional-days-off.table"
import {FerienBenutzungTable} from "./reservation-sections/holiday-usage.table"
import {TeilnehmendeInputs} from "./reservation-sections/participant-inputs"
import {KurseSection} from "./reservation-sections/training-section"
import styles from "./reservation.editor.module.scss"

function teilnehmendeTotals(male: string, female: string, under20: string) {
    const total = +male + +female + +under20
    return {totalStr: String(total), showUpload: +under20 * 100 >= total * 90}
}

export const OrganisationPublicAnlassEditor: React.FC = () => {
    const {orgId, anlassId} = useParams<{orgId: string; anlassId: string}>()
    const organisation = getOrganisationForPublicPage(orgId)
    const anlassClicked = organisation && anlassId ? organisation.reservations.find((a) => a.id === anlassId) : undefined
    const anlassInfo = anlassClicked ? resolveReservationFromOrganisation(anlassClicked, organisation) : undefined
    const {t} = useTranslation("dashboard")

    const [maleTeilnehmerCount, setMaleTeilnehmerCount] = useState("")
    const [femaleTeilnehmerCount, setFemaleTeilnehmerCount] = useState("")
    const [under20TeilnehmerCount, setUnder20TeilnehmerCount] = useState("")

    const title = anlassInfo ? anlassInfo.name : t("organisation-public.reservation.not-found-title")

    const organisationLocationOptions = [
        ...new Set((organisation?.reservations ?? []).flatMap(({location}) => (location ? [location] : []))),
    ].sort((a, b) => a.localeCompare(b, "de"))

    if (!organisation || !anlassInfo) {
        const badge =
            organisation && anlassClicked ? (
                <SportIconBadge icon={resolveReservationFromOrganisation(anlassClicked, organisation).sportIcon} />
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
                <p>{t("organisation-public.reservation.not-found-body")}</p>
            </>
        )
    }

    const periodLabel = anlassInfo.period ?? "—"
    const teilnehmer = teilnehmendeTotals(maleTeilnehmerCount, femaleTeilnehmerCount, under20TeilnehmerCount)

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
                        {t("organisation-public.reservation.actions.cancel-reservation")}
                    </Button>
                    <Button variant="contained" color="primary">
                        {t("organisation-public.reservation.actions.confirm-reservation")}
                    </Button>
                </div>
            </div>
            <TeilnehmendeInputs
                maleCount={maleTeilnehmerCount}
                femaleCount={femaleTeilnehmerCount}
                under20Count={under20TeilnehmerCount}
                totalPersonsDisplay={teilnehmer.totalStr}
                onMaleCountChange={setMaleTeilnehmerCount}
                onFemaleCountChange={setFemaleTeilnehmerCount}
                onUnder20CountChange={setUnder20TeilnehmerCount}
            />

            {teilnehmer.showUpload ? (
                <section className={styles.sectionCard}>
                    <div className={styles.sectionHeading}>
                        <PageTitle
                            title={t("organisation-public.reservation.participants-list-title")}
                            isSubTitle
                            toolTipContent={t("organisation-public.reservation.section-info-tooltip")}
                        />
                    </div>
                    <UploadSection variant="pdf" onFilesChange={() => undefined} isUploadSuccess={false} flushTop />
                </section>
            ) : null}
            <FerienBenutzungTable periodLabel={periodLabel} />
            <ZusatzlicheAusfalltageTable />
            <KurseSection />
        </>
    )
}
