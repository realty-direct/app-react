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
import { formatCurrency } from "../utils/formatters";
import LoadingSpinner from "./LoadingSpinner";
import { createCheckoutSession, redirectToCheckout } from "../services/stripe";
import useRealtyStore from "../store/store";
import { showNotification } from "../lib/notifications";

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
}

const OrderSummary = ({
  propertyId,
  packageType,
  packagePrice,
  enhancements,
  publishOption,
  publishDate,
}: OrderSummaryProps) => {
  const theme = useTheme();
  const { profile } = useRealtyStore();

  const [showPromoSection, setShowPromoSection] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const enhancementsData: Record<string, { title: string; numericPrice: number }> = {
    "photography-12": { title: "Professional Photography (12 images)", numericPrice: 350 },
    "photography-20": { title: "Professional Photography (20 images)", numericPrice: 470 },
    "drone-photography": { title: "Drone/Aerial Photography", numericPrice: 450 },
    "twilight-photography": { title: "Twilight Photography", numericPrice: 480 },
    "floor-plan-2d": { title: "2D Floor Plan", numericPrice: 295 },
    "virtual-tour": { title: "360° Virtual Tour", numericPrice: 480 },
    "walkthrough-video": { title: "Walkthrough Video", numericPrice: 560 },
    "hd-video": { title: "HD Video", numericPrice: 840 },
    "virtual-staging": { title: "Virtual Staging", numericPrice: 150 },
    "site-plan": { title: "Site Plan", numericPrice: 80 },
    "social-media-reels": { title: "Social Media Reels (2)", numericPrice: 280 },
    "print-package": { title: "Print Package (50 booklets & 100 flyers)", numericPrice: 220 },
    "standard-signboard": { title: "Standard Signboard", numericPrice: 190 },
    "photo-signboard": { title: "Photo Signboard", numericPrice: 310 },
    "premium-description": { title: "Premium Property Description", numericPrice: 180 },
    "social-media-boost": { title: "Additional Social Media Boost", numericPrice: 270 },
    "allhomes-listing": { title: "Listing on Allhomes.com.au", numericPrice: 645 },
    "juwai-listing": { title: "Listing on Juwai (China)", numericPrice: 160 },
    "contract-preparation": { title: "Sale Contract Preparation", numericPrice: 534 },
    "conveyancing": { title: "Full Conveyancing Service", numericPrice: 880 },
  };

  const enhancementsTotal = enhancements.reduce((total, enhancement) => {
    const enhancementData = enhancementsData[enhancement.enhancement_type];
    return total + (enhancementData ? enhancementData.numericPrice : 0);
  }, 0);

  const subtotal = packagePrice + enhancementsTotal;

  const calculateDiscount = (): number => {
    if (!appliedPromo) return 0;
    const discountAmount = (subtotal * appliedPromo.discount) / 100;
    return Number(discountAmount.toFixed(2));
  };

  const discount = calculateDiscount();
  const total = subtotal - discount;

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
        setPromoCode("");
      } else {
        setPromoError("Invalid promo code");
      }
    } catch (error) {
      setPromoError("Error applying promo code");
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  const handlePayment = async () => {
    if (!profile?.id) {
      showNotification("Please sign in to continue", "error");
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Create Stripe checkout session
      const session = await createCheckoutSession({
        propertyId,
        packageType: packageType || "",
        packagePrice,
        enhancements: enhancements.map(e => ({
          enhancement_type: e.enhancement_type,
          price: e.price,
        })),
        userId: profile.id,
        promoCode: appliedPromo?.code,
      });

      // Redirect to Stripe Checkout
      await redirectToCheckout(session.sessionId);
    } catch (error) {
      console.error("Payment error:", error);
      showNotification("Payment failed. Please try again.", "error");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <Card
      elevation={3}
      sx={{
        position: "relative",
        borderRadius: 2,
        overflow: "hidden",
        maxHeight: "100%",
      }}
    >
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

      <Box sx={{ p: 3 }}>
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
                  {enhancementsData[enhancement.enhancement_type]?.title || 
                   enhancement.enhancement_type
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {formatCurrency(enhancementsData[enhancement.enhancement_type]?.numericPrice || 0)}
                </Typography>
              </Box>
            ))}
          </>
        )}

        <Divider sx={{ my: 3 }} />

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
                  padding: "4px 12px",
                  minWidth: "80px",
                  fontWeight: 500,
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
                        sx={{ 
                          minWidth: 80,
                          py: 0.7,
                          fontWeight: 500
                        }}
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

        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={
            isProcessingPayment ||
            (publishOption === "later" && !publishDate) ||
            !packageType
          }
          onClick={handlePayment}
          sx={{ 
            mt: 2, 
            py: 1.5, 
            fontSize: "1rem",
            fontWeight: "bold",
            boxShadow: (theme) => `0 4px 12px ${theme.palette.primary.main}40`,
            '&:hover': {
              boxShadow: (theme) => `0 6px 14px ${theme.palette.primary.main}60`,
            }
          }}
        >
          {isProcessingPayment ? (
            <LoadingSpinner buttonMode text="Processing Payment..." />
          ) : (
            "Proceed to Payment"
          )}
        </Button>

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
    </Card>
  );
};

export default OrderSummary;