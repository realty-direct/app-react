import {
  Box,
  Card,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { 
  Home as HomeIcon, 
  Business as BusinessIcon,
  Landscape as LandscapeIcon,
  Agriculture as AgricultureIcon
} from "@mui/icons-material";
import React from "react";

// Property category type
type PropertyCategory = "residential" | "commercial" | "land" | "rural" | "";

interface PropertyCategorySelectorProps {
  value: PropertyCategory;
  onChange: (category: PropertyCategory) => void;
  disabled?: boolean;
}

const PropertyCategorySelector: React.FC<PropertyCategorySelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  // Handle category change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value as PropertyCategory);
  };

  // Handle card click
  const handleCardClick = (category: PropertyCategory) => {
    if (!disabled) {
      onChange(category);
    }
  };

  // Common styles for cards
  const getCardStyles = (category: PropertyCategory) => ({
    p: 2.5,
    cursor: disabled ? 'default' : 'pointer',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    minHeight: 88,
    transition: 'all 0.2s ease',
    borderRadius: 2,
    boxShadow: value === category ? 3 : 1,
    '&:hover': disabled ? {} : { transform: 'translateY(-2px)', boxShadow: 3 },
    bgcolor: 'background.paper',
    outline: value === category ? 2 : 0,
    outlineColor: 'primary.main',
    outlineOffset: '-2px',
  });

  // Common styles for icon containers
  const getIconBoxStyles = (category: PropertyCategory) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    bgcolor: value === category ? 'primary.main' : 'action.hover',
    borderRadius: '50%',
    width: 56,
    height: 56,
    mr: 2,
    transition: 'background-color 0.3s ease',
  });

  // Common styles for icons
  const getIconStyles = (category: PropertyCategory) => ({
    fontSize: 28,
    color: value === category ? 'common.white' : 'text.secondary',
  });

  return (
    <RadioGroup
      name="propertyCategory"
      value={value}
      onChange={handleChange}
    >
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
          gap: 2,
        }}
      >
        {/* Residential Property Card */}
        <Card 
          onClick={() => handleCardClick('residential')}
          sx={getCardStyles('residential')}
        >
          <Box sx={getIconBoxStyles('residential')}>
            <HomeIcon sx={getIconStyles('residential')} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight="500">Residential</Typography>
            <Typography variant="body2" color="text.secondary">Homes, apartments, units</Typography>
          </Box>
          <Radio 
            checked={value === 'residential'}
            disabled={disabled}
            value="residential"
          />
        </Card>
        
        {/* Commercial Property Card */}
        <Card 
          onClick={() => handleCardClick('commercial')}
          sx={getCardStyles('commercial')}
        >
          <Box sx={getIconBoxStyles('commercial')}>
            <BusinessIcon sx={getIconStyles('commercial')} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight="500">Commercial</Typography>
            <Typography variant="body2" color="text.secondary">Offices, retail spaces</Typography>
          </Box>
          <Radio 
            checked={value === 'commercial'}
            disabled={disabled}
            value="commercial"
          />
        </Card>
        
        {/* Rural Property Card */}
        <Card 
          onClick={() => handleCardClick('rural')}
          sx={getCardStyles('rural')}
        >
          <Box sx={getIconBoxStyles('rural')}>
            <AgricultureIcon sx={getIconStyles('rural')} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight="500">Rural</Typography>
            <Typography variant="body2" color="text.secondary">Rural properties, acreage</Typography>
          </Box>
          <Radio 
            checked={value === 'rural'}
            disabled={disabled}
            value="rural"
          />
        </Card>
        
        {/* Land Property Card */}
        <Card 
          onClick={() => handleCardClick('land')}
          sx={getCardStyles('land')}
        >
          <Box sx={getIconBoxStyles('land')}>
            <LandscapeIcon sx={getIconStyles('land')} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight="500">Land</Typography>
            <Typography variant="body2" color="text.secondary">Vacant lots, development sites</Typography>
          </Box>
          <Radio 
            checked={value === 'land'}
            disabled={disabled}
            value="land"
          />
        </Card>
      </Box>
    </RadioGroup>
  );
};

export default PropertyCategorySelector;