// @ts-nocheck
import * as React from 'react';
import { Inertia } from '@inertiajs/inertia';
import {LoadingButton} from '@mui/lab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {useFormik} from "formik";
import ServerValidationErrors from '../../Components/Forms/ValidationErrors';
import {useState} from 'react';
import {Alert, Snackbar} from "@mui/material";

const DeleteCryptoCurrency: React.FC<Props> = ({props, portfolioStyle ,rowData}) => {
    const [formErrors, setFormErrors] = useState('');
    const [open, setOpen] = React.useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const formik = useFormik({
        initialValues: {
            portfolioId: rowData.id,
        },
        onSubmit: (values, actions) => {
            Inertia.delete(`/portfolio/${formik.initialValues.portfolioId}?portfolioStyle=${portfolioStyle}`, {
                onError: (errors) => {
                    setFormErrors(errors);
                    actions.setSubmitting(false);
                },
                onSuccess: (res) => {
                    setFormErrors('');
                    actions.setStatus({message: 'Coin deleted successfully.'});
                    setOpen(true);
                    actions.setSubmitting(false);
                    Inertia.visit(props.site_url, { preserveScroll: true });
                },
            })
        },
    });

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography component="h1" variant="h5" sx={{marginBottom: 0}}>
                Are you sure you want to delete?
            </Typography>

            {formik.status && (
                <Snackbar
                    open={open}
                    anchorOrigin={{vertical: "top", horizontal: "center"}}
                    autoHideDuration={5000}
                    onClose={handleClose}
                >
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        {formik.status.message}
                    </Alert>
                </Snackbar>
            )}

            <ServerValidationErrors errors={formErrors} />

            <form onSubmit={formik.handleSubmit} >
                <Box
                    component='div'
                    sx={{
                        fontFamily: 'Roboto Helvetica Arial sans-serif',
                        fontWeight: '400',
                        fontSize: '1rem',
                        lineHeight: '1.4375em',
                        letterSpacing: '0.00938em',
                        marginBottom: '5px',
                        minWidth: {xs: 50, md: 400},
                        marginTop: '23px',
                    }}
                >
                    Coin:
                </Box>
                <Box component='div' sx={{
                    display: 'flex',
                    alignContent: 'space-between',
                    justifyContent: 'flex-start'
                }} >
                    <img
                        loading="lazy"
                        width="25"
                        src={rowData.image_thumb}
                        srcSet={rowData.image_thumb}
                        alt=""
                    />
                    &nbsp;{rowData.name + ' (' + rowData.symbol.toUpperCase() + ')'}
                </Box>

                <Box
                    component='div'
                    sx={{
                        fontFamily: 'Roboto Helvetica Arial sans-serif',
                        fontWeight: '400',
                        fontSize: '1rem',
                        lineHeight: '1.4375em',
                        letterSpacing: '0.00938em',
                        marginBottom: '5px',
                        minWidth: {xs: 50, md: 400},
                        marginTop: '35px',
                    }}
                >
                    Quantity:
                </Box>

                <Box component='div' sx={{
                    display: 'flex',
                    alignContent: 'space-between',
                    justifyContent: 'flex-start'
                }} >
                    {rowData.quantity}
                </Box>

                <LoadingButton
                    type="submit"
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 5, mb: 2 }}
                    loading={formik.isSubmitting && !formik.isValidating}
                >
                    Yes, Delete
                </LoadingButton>
            </form>
        </Box>
    );
}

export default DeleteCryptoCurrency;
