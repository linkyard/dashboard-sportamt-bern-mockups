import {Tab, Tabs} from "@mui/material"
import {useTranslation} from "react-i18next"
import {Navigate, useNavigate, useParams} from "react-router"
import {PageTitle} from "../../components/page-title"
import {stammdatenSeedLocations} from "../../dummyData"
import {FerienTable} from "./holiday/holiday.table"
import {LocationsTable} from "./location/location.table"
import styles from "./master-data.module.scss"
import {OrganisationenTable} from "./organisation/organisation.list"

type StammdatenTabId = "objects" | "organisations" | "holidays"

const STAMMDATEN_TAB_IDS: StammdatenTabId[] = ["objects", "organisations", "holidays"]

function tabIdToRouteSegment(tabId: StammdatenTabId): "objekte" | "organisationen" | "ferien" {
    if (tabId === "objects") return "objekte"
    if (tabId === "organisations") return "organisationen"
    return "ferien"
}

function routeSegmentToTabId(segment: string): StammdatenTabId | null {
    if (segment === "objekte") return "objects"
    if (segment === "organisationen") return "organisations"
    if (segment === "ferien") return "holidays"
    return null
}

export const StammdatenEditor = () => {
    const {t} = useTranslation("dashboard")
    const navigate = useNavigate()
    const {tabId: routeTabId} = useParams<{tabId: string}>()

    const activeTab = routeTabId ? routeSegmentToTabId(routeTabId) : null
    if (!activeTab) {
        return <Navigate to="/admin/stammdaten/objekte" replace />
    }

    return (
        <>
            <PageTitle title={t("dashboard:master-data.title")} />
            <Tabs
                value={activeTab}
                onChange={(_, newValue: StammdatenTabId) => navigate(`/admin/stammdaten/${tabIdToRouteSegment(newValue)}`)}
                aria-label={t("dashboard:master-data.tabs-aria-label")}
                className={styles.tabsRoot}
            >
                {STAMMDATEN_TAB_IDS.map((tabId) => (
                    <Tab
                        key={tabId}
                        value={tabId}
                        label={t(`dashboard:master-data.tabs.${tabId}`)}
                        id={`stammdaten-tab-${tabId}`}
                        aria-controls={`stammdaten-panel-${tabId}`}
                    />
                ))}
            </Tabs>
            {STAMMDATEN_TAB_IDS.map((tabId) => (
                <div
                    key={tabId}
                    id={`stammdaten-panel-${tabId}`}
                    role="tabpanel"
                    hidden={activeTab !== tabId}
                    aria-labelledby={`stammdaten-tab-${tabId}`}
                >
                    {tabId === "objects" ? (
                        <LocationsTable key="stammdaten-objects" initialLocations={stammdatenSeedLocations} />
                    ) : tabId === "organisations" ? (
                        <OrganisationenTable key="stammdaten-organisations" />
                    ) : tabId === "holidays" ? (
                        <FerienTable key="stammdaten-holidays" />
                    ) : null}
                </div>
            ))}
        </>
    )
}
