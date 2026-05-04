import {useTranslation} from "react-i18next"
import {useParams} from "react-router"
import anlassDetailStyles from "../board/anlass-detail.module.scss"
import {resolveAnlassFromOrganisation} from "../board/organisation"
import {AppBreadcrumbs} from "../components/breadcrumbs"
import {PageTitle} from "../components/page-title"
import {SportIconBadge} from "../components/sport-icon-badge"
import {getOrganisationForPublicVereinPage} from "../dashboard/dummyData"

export const VereinPublicAnlassPage: React.FC = () => {
    const {organisationId, anlassId} = useParams<{organisationId: string; anlassId: string}>()
    const organisation = getOrganisationForPublicVereinPage(organisationId)
    const anlassClicked = organisation && anlassId ? organisation.anlaesse.find((a) => a.id === anlassId) : undefined
    const anlassInfo = anlassClicked ? resolveAnlassFromOrganisation(anlassClicked, organisation) : undefined
    const {t} = useTranslation("dashboard")

    const title = anlassInfo ? `${anlassInfo.name} - ${anlassInfo.location ?? "-"}` : t("verein-public.anlass.not-found-title")

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
                {anlassInfo ? <SportIconBadge icon={anlassInfo.sportIcon} className={anlassDetailStyles.topBarBadge} /> : null}
            </div>
            <PageTitle title={title} editable />
        </>
    )
}
