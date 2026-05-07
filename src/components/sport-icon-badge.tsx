import type {IconProp} from "@fortawesome/fontawesome-svg-core"
import {faBasketball, faBicycle, faDumbbell, faFutbol, faTableTennisPaddleBall, faVolleyball} from "@fortawesome/free-solid-svg-icons"
import {
    faArrowArchery,
    faAward,
    faBadminton,
    faBaseballBall,
    faBaseballBatBall,
    faBasketballHoop,
    faBowArrow,
    faBoxingGlove,
    faBroomBall,
    faCourtSport,
    faCricket,
    faFootball,
    faFootballHelmet,
    faGolfBall,
    faGolfClub,
    faGolfFlagHole,
    faHandFist,
    faHockeyMask,
    faHockeyPuck,
    faHockeyStick,
    faIceSkate,
    faKettlebell,
    faLacrosseStickBall,
    faMedal,
    faPersonArmsRaised,
    faPersonBasketball,
    faPersonGolfing,
    faPersonLimbsWide,
    faPersonMeditating,
    faPersonRunning,
    faPersonRunningFast,
    faPersonSkating,
    faPersonSoccer,
    faPersonSwimming,
    faPersonSwimmingWater,
    faPickleball,
    faPool8Ball,
    faRacquet,
    faRugbyBall,
    faShirtJersey,
    faShirtRunning,
    faSword,
    faTennisBall,
    faUniformMartialArts,
} from "@fortawesome/pro-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import SearchIcon from "@mui/icons-material/Search"
import {IconButton, InputAdornment, Popover, TextField} from "@mui/material"
import {useMemo, useState} from "react"
import {useTranslation} from "react-i18next"
import styles from "./sport-icon-badge.module.scss"

type SportIconBadgeProps = {
    icon: IconProp
}

type SportIconOption = {
    icon: IconProp
    keywords: string[]
    section: string[]
}

export const SportIconBadge = ({icon}: SportIconBadgeProps) => {
    return (
        <span className={styles.badge} aria-hidden>
            <FontAwesomeIcon icon={icon} className={styles.icon} />
        </span>
    )
}

export const SportIconPicker = ({icon}: SportIconBadgeProps) => {
    const {t} = useTranslation(["common"])
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const [query, setQuery] = useState("")

    const onIconChange = (icon: IconProp) => {
        console.log("icon", icon)
    }

    const openPicker = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const closePicker = () => {
        setAnchorEl(null)
        setQuery("")
    }

    const handleIconClick = (icon: IconProp) => {
        setAnchorEl(null)
        onIconChange(icon)
    }

    const open = Boolean(anchorEl)
    const id = open ? "simple-popover" : undefined

    const filteredIcons = useMemo(() => {
        const search = query.trim().toLowerCase()
        if (!search) {
            return sportIcons
        }
        return sportIcons.filter(({keywords}) => keywords.some((keyword) => keyword.toLowerCase().includes(search)))
    }, [query])

    const groupedIcons = useMemo(() => {
        return filteredIcons.reduce<Record<string, SportIconOption[]>>((groups, option) => {
            const sections = option.section.length > 0 ? option.section : ["generic"]
            return sections.reduce<Record<string, SportIconOption[]>>((acc, sectionKey) => {
                acc[sectionKey] = acc[sectionKey] ? [...acc[sectionKey], option] : [option]
                return acc
            }, groups)
        }, {})
    }, [filteredIcons])

    const orderedSections = useMemo(() => {
        const sectionKeys = Array.from(new Set(sportIcons.flatMap((option) => (option.section.length > 0 ? option.section : ["generic"]))))
        const sorted = sectionKeys.sort((a, b) => {
            if (a === "generic") return -1
            if (b === "generic") return 1
            const labelA = t(`sport-icon-picker.sections.${a}`)
            const labelB = t(`sport-icon-picker.sections.${b}`)
            return labelA.localeCompare(labelB, "de")
        })
        return sorted.map((key) => ({
            key,
            label: t(`sport-icon-picker.sections.${key}`),
        }))
    }, [t])

    return (
        <>
            <button type="button" className={`${styles.badge} ${styles.pickerButton}`} onClick={openPicker} aria-label="Sportart auswählen">
                <FontAwesomeIcon icon={icon} className={styles.icon} />
            </button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={closePicker}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <div className={styles.popoverContent}>
                    <TextField
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={t("common:actions.search")}
                        aria-label={t("common:actions.search")}
                        size="small"
                        fullWidth
                        className={styles.searchInput}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" color="action" aria-hidden />
                                    </InputAdornment>
                                ),
                            },
                            htmlInput: {
                                style: {
                                    paddingTop: "4px",
                                    paddingBottom: "4px",
                                },
                            },
                        }}
                    />
                    {orderedSections.map(({key, label}) => {
                        const sectionIcons = groupedIcons[key] ?? []
                        if (sectionIcons.length === 0) return null

                        return (
                            <section key={key} className={styles.iconSection}>
                                <p className={styles.sectionTitle}>{label}</p>
                                <div className={styles.iconsContainer}>
                                    {sectionIcons.map(({icon: optionIcon, keywords}, index) => (
                                        <IconButton
                                            key={`${key}-${keywords[0]}-${index}`}
                                            size="small"
                                            className={styles.iconOption}
                                            aria-label={keywords[0]}
                                            onClick={() => handleIconClick(optionIcon)}
                                        >
                                            <FontAwesomeIcon icon={optionIcon} className={styles.icon} />
                                        </IconButton>
                                    ))}
                                </div>
                            </section>
                        )
                    })}
                    {filteredIcons.length === 0 ? <p className={styles.emptyState}>Keine Icons gefunden.</p> : null}
                </div>
            </Popover>
        </>
    )
}

