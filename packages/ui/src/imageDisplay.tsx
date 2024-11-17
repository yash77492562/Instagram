'use client';

import { CldImage } from "next-cloudinary";
import { MouseEvent } from "react";

// Define valid crop types and flags
type ValidCropMode = 
  | "thumb" 
  | "crop" 
  | "fill" 
  | "pad" 
  | "auto" 
  | "fill_pad" 
  | "fit" 
  | "imagga_crop" 
  | "imagga_scale" 
  | "lfill" 
  | "limit" 
  | "lpad" 
  | "mfit" 
  | "mpad" 
  | "scale";

type CropConfig = {
  type: ValidCropMode;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  gravity?: 'north_east' | 'south_east' | 'north_west' | 'south_west' | 'north' | 'south' | 'east' | 'west';
  source?: boolean;
};

type CloudinaryTransformations = {
  width?: number;
  height?: number;
  crop?: ValidCropMode | CropConfig; // Accepts custom crop configuration
  aspectRatio?: string;
  removeBackground?: boolean;
  background?: string;
  fillBackground?: boolean;
  blur?: string;
  grayscale?: boolean;
  opacity?: string;
};

interface ImageDisplayProps {
  public_id: string;
  alt: string;
  secure_url: string;
  type: 'profile' | 'view';
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  transformations?: CloudinaryTransformations;
  sizes?: string;
  fill?: boolean;
}

const DEFAULT_PROFILE_CONFIG: CloudinaryTransformations = {
  width: 250,
  height: 250,
  crop: 'fill' as ValidCropMode,
};

const DEFAULT_VIEW_CONFIG: CloudinaryTransformations = {
  width: 450,
  height: 550,
  crop: 'pad' as ValidCropMode,
};

export const ImageDisplay = ({
  public_id,
  alt,
  secure_url,
  type,
  onClick,
  transformations = {},
  ...props
}: ImageDisplayProps) => {
  const isProfile = type === 'profile';

  const containerClasses = isProfile
    ? "relative w-[250px] h-[250px] cursor-pointer"
    : "relative cursor-pointer w-[450px] h-[550px] max-w-[450px] max-h-[550px] min-h-[350px] flex items-center justify-center";

  const imageClasses = isProfile
    ? "object-cover hover:opacity-90 transition-opacity duration-200 rounded-sm"
    : "w-auto h-auto max-w-full max-h-[550px] hover:opacity-90 transition-opacity duration-200 rounded-sm";

  const config = {
    ...(isProfile ? DEFAULT_PROFILE_CONFIG : DEFAULT_VIEW_CONFIG),
    ...transformations, // Merge user-defined transformations
    crop: transformations.crop || DEFAULT_VIEW_CONFIG.crop, // Ensure crop config is applied
  };

  return (
    <div onClick={onClick} className={containerClasses}>
      <CldImage
        key={public_id}
        src={secure_url}
        alt={alt}
        width={config.width}
        height={config.height}
        {...config} // Pass all configurations, including `crop`
        className={imageClasses}
        {...props}
      />
    </div>
  );
};
