import {useTranslation} from "react-i18next"
import {useParams} from "react-router"
import AnlaesseCardList from "../board/anlaesse"
import {ContactDetails} from "../board/components/contact-box"
import orgStyles from "../board/organisation-admin.module.scss"
import {PageTitle} from "../components/page-title"
import {getOrganisationForPublicPage} from "../dummyData"
import {GeneralInformationBanner} from "./general-information-banner/general-information-banner"

export const OrganisationPublicPage: React.FC = () => {
    const {orgId} = useParams<{orgId: string}>()
    const organisation = getOrganisationForPublicPage(orgId)
    const {t} = useTranslation("dashboard")

    if (!organisation) {
        return (
            <>
                <PageTitle title={t("organisation-public.not-found-title")} />
                <p>{t("organisation-public.not-found-body")}</p>
            </>
        )
    }

    const title = organisation.organisation || t("organisation-public.fallback-title")

    return (
        <div className={orgStyles.orgAdminPage}>
            <div className={orgStyles.paperTop}>
                <PageTitle title={title} />
                <GeneralInformationBanner key={`general-info-${orgId}`} />
                <div className={orgStyles.contactGrid}>
                    <ContactDetails title={t("organisation-admin.contact-address-title")} contact={organisation.contact} />
                    <ContactDetails
                        title={t("organisation-admin.billing-address-title")}
                        contact={organisation.billingContact}
                        billingAddressMode
                    />
                </div>
            </div>
            <div className={orgStyles.anlaesseSection}>
                <AnlaesseCardList anlaesse={organisation.anlaesse} organisation={organisation} anlassDetailHref="organisation-public" />
            </div>
        </div>
    )
}
