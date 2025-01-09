/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Chip,
  Dialog,
  Divider,
  Grid,
  IconButton,
  Slide,
  Stack,
  styled,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { forwardRef, useEffect, useRef, useState } from "react";

import PropTypes from "prop-types";

import { useDropzone } from "react-dropzone";

import DialogPage from "./DialogPage";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Transition_up = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const textFieldWidth = {
  xs: 12, // Full width on extra small screens
  sm: 6, // Full width on small screens
  md: 4, // Half width on medium screens
  lg: 4, // One-third width on large screens
  xl: 4, // One-fourth width on extra large screens
  margin: "8px", // One-fourth width on extra large screens
};
const MainPage = () => {
  const fileInputRef = useRef(null);
  const isMobileView = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [isOpen, setIsOpen] = useState(false);
  const [documentOpen, setDocumentOpen] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [errorName, setErrorName] = useState("");
  const [value, setValue] = useState(0);
  const [applicants, setApplicants] = useState([]);
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [documentUploads, setDocumentUploads] = useState({});

  // Load applicants and uploads from localStorage
  useEffect(() => {
    const storedApplicants =
      JSON.parse(localStorage.getItem("applicantName")) || [];
    const storedUploads =
      JSON.parse(localStorage.getItem("documentUploads")) || {};
    setApplicants(storedApplicants);
    setDocumentUploads(storedUploads);
  }, []);

  // Save uploads to localStorage on change
  useEffect(() => {
    localStorage.setItem("documentUploads", JSON.stringify(documentUploads));
    localStorage.setItem("applicantName", JSON.stringify(applicants));
  }, [documentUploads, applicants]);

  // Applicant submit
  const handleFormsubmit = () => {
    if (!applicantName) {
      setErrorName("Enter the applicant name");
    } else {
      const existingData =
        JSON.parse(localStorage.getItem("applicantName")) || [];
      const newApplicant = {
        id: Date.now(),
        name: applicantName,
        documents: [],
      };
      const updatedData = [...existingData, newApplicant];

      localStorage.setItem("applicantName", JSON.stringify(updatedData));
      setApplicants(updatedData);
      setApplicantName("");
      setErrorName("");
      setIsOpen(false);
    }
  };

  // Handle adding document
  const handleAddDocument = () => {
    if (!documentName) {
      setErrorName("Enter the document name");
      return;
    }

    const updatedApplicants = [...applicants];
    updatedApplicants[value].documents.push({
      documentName,
      upload_document: documentFile,
    });

    // Update localStorage
    localStorage.setItem("applicantName", JSON.stringify(updatedApplicants));
    setApplicants(updatedApplicants);
    setDocumentName("");
    setDocumentFile(null);
    setErrorName("");
    setDocumentOpen(false);
  };
  const handleUploadSubmit = () => {
    const applicantId = applicants[value].id;
    const docKey = `${applicantId}-${selectedDocIndex}`;

    setDocumentUploads((prev) => ({
      ...prev,
      [docKey]: { ...prev[docKey], isComplete: true },
    }));
  };
  // Handle tab change
  const handleChange = (event, newValue) => {
    console.log(newValue, "newValue");
    setValue(newValue);
    setSelectedDocIndex(0);
  };

  // Handle delete applicant
  const handleDelete = (index) => {
    const updatedData = applicants.filter((_, i) => i !== index);
    localStorage.setItem("applicantName", JSON.stringify(updatedData));
    setApplicants(updatedData);
  };

  const handleDocumentChange = (event, newIndex) => {
    console.log(newIndex, "hjggfff");

    setSelectedDocIndex(newIndex);
  };

  const handleFileUpload = (files) => {
    const file = files[0];
    const applicantId = applicants[value].id;
    const docKey = `${applicantId}-${selectedDocIndex}`;

    setDocumentUploads((prev) => ({
      ...prev,
      [docKey]: { file, isComplete: false },
    }));
  };

  const handleCancelUpload = () => {
    const applicantId = applicants[value].id;
    const docKey = `${applicantId}-${selectedDocIndex}`;

    setDocumentUploads((prev) => {
      const updatedUploads = { ...prev };
      delete updatedUploads[docKey];
      return updatedUploads;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    noClick: true,
  });

  const handleNext = () => {
    if (selectedDocIndex < selectedApplicant.documents.length - 1) {
      setSelectedDocIndex(selectedDocIndex + 1);
    } else if (value < applicants.length - 1) {
      setValue(value + 1);
      setSelectedDocIndex(0);
    }
  };

  const handleBack = () => {
    if (value > 0) {
      setValue(value - 1);
      setSelectedDocIndex(0);
    }
  };
  const selectedApplicant = applicants[value];
  const selectedDocKey = selectedApplicant?.id + "-" + selectedDocIndex;
  const uploadedFile = documentUploads[selectedDocKey];

  console.log(value, selectedApplicant, "selectedApplicant");

  return (
    <div style={{ margin: "50px 10px" }}>
      <Stack
        spacing={4}
        direction={isMobileView ? "column" : "row"}
        justifyContent="space-between"
        alignItems={isMobileView ? "stretch" : "center"}
        marginBottom={4}
      >
        <Typography variant="h4">Document Upload</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          style={{ padding: "10px" }}
          onClick={() => setIsOpen(true)}
        >
          Add Applicant
        </Button>
      </Stack>
      <Box>
        {applicants.length !== 0 && (
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="applicants tabs"
              >
                {applicants.map((list, index) => (
                  <Tab
                    key={index}
                    sx={{
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                    label={
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span>{list.name}</span>
                        <IconButton
                          aria-label={`delete ${list.name}`}
                          size="small"
                          onClick={() => handleDelete(index)}
                          style={{ marginLeft: 8 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </div>
                    }
                    {...a11yProps(index)}
                  />
                ))}
              </Tabs>
            </Box>
            {applicants?.map((list, index) => (
              <CustomTabPanel value={value} index={index} key={index}>
                {list?.documents?.length === 0 ? (
                  <Box>
                    {" "}
                    <Typography>No documents available</Typography>
                  </Box>
                ) : (
                  <Box>
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                        <Box>
                          <Grid container spacing={4}>
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                              <Box sx={{ display: "flex", width: "100%" }}>
                                {/* Document Tabs */}
                                {selectedApplicant && (
                                  <Tabs
                                    value={selectedDocIndex}
                                    onChange={handleDocumentChange}
                                    orientation="vertical"
                                  >
                                    {selectedApplicant.documents.map(
                                      (doc, index) => (
                                        <Tab
                                          key={index}
                                          label={doc.documentName}
                                        />
                                      )
                                    )}
                                  </Tabs>
                                )}
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
                        {/* Upload Section */}
                        {selectedApplicant &&
                          selectedApplicant.documents[selectedDocIndex] && (
                            <Box
                              sx={{
                                border: "1px solid #e6e8ec",
                                borderRadius: "10px",
                              }}
                            >
                              <Box sx={{ borderBottom: "3px solid #e6e8ec" }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    margin: 2,
                                  }}
                                >
                                  <Grid container spacing={4}>
                                    <Grid
                                      item
                                      xs={textFieldWidth.xs}
                                      sm={textFieldWidth.sm}
                                      md={textFieldWidth.md}
                                      lg={textFieldWidth.lg}
                                      xl={textFieldWidth.xl}
                                    >
                                      <Button
                                        variant="contained"
                                        component="label"
                                        startIcon={<AddIcon />}
                                        disabled={!!uploadedFile}
                                      >
                                        Choose
                                        <input
                                          type="file"
                                          hidden
                                          ref={fileInputRef}
                                          onChange={(e) =>
                                            handleFileUpload(e.target.files)
                                          }
                                        />
                                      </Button>
                                    </Grid>
                                    <Grid
                                      item
                                      xs={textFieldWidth.xs}
                                      sm={textFieldWidth.sm}
                                      md={textFieldWidth.md}
                                      lg={textFieldWidth.lg}
                                      xl={textFieldWidth.xl}
                                    >
                                      <Button
                                        variant="contained"
                                        startIcon={<CloudUploadIcon />}
                                        disabled={
                                          !uploadedFile ||
                                          uploadedFile.isComplete
                                        }
                                        onClick={handleUploadSubmit}
                                      >
                                        Upload
                                      </Button>
                                    </Grid>
                                    <Grid
                                      item
                                      xs={textFieldWidth.xs}
                                      sm={textFieldWidth.sm}
                                      md={textFieldWidth.md}
                                      lg={textFieldWidth.lg}
                                      xl={textFieldWidth.xl}
                                    >
                                      <Button
                                        variant="contained"
                                        startIcon={<CloseIcon />}
                                        onClick={handleCancelUpload}
                                      >
                                        Cancel
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </Box>
                              </Box>
                              <Box sx={{ margin: 2 }}>
                                {uploadedFile && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Box>
                                      <Typography>
                                        {uploadedFile.file.name
                                          ? uploadedFile.file.name
                                          : "No data "}
                                      </Typography>
                                      <Typography>
                                        {(
                                          uploadedFile.file.size / 1024
                                        ).toFixed(2)}{" "}
                                        KB
                                      </Typography>
                                      <Chip
                                        label={
                                          uploadedFile.isComplete
                                            ? "Completed"
                                            : "Pending"
                                        }
                                        sx={{
                                          backgroundColor:
                                            uploadedFile.isComplete
                                              ? "#22c55e"
                                              : "#f97316",
                                          color: "#fff",
                                        }}
                                      />
                                    </Box>
                                    <Box>
                                      <IconButton
                                        onClick={handleCancelUpload}
                                        sx={{ color: "#f97316" }}
                                      >
                                        <CloseIcon />
                                      </IconButton>
                                    </Box>
                                  </Box>
                                )}
                                {!uploadedFile && (
                                  <Box
                                    {...getRootProps()}
                                    sx={{
                                      cursor: "pointer",
                                      height: 100,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "flex-start",
                                    }}
                                  >
                                    <input {...getInputProps()} />
                                    <Typography>
                                      {isDragActive
                                        ? "Drop files here..."
                                        : "Drag and drop files here"}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          )}
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </CustomTabPanel>
            ))}
          </Box>
        )}
        {applicants?.length !== 0 && (
          <Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              style={{ padding: "10px" }}
              onClick={() => setDocumentOpen(true)}
            >
              Add Document
            </Button>
          </Box>
        )}
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Button
          variant="outlined"
          style={{ padding: "10px" }}
          onClick={() => handleBack()}
        >
          Back
        </Button>
        <Button
          variant="contained"
          style={{ padding: "10px" }}
          onClick={() => handleNext()}
        >
          Next
        </Button>
      </Box>

      {/* Add Applicant Dialog */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        TransitionComponent={Transition_up}
        maxWidth={"lg"}
      >
        <DialogPage
          title="Add Applicant"
          label="Applicant Name"
          handleClose={() => setIsOpen(false)}
          setName={setApplicantName}
          name={applicantName}
          handleFormsubmit={handleFormsubmit}
          errorName={errorName}
        />
      </Dialog>

      {/* Add Document Dialog */}
      <Dialog
        open={documentOpen}
        onClose={() => setDocumentOpen(false)}
        TransitionComponent={Transition_up}
        maxWidth={"lg"}
      >
        <DialogPage
          title="Add Document"
          label="Document Name"
          handleClose={() => setDocumentOpen(false)}
          setName={setDocumentName}
          name={documentName}
          handleFormsubmit={handleAddDocument}
          errorName={errorName}
        />
      </Dialog>
    </div>
  );
};

export default MainPage;
