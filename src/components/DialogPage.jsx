/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import React from "react";

const DialogPage = ({
  title,
  label,
  handleClose,
  setName,
  name,
  handleFormsubmit,
  errorName,
}) => {
  return (
    <div>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="p" sx={{ fontWeight: "bold", fontSize: "18px" }}>
          {title}
        </Typography>
        <IconButton onClick={handleClose} color="primary">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ margin: "20px" }}>
        <DialogContentText>{label}</DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          name="Name"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!errorName}
          helperText={errorName}
        />
      </DialogContent>
      <DialogActions sx={{ margin: "20px" }}>
        <Button
          variant="contained"
          startIcon={<DoneIcon />}
          onClick={handleFormsubmit}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          onClick={handleClose}
          startIcon={<CloseIcon />}
        >
          Cancel
        </Button>
      </DialogActions>
    </div>
  );
};

export default DialogPage;
