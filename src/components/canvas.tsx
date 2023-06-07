import React, { useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { fabric } from 'fabric';
import { Box } from '@mui/material';


const baseUrl = process.env.PUBLIC_URL + '/assets/media/';
// Define the Canvas component
const Canvas = () => {
  const canvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    // Initialize the Fabric.js canvas
    canvasRef.current = new fabric.Canvas('canvas', {
      width: 800,
      height: 600,

    });

    const canvas=canvasRef.current
    const  BoundingBox= new fabric.Rect({
      width: 800,
      height: 600,
      hasBorders: false,
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
      evented: false,
      stroke: "black",
      fill: "red",
      selectable: false
      })

      canvasRef.current?.add(BoundingBox);
      // Event on object moving
      canvas.on('object:moving', (e) => {
        const object = e.target;
        const objectLeft=object?.left || 0;
        const objectTop=object?.top || 0;
        const objectWidth=object?.width || 0;
        const objectHeight=object?.height || 0;
        const BoundingBoxLeft=BoundingBox?.left || 0;
        const BoundingBoxTop=BoundingBox?.top || 0;
        const BoundingBoxWidth=BoundingBox?.width || 0;
        const BoundingBoxHeight=BoundingBox?.height || 0;


        // check left
        if (objectLeft < BoundingBoxLeft) {
          object?.set('left', BoundingBoxLeft);
        }
        // check right
        else if (objectLeft + objectWidth > BoundingBoxLeft + BoundingBoxWidth) {
          object?.set('left', BoundingBoxLeft + BoundingBoxWidth - objectWidth);
        }
        // check top
        if (objectTop < BoundingBoxTop) {
          object?.set('top', BoundingBoxTop);
        }
        // check bottom
        else if (objectTop + objectHeight > BoundingBoxTop + BoundingBoxHeight) {
          object?.set('top', BoundingBoxTop + BoundingBoxHeight - objectHeight);
        }
      });
      return () => {
        // Cleanup the Fabric.js canvas when the component unmounts
        if (canvasRef.current) {
          canvasRef.current.dispose();
          canvasRef.current = null;
        }
      };
    }, []);



    const handleDrop = (item: any, position: fabric.IPoint) => {
      if (!canvasRef.current) return;
      const imageSrc = baseUrl + item.imageUrl;

      // Create a new Fabric.js image object for the dropped icon
      fabric.Image.fromURL('http://localhost:3000'+imageSrc, (icon) => {
        icon.set({
          left: position.x,
          top: position.y,
          hasControls: false,
          hasBorders: false,
        });

        const desiredSize = 60;
        const boundingRect = icon.getBoundingRect();
        const scale = Math.min(desiredSize / boundingRect.height, desiredSize / boundingRect.width);
        icon.scaleToHeight(boundingRect.height * scale);
        icon.scaleToWidth(boundingRect.width * scale);

        // Add the icon to the canvas
        canvasRef.current?.add(icon);
        canvasRef.current?.renderAll();


      });
    };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const [, drop] = useDrop(() => ({
    accept: 'icon',
    drop: (item: any, monitor:any) => {
      console.log('canvas is refered',canvasRef.current);
      // const position = canvasRef.current?.getPointer(monitor.getClientOffset() || { x: 0, y: 0 });
      const position = monitor.getClientOffset()
      console.log('postions initial',monitor.getClientOffset())
      console.log('postions',position)
      if (position) {
        console.log('canvas is refered at the time of drop event',canvasRef.current);
        handleDrop(item, position);
      }
    },
  }));



  return (
    <Box
      border="1px solid gray"
      mt={3}
      onDragOver={handleDragOver}
      ref={drop}
    >
      <canvas style={{border:'2px solid red', margin:'auto', }} id="canvas" />
    </Box>
  );
};

export default Canvas;
