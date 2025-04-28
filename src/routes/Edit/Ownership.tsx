import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
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

  // Get filenames from URLs for display
  const getFilenameFromUrl = (url: string | null): string => {
    if (!url) return "";
    try {
      // Extract the filename from the URL path
      const urlParts = url.split("/");
      const filenameWithId = urlParts[urlParts.length - 1];

      // Extract just the filename portion after the UUID
      const parts = filenameWithId.split("-");
      if (parts.length > 1) {
        // Return everything after the first dash
        return parts.slice(1).join("-");
      }
      return filenameWithId;
    } catch (error) {
      console.error("Error parsing filename from URL:", error);
      return "Document";
    }
  };

  // Check file size and type before upload
  const validateFile = (file: File): boolean => {
    // Limit to 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMessage("File is too large. Maximum size is 10MB.");
      return false;
    }

    // Check valid file types
    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setErrorMessage(
        "Invalid file type. Please upload a PDF, JPEG, or PNG file."
      );
      return false;
    }

    return true;
  };

  // Handle file upload
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "rates" | "id"
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !propertyId) return;

    const file = files[0]; // Only use the first file

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

  // Handle file deletion
  const handleDeleteFile = async (
    fileUrl: string | null,
    type: "rates" | "id"
  ) => {
    if (!propertyId || !fileUrl) return;

    setIsDeleting(true);
    setUploadType(type);
    setErrorMessage("");

    try {
      const success = await deletePropertyImageFromDB(fileUrl);

      if (success) {
        if (type === "rates") {
          const updatedDetail = await updatePropertyOwnershipDocumentInDB(
            propertyId,
            ""
          );
          if (updatedDetail) {
            updateOwnershipDocument(propertyId, null);
          }
        } else {
          const updatedDetail = await updatePropertyIdentificationDocumentInDB(
            propertyId,
            ""
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

  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      {/* Header */}
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Ownership Verification
      </Typography>

      {/* Error Message */}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Description */}
      <Typography sx={{ mb: 4 }}>
        Ownership verification is required before we can send your property ad
        live. To ensure there are no delays, provide this now if you can. If you
        don't have this on hand, feel free to continue for now and supply this
        later.
      </Typography>

      {/* Rates Notice Section */}
      <Card sx={{ mb: 4, border: "1px solid #e0e0e0" }}>
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
              </Typography>
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
            </Box>
          ) : (
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                border: "1px dashed #bdbdbd",
                borderRadius: 2,
                backgroundColor: "#f5f5f5",
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
                  disabled={isUploading}
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
              >
                I don't have a rates notice
              </Button>
            </Paper>
          )}
        </CardContent>
      </Card>

      {/* Photo ID Section */}
      <Card sx={{ mb: 4, border: "1px solid #e0e0e0" }}>
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
              </Typography>
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
            </Box>
          ) : (
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                border: "1px dashed #bdbdbd",
                borderRadius: 2,
                backgroundColor: "#f5f5f5",
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
                  disabled={isUploading}
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
            </Paper>
          )}
        </CardContent>
      </Card>

      {/* Information about verification */}
      <Card sx={{ border: "1px solid #e0e0e0", bgcolor: "#f9f9f9" }}>
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

      {/* Contact dialog */}
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
            <Link href="mailto:support@realtydashboard.com">
              support@realtydashboard.com
            </Link>{" "}
            or call us at <strong>1-800-PROPERTY</strong> to discuss alternative
            options.
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

      {/* Full page loading overlay */}
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
