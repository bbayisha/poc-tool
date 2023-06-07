import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Stage, Layer, Image, Line } from 'react-konva';
import useImage from 'use-image';
import { v4 as uuidv4 } from 'uuid';
import NavBar from './components/NavBar';
import './App.css';
import SearchBar from './components/SearchBar';
interface ImageData {
  id: string;
  x: number;
  y: number;
  src: string;
  connectedTo: number;
  lineCoords: LineCoords;
}
interface pointCoords{
  id: string;
  x: number;
  y: number;
}
interface LineCoords {
  srcNodeId: string;
  to: pointCoords
  from: pointCoords
}




interface URLImageProps {
  image: ImageData;
  onImageDelete: () => void;
  onCloseContextMenu: () => void;
  // selectedImageId: string | null;
  setSelectedImageId: React.Dispatch<React.SetStateAction<string | null>>;
  setLineCoords: React.Dispatch<React.SetStateAction<{ [key: string]: LineCoords; }>>;

}

const URLImage: React.FC<URLImageProps> = ({ image, onImageDelete, onCloseContextMenu, setLineCoords, setSelectedImageId}) => {
  const [img] = useImage(image.src);

  const dragBoundFunc = (pos:any) => {
  const stageWidth = window.innerWidth;
  const stageHeight = window.innerHeight;
  const imageWidth = 50; // Adjust the width of the image
  const imageHeight = 50; // Adjust the height of the image

  const minX = imageWidth / 2;
  const minY = imageHeight / 2;
  const maxX = stageWidth - imageWidth / 2;
  const maxY = stageHeight - imageHeight / 2;

  const x = Math.max(minX, Math.min(pos.x, maxX));
  const y = Math.max(minY, Math.min(pos.y, maxY));

  return { x, y };
  };
  const handleContextMenu = (e: any) => {
    e.evt.preventDefault();
    setSelectedImageId(image.id);
    const contextMenu = document.getElementById('context-menu');
    console.log(document.getElementById('context-menu'))
    if (contextMenu) {
      contextMenu.style.display = 'block';
      contextMenu.style.left = `${e.evt.clientX}px`;
      console.log(  )
      contextMenu.style.top = `${e.evt.clientY}px`;
      contextMenu.style.zIndex = `100`;
    }
    };

    const handleDragMove = (e: any) => {
      const imageId = image.id;
      const newX = e.target.x();
      const newY = e.target.y();

      setLineCoords((prevLineCoords: { [key: string]: LineCoords }) => {
        const updatedLineCoords = { ...prevLineCoords };

        Object.keys(updatedLineCoords).forEach((key) => {
          const coords = updatedLineCoords[key];
          const { from, to } = coords;

          if (from.id === imageId) {
            updatedLineCoords[key].from = { id: imageId, x: newX, y: newY };
          }

          if (to.id === imageId) {
            updatedLineCoords[key].to = { id: imageId, x: newX, y: newY };
          }
        });

        return updatedLineCoords;
      });


    };




  return (
    <Image
      image={img}
      x={image.x}
      y={image.y}
      draggable
      offsetX={img ? img.width / 6 : 0}
      offsetY={img ? img.height / 6 : 0}
      width={50}
      height={50}
      onContextMenu={handleContextMenu}
      dragBoundFunc={dragBoundFunc}
      onDragMove={handleDragMove}
    />
  );
};

