import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import VerifiedIcon from "@mui/icons-material/Verified";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Link,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  updatePropertyIdentificationDocumentInDB,
  updatePropertyOwnershipDocumentInDB,
} from "../../database/details";
import {
  deletePropertyImageFromDB,
  uploadIdentification,
  uploadRatesNotice,
} from "../../database/files";
import useRealtyStore from "../../store/store";

export default function Ownership() {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const propertyId = id ?? "";

  const {
    propertyDetails,
    updatePropertyDetail,
    updateOwnershipDocument,
    updateIdentificationDocument,
  } = useRealtyStore();

  const propertyDetail = propertyDetails.find(
    (p) => p.property_id === propertyId
  );

  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadType, setUploadType] = useState<"rates" | "id" | "">("");
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getFilenameFromUrl = (url: string | null): string => {
    if (!url) return "";
    try {
      const urlParts = url.split("/");
      const filenameWithId = urlParts[urlParts.length - 1];

      const parts = filenameWithId.split("-");
      if (parts.length > 1) {
        return parts.slice(1).join("-");
      }
      return filenameWithId;
    } catch (error) {
      console.error("Error parsing filename from URL:", error);
      return "Document";
    }
  };

  const validateFile = (file: File): boolean => {
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMessage("File is too large. Maximum size is 10MB.");
      return false;
    }

    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setErrorMessage(
        "Invalid file type. Please upload a PDF, JPEG, or PNG file."
      );
      return false;
    }

    return true;
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "rates" | "id"
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !propertyId) return;

    if (propertyDetail.ownership_verified) {
      setErrorMessage("Your documents have already been verified. Please contact support if you need to update them.");
      return;
    }

    const file = files[0];

    if (!validateFile(file)) {
      return;
    }

    setIsUploading(true);
    setUploadType(type);
    setErrorMessage("");

    try {
      let fileUrl: string | null = null;

      if (type === "rates") {
        fileUrl = await uploadRatesNotice(propertyId, file);
        if (fileUrl) {
          const updatedDetail = await updatePropertyOwnershipDocumentInDB(
            propertyId,
            fileUrl
          );
          if (updatedDetail) {
            updateOwnershipDocument(propertyId, fileUrl);
          }
        }
      } else {
        fileUrl = await uploadIdentification(propertyId, file);
        if (fileUrl) {
          const updatedDetail = await updatePropertyIdentificationDocumentInDB(
            propertyId,
            fileUrl
          );
          if (updatedDetail) {
            updateIdentificationDocument(propertyId, fileUrl);
          }
        }
      }

      if (!fileUrl) {
        setErrorMessage("Failed to upload the file. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
    } finally {
      setIsUploading(false);
      setUploadType("");
    }
  };

  const handleDeleteFile = async (
    fileUrl: string | null,
    type: "rates" | "id"
  ) => {
    if (!propertyId || !fileUrl) return;
    
    if (propertyDetail.ownership_verified) {
      setErrorMessage("Verified documents cannot be deleted. Please contact support if you need to make changes.");
      return;
    }

    setIsDeleting(true);
    setUploadType(type);
    setErrorMessage("");

    try {
      const success = await deletePropertyImageFromDB(fileUrl);

      if (success) {
        if (type === "rates") {
          const updatedDetail = await updatePropertyOwnershipDocumentInDB(
            propertyId,
            null
          );
          if (updatedDetail) {
            updateOwnershipDocument(propertyId, null);
          }
        } else {
          const updatedDetail = await updatePropertyIdentificationDocumentInDB(
            propertyId,
            null
          );
          if (updatedDetail) {
            updateIdentificationDocument(propertyId, null);
          }
        }
      } else {
        setErrorMessage("Failed to delete the file. Please try again.");
      }
    } catch (error) {
      console.error(
        `Error deleting ${type === "rates" ? "rates notice" : "identification"}:`,
        error
      );
      setErrorMessage("An unexpected error occurred while deleting the file.");
    } finally {
      setIsDeleting(false);
      setUploadType("");
    }
  };

  if (!propertyDetail)
    return <Typography>No property details found.</Typography>;
    
  const isVerified = propertyDetail.ownership_verified || false;

  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Ownership Verification
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {isVerified ? (
        <Alert severity="success" sx={{ mb: 4 }}>
          <Typography variant="body1" sx={{ fontWeight: "medium" }}>
            Your ownership documents have been verified!
          </Typography>
          <Typography variant="body2">
            Your property is now eligible for publishing. Verified documents cannot be changed without contacting support.
          </Typography>
        </Alert>
      ) : (
        <Typography sx={{ mb: 4 }}>
          Ownership verification is required before we can send your property ad
          live. To ensure there are no delays, provide this now if you can. If you
          don't have this on hand, feel free to continue for now and supply this
          later.
        </Typography>
      )}

      <Card sx={{ mb: 4, border: `1px solid ${theme.palette.divider}` }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Rates Notice
          </Typography>

          <Typography sx={{ mb: 3 }}>
            Please upload a recent rates notice to verify your ownership of the
            property you're listing and its legal address.
          </Typography>

          {propertyDetail.ownership_document ? (
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <InsertDriveFileIcon sx={{ mr: 1 }} />
              <Typography sx={{ flexGrow: 1 }}>
                <Link
                  href={propertyDetail.ownership_document}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {getFilenameFromUrl(propertyDetail.ownership_document) ||
                    "Rates notice document"}
                </Link>
                {propertyDetail.ownership_verified && (
                  <Tooltip title="This document has been verified by our team">
                    <Chip
                      icon={<VerifiedIcon />}
                      label="Verified"
                      size="small"
                      color="success"
                      sx={{ ml: 2 }}
                    />
                  </Tooltip>
                )}
              </Typography>
              {!propertyDetail.ownership_verified ? (
                <Button
                  startIcon={<DeleteIcon />}
                  color="error"
                  variant="outlined"
                  size="small"
                  disabled={isDeleting}
                  onClick={() =>
                    handleDeleteFile(propertyDetail.ownership_document, "rates")
                  }
                >
                  {isDeleting && uploadType === "rates" ? (
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                  ) : null}
                  Delete
                </Button>
              ) : (
                <Tooltip title="Verified documents cannot be deleted. Please contact support if you need to update this document.">
                  <span>
                    <Button
                      startIcon={<DeleteIcon />}
                      color="error"
                      variant="outlined"
                      size="small"
                      disabled={true}
                    >
                      Delete
                    </Button>
                  </span>
                </Tooltip>
              )}
            </Box>
          ) : (
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                border: `1px dashed ${theme.palette.divider}`,
                borderRadius: 2,
              }}
            >
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload(e, "rates")}
                style={{ display: "none" }}
                id="rates-notice-upload"
                disabled={isUploading}
              />
              <label htmlFor="rates-notice-upload">
                <Button
                  variant="contained"
                  component="span"
                  disabled={isUploading || isVerified}
                  startIcon={<CloudUploadIcon />}
                >
                  {isUploading && uploadType === "rates" ? (
                    <>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      Uploading...
                    </>
                  ) : (
                    "Upload Rates Notice"
                  )}
                </Button>
              </label>
              <Typography
                variant="body2"
                sx={{ mt: 2, color: "text.secondary" }}
              >
                Accepted formats: PDF, JPEG, PNG (Max 10MB)
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Button
                color="primary"
                variant="text"
                onClick={() => setContactDialogOpen(true)}
                startIcon={<ContactMailIcon />}
                disabled={isVerified}
              >
                I don't have a rates notice
              </Button>
              {isVerified && (
                <Typography 
                  variant="body2" 
                  sx={{ mt: 2, color: "text.secondary", fontStyle: "italic" }}
                >
                  Your documents have been verified. Upload options are disabled.
                </Typography>
              )}
            </Paper>
          )}
        </CardContent>
      </Card>

      <Card sx={{ mb: 4, border: `1px solid ${theme.palette.divider}` }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Photo Identification
          </Typography>

          <Typography sx={{ mb: 3 }}>
            Please upload a valid government-issued photo ID such as a driver's
            license or passport. This helps us verify your identity.
          </Typography>

          {propertyDetail.identification_document ? (
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <InsertDriveFileIcon sx={{ mr: 1 }} />
              <Typography sx={{ flexGrow: 1 }}>
                <Link
                  href={propertyDetail.identification_document}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {getFilenameFromUrl(propertyDetail.identification_document) ||
                    "Identification document"}
                </Link>
                {propertyDetail.ownership_verified && (
                  <Tooltip title="This document has been verified by our team">
                    <Chip
                      icon={<VerifiedIcon />}
                      label="Verified"
                      size="small"
                      color="success"
                      sx={{ ml: 2 }}
                    />
                  </Tooltip>
                )}
              </Typography>
              {!propertyDetail.ownership_verified ? (
                <Button
                  startIcon={<DeleteIcon />}
                  color="error"
                  variant="outlined"
                  size="small"
                  disabled={isDeleting}
                  onClick={() =>
                    handleDeleteFile(propertyDetail.identification_document, "id")
                  }
                >
                  {isDeleting && uploadType === "id" ? (
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                  ) : null}
                  Delete
                </Button>
              ) : (
                <Tooltip title="Verified documents cannot be deleted. Please contact support if you need to update this document.">
                  <span>
                    <Button
                      startIcon={<DeleteIcon />}
                      color="error"
                      variant="outlined"
                      size="small"
                      disabled={true}
                    >
                      Delete
                    </Button>
                  </span>
                </Tooltip>
              )}
            </Box>
          ) : (
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                border: `1px dashed ${theme.palette.divider}`,
                borderRadius: 2,
              }}
            >
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload(e, "id")}
                style={{ display: "none" }}
                id="id-document-upload"
                disabled={isUploading}
              />
              <label htmlFor="id-document-upload">
                <Button
                  variant="contained"
                  component="span"
                  disabled={isUploading || isVerified}
                  startIcon={<CloudUploadIcon />}
                >
                  {isUploading && uploadType === "id" ? (
                    <>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      Uploading...
                    </>
                  ) : (
                    "Upload Photo ID"
                  )}
                </Button>
              </label>
              <Typography
                variant="body2"
                sx={{ mt: 2, color: "text.secondary" }}
              >
                Accepted formats: PDF, JPEG, PNG (Max 10MB)
              </Typography>
              {isVerified && (
                <Typography 
                  variant="body2" 
                  sx={{ mt: 2, color: "text.secondary", fontStyle: "italic" }}
                >
                  Your documents have been verified. Upload options are disabled.
                </Typography>
              )}
            </Paper>
          )}
        </CardContent>
      </Card>

      <Card
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(0, 0, 0, 0.02)",
        }}
      >
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
            What happens next?
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Once you submit your verification documents:
          </Typography>
          <Stack spacing={1}>
            <Typography component="li" sx={{ display: "list-item", ml: 3 }}>
              Our team will review your documents typically within 1 business
              day
            </Typography>
            <Typography component="li" sx={{ display: "list-item", ml: 3 }}>
              You'll receive an email notification when verification is complete
            </Typography>
            <Typography component="li" sx={{ display: "list-item", ml: 3 }}>
              If there are any issues, we'll contact you for additional
              information
            </Typography>
          </Stack>
          <Typography sx={{ mt: 2, fontStyle: "italic" }}>
            Note: Your documents are stored securely and will never be shared
            with third parties.
          </Typography>
        </CardContent>
      </Card>

      <Dialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        aria-labelledby="contact-dialog-title"
      >
        <DialogTitle id="contact-dialog-title">
          Contact Support for Assistance
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            If you don't have a rates notice, you can provide alternative
            documentation to verify ownership.
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Please contact our support team at{" "}
            <Link href="mailto:admin@realtydirect.com.au">
              admin@realtydirect.com.au
            </Link>{" "}
            or call us at <strong>+61 406 371 630</strong> to discuss
            alternative options.
          </Typography>
          <Typography>
            Our team will work with you to find a suitable alternative for
            verification.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {(isUploading || isDeleting) && (
        <LoadingSpinner
          fullPage
          text={`${isUploading ? "Uploading" : "Deleting"} ${
            uploadType === "rates" ? "rates notice" : "identification document"
          }...`}
          transparent
        />
      )}
    </Box>
  );
}