import {Box} from "@mui/material"
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs"
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider"
import "dayjs/locale/de-ch"
import {useTranslation} from "react-i18next"
import {Navigate, Outlet, Route, Routes} from "react-router"
import {AnlassDetail} from "../board/anlass-detail"
import {BoardDetail} from "../board/board-detail"
import {OrganisationAdminPage} from "../board/organisation-admin"
import {Dashboard} from "../dashboard/dashboard"
import {HolidayEditorPage} from "../stammdaten/ferien/holiday-editor-page"
import {StammdatenEditor} from "../stammdaten/stammdaten"
import {VereinEditorPage} from "../stammdaten/vereine/verein-editor-page"
import {PageLayout} from "./layout"

function NotFound() {
    const {t} = useTranslation("common")
    return (
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100%", py: 4}}>{t("routing.not-found")}</Box>
    )
}

export function AppRoot() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de-ch">
            <div className="root">
                <RouteIndex />
            </div>
        </LocalizationProvider>
    )
}

export function RouteIndex() {
    return (
        <Routes>
            <Route path="/" element={<PageLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="/stammdaten" element={<Outlet />}>
                    <Route index element={<Navigate to="/stammdaten/objekte" replace />} />
                    <Route path="vereine/:vereinId/edit" element={<VereinEditorPage />} />
                    <Route path="ferien-und-feiertage/holiday/:holidayId/edit" element={<HolidayEditorPage />} />
                    <Route path=":tabId" element={<StammdatenEditor />} />
                </Route>
                <Route path="/organisation-admin" element={<Navigate to="/" replace />} />
                <Route path="/organisation-admin/:organisationId/anlass/:anlassId" element={<AnlassDetail />} />
                <Route path="/organisation-admin/:organisationId" element={<OrganisationAdminPage />} />
                <Route path="/board" element={<BoardDetail />} />
                <Route path="/board/:boardId" element={<BoardDetail />} />
                <Route path="/*" element={<NotFound />} />
            </Route>
        </Routes>
    )
}
