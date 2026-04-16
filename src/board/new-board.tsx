import { Container, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import styles from "./dashboard/dashboard.module.scss";

export const NewBoard = () => {
  const { t } = useTranslation("dashboard");
  return (
    <Container maxWidth="xl" className={styles.pageContainer}>
      <Paper className={styles.pagePaper}>
        <Typography variant="h4" component="h1">
          {t("topbar.new-board")}
        </Typography>
      </Paper>
    </Container>
  );
};
