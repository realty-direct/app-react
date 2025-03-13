import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router";
import { updatePropertyDetailInDB } from "../../../database/details";
import {
  deletePropertyImageFromDB,
  uploadPropertyImage,
} from "../../../database/supabase";
import useRealtyStore from "../../../store/store";
import { SortableImage } from "./SortableImage";

export default function Media() {
  const { id } = useParams<{ id: string }>();
  const propertyId = id ?? "";

  const {
    propertyDetails,
    updateImageOrder,
    setMainImage,
    updatePropertyDetail,
  } = useRealtyStore();

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

  const [videoURL, setVideoURL] = useState(propertyDetail.video_url || "");
  const [loading, setLoading] = useState(false);

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

      const newPropertyDetail = await updatePropertyDetailInDB(propertyId, {
        [type]: updatedList,
      });

      if (newPropertyDetail) {
        await updatePropertyDetail(propertyId, newPropertyDetail);
      }

      // ✅ Set first image as main image if none is set
      if (type === "images" && updatedList.length > 0) {
        setMainImage(propertyId, updatedList[0].url);
      }
    }

    setLoading(false);
  };

  // ✅ Handle Image Deletion
  const handleDeleteImage = async (imageUrl: string) => {
    if (!propertyId) return;

    setLoading(true);

    const success = await deletePropertyImageFromDB(imageUrl);

    if (success) {
      const updatedImages = images.filter((img) => img.url !== imageUrl);
      await updatePropertyDetail(propertyId, { images: updatedImages });

      // ✅ Ensure a new main image is set if the main image was deleted
      if (updatedImages.length > 0) {
        setMainImage(propertyId, updatedImages[0].url);
      }
    }

    setLoading(false);
  };

  // ✅ Handle Drag and Drop Sorting
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img.url === active.id);
    const newIndex = images.findIndex((img) => img.url === over.id);
    const reorderedImages = arrayMove(images, oldIndex, newIndex);

    updateImageOrder(propertyId, reorderedImages);
    setMainImage(propertyId, reorderedImages[0].url);
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
        value={videoURL}
        onChange={(e) => setVideoURL(e.target.value)}
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
