// @ts-nocheck
import React from 'react';
import {Dialog, DialogContent, DialogTitle} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/CancelPresentation";
import Container from "@mui/material/Container";

const DialogModal  = (props: { open: any; onClose: any; disableClose: any; children: any; }) => {
    const {open, onClose, disableClose, children} = props;

    return (
        <Dialog
            open={open}
        >
            <DialogTitle
                direction="row"
                display="flex"
                alignItems="end"
                flexDirection="column"
            >
                {!disableClose && (
                    <IconButton onClick={() => onClose(false)}>
                        <CloseIcon />
                    </IconButton>
                )}
            </DialogTitle>

            <DialogContent>
                <Container component="main" maxWidth="xs">
                    {children}
                </Container>
            </DialogContent>
        </Dialog>
    );
}

export default DialogModal;
