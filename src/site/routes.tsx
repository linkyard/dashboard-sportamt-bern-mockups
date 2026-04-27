import {Navigate, Route, Routes, useParams} from "react-router"
import {AnlassDetail} from "../board/anlass-detail"
import {BoardDetail} from "../board/board-detail"
import {OrganisationAdminPage} from "../board/organisation-admin"
import {Dashboard} from "../dashboard/dashboard"
import {getBoardById, getOrganisationById} from "../dashboard/dummyData"
import {StammdatenEditor} from "../stammdaten/stammdaten"

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

const BoardDetailRoute = () => {
    const {boardId} = useParams<{boardId: string}>()
    const board = boardId ? getBoardById(boardId) : undefined

    if (boardId && !board) {
        return <Navigate to="/" replace />
    }

    return <BoardDetail key={board?.id ?? "new"} board={board} isNew={!boardId} />
}

export function Router() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stammdaten" element={<Navigate to="/stammdaten/objekte" replace />} />
            <Route path="/stammdaten/:tabId" element={<StammdatenEditor />} />
            <Route path="/organisation-admin" element={<Navigate to="/" replace />} />
            <Route path="/organisation-admin/:organisationId/anlass/:anlassId" element={<AnlassDetailRoute />} />
            <Route path="/organisation-admin/:organisationId" element={<OrganisationAdminRoute />} />
            <Route path="/board" element={<BoardDetailRoute />} />
            <Route path="/board/:boardId" element={<BoardDetailRoute />} />
        </Routes>
    )
}
