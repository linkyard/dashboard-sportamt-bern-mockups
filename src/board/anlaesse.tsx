import {useTranslation} from "react-i18next"
import {PageTitle} from "../components/page-title"

interface AnlaesseCardListProps {}

export const AnlaesseCardList: React.FC<AnlaesseCardListProps> = ({}) => {
    const {t} = useTranslation("dashboard")

    return (
        <div>
            <PageTitle title={t("dashboard:new-board.anlaesse.title")} isSubTitle hasInfoButton />
        </div>
    )
}

export default AnlaesseCardList
