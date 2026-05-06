import {useTranslation} from "react-i18next"
import {useParams} from "react-router"
import orgStyles from "../admin/board/organisation-admin.module.scss"
import ReservationsCardList from "../admin/board/reservation.list"
import {ContactDetails} from "../components/contact-box"
import {PageTitle} from "../components/page-title"
import {getOrganisationForPublicPage} from "../dummyData"
import {ConfirmContactAddressBanner} from "./components/confirm-contact-address.banner"
import {GeneralInformationBanner} from "./components/general-information.banner"

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
                <PageTitle title={title} editable />
                <GeneralInformationBanner key={`general-info-${orgId}`} />
                <div className={orgStyles.contactGrid}>
                    <ContactDetails title={t("organisation-admin.contact-address-title")} contact={organisation.contact} />
                    <ContactDetails
                        title={t("organisation-admin.billing-address-title")}
                        contact={organisation.billingContact}
                        billingAddressMode
                    />
                </div>
                <ConfirmContactAddressBanner key={`confirm-address-${orgId}`} />
            </div>
            <div className={orgStyles.anlaesseSection}>
                <ReservationsCardList
                    reservations={organisation.reservations}
                    organisation={organisation}
                    reservationDetailHref="organisation-public"
                />
            </div>
        </div>
    )
}
