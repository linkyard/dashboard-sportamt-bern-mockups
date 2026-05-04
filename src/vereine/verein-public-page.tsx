import {useTranslation} from "react-i18next"
import {useParams} from "react-router"
import AnlaesseCardList from "../board/anlaesse"
import {ContactDetails} from "../board/components/contact-box"
import orgStyles from "../board/organisation-admin.module.scss"
import {PageTitle} from "../components/page-title"
import {getOrganisationForPublicVereinPage} from "../dashboard/dummyData"
import {GeneralInformationBanner} from "./general-information-banner/general-information-banner"

export const VereinPublicPage: React.FC = () => {
    const {organisationId} = useParams<{organisationId: string}>()
    const organisation = getOrganisationForPublicVereinPage(organisationId)
    const {t} = useTranslation("dashboard")

    if (!organisation) {
        return (
            <>
                <PageTitle title={t("verein-public.not-found-title")} />
                <p>{t("verein-public.not-found-body")}</p>
            </>
        )
    }

    const title = organisation.organisation || t("verein-public.fallback-title")

    return (
        <div className={orgStyles.orgAdminPage}>
            <div className={orgStyles.paperTop}>
                <PageTitle title={title} />
                <GeneralInformationBanner key={`general-info-${organisationId}`} />
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
                <AnlaesseCardList anlaesse={organisation.anlaesse} organisation={organisation} anlassDetailHref="verein-public" />
            </div>
        </div>
    )
}