const sportIcons: SportIconOption[] = [
    {
        icon: faFutbol,
        keywords: ["fussball", "soccer", "ball"],
        section: ["football"],
    },
    {
        icon: faBasketball,
        keywords: ["basketball", "ball"],
        section: ["basketball"],
    },
    {
        icon: faTennisBall,
        keywords: ["tennis", "ball"],
        section: ["tennis-and-racket-sports"],
    },
    {
        icon: faVolleyball,
        keywords: ["volleyball", "ball", "handball", "beachvolleyball"],
        section: ["volleyball"],
    },
    {
        icon: faTableTennisPaddleBall,
        keywords: ["tischtennis", "table tennis"],
        section: ["tennis-and-racket-sports"],
    },
    {
        icon: faRacquet,
        keywords: ["racquet", "racquetball", "tennis", "schläger", "schlaeger"],
        section: ["tennis-and-racket-sports"],
    },
    {
        icon: faFootball,
        keywords: ["american football", "ball"],
        section: ["american-football"],
    },
    {
        icon: faFootballHelmet,
        keywords: ["american football", "ball"],
        section: ["american-football"],
    },
    {
        icon: faCourtSport,
        keywords: ["american football", "spielfeld", "feld", "fussballfeld", "fussbal"],
        section: ["american-football", "football"],
    },
    {
        icon: faPersonSoccer,
        keywords: ["fussball", "soccer", "spieler"],
        section: ["football"],
    },
    {
        icon: faRugbyBall,
        keywords: ["rugby", "ball"],
        section: ["rugby"],
    },
    {
        icon: faBaseballBall,
        keywords: ["baseball", "ball", "softball"],
        section: ["baseball-and-softball"],
    },
    {
        icon: faBaseballBatBall,
        keywords: ["baseball", "ball", "softball"],
        section: ["baseball-and-softball"],
    },
    {
        icon: faBadminton,
        keywords: ["badminton", "schläger", "racquet", "schlaeger"],
        section: ["tennis-and-racket-sports"],
    },
    {
        icon: faBasketballHoop,
        keywords: ["basketball", "hoop", "basketballkorb", "korb"],
        section: ["basketball"],
    },
    {
        icon: faBicycle,
        keywords: ["fahrrad", "rad", "bike", "velo"],
        section: ["cycling"],
    },
    {
        icon: faBoxingGlove,
        keywords: ["boxen", "boxer"],
        section: ["combat-sports"],
    },
    {
        icon: faBroomBall,
        keywords: ["quidditch"],
        section: ["quidditch"],
    },
    {
        icon: faCricket,
        keywords: ["cricket", "ball"],
        section: ["cricket"],
    },
    {
        icon: faDumbbell,
        keywords: ["dumbbell", "gym", "fitness", "krafttraining"],
        section: ["fitness", "generic"],
    },
    {
        icon: faKettlebell,
        keywords: ["dumbbell", "gym", "fitness", "krafttraining"],
        section: ["fitness", "generic"],
    },
    {
        icon: faHockeyPuck,
        keywords: ["hockey", "ball"],
        section: ["hockey"],
    },
    {
        icon: faHockeyStick,
        keywords: ["hockey", "stick", "schläger", "hockeyschläger", "schlaeger"],
        section: ["hockey"],
    },
    {
        icon: faHockeyMask,
        keywords: ["hockey", "mask", "masken", "schutzmaske"],
        section: ["hockey"],
    },
    {
        icon: faGolfBall,
        keywords: ["golf", "ball"],
        section: ["golf"],
    },
    {
        icon: faGolfFlagHole,
        keywords: ["golf", "flag", "flagge", "flaggen", "ball"],
        section: ["golf"],
    },
    {
        icon: faPersonGolfing,
        keywords: ["golf", "spieler"],
        section: ["golf"],
    },
    {
        icon: faGolfClub,
        keywords: ["golf", "club", "golfclub", "golfschläger", "schläger", "schlaeger"],
        section: ["golf"],
    },
    {
        icon: faIceSkate,
        keywords: ["eislauf", "eislaufen"],
        section: ["skating"],
    },
    {
        icon: faPersonSkating,
        keywords: ["eislauf", "eislaufen", "spieler"],
        section: ["skating"],
    },
    {
        icon: faLacrosseStickBall,
        keywords: ["lacrosse", "stick", "schläger", "schlaeger"],
        section: ["lacrosse"],
    },
    {
        icon: faMedal,
        keywords: ["medaille"],
        section: ["generic"],
    },
    {
        icon: faAward,
        keywords: ["award", "preis"],
        section: ["generic"],
    },
    {
        icon: faPersonRunning,
        keywords: ["läufer", "laeufer"],
        section: ["running", "generic"],
    },
    {
        icon: faPersonBasketball,
        keywords: ["basketball", "spieler"],
        section: ["basketball"],
    },
    {
        icon: faPersonSwimming,
        keywords: ["schwimmen", "hallenbad", "schwimmbad", "wassersport"],
        section: ["water-sports"],
    },
    {
        icon: faPersonSwimmingWater,
        keywords: ["schwimmen", "hallenbad", "schwimmbad", "wassersport"],
        section: ["water-sports"],
    },
    {
        icon: faPickleball,
        keywords: ["pickleball", "ball"],
        section: ["tennis-and-racket-sports"],
    },
    {
        icon: faPool8Ball,
        keywords: ["pool", "billard"],
        section: ["generic"],
    },
    {
        icon: faShirtJersey,
        keywords: ["sport", "jersey"],
        section: ["generic"],
    },
    {
        icon: faSword,
        keywords: ["fechten"],
        section: ["combat-sports"],
    },
    {
        icon: faPersonMeditating,
        keywords: ["yoga", "meditation"],
        section: ["generic"],
    },
    {
        icon: faShirtRunning,
        keywords: ["laufen", "lauf"],
        section: ["running", "generic"],
    },
    {
        icon: faArrowArchery,
        keywords: ["schießen", "shiessen", "schuetzen", "pfeil", "pfeile"],
        section: ["archery"],
    },
    {
        icon: faBowArrow,
        keywords: ["schießen", "shiessen", "schuetzen", "pfeil", "pfeile", "bogen", "bow", "bogenschiessen"],
        section: ["archery"],
    },
    {
        icon: faUniformMartialArts,
        keywords: ["karate", "kung fu", "taikwondo", "judo", "jiu jitsu", "kampfsport"],
        section: ["combat-sports"],
    },
    {
        icon: faHandFist,
        keywords: ["karate", "kung fu", "taikwondo", "judo", "jiu jitsu", "kampfsport"],
        section: ["combat-sports"],
    },
    {
        icon: faPersonArmsRaised,
        keywords: ["sport", "fitness", "gym", "krafttraining", "pilates"],
        section: ["fitness", "generic", "volleyball"],
    },
    {
        icon: faPersonLimbsWide,
        keywords: ["sport", "fitness", "gym", "krafttraining", "pilates"],
        section: ["fitness", "generic"],
    },
    {
        icon: faPersonRunningFast,
        keywords: ["laufen", "lauf", "sprint", "sport"],
        section: ["running", "generic"],
    },
]
