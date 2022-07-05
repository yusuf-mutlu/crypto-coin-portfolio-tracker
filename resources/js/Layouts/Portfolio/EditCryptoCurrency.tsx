// @ts-nocheck
import * as React from 'react';
import { Inertia } from '@inertiajs/inertia';
import {LoadingButton} from '@mui/lab';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {useFormik} from "formik";
import * as yup from 'yup';
import ServerValidationErrors from '../../Components/Forms/ValidationErrors';
import {useState} from 'react';
import {Alert, Snackbar} from "@mui/material";

const validationSchema = yup.object({
    quantity: yup
        .number().test(
            'is-decimal',
            value => (value + "").match(/^\d*[\.{1}\d*]\d*$/),
        ).typeError('Quantity must be a number')
        .required('Enter quantity'),
});

const EditCryptoCurrency: React.FC<Props> = ({props, portfolioStyle, rowData}) => {
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
            quantity: rowData.quantity,
            portfolioStyle: portfolioStyle,
        },
        validationSchema: validationSchema,
        onSubmit: (values, actions) => {
            Inertia.patch(route('portfolio.update', {
                portfolio: rowData.id,
            }), values, {
                onError: (errors) => {
                    setFormErrors(errors);
                    actions.setSubmitting(false);
                },
                onSuccess: (res) => {
                    setFormErrors('');
                    actions.setStatus({message: 'Coin edited successfully.'});
                    setOpen(true);
                    actions.setSubmitting(false);
                    Inertia.visit(props.site_url, { preserveScroll: true });
                },
            })
        },
        enableReinitialize: true,
    });
    console.log(portfolioStyle);
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography component="h1" variant="h5" sx={{marginBottom: 3}}>
                Edit a coin from your portfolio
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

                <TextField
                    fullWidth
                    sx={{ minWidth: {xs: 50, md: 400}, marginTop: '35px' }}
                    id="quantity"
                    name="quantity"
                    label="Quantity"
                    variant="standard"
                    value={formik.values.quantity}
                    onChange={formik.handleChange}
                    error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                    helperText={formik.touched.quantity && formik.errors.quantity}
                />

                <TextField
                    id="portfolioStyle"
                    name="portfolioStyle"
                    value={portfolioStyle}
                    sx={{ display: 'none' }}
                />

                <LoadingButton
                    type="submit"
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 5, mb: 2 }}
                    loading={formik.isSubmitting && !formik.isValidating}
                >
                    Save
                </LoadingButton>
            </form>
        </Box>
    );
}

export default EditCryptoCurrency;
