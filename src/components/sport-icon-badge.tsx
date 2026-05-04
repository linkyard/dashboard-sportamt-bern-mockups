import type {IconProp} from "@fortawesome/fontawesome-svg-core"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import styles from "./sport-icon-badge.module.scss"

type SportIconBadgeProps = {
    icon: IconProp
}

export const SportIconBadge = ({icon}: SportIconBadgeProps) => {
    return (
        <span className={styles.badge} aria-hidden>
            <FontAwesomeIcon icon={icon} className={styles.icon} />
        </span>
    )
}
