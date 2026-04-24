import {Container, Paper} from "@mui/material"
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs"
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider"
import "dayjs/locale/de-ch"
import commonStyles from "./common.module.scss"
import {TopBar} from "./dashboard/top-bar"
import {Router} from "./site/routes"

export default function MainView() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de-ch">
            <div className="root">
                <TopBar />
                <Container maxWidth="xl" className={commonStyles.pageContainer}>
                    <Paper className={commonStyles.pagePaper}>
                        <Router />
                    </Paper>
                </Container>
            </div>
        </LocalizationProvider>
    )
}
