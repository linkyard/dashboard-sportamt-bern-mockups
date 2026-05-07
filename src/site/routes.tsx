import {Box} from "@mui/material"
import {ThemeProvider} from "@mui/material/styles"
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs"
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider"
import "dayjs/locale/de-ch"
import {useTranslation} from "react-i18next"
import {Navigate, Outlet, Route, Routes} from "react-router"
import {BoardDetail} from "../admin/board/board-detail"
import {OrganisationAdminPage} from "../admin/board/organisation.admin"
import {ReservationDetail} from "../admin/board/reservation/reservation-detail"
import {Dashboard} from "../admin/dashboard"
import {HolidayEditorPage} from "../admin/master-data/holiday/holiday-closures.editor"
import {StammdatenEditor} from "../admin/master-data/master-data"
import {OrganisationEditorPage} from "../admin/master-data/organisation/organisation.editor"
import {OrganisationPublicPage} from "../organisation/organisation-detail"
import {ReservationEditor} from "../organisation/reservation.editor"
import {appTheme} from "../theme/app-theme"
import {PageLayout} from "./layout"

function NotFound() {
    const {t} = useTranslation("common")
    return (
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100%", py: 4}}>{t("routing.not-found")}</Box>
    )
}

export function AppRoot() {
    return (
        <ThemeProvider theme={appTheme}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de-ch">
                <div className="root">
                    <RouteIndex />
                </div>
            </LocalizationProvider>
        </ThemeProvider>
    )
}

export function RouteIndex() {
    return (
        <Routes>
            <Route path="/" element={<PageLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="/admin/stammdaten" element={<Outlet />}>
                    <Route index element={<Navigate to="/admin/stammdaten/objekte" replace />} />
                    <Route path="organisationen/:orgId/edit" element={<OrganisationEditorPage />} />
                    <Route path="ferien/holiday/:holidayId/edit" element={<HolidayEditorPage />} />
                    <Route path=":tabId" element={<StammdatenEditor />} />
                </Route>
                <Route path="/organisationen/:orgId/anlass/:anlassId" element={<ReservationEditor />} />
                <Route path="/organisationen/:orgId" element={<OrganisationPublicPage />} />
                <Route path="/organisation-admin" element={<Navigate to="/" replace />} />
                <Route path="/organisation-admin/:orgId/anlass/:anlassId" element={<ReservationDetail />} />
                <Route path="/organisation-admin/:orgId" element={<OrganisationAdminPage />} />
                <Route path="/board" element={<BoardDetail />} />
                <Route path="/board/:boardId" element={<BoardDetail />} />
                <Route path="/*" element={<NotFound />} />
            </Route>
        </Routes>
    )
}
