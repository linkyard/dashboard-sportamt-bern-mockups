import {createBrowserRouter} from "react-router"

import {AppRoot} from "./routes"

export const router = createBrowserRouter([{path: "*", element: <AppRoot />}])
