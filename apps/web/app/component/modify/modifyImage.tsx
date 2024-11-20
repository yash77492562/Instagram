import React, { useState } from "react";
import { ImageDisplay } from "@repo/ui/imageDisplay";
import { Card, CardContent } from "../card";
import { Slider } from "../slider";
import { Switch } from "../switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { Label } from "../label";
import { Button } from "../button";
import { Input } from "../input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";

type ImageResource = {
  current_index: number;
  public_id: string;
  secure_url: string;
  alt: string;
};

interface ModifyImageProps {
  image: ImageResource;
}

// Crop related types
type ValidCropGravity = 
  | "center" 
  | "north" 
  | "south" 
  | "east" 
  | "west" 
  | "north_east" 
  | "north_west" 
  | "south_east" 
  | "south_west";

type ValidCropMode = "pad" | "fill" | "crop" | "thumb" | "scale" | "fit";

interface CropConfig {
  type: "crop";
  width: number;
  height: number;
  x: number;
  y: number;
  gravity?: ValidCropGravity;
}

// Updated CloudinaryTransformations interface
interface CloudinaryTransformations {
  blur?: string;
  grayscale?: boolean;
  opacity?: string;
  brightness?: string;
  contrast?: string;
  saturation?: string;
  crop?: ValidCropMode | CropConfig;
  removeBackground?: boolean;
  fillBackground?: boolean;
  remove?: string[];
  replace?: string[];
  replaceBackground?: string;
  restore?: boolean;
  enhance?: boolean;
  recolor?: {
    color: string;
  };
}

interface TransformationState {
  // Basic transformations
  blur: string;
  grayscale: boolean;
  opacity: string;
  brightness: string;
  contrast: string;
  saturation: string;
  
  // Crop settings
  cropType: "standard" | "custom";
  cropMode: ValidCropMode;
  customCrop: {
    width: number;
    height: number;
    x: number;
    y: number;
    gravity: ValidCropGravity;
  };
  
  // Background and removal features
  removeBackground: boolean;
  fillBackground: boolean;
  
  // Generative AI features
  generativeFeatures: {
    removePrompt: string;
    removeShadow: boolean;
    removeMultiple: boolean;
    replaceFrom: string;
    replaceTo: string;
    replaceBackground: string;
    restore: boolean;
    enhanceQuality: boolean;
    recolor: {
      enabled: boolean;
      color: string;
    };
  };
}

const initialState: TransformationState = {
  // Basic transformations
  blur: "0",
  grayscale: false,
  opacity: "100",
  brightness: "100",
  contrast: "100",
  saturation: "100",
  
  // Crop settings
  cropType: "standard",
  cropMode: "pad",
  customCrop: {
    width: 450,
    height: 550,
    x: 0,
    y: 0,
    gravity: "center",
  },
  
  // Background and removal features
  removeBackground: false,
  fillBackground: false,
  
  // Generative AI features
  generativeFeatures: {
    removePrompt: "",
    removeShadow: false,
    removeMultiple: false,
    replaceFrom: "",
    replaceTo: "",
    replaceBackground: "",
    restore: false,
    enhanceQuality: false,
    recolor: {
      enabled: false,
      color: "",
    },
  },
};

