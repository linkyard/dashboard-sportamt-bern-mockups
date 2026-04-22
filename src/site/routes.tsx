import {Route, Routes, useLocation} from "react-router"
import {BoardAdminPage} from "../board/board-admin"
import {NewBoard} from "../board/new-board"
import type {Organisation} from "../board/organisation"
import {OrganisationAdminPage} from "../board/organisation-admin"
import {Dashboard} from "../dashboard/dashboard"

const OrganisationAdminRoute = () => {
    const location = useLocation()
    const organisation = (location.state as {organisation?: Organisation} | null)?.organisation

    return <OrganisationAdminPage organisation={organisation} />
}

export function Router() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/board-admin" element={<BoardAdminPage />} />
            <Route path="/organisation-admin" element={<OrganisationAdminRoute />} />
            <Route path="/new-board" element={<NewBoard />} />
        </Routes>
    )
}
