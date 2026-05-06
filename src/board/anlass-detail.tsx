import {faCalendar} from "@fortawesome/free-regular-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {useTranslation} from "react-i18next"
import {useParams} from "react-router"
import {AppBreadcrumbs} from "../components/breadcrumbs"
import {PageTitle} from "../components/page-title"
import {SportIconBadge} from "../components/sport-icon-badge"
import {getOrganisationById} from "../dummyData"
import styles from "./anlass-detail.module.scss"
import {AnlassHistoryLog} from "./components/anlass-history-log"
import {AnlassKurseControlTable} from "./components/anlass-kurse-control-table"
import {resolveAnlassFromOrganisation} from "./organisation"

export const AnlassDetail: React.FC = () => {
    const {orgId, anlassId} = useParams<{orgId: string; anlassId: string}>()
    const organisation = orgId ? getOrganisationById(orgId) : undefined
    const anlass = organisation && anlassId ? organisation.anlaesse.find((a) => a.id === anlassId) : undefined
    const {t} = useTranslation("dashboard")
    const anlassForDisplay = anlass ? resolveAnlassFromOrganisation(anlass, organisation) : undefined

    const title = anlassForDisplay
        ? `${anlassForDisplay.name} - ${anlassForDisplay.location ?? "-"}`
        : t("dashboard:organisation-admin.anlass-detail.fallback-title")

    const periodLabel = anlassForDisplay ? (anlassForDisplay.period ?? "—") : null

    return (
        <>
            <div className={styles.topBar}>
                <div className={styles.breadcrumbsWrapper}>
                    <AppBreadcrumbs variant="anlass-detail" organisation={organisation} anlass={anlass} />
                </div>
                {anlassForDisplay ? <SportIconBadge icon={anlassForDisplay.sportIcon} /> : null}
            </div>
            <PageTitle title={title} />
            {periodLabel ? (
                <div className={styles.periodRow}>
                    <FontAwesomeIcon icon={faCalendar} className={styles.periodIcon} />
                    <span>{periodLabel}</span>
                </div>
            ) : null}
            {!anlassForDisplay ? <p>{t("dashboard:organisation-admin.anlass-detail.empty")}</p> : null}
            {anlassForDisplay ? (
                <>
                    <AnlassHistoryLog
                        title={t("dashboard:organisation-admin.anlass-detail.history-title")}
                        emptyText={t("dashboard:organisation-admin.anlass-detail.history-empty")}
                        entries={anlassForDisplay.history ?? []}
                        status={anlassForDisplay.status}
                    />
                    <div className={styles.kurseTableSection}>
                        <PageTitle title={t("dashboard:organisation-admin.anlass-detail.kurse-table.title")} isSubTitle />
                        <AnlassKurseControlTable />
                    </div>
                </>
            ) : null}
        </>
    )
}