export const ModifyImage = ({ image }: ModifyImageProps) => {
  const [transformations, setTransformations] = useState<TransformationState>(initialState);

  const resetTransformations = () => {
    setTransformations(initialState);
  };

  const handleSliderChange = (
    field: keyof Pick<TransformationState, "blur" | "opacity" | "brightness" | "contrast" | "saturation">,
    value: number[]
  ) => {
    const newValue = value[0];
    if (typeof newValue === "number") {
      setTransformations(prev => ({
        ...prev,
        [field]: newValue.toString()
      }));
    }
  };

  const prepareTransformations = (): CloudinaryTransformations => {
    // Basic image adjustments
    const basicTransformations: Partial<CloudinaryTransformations> = {
      blur: transformations.blur !== "0" ? transformations.blur : undefined,
      grayscale: transformations.grayscale,
      opacity: transformations.opacity !== "100" ? transformations.opacity : undefined,
      brightness: transformations.brightness !== "100" ? transformations.brightness : undefined,
      contrast: transformations.contrast !== "100" ? transformations.contrast : undefined,
      saturation: transformations.saturation !== "100" ? transformations.saturation : undefined,
    };

    // Crop settings
    const cropTransformations = transformations.cropType === "custom"
      ? {
          crop: {
            type: "crop" as const,
            width: transformations.customCrop.width,
            height: transformations.customCrop.height,
            x: transformations.customCrop.x,
            y: transformations.customCrop.y,
            gravity: transformations.customCrop.gravity,
          } as CropConfig,
        }
      : { crop: transformations.cropMode };

    // Background and removal transformations
    const backgroundTransformations = {
      removeBackground: transformations.removeBackground,
      fillBackground: transformations.fillBackground,
    };

    // Generative AI transformations
    const generativeTransformations: Partial<CloudinaryTransformations> = {
      remove: transformations.generativeFeatures.removePrompt
        ? [
            transformations.generativeFeatures.removePrompt,
            ...(transformations.generativeFeatures.removeShadow ? ["shadow"] : []),
            ...(transformations.generativeFeatures.removeMultiple ? ["multiple"] : []),
          ]
        : undefined,
      replace: transformations.generativeFeatures.replaceFrom && 
        transformations.generativeFeatures.replaceTo
        ? [
            transformations.generativeFeatures.replaceFrom,
            transformations.generativeFeatures.replaceTo,
          ]
        : undefined,
      replaceBackground: transformations.generativeFeatures.replaceBackground || undefined,
      restore: transformations.generativeFeatures.restore,
      enhance: transformations.generativeFeatures.enhanceQuality,
      recolor: transformations.generativeFeatures.recolor.enabled
        ? { color: transformations.generativeFeatures.recolor.color }
        : undefined,
    };

    return {
      ...basicTransformations,
      ...cropTransformations,
      ...backgroundTransformations,
      ...generativeTransformations,
    };
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6 flex flex-col md:flex-row gap-6">
      <Card className="md:w-1/3 h-fit">
        <CardContent className="p-6 space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="generative">Generative AI</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              {/* Basic Adjustments */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Blur</Label>
                  <Slider
                    value={[parseInt(transformations.blur)]}
                    onValueChange={(value) => handleSliderChange("blur", value)}
                    min={0}
                    max={2000}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Opacity</Label> 
                  <Slider
                    value={[parseInt(transformations.opacity)]}
                    onValueChange={(value) => handleSliderChange("opacity", value)}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Brightness</Label> 
                  <Slider
                    value={[parseInt(transformations.brightness)]}
                    onValueChange={(value) => handleSliderChange("brightness", value)}
                    min={0}
                    max={200}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Contrast</Label> 
                  <Slider
                    value={[parseInt(transformations.contrast)]}
                    onValueChange={(value) => handleSliderChange("contrast", value)}
                    min={0}
                    max={200}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Saturation</Label> 
                  <Slider
                    value={[parseInt(transformations.saturation)]}
                    onValueChange={(value) => handleSliderChange("saturation", value)}
                    min={0}
                    max={200}
                    step={1}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Grayscale</Label>
                  <Switch
                    checked={transformations.grayscale}
                    onCheckedChange={(checked) =>
                      setTransformations(prev => ({
                        ...prev,
                        grayscale: checked
                      }))
                    }
                  />
                </div>
              </div>

              {/* Crop Settings */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Crop Type</Label>
                  <Select
                    value={transformations.cropType}
                    onValueChange={(value: "standard" | "custom") =>
                      setTransformations(prev => ({
                        ...prev,
                        cropType: value
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Crop</SelectItem>
                      <SelectItem value="custom">Custom Crop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {transformations.cropType === "standard" && (
                  <div className="space-y-2">
                    <Label>Crop Mode</Label>
                    <Select
                      value={transformations.cropMode}
                      onValueChange={(value: ValidCropMode) =>
                        setTransformations(prev => ({
                          ...prev,
                          cropMode: value
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pad">Pad</SelectItem>
                        <SelectItem value="fill">Fill</SelectItem>
                        <SelectItem value="crop">Crop</SelectItem>
                        <SelectItem value="thumb">Thumb</SelectItem>
                        <SelectItem value="scale">Scale</SelectItem>
                        <SelectItem value="fit">Fit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {transformations.cropType === "custom" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="crop-x">X Offset</Label>
                        <Input
                          id="crop-x"
                          type="number"
                          value={transformations.customCrop.x}
                          onChange={(e) =>
                            setTransformations(prev => ({
                              ...prev,
                              customCrop: {
                                ...prev.customCrop,
                                x: parseInt(e.target.value) || 0
                              }
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="crop-y">Y Offset</Label>
                        <Input
                          id="crop-y"
                          type="number"
                          value={transformations.customCrop.y}
                          onChange={(e) =>
                            setTransformations(prev => ({
                              ...prev,
                              customCrop: {
                                ...prev.customCrop,
                                y: parseInt(e.target.value) || 0
                              }
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Gravity</Label>
                      <Select
                        value={transformations.customCrop.gravity}
                        onValueChange={(value: ValidCropGravity) =>
                          setTransformations(prev => ({
                            ...prev,
                            customCrop: {
                              ...prev.customCrop,
                              gravity: value
                            }
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gravity" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "center",
                            "north",
                            "south",
                            "east",
                            "west",
                            "north_east",
                            "north_west",
                            "south_east",
                            "south_west"
                          ].map((gravity) => (
                            <SelectItem key={gravity} value={gravity as ValidCropGravity}>
                              {gravity.replace("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              {/* Background Controls */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Remove Background</Label>
                  <Switch
                    checked={transformations.removeBackground}
                    onCheckedChange={(checked) =>
                      setTransformations(prev => ({
                        ...prev,
                        removeBackground: checked
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Fill Background</Label>
                  <Switch
                    checked={transformations.fillBackground}
                    onCheckedChange={(checked) =>
                      setTransformations(prev => ({
                        ...prev,
                        fillBackground: checked
                      }))
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="generative" className="space-y-4">
              {/* Remove Object with AI */}
              <div className="space-y-2">
                <Label>Remove Object (AI)</Label>
                <Input
                  placeholder="Enter object to remove"
                  value={transformations.generativeFeatures.removePrompt}
                  onChange={(e) =>
                    setTransformations((prev) => ({
                      ...prev,
                      generativeFeatures: {
                        ...prev.generativeFeatures,
                        removePrompt: e.target.value,
                      },
                    }))
                  }
                />
                <div className="flex items-center justify-between">
                  <Label>Remove Shadow</Label>
                  <Switch
                    checked={transformations.generativeFeatures.removeShadow}
                    onCheckedChange={(checked) =>
                      setTransformations((prev) => ({
                        ...prev,
                        generativeFeatures: {
                          ...prev.generativeFeatures,
                          removeShadow: checked,
                        },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Multiple Objects</Label>
                  <Switch
                    checked={transformations.generativeFeatures.removeMultiple}
                    onCheckedChange={(checked) =>
                      setTransformations((prev) => ({
                        ...prev,
                        generativeFeatures: {
                          ...prev.generativeFeatures,
                          removeMultiple: checked,
                        },
                      }))
                    }
                  />
                </div>
              </div>

              {/* Replace Objects */}
              <div className="space-y-2">
                <Label>Replace Objects</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Original object"
                    value={transformations.generativeFeatures.replaceFrom}
                    onChange={(e) =>
                      setTransformations((prev) => ({
                        ...prev,
                        generativeFeatures: {
                          ...prev.generativeFeatures,
                          replaceFrom: e.target.value,
                        },
                      }))
                    }
                  />
                  <Input
                    placeholder="New object"
                    value={transformations.generativeFeatures.replaceTo}
                    onChange={(e) =>
                      setTransformations((prev) => ({
                        ...prev,
                        generativeFeatures: {
                          ...prev.generativeFeatures,
                          replaceTo: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              </div>

              {/* Replace Background */}
              <div className="space-y-2">
                <Label>Replace Background</Label>
                <Input
                  placeholder="Describe new background"
                  value={transformations.generativeFeatures.replaceBackground}
                  onChange={(e) =>
                    setTransformations((prev) => ({
                      ...prev,
                      generativeFeatures: {
                        ...prev.generativeFeatures,
                        replaceBackground: e.target.value,
                      },
                    }))
                  }
                />
              </div>

              {/* Restore Image */}
              <div className="flex items-center justify-between">
                <Label>Restore Image</Label>
                <Switch
                  checked={transformations.generativeFeatures.restore}
                  onCheckedChange={(checked) =>
                    setTransformations((prev) => ({
                      ...prev,
                      generativeFeatures: {
                        ...prev.generativeFeatures,
                        restore: checked,
                      },
                    }))
                  }
                />
              </div>
            </TabsContent>
          </Tabs>

          <Button
            onClick={resetTransformations}
            variant="outline"
            className="w-full"
          >
            Reset All
          </Button>
        </CardContent>
      </Card>

      <div className="md:w-2/3 bg-black rounded-lg flex justify-center items-center p-6">
        <ImageDisplay
          public_id={image.public_id}
          secure_url={image.secure_url}
          alt={image.alt}
          type="view"
          transformations={prepareTransformations()}
        />
      </div>
    </div>
  );
};

export default ModifyImage;
