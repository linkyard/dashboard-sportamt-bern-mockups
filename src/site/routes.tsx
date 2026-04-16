import { Route, Routes } from "react-router";
import { BoardAdminPage } from "../board/board-admin";
import { NewBoard } from "../board/new-board";
import { Dashboard } from "../dashboard/dashboard";

export function RouteIndex() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/board-admin" element={<BoardAdminPage />} />
      <Route path="/new-board" element={<NewBoard />} />
    </Routes>
  );
}
