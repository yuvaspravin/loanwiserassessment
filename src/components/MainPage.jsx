/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Chip,
  Dialog,
  Divider,
  IconButton,
  Stack,
  styled,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import AddIcon from "@mui/icons-material/Add";
import DialogPage from "./DialogPage";
import { useDispatch } from "react-redux";

import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { useDropzone } from "react-dropzone";

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
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
const MainPage = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [documentOpen, setDocumentOpen] = useState(false);
  const [applicantName, setApplicantName] = useState(""); // Applicant name
  const [documentName, setDocumentName] = useState(""); // Document name
  const [documentFile, setDocumentFile] = useState(null); // Document file (for upload)
  const [errorName, setErrorName] = useState("");
  const [value, setValue] = useState(0);
  const [applicants, setApplicants] = useState([]);
  const [docButtonView, setDocButtonView] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [buttonClickList, setButtonClickList] = useState({});
  console.log(uploadComplete, "isUploaded");

  const addedDocumentName =
    buttonClickList && buttonClickList?.upload_document?.name;
  const addedDocumentFile =
    buttonClickList && buttonClickList?.upload_document?.size;
  console.log(addedDocumentName, "uploadedFiles");
  // Fetch data from localStorage
  useEffect(() => {
    const existingData =
      JSON.parse(localStorage.getItem("applicantName")) || [];
    setApplicants(existingData);
  }, []);
  useEffect(() => {
    if (Object.keys(buttonClickList).length === 0) {
      let data = applicants[docButtonView]?.documents[0];
      if (data) {
        setButtonClickList(data);
      }
    }
  }, [docButtonView, applicants]);

  const listview = applicants.map((e, index) => index == docButtonView);

  console.log(listview, "dbchbdhb");

  // Update state when adding a new applicant
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
    setApplicants(updatedApplicants); // Update state

    // Clear inputs
    setDocumentName("");
    setDocumentFile(null);
    setErrorName("");
    setDocumentOpen(false); // Close dialog
  };
  const handleUploadSubmit = (list) => {
    const updatedApplicants = [...applicants];

    // Find the applicant and their corresponding document
    const applicant = updatedApplicants[value];

    const documentIndex = applicant.documents.findIndex(
      (doc) => doc.documentName == list.documentName
    );

    // Check if the document name exists
    if (documentIndex !== -1) {
      console.log(updatedApplicants[value], "documentName");
      const file = uploadedFiles[0];
      const fileData = {
        name: file.name,
        size: (file.size / 1024).toFixed(2),
        type: file.type,
        lastModified: file.lastModified,
      };

      // Update the specific document's upload_document field
      applicant.documents[documentIndex].upload_document = fileData;

      setApplicants(updatedApplicants);
      localStorage.setItem("applicantName", JSON.stringify(updatedApplicants));
      setUploadComplete(true);

      // Clear inputs and close the dialog
    } else {
      // Handle case where document name doesn't match (optional)
      alert("Document name does not exist.");
    }
  };

  // Handle tab change
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Handle delete applicant
  const handleDelete = (index) => {
    const updatedData = applicants.filter((_, i) => i !== index);
    localStorage.setItem("applicantName", JSON.stringify(updatedData));
    setApplicants(updatedData);
  };

  // document view

  const documentView = (index, list) => {
    console.log(list, "dnjcdh");
    setDocButtonView(index);
    setButtonClickList(list);
  };

  const handleFileUpload = useCallback((files) => {
    console.log(files, "dfff");
    const fileArray = Array.from(files); // Convert FileList to an array

    // Append the new files to the existing files (if any) instead of replacing them
    setUploadedFiles((prevFiles) => [...prevFiles, ...fileArray]);

    // Set the upload state to true after files are added (you can change this logic based on your needs)
    setIsUploaded(true); // Change this to true after upload completion if you want

    console.log("Files uploaded:", fileArray);
  }, []);

  // Drag-and-drop handler
  const onDrop = useCallback((acceptedFiles) => {
    handleFileUpload(acceptedFiles);
  }, []);

  const resetDropzone = (list) => {
    setUploadedFiles([]);
    setUploadComplete(false);
    setIsUploaded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input
    }
    if (buttonClickList.upload_document?.length > 0) {
      const updatedApplicants = [...applicants];

      // Find the applicant and their corresponding document
      const applicant = updatedApplicants[value];
      console.log(list, "edbhhbe");

      const documentIndex = applicant.documents.findIndex(
        (doc) => doc.documentName == list.documentName
      );

      // Check if the document name exists
      if (documentIndex !== -1) {
        console.log(updatedApplicants[value], "documentName");

        const fileData = {};

        // Update the specific document's upload_document field
        applicant.documents[documentIndex].upload_document = fileData;

        setApplicants(updatedApplicants);
        localStorage.setItem(
          "applicantName",
          JSON.stringify(updatedApplicants)
        );
        setUploadComplete(true);

        // Clear inputs and close the dialog
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });

  const handleNext = () => {
    if (docButtonView < applicants[value]?.documents?.length - 1) {
      setDocButtonView((prevIndex) => prevIndex + 1);
    }
  };
  const handleBack = () => {
    if (docButtonView > 0) {
      setDocButtonView((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div style={{ marginTop: "50px" }}>
      <Stack spacing={5}>
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
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
        </Box>
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
                    {console.log(list, "testddd")}
                    <Typography>No documents available</Typography>
                  </Box>
                ) : (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                    }}
                  >
                    {console.log(list?.documents[value], "testddd")}
                    <Box sx={{ width: "20%" }}>
                      {list?.documents?.map((doc, idx) => (
                        <Button
                          key={index}
                          variant="contained"
                          sx={{
                            width: "200px",
                            backgroundColor:
                              docButtonView == idx ? "primary.main" : "#FFF",
                            color:
                              docButtonView == idx ? "#fff" : "primary.main",
                            borderWidth: docButtonView === idx ? "none" : "1px",
                            borderStyle:
                              docButtonView == idx ? "none" : "solid",
                            borderColor:
                              docButtonView == idx ? "none" : "primary.main",
                            margin: "20px auto",
                          }}
                          onClick={() => documentView(idx, doc)}
                        >
                          {doc?.documentName}
                        </Button>
                      ))}
                    </Box>
                    {docButtonView !== null &&
                      list?.documents[docButtonView] && (
                        <Box
                          sx={{
                            width: "80%",
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
                              <Button
                                variant="contained"
                                component="label"
                                startIcon={<AddIcon />}
                                sx={{ mr: 2 }}
                                disabled={uploadedFiles.length > 0}
                              >
                                Choose
                                <VisuallyHiddenInput
                                  type="file"
                                  hidden
                                  onChange={(event) =>
                                    handleFileUpload(event.target.files)
                                  }
                                  ref={fileInputRef}
                                />
                              </Button>
                              <Button
                                variant="contained"
                                component="label"
                                startIcon={<CloudUploadIcon />}
                                sx={{ mr: 2 }}
                                disabled={
                                  uploadedFiles.length == 0 || uploadComplete
                                }
                                onClick={() =>
                                  handleUploadSubmit(
                                    list?.documents[docButtonView]
                                  )
                                }
                              >
                                Upload
                              </Button>
                              <Button
                                variant="contained"
                                component="label"
                                startIcon={<CloseIcon />}
                                sx={{ mr: 2 }}
                                disabled={uploadedFiles.length == 0}
                                onClick={() =>
                                  resetDropzone(list?.documents[docButtonView])
                                }
                              >
                                Cancel
                              </Button>
                            </Box>
                          </Box>

                          <Box sx={{ margin: 2 }}>
                            <Box sx={{ width: "100%", margin: "0 auto" }}>
                              {(!isUploaded && uploadedFiles.length == 0) ||
                              list?.documents[value] == undefined ? (
                                <Box
                                  {...getRootProps()}
                                  elevation={3}
                                  sx={{
                                    cursor: "pointer",
                                    height: 100,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                  }}
                                >
                                  <input {...getInputProps()} />
                                  {isDragActive ? (
                                    <Typography variant="body1">
                                      Drop the files here...
                                    </Typography>
                                  ) : (
                                    <Typography variant="body1">
                                      Drag and drop files here
                                    </Typography>
                                  )}
                                </Box>
                              ) : (
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexDirection: "row",
                                  }}
                                >
                                  {list?.documents[value] !== undefined && (
                                    <Box>
                                      {uploadedFiles.length > 0 ? (
                                        <>
                                          {uploadedFiles.map((file, index) => (
                                            <Box
                                              key={index}
                                              sx={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                justifyContent: "flex-start",
                                                flexDirection: "column",
                                              }}
                                            >
                                              <Typography variant="body1">
                                                {file.name}
                                              </Typography>
                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  justifyContent:
                                                    "space-between",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <Typography
                                                  variant="body1"
                                                  color="text.secondary"
                                                >
                                                  {(file.size / 1024).toFixed(
                                                    2
                                                  )}{" "}
                                                  KB
                                                </Typography>
                                                <Chip
                                                  label={
                                                    uploadComplete
                                                      ? "Completed"
                                                      : "Pending"
                                                  }
                                                  sx={{
                                                    backgroundColor:
                                                      uploadComplete
                                                        ? "#22c55e"
                                                        : "#f97316",
                                                    color: "#fff",
                                                    ml: 2,
                                                  }}
                                                />
                                              </Box>
                                            </Box>
                                          ))}
                                        </>
                                      ) : (
                                        <Box>
                                          <Typography variant="body1">
                                            {addedDocumentName}
                                          </Typography>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                            }}
                                          >
                                            <Typography
                                              variant="body1"
                                              color="text.secondary"
                                            >
                                              {addedDocumentFile} KB
                                            </Typography>
                                            <Chip
                                              label="Completed"
                                              sx={{
                                                backgroundColor: "#22c55e",

                                                color: "#fff",
                                                ml: 2,
                                              }}
                                            />
                                          </Box>
                                        </Box>
                                      )}
                                    </Box>
                                  )}
                                  {list?.documents[value] !== undefined && (
                                    <IconButton
                                      onClick={() =>
                                        resetDropzone(
                                          list?.documents[docButtonView]
                                        )
                                      }
                                      sx={{ color: "#f97316" }}
                                    >
                                      <CloseIcon />
                                    </IconButton>
                                  )}
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      )}
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
        sx={{ "& .MuiDialog-paper": { width: "30%" } }}
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
        sx={{ "& .MuiDialog-paper": { width: "30%" } }}
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