const App: React.FC = () => {
  const dragUrl = useRef<string | undefined>();
  const stageRef = useRef<any>();
  const [images, setImages] = useState<ImageData[]>([]);
  const [lineCoords, setLineCoords] = useState<{ [key: string]: LineCoords }>({});
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);



  const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
    dragUrl.current = e.currentTarget.src;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    stageRef.current.setPointersPositions(e.nativeEvent);
    const newImage: ImageData = {
      id: uuidv4(),
      ...stageRef.current.getPointerPosition(),
      src: dragUrl.current!,
      connectedTo: -1, // Initialize connectedTo property
      lineCoords: {},
    };
    setImages((prevImages) => [...prevImages, newImage]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleImageDelete = () => {
    if (selectedImageId) {
      const updatedImages = images.filter((image) => image.id !== selectedImageId);
      const updatedLineCoords = { ...lineCoords };

      // Remove the lines connected to the deleted object
      Object.entries(updatedLineCoords).forEach(([key, coords]) => {
        if (key === selectedImageId) {
          delete updatedLineCoords[key];
        }
        if (coords.to.id === selectedImageId) {
          delete updatedLineCoords[key];
        }
      });

      setImages(updatedImages);
      setLineCoords(updatedLineCoords);
      setSelectedImageId(null);
      handleCloseContextMenu();
    }
  };




        const handleCloseContextMenu = () => {
          const contextMenu = document.getElementById('context-menu');
          if (contextMenu) {
            contextMenu.style.display = 'none';
          }
        };

        const handleImageConnect = (id: string) => {
          if (selectedImageId) {
            const srcImage = images.find((image) => image.id === selectedImageId);
            const destImage = images.find((image) => image.id === id);


            if (srcImage && destImage) {
              const updatedImages = images.map((image) => {
                if (image.id === selectedImageId) {
                  return {
                    ...image,
                    connectedTo: destImage.connectedTo + 1,
                  };
                }
                return image;
              });

              setImages(updatedImages);
              drawLine(srcImage, destImage);
            }

            setSelectedImageId(null);
            handleCloseContextMenu();
          }
        };


  const drawLine = (srcImage: ImageData, destImage: ImageData) => {
    const lineCoordsCopy = { ...lineCoords };
    lineCoordsCopy[srcImage.id] = {
      ...lineCoordsCopy[srcImage.id],
      from: {
        id: srcImage.id,
        x: srcImage.x,
        y: srcImage.y,
      },
      to: {
        id: destImage.id,
        x: destImage.x,
        y: destImage.y,
      },
    };

    setLineCoords(lineCoordsCopy);
  };





  const baseUrl = process.env.PUBLIC_URL + '/assets/media/';
  const imageUrl1 = "vEdge.png";
  const imageSrc1 = baseUrl + imageUrl1;
  const imageUrl2 = "vSmart.png";
  const imageSrc2 = baseUrl + imageUrl2;
  const imageUrl3 = "vManage.png";
  const imageSrc3 = baseUrl + imageUrl3;
  const imageUrl4 = "vBond.png";
  const imageSrc4 = baseUrl + imageUrl4;
  const imageUrl5 = "C8KV SD-WAN.png";
  const imageSrc5 = baseUrl + imageUrl5;



  return (
    <div>
      <NavBar />
      <div className='panel'>
        <div className='sideBar'>
          <SearchBar />
        </div>
        <div className='canvas-complete'>
        <div className='fullToolBar'>
      <h2>VNF Toolbar</h2>
      <div className='toolbar'>
      <div className='toolDiv'>
      <img
        alt="image"
        src={imageSrc1}
        width={50}
        height={50}
        draggable
        onDragStart={handleDragStart}
      />
      <span>vEdge</span>
      </div>
      <div className='toolDiv'>
            <img
        alt="image"
        src={imageSrc2}
        width={50}
        height={50}
        draggable
        onDragStart={handleDragStart}
      />  <span>vSmart</span>
      </div>
      <div className='toolDiv'>
            <img
        alt="image"
        src={imageSrc3}
        width={50}
        height={50}
        draggable
        onDragStart={handleDragStart}
      />
        <span>vManage</span>
      </div>
      <div className='toolDiv'>
            <img
        alt="image"
        src={imageSrc4}
        width={50}
        height={50}
        draggable
        onDragStart={handleDragStart}
      />
        <span>vBond</span>
      </div>
      <div className='toolDiv'>
            <img
        alt="image"
        src={imageSrc5}
        width={50}
        height={50}
        draggable
        onDragStart={handleDragStart}
      />
        <span>C8KV SD-WAN</span>
      </div>



      </div>
      </div>
      <div onDrop={handleDrop} onDragOver={handleDragOver}>
        <Stage
          width={1080}
          height={500}
          style={{ backgroundImage: 'radial-gradient(#ccc 10%, transparent 11%)', backgroundRepeat:'repeat', backgroundSize:'20px 20px' }}

          ref={stageRef}
        >
         <Layer>
         {Object.values(lineCoords).map((coords) => {
          return (
            <Line
              key={`${coords.from.id}-${coords.to.id}`}
              points={[coords.from.x, coords.from.y, coords.to.x, coords.to.y]}
              stroke="gray"
              strokeWidth={1}
            />
          );
        })}


            {images.map((image) => (
              <URLImage
                key={image.id}
                image={image}
                onImageDelete={handleImageDelete}
                onCloseContextMenu={handleCloseContextMenu}
                setSelectedImageId={setSelectedImageId}
                setLineCoords={setLineCoords}
              />
            ))}



          </Layer>
        </Stage>
      </div>

      <ul
      id="context-menu"
      style={{
        display: 'none',
        position: 'absolute',
        padding: '8px 0',
        margin: '0',
        zIndex: '100',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        // boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.16)',
        borderRadius: '4px',
        // maxHeight: '300px',
        overflowY: 'auto',
        objectFit:'contain',
        maxHeight:'100px !important',
        width:'100px !important'
      }}
    >
      <li
        style={{
          listStyleType: 'none',
          padding: '8px 16px',
        }}
      >
        <a
          onClick={() => {
            const subMenu = document.getElementById('sub-menu');
            if (subMenu) {
              subMenu.style.display =
                subMenu.style.display === 'block' ? 'none' : 'block';
            }
          }}
          style={{ cursor: 'pointer' }}
        >
          Connect
        </a>
        <ul
          id="sub-menu"
          style={{ display: 'none', paddingLeft: '10px', marginTop: '5px' }}
        >
          {images
            .filter((image) => image.id !== selectedImageId)
            .map((image) => (
              <li key={image.id} style={{ listStyleType: 'none' }}>
                <a
                  onClick={() => handleImageConnect(image.id)}
                  style={{ cursor: 'pointer', display: 'block' }}
                >
                  {image.id}
                </a>
              </li>
            ))}
        </ul>
      </li>
      <li
        style={{
          listStyleType: 'none',
          padding: '8px 16px',
        }}
      >
        <a onClick={handleImageDelete} style={{ cursor: 'pointer' }}>
          Delete
        </a>
      </li>
      <li
        style={{
          listStyleType: 'none',
          padding: '8px 16px',
          borderTop: '1px solid #ccc',
        }}
      >
        <button
          onClick={handleCloseContextMenu}
          style={{
            cursor: 'pointer',
            backgroundColor: 'transparent',
            border: 'none',
          }}
        >
          Close
        </button>
      </li>
    </ul>
        </div>
      </div>



    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
export default App
