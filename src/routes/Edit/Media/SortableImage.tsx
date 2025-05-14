import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Button, Typography } from "@mui/material";

interface SortableImageProps {
  image: { url: string };
  isMain: boolean;
  onDelete: () => void;
  showMainImageLabel?: boolean;
  disabled?: boolean;
}

export const SortableImage = ({
  image,
  isMain,
  onDelete,
  showMainImageLabel = false,
  disabled = false,
}: SortableImageProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: image.url,
      disabled,
    });

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
          cursor: disabled ? "default" : "grab",
          borderRadius: 2,
          overflow: "hidden",
          transform: CSS.Transform.toString(transform),
          transition: transition || "transform 200ms ease-in-out",
          opacity: disabled ? 0.7 : 1,
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          "&:hover": {
            boxShadow: disabled
              ? "0 4px 8px rgba(0,0,0,0.1)"
              : "0 6px 12px rgba(0,0,0,0.15)",
          },
        }}
      >
        {/* "Main Image" Label */}
        {isMain && showMainImageLabel && (
          <Typography
            sx={(theme) => ({
              position: "absolute",
              top: 4,
              left: 4,
              // Use a darker blue in dark mode for better contrast
              backgroundColor: theme.palette.mode === 'dark' 
                ? '#1565c0' // A darker, more vibrant blue for dark mode
                : theme.palette.primary.main,
              color: "#ffffff",
              fontSize: 12,
              padding: "4px 10px",
              borderRadius: 4,
              fontWeight: "bold",
              zIndex: 2,
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 2px 4px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.15)' 
                : '0 1px 3px rgba(0,0,0,0.3)',
              textShadow: '0px 1px 2px rgba(0,0,0,0.5)',
              letterSpacing: "0.5px",
              // Improve contrast in both modes
              border: theme.palette.mode === 'dark'
                ? '1px solid rgba(255,255,255,0.25)'
                : 'none',
            })}
          >
            Main Image
          </Typography>
        )}
        <img
          src={image.url}
          alt="Property"
          width="100%"
          style={{
            borderRadius: 8,
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>

      {/* View & Delete Buttons (Outside of Drag Area) */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 1 }}>
        <Button
          size="small"
          variant="text"
          onClick={() => window.open(image.url, "_blank")}
          sx={{
            color: "#1976d2",
            textTransform: "none",
            fontSize: 12,
            minWidth: "40px",
            padding: "4px 8px",
          }}
          disabled={disabled}
        >
          View
        </Button>
        <Button
          size="small"
          variant="text"
          onClick={onDelete}
          sx={{
            color: "error.main",
            textTransform: "none",
            fontSize: 12,
            minWidth: "40px",
            padding: "4px 8px",
          }}
          disabled={disabled}
        >
          Delete
        </Button>
      </Box>
    </Box>
  );
};
