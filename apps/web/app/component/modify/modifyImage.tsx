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

type ImageResource = {
  current_index: number;
  public_id: string;
  secure_url: string;
  alt: string;
};

interface ModifyImageProps {
  image: ImageResource;
}

export const ModifyImage = ({ image }: ModifyImageProps) => {
  const [transformations, setTransformations] = useState({
    blur: "0",
    grayscale: false,
    opacity: "100",
    removeBackground: false,
    fillBackground: false,
    cropType: "standard" as "standard" | "custom",
    crop: "pad" as "pad" | "fill" | "crop" | "thumb" | "scale" | "fit",
    customCrop: {
      width: 450,
      height: 550,
      x: 0,
      y: 0,
      gravity: "north" as const,
    },
  });

  const resetTransformations = () => {
    setTransformations({
      blur: "0",
      grayscale: false,
      opacity: "100",
      removeBackground: false,
      fillBackground: false,
      cropType: "standard",
      crop: "pad",
      customCrop: {
        width: 450,
        height: 550,
        x: 0,
        y: 0,
        gravity: "north",
      },
    });
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6 flex flex-col md:flex-row gap-6">
      <Card className="md:w-1/3 h-fit">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            {/* Crop Type Selection */}
            <div className="space-y-2">
              <Label>Crop Type</Label>
              <Select
                value={transformations.cropType}
                onValueChange={(value) =>
                  setTransformations((prev) => ({
                    ...prev,
                    cropType: value as "standard" | "custom",
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

            {/* Standard Crop Options */}
            {transformations.cropType === "standard" && (
              <div className="space-y-2">
                <Label>Crop Mode</Label>
                <Select
                  value={transformations.crop}
                  onValueChange={(value) =>
                    setTransformations((prev) => ({
                      ...prev,
                      crop: value as typeof transformations.crop,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {["pad", "fill", "crop", "thumb", "scale", "fit"].map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Custom Crop Fields */}
            {transformations.cropType === "custom" && (
              <div className="space-y-4">
                <Label>Custom Crop Settings</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="width">Width (450px)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={450}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (550px)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={550}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="x">X Offset</Label>
                    <Input
                      id="x"
                      type="number"
                      value={transformations.customCrop.x}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setTransformations((prev) => ({
                          ...prev,
                          customCrop: {
                            ...prev.customCrop,
                            x: value,
                          },
                        }));
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="y">Y Offset</Label>
                    <Input
                      id="y"
                      type="number"
                      value={transformations.customCrop.y}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setTransformations((prev) => ({
                          ...prev,
                          customCrop: {
                            ...prev.customCrop,
                            y: value,
                          },
                        }));
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Label>Gravity</Label>
                  <Select
                    value={transformations.customCrop.gravity}
                    onValueChange={(value) =>
                      setTransformations((prev) => ({
                        ...prev,
                        customCrop: {
                          ...prev.customCrop,
                          gravity: value as typeof transformations.customCrop.gravity,
                        },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gravity" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "north",
                        "south",
                        "east",
                        "west",
                        "north_east",
                        "north_west",
                        "south_east",
                        "south_west",
                        "center",
                      ].map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Blur */}
            <div className="space-y-2">
              <Label>Blur</Label>
              <Slider
                value={[parseInt(transformations.blur)]}
                onValueChange={([value]) => {
                  if (value !== undefined) {
                    setTransformations((prev) => ({
                      ...prev,
                      blur: value.toString(),
                    }));
                  }
                }}
                min={0}
                max={2000}
                step={1}
              />
            </div>

            {/* Opacity */}
            <div className="space-y-2">
              <Label>Opacity</Label>
              <Slider
                value={[parseInt(transformations.opacity)]}
                onValueChange={([value]) => {
                  if (value !== undefined) {
                    setTransformations((prev) => ({
                      ...prev,
                      opacity: value.toString(),
                    }));
                  }
                }}
                min={0}
                max={100}
                step={1}
              />
            </div>

            {/* Other controls */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Grayscale</Label>
                <Switch
                  checked={transformations.grayscale}
                  onCheckedChange={(checked) =>
                    setTransformations((prev) => ({
                      ...prev,
                      grayscale: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Remove Background</Label>
                <Switch
                  checked={transformations.removeBackground}
                  onCheckedChange={(checked) =>
                    setTransformations((prev) => ({
                      ...prev,
                      removeBackground: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Fill Background</Label>
                <Switch
                  checked={transformations.fillBackground}
                  onCheckedChange={(checked) =>
                    setTransformations((prev) => ({
                      ...prev,
                      fillBackground: checked,
                    }))
                  }
                />
              </div>
            </div>

            <Button
              onClick={resetTransformations}
              variant="outline"
              className="w-full"
            >
              Reset All
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="md:w-2/3 bg-black rounded-lg flex justify-center items-center p-6">
        <ImageDisplay
          public_id={image.public_id}
          secure_url={image.secure_url}
          alt={image.alt}
          type="view"
          transformations={
            transformations.cropType === "custom"
              ? {
                  ...transformations,
                  crop: {
                    type: "crop",
                    width: 450,
                    height: 550,
                    x: transformations.customCrop.x,
                    y: transformations.customCrop.y,
                    gravity: transformations.customCrop.gravity,
                  },
                }
              : transformations
          }
        />
      </div>
    </div>
  );
};

export default ModifyImage;