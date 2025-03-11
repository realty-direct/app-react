import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  defaultAnimateLayoutChanges,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Box,
  Button,
  FormControlLabel,
  Paper,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router";
import {
  deletePropertyImageFromDB,
  uploadPropertyImage,
} from "../../database/supabase";
import useRealtyStore from "../../store/store";

export default function Media() {
  const { id } = useParams<{ id: string }>();
  const propertyId = id ?? "";

  const {
    propertyDetails,

    setMainImage,
    updatePropertyDetail: updatePropertyDetailInStore,
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

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    setLoading(true);
    const fileArray = Array.from(files);
    for (const file of fileArray) {
      const imageUrl = await uploadPropertyImage(propertyId, file);
      if (imageUrl) {
        const updatedImages = [...images, { url: imageUrl }];
        updatePropertyDetailInStore(propertyId, { images: updatedImages });
        await updatePropertyDetail(propertyId, { images: updatedImages });
      }
    }
    setLoading(false);
  };

  const handleFloorPlanUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    setLoading(true);
    const fileArray = Array.from(files);
    for (const file of fileArray) {
      const imageUrl = await uploadPropertyImage(propertyId, file);
      if (imageUrl) {
        const updatedFloorPlans = [...floorPlans, { url: imageUrl }];
        updatePropertyDetailInStore(propertyId, {
          floor_plans: updatedFloorPlans,
        });
        await updatePropertyDetail(propertyId, {
          floor_plans: updatedFloorPlans,
        });
      }
    }
    setLoading(false);
  };

  const handleDeleteImage = async (imageUrl: string) => {
    if (!propertyId) return;

    setLoading(true);

    const success = await deletePropertyImageFromDB(propertyId, imageUrl);
    if (success) {
      const updatedImages = images.filter(
        (img): img is { url: string } =>
          img !== null &&
          typeof img === "object" &&
          "url" in img &&
          typeof img.url === "string" &&
          img.url !== imageUrl
      );

      updatePropertyDetailInStore(propertyId, { images: updatedImages });
      await updatePropertyDetail(propertyId, { images: updatedImages });
    }

    setLoading(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img.url === active.id);
    const newIndex = images.findIndex((img) => img.url === over.id);

    const reorderedImages = arrayMove(images, oldIndex, newIndex);
    updateImageOrder(propertyId, reorderedImages);

    if (newIndex === 0) {
      setMainImage(propertyId, reorderedImages[0].url);
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
          accept="image/*"
          onChange={handlePhotoUpload}
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
                index={index}
                isMain={index === 0} // ✅ First image is always the main image
                onDelete={() => handleDeleteImage(image.url)}
              />
            ))}
          </Box>
        </SortableContext>
      </DndContext>

      <FormControlLabel
        control={<Radio />}
        label="Add Professional Photography and Retouching to your cart ($350.00)"
      />

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

      <FormControlLabel
        control={<Radio />}
        label="Add 3D Virtual Tours to your cart ($385.00)"
      />

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Floor Plans
      </Typography>

      <Typography sx={{ mb: 2 }}>
        Give potential buyers a real feel for the property layout. Add your
        floor plans here, or let us organise one for you.
      </Typography>

      <Paper
        sx={{ p: 3, textAlign: "center", border: "1px dashed gray", mb: 3 }}
      >
        <Typography variant="subtitle1">{"Upload floorplan(s)"}</Typography>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFloorPlanUpload}
          style={{ display: "none" }}
          id="floorplan-upload"
        />
        <label htmlFor="floorplan-upload">
          <Button variant="contained" component="span">
            Choose file
          </Button>
        </label>
      </Paper>

      <FormControlLabel
        control={<Radio />}
        label="Add Professional 2D full color Floorplan to your cart ($120.00)"
      />
    </Box>
  );
}

const SortableImage = ({
  image,
  index,
  isMain,
  onDelete,
}: {
  image: { url: string };
  index: number;
  isMain: boolean;
  onDelete: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: image.url,
      animateLayoutChanges: (args) =>
        defaultAnimateLayoutChanges({ ...args, wasDragging: true }),
    });

  const viewImage = (event: React.MouseEvent) => {
    event.stopPropagation(); // ✅ Prevents drag interference
    window.open(image.url, "_blank", "noopener,noreferrer");
  };

  const deleteImage = (event: React.MouseEvent) => {
    event.stopPropagation(); // ✅ Prevents drag interference
    onDelete();
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* Draggable Image */}
      <Box
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        sx={{
          position: "relative",
          width: 120,
          height: 120,
          cursor: "grab",
          borderRadius: 2,
          overflow: "hidden",
          transform: CSS.Transform.toString(transform),
          transition: transition || "transform 200ms ease-in-out",
        }}
      >
        {/* Main Image Indicator */}
        {isMain && (
          <Typography
            sx={{
              position: "absolute",
              top: 4,
              left: 4,
              backgroundColor: "primary.main",
              color: "white",
              fontSize: 12,
              padding: "2px 6px",
              borderRadius: 4,
              fontWeight: "bold",
              zIndex: 2,
            }}
          >
            Main Image
          </Typography>
        )}

        {/* Image */}
        <img
          src={image.url}
          alt="Property"
          width="100%"
          style={{
            borderRadius: 8,
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
          }}
        />
      </Box>

      {/* View & Delete Buttons Directly Below Image */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          mt: 0, // ✅ Small margin to separate from image
        }}
      >
        {/* View Button */}
        <Button
          size="small"
          variant="text"
          onClick={viewImage} // ✅ Fully working
          sx={{ color: "#1976d2", textTransform: "none", fontSize: 12 }}
        >
          View
        </Button>

        {/* Delete Button */}
        <Button
          size="small"
          variant="text"
          onClick={deleteImage} // ✅ Fully working
          sx={{ color: "red", textTransform: "none", fontSize: 12 }}
        >
          Delete
        </Button>
      </Box>
    </Box>
  );
};
