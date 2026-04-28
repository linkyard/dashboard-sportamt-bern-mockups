import {faCalendar, faClock} from "@fortawesome/free-regular-svg-icons"
import {faLocationDot} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import SearchIcon from "@mui/icons-material/Search"
import {TextField} from "@mui/material"
import {useMemo, useState} from "react"
import {useTranslation} from "react-i18next"
import {useNavigate} from "react-router"
import {PageTitle} from "../components/page-title"
import {SportIconBadge} from "../components/sport-icon-badge"
import styles from "./anlaesse.module.scss"
import {AnlassStatusPill} from "./components/anlass-status-pill"
import {type Anlass, type Organisation} from "./organisation"

interface AnlaesseCardListProps {
    anlaesse: Anlass[]
    organisation?: Organisation
}

export const AnlaesseCardList: React.FC<AnlaesseCardListProps> = ({anlaesse, organisation}) => {
    const {t} = useTranslation("dashboard")
    const [query, setQuery] = useState("")

    const filteredAnlaesse = useMemo(() => {
        const searchQuery = query.trim().toLowerCase()
        if (!searchQuery) return anlaesse

        return anlaesse.filter((anlass) => {
            const searchableText = [
                anlass.name,
                anlass.period ?? "",
                anlass.location ?? "",
                (anlass.times ?? []).join(" "),
                anlass.status ? t(`organisation-admin.anlaesse.status.${anlass.status}`) : "",
            ]
                .join(" ")
                .toLowerCase()

            return searchableText.includes(searchQuery)
        })
    }, [anlaesse, query, t])

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <div className={styles.headerTitle}>
                    <PageTitle title={t("organisation-admin.anlaesse.title")} isSubTitle hasInfoButton />
                </div>
                <TextField
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={t("common:actions.search")}
                    aria-label={t("common:actions.search")}
                    className={styles.searchInput}
                    size="small"
                    slotProps={{
                        input: {
                            startAdornment: <SearchIcon className={styles.searchIcon} />,
                        },
                    }}
                />
            </div>

            <div className={styles.cards}>
                {filteredAnlaesse.map((anlass) => (
                    <AnlaessCard key={anlass.id} anlass={anlass} organisation={organisation} />
                ))}
            </div>
        </div>
    )
}

export default AnlaesseCardList

interface AnlaessCardProps {
    anlass: Anlass
    organisation?: Organisation
}

const AnlaessCard: React.FC<AnlaessCardProps> = ({anlass, organisation}) => {
    const navigate = useNavigate()

    const openDetail = () => {
        if (!organisation?.id) return
        navigate(`/organisation-admin/${organisation.id}/anlass/${anlass.id}`)
    }

    return (
        <article
            className={styles.card}
            role="button"
            tabIndex={0}
            onClick={openDetail}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    openDetail()
                }
            }}
        >
            <SportIconBadge icon={anlass.sportIcon} className={styles.sportBadge} />

            <h3 className={styles.title}>{anlass.name}</h3>

            <div className={`${styles.infoRow} ${styles.periodRow}`}>
                <span className={styles.infoIconCell}>
                    <FontAwesomeIcon icon={faCalendar} className={styles.infoIcon} />
                </span>
                <span>{anlass.period ?? "-"}</span>
            </div>

            <div className={`${styles.infoRow} ${styles.locationRow}`}>
                <span className={styles.infoIconCell}>
                    <FontAwesomeIcon icon={faLocationDot} className={styles.infoIcon} />
                </span>
                <span>{anlass.location ?? "-"}</span>
            </div>

            <div className={styles.timesColumn}>
                {(anlass.times ?? []).map((time) => (
                    <div key={`${anlass.name}-${time}`} className={styles.infoRow}>
                        <span className={styles.infoIconCell}>
                            <FontAwesomeIcon icon={faClock} className={styles.infoIcon} />
                        </span>
                        <span>{time}</span>
                    </div>
                ))}
            </div>

            <div className={styles.statusCell}>
                <AnlassStatusPill status={anlass.status} />
            </div>
        </article>
    )
}
