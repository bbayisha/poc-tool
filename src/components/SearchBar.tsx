import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function FormPropsTextFields() {
  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
      <TextField
          id="outlined-error-helper-text"
          defaultValue="Search"
          InputProps={{
            style: {
              color: 'rgba(231, 231, 231, 0.884)', // Change the text color here
              borderColor: 'rgba(231, 231, 231, 0.884)', // Change the border color here
            },
          }}
          InputLabelProps={{
            style: {
              color: 'rgba(231, 231, 231, 0.884)', // Change the label color here
            },
          }}
        />
      </div>
    </Box>
  );
}