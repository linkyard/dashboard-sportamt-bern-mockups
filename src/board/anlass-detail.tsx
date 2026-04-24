import {faCalendar} from "@fortawesome/free-regular-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {useTranslation} from "react-i18next"
import {AppBreadcrumbs} from "../components/breadcrumbs"
import {PageTitle} from "../components/page-title"
import styles from "./anlass-detail.module.scss"
import {AnlassHistoryLog} from "./components/anlass-history-log"
import {resolveAnlassFromOrganisation, type Anlass, type Organisation} from "./organisation"

interface AnlassDetailProps {
    anlass?: Anlass
    organisation?: Organisation
}

export const AnlassDetail: React.FC<AnlassDetailProps> = ({anlass, organisation}) => {
    const {t} = useTranslation("dashboard")
    const anlassForDisplay = anlass ? resolveAnlassFromOrganisation(anlass, organisation) : undefined

    const title = anlassForDisplay
        ? `${anlassForDisplay.name} - ${anlassForDisplay.location ?? "-"}`
        : t("dashboard:organisation-admin.anlass-detail.fallback-title")

    const periodLabel = anlassForDisplay ? (anlassForDisplay.period ?? anlassForDisplay.date ?? "—") : null

    return (
        <>
            <AppBreadcrumbs variant="anlass-detail" organisation={organisation} anlass={anlass} />
            <PageTitle title={title} />
            {periodLabel ? (
                <div className={styles.periodRow}>
                    <FontAwesomeIcon icon={faCalendar} className={styles.periodIcon} />
                    <span>{periodLabel}</span>
                </div>
            ) : null}
            {!anlassForDisplay ? <p>{t("dashboard:organisation-admin.anlass-detail.empty")}</p> : null}
            {anlassForDisplay ? (
                <AnlassHistoryLog
                    title={t("dashboard:organisation-admin.anlass-detail.history-title")}
                    emptyText={t("dashboard:organisation-admin.anlass-detail.history-empty")}
                    entries={anlassForDisplay.history ?? []}
                    status={anlassForDisplay.status}
                />
            ) : null}
        </>
    )
}
