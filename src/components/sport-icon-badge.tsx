import type {IconProp} from "@fortawesome/fontawesome-svg-core"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import styles from "./sport-icon-badge.module.scss"

type SportIconBadgeProps = {
    icon: IconProp
    className?: string
}

export const SportIconBadge = ({icon, className}: SportIconBadgeProps) => (
    <span className={[styles.badge, className].filter(Boolean).join(" ")} aria-hidden>
        <FontAwesomeIcon icon={icon} className={styles.icon} />
    </span>
)
