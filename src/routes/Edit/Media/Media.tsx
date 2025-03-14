import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router";
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

  const [loading, setLoading] = useState(false);

  const handleVideoURLChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newURL = event.target.value;

    // ✅ Update Zustand store immediately
    updatePropertyDetail(propertyId, { video_url: newURL });
  };

  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "images" | "floor_plans"
  ) => {
    const files = event.target.files;
    if (!files) return;

    setLoading(true);
    const uploadedFiles: { url: string }[] = [];

    for (const file of Array.from(files)) {
      const fileUrl =
        type === "images"
          ? await uploadPropertyImage(propertyId, file) // Upload image
          : await uploadFloorPlan(propertyId, file); // Upload floor plan

      if (fileUrl) uploadedFiles.push({ url: fileUrl });
    }

    if (uploadedFiles.length > 0) {
      const updatedList =
        type === "images"
          ? [...images, ...uploadedFiles]
          : [...floorPlans, ...uploadedFiles];

      // ✅ Update DB and store
      const updatedData =
        type === "images"
          ? await updatePropertyImagesInDB(propertyId, updatedList)
          : await updatePropertyFloorPlansInDB(propertyId, updatedList);

      if (updatedData) {
        const validFiles = (updatedData[type] as { url: string }[]).filter(
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

    setLoading(false);
  };

  const handleDeleteFile = async (
    fileUrl: string,
    type: "images" | "floor_plans"
  ) => {
    if (!propertyId) return;

    setLoading(true);

    const success = await deletePropertyImageFromDB(fileUrl); // ✅ Works for both images and floor plans

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
        const validFiles = (updatedData[type] as { url: string }[]).filter(
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

    setLoading(false);
  };

  // ✅ Handle Drag and Drop Sorting
  const handleDragEnd = async (
    event: DragEndEvent,
    type: "images" | "floor_plans"
  ) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const list = type === "images" ? images : floorPlans;
    const oldIndex = list.findIndex((item) => item.url === active.id);
    const newIndex = list.findIndex((item) => item.url === over.id);
    const reorderedList = arrayMove(list, oldIndex, newIndex);

    // ✅ Update DB and store
    const updatedData =
      type === "images"
        ? await updatePropertyImagesInDB(propertyId, reorderedList)
        : await updatePropertyFloorPlansInDB(propertyId, reorderedList);

    if (updatedData) {
      const validFiles = (updatedData[type] as { url: string }[]).filter(
        (file): file is { url: string } =>
          file !== null &&
          typeof file === "object" &&
          "url" in file &&
          typeof file.url === "string"
      );

      if (type === "images") updateImageOrder(propertyId, validFiles);
      else updatePropertyDetail(propertyId, { floor_plans: validFiles });
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

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={(event) => handleDragEnd(event, "floor_plans")}
      >
        <SortableContext items={floorPlans.map((img) => img.url)}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {floorPlans.map((image, index) => (
              <SortableImage
                key={image.url}
                image={image}
                showMainImageLabel={false}
                isMain={index === 0}
                onDelete={() => handleDeleteFile(image.url, "floor_plans")}
              />
            ))}
          </Box>
        </SortableContext>
      </DndContext>
    </Box>
  );
}
