import { Container, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import commonStyles from "../common.module.scss";

export const BoardAdminPage = () => {
  const { t } = useTranslation("dashboard");
  return (
    <Container maxWidth="xl" className={commonStyles.pageContainer}>
      <Paper className={commonStyles.pagePaper}>
        <h2 className={commonStyles.pageTitle}>{t("dashboard:board-admin.title")}</h2>
      </Paper>
    </Container>
  );
};
