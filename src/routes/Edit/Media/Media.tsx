import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router";
import { updatePropertyImagesInDB } from "../../../database/details";
import {
  deletePropertyImageFromDB,
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

  const [loading, setLoading] = useState(false);

  const handleVideoURLChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newURL = event.target.value;

    // ✅ Update Zustand store immediately
    updatePropertyDetail(propertyId, { video_url: newURL });
  };

  // ✅ Handle Upload for Photos and Floorplans
  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "images" | "floor_plans"
  ) => {
    const files = event.target.files;
    if (!files) return;

    setLoading(true);
    const uploadedImages: { url: string }[] = [];

    for (const file of Array.from(files)) {
      const imageUrl = await uploadPropertyImage(propertyId, file);
      if (imageUrl) uploadedImages.push({ url: imageUrl });
    }

    if (uploadedImages.length > 0) {
      const updatedList =
        type === "images"
          ? [...images, ...uploadedImages]
          : [...floorPlans, ...uploadedImages];

      // ✅ Update DB and store
      const updatedData = await updatePropertyImagesInDB(
        propertyId,
        updatedList
      );

      if (updatedData && Array.isArray(updatedData.images)) {
        // ✅ Filter out null values and ensure only valid `{ url: string }`
        const validImages = updatedData.images.filter(
          (img): img is { url: string } =>
            img !== null &&
            typeof img === "object" &&
            "url" in img &&
            typeof img.url === "string"
        );

        updateImageOrder(propertyId, validImages);
      } else {
        updateImageOrder(propertyId, []); // ✅ Always ensures an array
      }
    }

    setLoading(false);
  };

  const handleDeleteImage = async (imageUrl: string) => {
    if (!propertyId) return;

    setLoading(true);

    const success = await deletePropertyImageFromDB(imageUrl);

    if (success) {
      const updatedImages = images.filter((img) => img.url !== imageUrl);

      // ✅ Ensure first image is main
      const updatedData = await updatePropertyImagesInDB(
        propertyId,
        updatedImages
      );

      if (updatedData?.images && Array.isArray(updatedData.images)) {
        // ✅ Filter to ensure only `{ url: string }`
        const validImages = updatedData.images.filter(
          (img): img is { url: string } =>
            img !== null &&
            typeof img === "object" &&
            "url" in img &&
            typeof img.url === "string"
        );

        updateImageOrder(propertyId, validImages);
      } else {
        updateImageOrder(propertyId, []); // ✅ Always pass an array
      }
    }

    setLoading(false);
  };

  // ✅ Handle Drag and Drop Sorting
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img.url === active.id);
    const newIndex = images.findIndex((img) => img.url === over.id);
    const reorderedImages = arrayMove(images, oldIndex, newIndex);

    // ✅ Update DB and store
    const updatedData = await updatePropertyImagesInDB(
      propertyId,
      reorderedImages
    );

    if (updatedData?.images && Array.isArray(updatedData.images)) {
      // ✅ Filter out null values and ensure only `{ url: string }`
      const validImages = updatedData.images.filter(
        (img): img is { url: string } =>
          img !== null &&
          typeof img === "object" &&
          "url" in img &&
          typeof img.url === "string"
      );

      updateImageOrder(propertyId, validImages);
    } else {
      updateImageOrder(propertyId, []); // ✅ Always ensures an array
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
        />
        <label htmlFor="photo-upload">
          <Button variant="contained" component="span">
            Drop your image here / Choose file
          </Button>
        </label>
      </Paper>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images.map((img) => img.url)}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {images.map((image, index) => (
              <SortableImage
                key={image.url}
                image={image}
                // index={index}
                isMain={index === 0}
                onDelete={() => handleDeleteImage(image.url)}
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
      />

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Floor Plans
      </Typography>

      <Paper
        sx={{ p: 3, textAlign: "center", border: "1px dashed gray", mb: 3 }}
      >
        <Typography variant="subtitle1">Upload floorplan(s)</Typography>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleUpload(e, "floor_plans")}
          style={{ display: "none" }}
          id="floorplan-upload"
        />
        <label htmlFor="floorplan-upload">
          <Button variant="contained" component="span">
            Choose file
          </Button>
        </label>
      </Paper>
    </Box>
  );
}
