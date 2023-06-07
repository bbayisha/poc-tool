import React from 'react';
import { Box, Tooltip } from '@mui/material';
import { useDrag } from 'react-dnd';


const icons = [
  { id: 1, name: 'Icon 1', imageUrl: '21251776.third_party.svg' },
  { id: 2, name: 'Icon 2', imageUrl: '21251776.third_party.svg' },
  { id: 3, name: 'Icon 3', imageUrl: '21251776.third_party.svg' },
  // Add more icons as needed
];

const baseUrl = process.env.PUBLIC_URL + '/assets/media/';

// Define the Toolbar component
const Toolbar = () => {
  return (
    <Box display="flex" justifyContent="center" mt={3}>
      {icons.map((icon) => (
        <Icon key={icon.id} {...icon} />
      ))}
    </Box>
  );
};

// Define the Icon component
const Icon = ({ id, name, imageUrl }: { id: number; name: string; imageUrl: string }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'icon',
    item: { id, name, imageUrl },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const imageSrc = baseUrl + imageUrl;


  return (
    <Tooltip
    enterDelay={300}
    leaveDelay={50}
    arrow
     title={name}>
      <Box
       ref={drag}
       display="flex"
       justifyContent="center"
       alignItems="center"
       flexDirection='column'
       width={80}
       height={100}
       >
        <img src={imageSrc} alt={name} width={60} height={60} />
        <span>{name}</span>
      </Box>
    </Tooltip>
  );
};

export { Toolbar };
