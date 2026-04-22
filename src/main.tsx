import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs"
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider"
import "dayjs/locale/de-ch"
import {TopBar} from "./dashboard/top-bar"
import {Router} from "./site/routes"

export default function MainView() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de-ch">
            <div className="root">
                <TopBar />
                <Router />
            </div>
        </LocalizationProvider>
    )
}
