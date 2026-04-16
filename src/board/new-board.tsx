import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Container, Paper, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/de-ch";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import commonStyles from "../common.module.scss";
import styles from "./new-board.module.scss";

export const NewBoard = () => {
  const { t } = useTranslation("dashboard");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [bemerkung, setBemerkung] = useState("");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return;
    setSelectedFileName(fileList[0].name);
  };

  return (
    <Container maxWidth="xl" className={commonStyles.pageContainer}>
      <Paper className={commonStyles.pagePaper}>
        <h2 className={commonStyles.pageTitle}>
          {t("dashboard:new-board.title")}
        </h2>

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de-ch">
          <Box className={styles.formSection}>
            <Box className={styles.formWrapper}>
              <Box className={styles.formColumn}>
                <TextField
                  label="Name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className={styles.fieldInput}
                  size="small"
                />
                <TextField
                  label="Bemerkung"
                  value={bemerkung}
                  onChange={(event) => setBemerkung(event.target.value)}
                  multiline
                  rows={3}
                  className={styles.fieldInput}
                  size="small"
                />
              </Box>

              <Box className={styles.formColumn}>
                <DatePicker
                  label="Start date"
                  value={startDate}
                  onChange={(date) => setStartDate(date ? dayjs(date) : null)}
                  slotProps={{
                    textField: { className: styles.dateInput, size: "small" },
                  }}
                />
                <DatePicker
                  label="End date"
                  value={endDate}
                  onChange={(date) => setEndDate(date ? dayjs(date) : null)}
                  slotProps={{
                    textField: { className: styles.dateInput, size: "small" },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </LocalizationProvider>

        <Box className={styles.uploadSection}>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={(event) => handleFiles(event.target.files)}
          />
          <Box
            className={`${styles.uploadDropzone} ${isDragging ? styles.uploadDropzoneActive : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              handleFiles(event.dataTransfer.files);
            }}
          >
            <div className={styles.emptyDropzone}>
              <FontAwesomeIcon
                icon={faUpload}
                size="lg"
                className={styles.uploadIcon}
              />
              <p className={styles.uploadHint}>
                {t("dashboard:new-board.upload.helpertext")}
              </p>
            </div>
          </Box>
          {selectedFileName && (
            <p className={styles.selectedFile}>
              {t("dashboard:new-board.upload.selected-file")}:{" "}
              {selectedFileName}
            </p>
          )}
        </Box>
      </Paper>
    </Container>
  );
};
