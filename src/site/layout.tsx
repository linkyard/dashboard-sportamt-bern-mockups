import {Container, Paper} from "@mui/material"
import {Outlet} from "react-router"

import commonStyles from "../common.module.scss"
import {TopBar} from "../dashboard/top-bar"

export function PageLayout() {
    return (
        <>
            <TopBar />
            <Container maxWidth="xl" className={commonStyles.pageContainer}>
                <Paper className={commonStyles.pagePaper}>
                    <Outlet />
                </Paper>
            </Container>
        </>
    )
}
