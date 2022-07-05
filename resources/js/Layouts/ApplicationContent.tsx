import * as React from 'react';
import Container from '@mui/material/Container';

const ApplicationContent = ({ props, children }) => {
    return (
        <Container fixed sx={{ marginTop: 2 }}>
            {children}
        </Container>
    );
};

export default ApplicationContent;
