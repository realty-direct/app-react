import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  updatePropertyFloorPlansInDB,
  updatePropertyImagesInDB,
} from "../../../database/details";
import {
  deletePropertyImageFromDB,
  uploadFloorPlan,
  uploadPropertyImage,
} from "../../../database/files";
import useRealtyStore from "../../../store/store";
import { SortableImage } from "./SortableImage";

export default function Media() {
  const { id } = useParams<{ id: string }>();
  const propertyId = id ?? "";

  const { propertyDetails, updateImageOrder, updatePropertyDetail } =
    useRealtyStore();

  const propertyDetail = propertyDetails.find(
    (p) => p.property_id === propertyId
  );

  if (!propertyDetail) return <Typography>No details found.</Typography>;

  const images: { url: string }[] = Array.isArray(propertyDetail.images)
    ? propertyDetail.images.filter(
        (img): img is { url: string } =>
          !!img && typeof img === "object" && "url" in img
      )
    : [];

  const floorPlans: { url: string }[] = Array.isArray(
    propertyDetail.floor_plans
  )
    ? propertyDetail.floor_plans.filter(
        (img): img is { url: string } =>
          !!img && typeof img === "object" && "url" in img
      )
    : [];

  // Loading states with more specific types
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [videoUrlSaving, setVideoUrlSaving] = useState(false);
  const [loadingType, setLoadingType] = useState<"images" | "floorPlans" | "">(
    ""
  );

  const handleVideoURLChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newURL = event.target.value;
    setVideoUrlSaving(true);

    try {
      // Update Zustand store
      updatePropertyDetail(propertyId, { video_url: newURL });
    } catch (error) {
      console.error("Error updating video URL:", error);
    } finally {
      setTimeout(() => {
        setVideoUrlSaving(false);
      }, 500); // Small delay to show feedback
    }
  };

  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "images" | "floorPlans"
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setLoadingType(type);
    const uploadedFiles: { url: string }[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileUrl =
          type === "images"
            ? await uploadPropertyImage(propertyId, file)
            : await uploadFloorPlan(propertyId, file);

        if (fileUrl) uploadedFiles.push({ url: fileUrl });
      }

      if (uploadedFiles.length > 0) {
        const updatedList =
          type === "images"
            ? [...images, ...uploadedFiles]
            : [...floorPlans, ...uploadedFiles];

        // Update DB and store
        const updatedData =
          type === "images"
            ? await updatePropertyImagesInDB(propertyId, updatedList)
            : await updatePropertyFloorPlansInDB(propertyId, updatedList);

        if (updatedData) {
          type MediaUpdateData = {
            images?: { url: string }[];
            floor_plans?: { url: string }[];
          };
          
          const validFiles = (
            (updatedData as MediaUpdateData)[
              type === "images" ? "images" : "floor_plans"
            ] || []
          ).filter(
            (file): file is { url: string } =>
              file !== null &&
              typeof file === "object" &&
              "url" in file &&
              typeof file.url === "string"
          );

          if (type === "images") updateImageOrder(propertyId, validFiles);
          else updatePropertyDetail(propertyId, { floor_plans: validFiles });
        }
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
    } finally {
      setIsUploading(false);
      setLoadingType("");
    }
  };

  const handleDeleteFile = async (
    fileUrl: string,
    type: "images" | "floorPlans"
  ) => {
    if (!propertyId) return;

    setIsDeleting(true);
    setLoadingType(type);

    try {
      // This calls our enhanced deletePropertyImageFromDB function
      // which now properly removes files from storage
      const success = await deletePropertyImageFromDB(fileUrl);

      if (success) {
        const updatedFiles =
          type === "images"
            ? images.filter((img) => img.url !== fileUrl)
            : floorPlans.filter((fp) => fp.url !== fileUrl);

        const updatedData =
          type === "images"
            ? await updatePropertyImagesInDB(propertyId, updatedFiles)
            : await updatePropertyFloorPlansInDB(propertyId, updatedFiles);

        if (updatedData) {
          type MediaUpdateData = {
            images?: { url: string }[];
            floor_plans?: { url: string }[];
          };
          
          const validFiles = (
            (updatedData as MediaUpdateData)[
              type === "images" ? "images" : "floor_plans"
            ] || []
          ).filter(
            (file): file is { url: string } =>
              file !== null &&
              typeof file === "object" &&
              "url" in file &&
              typeof file.url === "string"
          );

          if (type === "images") updateImageOrder(propertyId, validFiles);
          else updatePropertyDetail(propertyId, { floor_plans: validFiles });
        }
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    } finally {
      setIsDeleting(false);
      setLoadingType("");
    }
  };

  // Handle Drag and Drop Sorting - no loading indicator needed for this
  const handleDragEnd = async (
    event: DragEndEvent,
    type: "images" | "floorPlans"
  ) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    try {
      const list = type === "images" ? images : floorPlans;
      const oldIndex = list.findIndex((item) => item.url === active.id);
      const newIndex = list.findIndex((item) => item.url === over.id);
      const reorderedList = arrayMove(list, oldIndex, newIndex);

      // Update local state first for immediate feedback
      if (type === "images") {
        updateImageOrder(propertyId, reorderedList);
      } else {
        updatePropertyDetail(propertyId, { floor_plans: reorderedList });
      }

      // Update DB in the background (no loading state needed)
      const updatedData =
        type === "images"
          ? await updatePropertyImagesInDB(propertyId, reorderedList)
          : await updatePropertyFloorPlansInDB(propertyId, reorderedList);

      if (updatedData) {
        const validFiles = (
          (updatedData as any)[
            type === "images" ? "images" : "floor_plans"
          ] as { url: string }[]
        ).filter(
          (file): file is { url: string } =>
            file !== null &&
            typeof file === "object" &&
            "url" in file &&
            typeof file.url === "string"
        );

        // Update again with server data if needed
        if (JSON.stringify(validFiles) !== JSON.stringify(reorderedList)) {
          if (type === "images") updateImageOrder(propertyId, validFiles);
          else updatePropertyDetail(propertyId, { floor_plans: validFiles });
        }
      }
    } catch (error) {
      console.error(`Error reordering ${type}:`, error);
    }
  };

  const getLoadingText = () => {
    if (loadingType === "images") {
      return isUploading
        ? "Uploading property images..."
        : "Deleting property image...";
    }
    if (loadingType === "floorPlans") {
      return isUploading
        ? "Uploading floor plans..."
        : "Deleting floor plan...";
    }
    return "Processing...";
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        Photos and Media
      </Typography>

      <Typography sx={{ mb: 2 }}>
        For best results, we recommend a resolution of <b>2000 x 1500 pixels</b>{" "}
        or higher, in a standard <b>4:3 ratio</b>.
      </Typography>

      <Typography sx={{ mb: 3 }}>
        (Limit <b>36</b> photos)
      </Typography>

      <Paper
        sx={{ p: 3, textAlign: "center", border: "1px dashed gray", mb: 3 }}
      >
        <Typography variant="subtitle1">Upload photo(s)</Typography>
        <input
          type="file"
          multiple
          accept=".jpg,.jpeg,.png"
          onChange={(e) => handleUpload(e, "images")}
          style={{ display: "none" }}
          id="photo-upload"
          disabled={isUploading || isDeleting}
        />
        <label htmlFor="photo-upload">
          <Button
            variant="contained"
            component="span"
            disabled={isUploading || isDeleting}
          >
            {isUploading && loadingType === "images" ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Uploading...
              </Box>
            ) : (
              "Drop your image here / Choose file"
            )}
          </Button>
        </label>
      </Paper>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={(event) => handleDragEnd(event, "images")}
      >
        <SortableContext items={images.map((img) => img.url)}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {images.map((image, index) => (
              <SortableImage
                key={image.url}
                image={image}
                showMainImageLabel={true}
                isMain={index === 0}
                onDelete={() => handleDeleteFile(image.url, "images")}
                disabled={isUploading || isDeleting}
              />
            ))}
          </Box>
        </SortableContext>
      </DndContext>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        The video needs to be uploaded to YouTube
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          label="Video URL (External Link)"
          variant="filled"
          fullWidth
          value={propertyDetail.video_url || ""}
          onChange={handleVideoURLChange}
          sx={{ mb: 3 }}
          disabled={videoUrlSaving}
        />
        {videoUrlSaving && <CircularProgress size={20} sx={{ mb: 3 }} />}
      </Box>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Floor Plans
      </Typography>
      <Typography sx={{ mb: 3 }}>
        Please limit to maximum of <b>5</b> floor plans.
      </Typography>

      <Paper
        sx={{ p: 3, textAlign: "center", border: "1px dashed gray", mb: 3 }}
      >
        <Typography variant="subtitle1">Upload floorplan(s)</Typography>
        <input
          type="file"
          multiple
          accept=".jpg,.jpeg,.png"
          onChange={(e) => handleUpload(e, "floorPlans")}
          style={{ display: "none" }}
          id="floorplan-upload"
          disabled={isUploading || isDeleting}
        />
        <label htmlFor="floorplan-upload">
          <Button
            variant="contained"
            component="span"
            disabled={isUploading || isDeleting}
          >
            {isUploading && loadingType === "floorPlans" ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Uploading...
              </Box>
            ) : (
              "Choose file"
            )}
          </Button>
        </label>
      </Paper>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={(event) => handleDragEnd(event, "floorPlans")}
      >
        <SortableContext items={floorPlans.map((plan) => plan.url)}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {floorPlans.map((floorPlan, index) => (
              <SortableImage
                key={floorPlan.url}
                image={floorPlan}
                showMainImageLabel={false}
                isMain={index === 0}
                onDelete={() => handleDeleteFile(floorPlan.url, "floorPlans")}
                disabled={isUploading || isDeleting}
              />
            ))}
          </Box>
        </SortableContext>
      </DndContext>

      {/* Full page loading overlay only for uploads and deletions which take time */}
      {(isUploading || isDeleting) && (
        <LoadingSpinner fullPage text={getLoadingText()} transparent />
      )}
    </Box>
  );
}
