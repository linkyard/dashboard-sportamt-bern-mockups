import type {IconProp} from "@fortawesome/fontawesome-svg-core"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {SHOW_SPORT_ICONS} from "../config/show-sport-icons"
import styles from "./sport-icon-badge.module.scss"

type SportIconBadgeProps = {
    icon: IconProp
    className?: string
}

export const SportIconBadge = ({icon, className}: SportIconBadgeProps) => {
    if (!SHOW_SPORT_ICONS) return null
    return (
        <span className={[styles.badge, className].filter(Boolean).join(" ")} aria-hidden>
            <FontAwesomeIcon icon={icon} className={styles.icon} />
        </span>
    )
}
