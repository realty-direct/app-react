import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
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
} from "../../../database/supabase";
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

  // Add loading states
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<
    "" | "images" | "floorPlans" | "videoUrl"
  >("");

  const handleVideoURLChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newURL = event.target.value;
    setLoadingType("videoUrl");
    setLoading(true);

    try {
      // Update Zustand store
      updatePropertyDetail(propertyId, { video_url: newURL });
    } catch (error) {
      console.error("Error updating video URL:", error);
    } finally {
      setLoading(false);
      setLoadingType("");
    }
  };

  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "images" | "floorPlans"
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
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

          if (type === "images") updateImageOrder(propertyId, validFiles);
          else updatePropertyDetail(propertyId, { floor_plans: validFiles });
        }
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
    } finally {
      setLoading(false);
      setLoadingType("");
    }
  };

  const handleDeleteFile = async (
    fileUrl: string,
    type: "images" | "floorPlans"
  ) => {
    if (!propertyId) return;

    setLoading(true);
    setLoadingType(type);

    try {
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

          if (type === "images") updateImageOrder(propertyId, validFiles);
          else updatePropertyDetail(propertyId, { floor_plans: validFiles });
        }
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    } finally {
      setLoading(false);
      setLoadingType("");
    }
  };

  // Handle Drag and Drop Sorting
  const handleDragEnd = async (
    event: DragEndEvent,
    type: "images" | "floorPlans"
  ) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Don't show loading UI for reordering to avoid flicker
    // Just update the visual order immediately

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

      // Update DB in the background
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

  // Get loading message based on type
  const getLoadingText = () => {
    switch (loadingType) {
      case "images":
        return "Processing property images...";
      case "floorPlans":
        return "Processing floor plans...";
      case "videoUrl":
        return "Updating video link...";
      default:
        return "Processing...";
    }
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
          disabled={loading}
        />
        <label htmlFor="photo-upload">
          <Button variant="contained" component="span" disabled={loading}>
            {loading && loadingType === "images" ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </div>
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
                disabled={loading}
              />
            ))}
          </Box>
        </SortableContext>
      </DndContext>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        The video needs to be uploaded to YouTube
      </Typography>

      <TextField
        label="Video URL (External Link)"
        variant="filled"
        fullWidth
        value={propertyDetail.video_url || ""}
        onChange={handleVideoURLChange}
        sx={{ mb: 3 }}
        disabled={loading}
      />

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
          disabled={loading}
        />
        <label htmlFor="floorplan-upload">
          <Button variant="contained" component="span" disabled={loading}>
            {loading && loadingType === "floorPlans" ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </div>
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
                disabled={loading}
              />
            ))}
          </Box>
        </SortableContext>
      </DndContext>

      {/* Full page loading overlay only for uploads and deletions which take time */}
      {loading &&
        (loadingType === "images" || loadingType === "floorPlans") && (
          <LoadingSpinner fullPage text={getLoadingText()} transparent />
        )}
    </Box>
  );
}
