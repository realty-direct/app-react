import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import {
  Alert,
  Box,
  Button,
  Card,
  Collapse,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/formatters";
import LoadingSpinner from "./LoadingSpinner";

interface PromoCode {
  code: string;
  discount: number;
  discountAmount?: number;
}

interface OrderSummaryProps {
  propertyId: string;
  packageType: string | null;
  packagePrice: number;
  enhancements: Array<{
    id?: string;
    enhancement_type: string;
    price: number;
  }>;
  publishOption: string;
  publishDate: Date | null;
  handleFinalizeListing: () => Promise<void>;
}

const OrderSummary = ({
  propertyId,
  packageType,
  packagePrice,
  enhancements,
  publishOption,
  publishDate,
  handleFinalizeListing,
}: OrderSummaryProps) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [showPromoSection, setShowPromoSection] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(true);

  // Check if any signboard enhancement is selected
  const hasSignboardEnhancement = enhancements.some((enhancement) =>
    ["standard-signboard", "photo-signboard"].includes(
      enhancement.enhancement_type
    )
  );

  // Calculate totals
  const enhancementsTotal = enhancements.reduce(
    (total, enhancement) => total + enhancement.price,
    0
  );

  const subtotal = packagePrice + enhancementsTotal;

  const calculateDiscount = (): number => {
    if (!appliedPromo) return 0;
    const discountAmount = (subtotal * appliedPromo.discount) / 100;
    return Number(discountAmount.toFixed(2));
  };

  const discount = calculateDiscount();
  const total = subtotal - discount;

  // Mock promo code validation
  const validatePromoCode = async (code: string): Promise<PromoCode | null> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const validPromoCodes: Record<string, PromoCode> = {
      WELCOME10: { code: "WELCOME10", discount: 10 },
      SUMMER20: { code: "SUMMER20", discount: 20 },
      NEWUSER15: { code: "NEWUSER15", discount: 15 },
    };

    return code.toUpperCase() in validPromoCodes
      ? validPromoCodes[code.toUpperCase()]
      : null;
  };

  // Apply promo code
  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }

    setIsApplyingPromo(true);
    setPromoError("");

    try {
      const validPromo = await validatePromoCode(promoCode);

      if (validPromo) {
        const discountAmount = (subtotal * validPromo.discount) / 100;
        setAppliedPromo({
          ...validPromo,
          discountAmount: Number(discountAmount.toFixed(2)),
        });
        setPromoCode(""); // Clear input after successful application
      } else {
        setPromoError("Invalid promo code");
      }
    } catch (error) {
      setPromoError("Error applying promo code");
    } finally {
      setIsApplyingPromo(false);
    }
  };

  // Remove applied promo code
  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  // Handle finalizing listing
  const handleFinalize = async () => {
    setIsFinalizing(true);
    await handleFinalizeListing();
    setIsFinalizing(false);
  };

  // Navigate to add signboard enhancement
  const handleAddSignboard = () => {
    navigate(`/property/${propertyId}/edit`, { state: { tabIndex: 9 } }); // 9 is the Enhancements tab
  };

  return (
    <Card
      elevation={3}
      sx={{
        position: "sticky",
        top: 90, // Below the tabs
        borderRadius: 2,
        overflow: "visible",
      }}
    >
      {/* Card Header with expand/collapse toggle for mobile */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.primary.main,
          color: "white",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <Typography variant="h6">Order Summary</Typography>
        <IconButton
          onClick={() => setShowOrderSummary(!showOrderSummary)}
          sx={{
            display: { xs: "flex", md: "none" },
            color: "white",
          }}
        >
          {showOrderSummary ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Collapsible content on mobile */}
      <Collapse
        in={showOrderSummary}
        sx={{ display: { xs: "block", md: "block" } }}
      >
        <Box sx={{ p: 3 }}>
          {/* Package section */}
          <Typography fontWeight="medium" sx={{ mb: 1 }}>
            Selected Package
          </Typography>

          {packageType ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
                p: 1,
                backgroundColor: "background.default",
                borderRadius: 1,
              }}
            >
              <Typography>{packageType} Package</Typography>
              <Typography fontWeight="medium">
                {formatCurrency(packagePrice)}
              </Typography>
            </Box>
          ) : (
            <Alert severity="warning" sx={{ mb: 2 }}>
              No package selected
            </Alert>
          )}

          {/* Enhancements section */}
          {enhancements.length > 0 && (
            <>
              <Typography fontWeight="medium" sx={{ mt: 3, mb: 1 }}>
                Listing Enhancements
              </Typography>

              {enhancements.map((enhancement) => (
                <Box
                  key={enhancement.id || enhancement.enhancement_type}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                    p: 1,
                    backgroundColor: "background.default",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2">
                    {enhancement.enhancement_type
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {formatCurrency(enhancement.price)}
                  </Typography>
                </Box>
              ))}
            </>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Promo code section */}
          <Box
            onClick={() => setShowPromoSection(!showPromoSection)}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              cursor: "pointer",
            }}
          >
            <LocalOfferIcon sx={{ mr: 1, color: "primary.main" }} />
            <Typography color="primary.main" fontWeight="medium">
              {appliedPromo ? "Promo code applied" : "Add promo code"}
            </Typography>
            <IconButton size="small">
              {showPromoSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          <Collapse in={showPromoSection}>
            {appliedPromo ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  mb: 2,
                  backgroundColor: "success.light",
                  color: "success.contrastText",
                  borderRadius: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CheckCircleIcon sx={{ mr: 1 }} />
                  <Typography fontWeight="medium">
                    {appliedPromo.code} ({appliedPromo.discount}% off)
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: "success.contrastText",
                    color: "success.contrastText",
                    "&:hover": {
                      borderColor: "success.contrastText",
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                  onClick={handleRemovePromo}
                >
                  Remove
                </Button>
              </Box>
            ) : (
              <Box sx={{ mb: 3 }}>
                <TextField
                  variant="outlined"
                  fullWidth
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  error={!!promoError}
                  helperText={promoError}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          variant="contained"
                          size="small"
                          disabled={isApplyingPromo || !promoCode.trim()}
                          onClick={handleApplyPromoCode}
                          sx={{ minWidth: 80 }}
                        >
                          {isApplyingPromo ? (
                            <LoadingSpinner inline size={20} />
                          ) : (
                            "Apply"
                          )}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 1 }}
                />
              </Box>
            )}
          </Collapse>

          {/* Totals */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography>Subtotal:</Typography>
            <Typography>{formatCurrency(subtotal)}</Typography>
          </Box>

          {appliedPromo && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
                color: "success.main",
              }}
            >
              <Typography>Discount ({appliedPromo.discount}%):</Typography>
              <Typography>-{formatCurrency(discount)}</Typography>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
              fontSize: "1.2rem",
              mt: 2,
            }}
          >
            <Typography fontWeight="bold">Total:</Typography>
            <Typography fontWeight="bold">{formatCurrency(total)}</Typography>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            Includes GST
          </Typography>

          {/* Add more services button */}
          <Button
            startIcon={<AddCircleOutlineIcon />}
            color="primary"
            variant="outlined"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
            onClick={() =>
              navigate(`/property/${propertyId}/edit`, {
                state: { tabIndex: 9 },
              })
            }
          >
            Add More Services
          </Button>

          {/* Signboard recommendation if none selected */}
          {!hasSignboardEnhancement && (
            <Alert
              severity="info"
              sx={{ mt: 2, mb: 2 }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={handleAddSignboard}
                >
                  Add
                </Button>
              }
            >
              Consider adding a For Sale sign to increase your property's
              visibility
            </Alert>
          )}

          {/* Finalize Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={
              isFinalizing ||
              (publishOption === "later" && !publishDate) ||
              !packageType
            }
            onClick={handleFinalize}
            sx={{ mt: 2, py: 1.5 }}
          >
            {isFinalizing ? (
              <LoadingSpinner buttonMode text="Processing..." />
            ) : (
              "Finalize & Pay Now"
            )}
          </Button>

          {/* Validation warnings */}
          {!packageType && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Please select a package before proceeding
            </Alert>
          )}

          {publishOption === "later" && !publishDate && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Please select a publish date
            </Alert>
          )}
        </Box>
      </Collapse>
    </Card>
  );
};

export default OrderSummary;
