import {Chip} from "@mui/material"
import {useTranslation} from "react-i18next"
import {useLocation} from "react-router"
import {PageTitle} from "../components/page-title"
import {type Board} from "../dashboard/dummyData"
import {formatDateSwiss} from "../util/date"
import styles from "./stammdaten.module.scss"

export const StammdatenEditor = () => {
    const {t} = useTranslation("dashboard")
    const location = useLocation()
    const state = location.state as {board?: Board} | null
    const board = state?.board

    return (
        <>
            <PageTitle title={t("dashboard:stammdaten.title")} />
                {board ? (
                    <div className={styles.detailsGrid}>
                        <p>
                            <strong>{t("dashboard:stammdaten.fields.name")}:</strong> {board.name}
                        </p>
                        <p>
                            <strong>{t("dashboard:stammdaten.fields.bemerkung")}:</strong> {board.bemerkung}
                        </p>
                        <p>
                            <strong>{t("dashboard:stammdaten.fields.start-date")}:</strong> {formatDateSwiss(board.startDate)}
                        </p>
                        <p>
                            <strong>{t("dashboard:stammdaten.fields.end-date")}:</strong> {formatDateSwiss(board.endDate)}
                        </p>
                        <div className={styles.labelsRow}>
                            {board.labels.map((label) => (
                                <Chip key={label} label={label} size="small" />
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>{t("dashboard:stammdaten.empty")}</p>
                )}
        </>
    )
}
