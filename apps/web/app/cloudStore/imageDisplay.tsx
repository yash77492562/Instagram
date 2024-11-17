

// 'use client'
// import React, { MouseEvent, useState, useRef, useEffect } from 'react';
// import { CldImage } from "next-cloudinary";
// import { Button } from "@repo/ui/imageButton";
// import { 
//   Settings2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, 
//   ZoomIn, ZoomOut, Maximize2, RotateCcw, X 
// } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@repo/ui/dialog";

// interface Position {
//   x: number;  // -100 to 100
//   y: number;  // -100 to 100
//   zoom: number; // 1.0 to 2.0
// }

// interface DragState {
//   isDragging: boolean;
//   startX: number;
//   startY: number;
//   startPositionX: number;
//   startPositionY: number;
// }

// interface ImageDisplayProps {
//   public_id: string;
//   alt: string;
//   secure_url: string;
//   type: 'profile' | 'view';
//   initialPosition?: Position;
//   imageIndex?: number;
//   onPositionChange?: (imageId: string, index: number, position: Position) => void;
//   onClick?: (e: MouseEvent<HTMLDivElement>) => void;
// }

// const DEFAULT_POSITION: Position = { x: 0, y: 0, zoom: 1.0 };

// export const ImageDisplay = ({
//   public_id,
//   alt,
//   secure_url,
//   type,
//   initialPosition = DEFAULT_POSITION,
//   imageIndex = 0,
//   onPositionChange,
//   onClick
// }: ImageDisplayProps) => {
//   const [position, setPosition] = useState<Position>(initialPosition);
//   const [showControls, setShowControls] = useState(false);
//   const [showPreview, setShowPreview] = useState(false);
//   const [dragState, setDragState] = useState<DragState>({
//     isDragging: false,
//     startX: 0,
//     startY: 0,
//     startPositionX: 0,
//     startPositionY: 0
//   });

//   const containerRef = useRef<HTMLDivElement>(null);
//   const touchTimeoutRef = useRef<NodeJS.Timeout>();
//   const positionRef = useRef(position);

//   useEffect(() => {
//     positionRef.current = position;
//   }, [position]);

//   const updatePosition = (updates: Partial<Position>) => {
//     const newPosition = {
//       ...position,
//       ...updates,
//       x: Math.max(-100, Math.min(100, 'x' in updates ? updates.x! : position.x)),
//       y: Math.max(-100, Math.min(100, 'y' in updates ? updates.y! : position.y)),
//       zoom: Math.max(1.0, Math.min(2.0, 'zoom' in updates ? updates.zoom! : position.zoom))
//     };
//     setPosition(newPosition);
//     onPositionChange?.(public_id, imageIndex, newPosition);
//   };

//   const handleDragStart = (clientX: number, clientY: number) => {
//     setDragState({
//       isDragging: true,
//       startX: clientX,
//       startY: clientY,
//       startPositionX: position.x,
//       startPositionY: position.y
//     });
//   };

//   const handleDragMove = (clientX: number, clientY: number) => {
//     if (!dragState.isDragging) return;

//     const deltaX = clientX - dragState.startX;
//     const deltaY = clientY - dragState.startY;
//     const sensitivity = 0.5;

//     updatePosition({
//       x: dragState.startPositionX + deltaX * sensitivity,
//       y: dragState.startPositionY + deltaY * sensitivity
//     });
//   };

//   const handleDragEnd = () => {
//     setDragState(prev => ({ ...prev, isDragging: false }));
//   };

//   // Mouse event handlers
//   const handleMouseDown = (e: React.MouseEvent) => {
//     e.preventDefault();
//     handleDragStart(e.clientX, e.clientY);
//   };

//   const handleMouseMove = (e: React.MouseEvent) => {
//     e.preventDefault();
//     handleDragMove(e.clientX, e.clientY);
//   };

//   const handleMouseUp = (e: React.MouseEvent) => {
//     e.preventDefault();
//     handleDragEnd();
//   };

