import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Button, Typography } from "@mui/material";

export const SortableImage = ({
  image,
  isMain,
  onDelete,
}: {
  image: { url: string };
  isMain: boolean;
  onDelete: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.url });

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* Draggable Image Box */}
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
        {/* "Main Image" Label */}
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
        <img
          src={image.url}
          alt="Property"
          width="100%"
          style={{ borderRadius: 8, height: "100%", objectFit: "cover" }}
        />
      </Box>

      {/* View & Delete Buttons (Outside of Drag Area) */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 1 }}>
        <Button
          size="small"
          variant="text"
          onClick={() => window.open(image.url, "_blank")}
          sx={{ color: "#1976d2", textTransform: "none", fontSize: 12 }}
        >
          View
        </Button>
        <Button
          size="small"
          variant="text"
          onClick={onDelete}
          sx={{ color: "red", textTransform: "none", fontSize: 12 }}
        >
          Delete
        </Button>
      </Box>
    </Box>
  );
};
