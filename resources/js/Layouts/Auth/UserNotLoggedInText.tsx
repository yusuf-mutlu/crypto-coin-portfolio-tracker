import * as React from 'react';
import Box from "@mui/material/Box";

const UserNotLoggedInText = () => {
    return (
        <Box component="div" sx={{textAlign: "center", fontSize: "1.08em", border: "1px solid"}}>
            <p>"Log in" to access your portfolio!</p>
            <p>If you don't have an account "Sign up" to create your portfolio!</p>
            <p>or try demo account</p>
            <p>email: <b>user@example.com</b> password: <b>p@ssword</b></p>
        </Box>
    );
};

export default UserNotLoggedInText;
