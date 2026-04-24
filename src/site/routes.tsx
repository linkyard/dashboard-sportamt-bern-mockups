import {Navigate, Route, Routes, useParams} from "react-router"
import {AnlassDetail} from "../board/anlass-detail"
import {NewBoard} from "../board/new-board"
import {OrganisationAdminPage} from "../board/organisation-admin"
import {BoardAdminPage} from "../board/stammdaten"
import {Dashboard} from "../dashboard/dashboard"
import {getOrganisationById} from "../dashboard/dummyData"

const OrganisationAdminRoute = () => {
    const {organisationId} = useParams<{organisationId: string}>()
    const organisation = organisationId ? getOrganisationById(organisationId) : undefined

    return <OrganisationAdminPage organisation={organisation} />
}

const AnlassDetailRoute = () => {
    const {organisationId, anlassId} = useParams<{organisationId: string; anlassId: string}>()
    const organisation = organisationId ? getOrganisationById(organisationId) : undefined
    const anlass = organisation && anlassId ? organisation.anlaesse.find((a) => a.id === anlassId) : undefined

    return <AnlassDetail anlass={anlass} organisation={organisation} />
}

export function Router() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stammdaten" element={<BoardAdminPage />} />
            <Route path="/organisation-admin" element={<Navigate to="/" replace />} />
            <Route path="/organisation-admin/:organisationId/anlass/:anlassId" element={<AnlassDetailRoute />} />
            <Route path="/organisation-admin/:organisationId" element={<OrganisationAdminRoute />} />
            <Route path="/new-board" element={<NewBoard />} />
        </Routes>
    )
}