//   // Touch event handlers
//   const handleTouchStart = (e: React.TouchEvent) => {
//     const touch = e.touches[0];
//     if(touch === undefined){
//         return null
//     }
//     handleDragStart(touch.clientX, touch.clientY);

//     // Set up long press for showing controls
//     touchTimeoutRef.current = setTimeout(() => {
//       setShowControls(true);
//     }, 500);
//   };

//   const handleTouchMove = (e: React.TouchEvent) => {
//     const touch = e.touches[0];
//     if(touch === undefined){
//         return null
//     }
//     handleDragMove(touch.clientX, touch.clientY);

//     // Clear long press timeout if moving
//     if (touchTimeoutRef.current) {
//       clearTimeout(touchTimeoutRef.current);
//     }
//   };

//   const handleTouchEnd = () => {
//     handleDragEnd();
//     if (touchTimeoutRef.current) {
//       clearTimeout(touchTimeoutRef.current);
//     }
//   };

//   const resetPosition = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     updatePosition(DEFAULT_POSITION);
//   };

//   const STEP = 10;
//   const ZOOM_STEP = 0.1;

//   const controlButtons = [
//     { icon: ArrowUp, onClick: () => updatePosition({ y: position.y - STEP }), label: 'Move Up' },
//     { icon: ArrowDown, onClick: () => updatePosition({ y: position.y + STEP }), label: 'Move Down' },
//     { icon: ArrowLeft, onClick: () => updatePosition({ x: position.x - STEP }), label: 'Move Left' },
//     { icon: ArrowRight, onClick: () => updatePosition({ x: position.x + STEP }), label: 'Move Right' },
//     { icon: ZoomIn, onClick: () => updatePosition({ zoom: position.zoom + ZOOM_STEP }), label: 'Zoom In' },
//     { icon: ZoomOut, onClick: () => updatePosition({ zoom: position.zoom - ZOOM_STEP }), label: 'Zoom Out' },
//   ];

//   return (
//     <div className="relative">
//       <div
//         className="">
//         <CldImage
//           key={public_id}
//           src={secure_url}
//           alt={alt}
//           width={250}
//           height={250}
//           crop="fill"
//           gravity='auto:focus'
//           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//           className="w-auto h-auto max-w-[250px] max-h-[250px] hover:opacity-90 transition-opacity duration-200 rounded-sm select-none"
//           priority={true}
//         />
//       </div>

//       {type === 'view' && (
//         <>
//           <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 flex gap-2">
//             <Button
//               variant="secondary"
//               size="icon"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setShowPreview(true);
//               }}
//             >
//               <Maximize2 className="h-4 w-4" />
//             </Button>
//             <Button
//               variant="secondary"
//               size="icon"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setShowControls(!showControls);
//               }}
//             >
//               <Settings2 className="h-4 w-4" />
//             </Button>
//           </div>

//           {showControls && (
//             <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//               <div className="grid grid-cols-4 gap-2">
//                 {controlButtons.map((button, index) => (
//                   <Button
//                     key={index}
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-white hover:bg-white/20"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       button.onClick();
//                     }}
//                   >
//                     <button.icon className="h-4 w-4" />
//                   </Button>
//                 ))}
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-8 w-8 text-white hover:bg-white/20"
//                   onClick={resetPosition}
//                 >
//                   <RotateCcw className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           )}

//           <Dialog open={showPreview} onOpenChange={setShowPreview}>
//             <DialogContent className="max-w-screen-lg">
//               <DialogHeader>
//                 <DialogTitle>Original Image</DialogTitle>
//               </DialogHeader>
//               <div className="relative w-full h-full flex items-center justify-center">
//                 <CldImage
//                   src={secure_url}
//                   alt={alt}
//                   width={800}
//                   height={800}
//                   crop="limit"
//                   className="w-auto h-auto max-w-full max-h-[80vh] rounded-sm"
//                 />
//               </div>
//             </DialogContent>
//           </Dialog>
//         </>
//       )}
//     </div>
//   );
// };

// export default ImageDisplay;