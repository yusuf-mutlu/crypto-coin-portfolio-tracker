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
import Autocomplete from '@mui/material/Autocomplete';
import axios from "axios";
import {Alert, Snackbar} from "@mui/material";

const validationSchema = yup.object({
    coin: yup
        .string()
        .required('Choose crypto currency'),
    quantity: yup
        .number().test(
            'is-decimal',
            value => (value + "").match(/^\d*[\.{1}\d*]\d*$/),
        ).typeError('Quantity must be a number')
        .required('Enter quantity'),
});

const AddCryptoCurrency: React.FC<Props> = ({props, sendRandomNumberToParent}) => {
    const [formErrors, setFormErrors] = useState('');
    const [coinsList, setCoinsList] = useState([]);
    const coinDropDownApiURL = props.site_url + '/coins-dropdown';
    const [open, setOpen] = React.useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const coinDropDownSearchApiURL = (searchString) => {
        return props.site_url + '/coins-dropdown-search?search=' + searchString;
    };

    async function fetchDropDownData() {
        axios.get(coinDropDownApiURL).then(response => {
            setCoinsList(response.data);
        });
    }

    const formik = useFormik({
        initialValues: {
            coin: '',
            quantity: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values, actions) => {
            Inertia.post(route('portfolio.store'), values, {
                onError: (errors) => {
                    setFormErrors(errors);
                    actions.setSubmitting(false);
                },
                onSuccess: (res) => {
                    setFormErrors('');
                    actions.resetForm();
                    actions.setStatus({message: 'Coin added to your portfolio.'});
                    setOpen(true);
                    sendRandomNumberToParent(Math.random());
                    actions.setSubmitting(false);
                },
            })
        },
    });

    const onInputChange = (e, value) => {
        const apiURL = coinDropDownSearchApiURL(value);

        if (value.toString().length > 1) {
            axios.get(apiURL).then(response => {
                setCoinsList(response.data);
            });
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography component="h1" variant="h5" sx={{marginBottom: 3}}>
                Add a coin to your portfolio
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
                <Autocomplete
                    id="coin"
                    name="coin"
                    sx={{ minWidth: {xs: 50, md: 400} }}
                    options={coinsList}
                    getOptionLabel={(option) => option.name + ' (' + option.symbol.toUpperCase() + ')'}
                    onChange={(e, value) => {
                        formik.setStatus({message: null});
                        formik.setFieldValue(
                            'coin',
                            value !== null ? value.id : formik.initialValues.coin
                        );
                    }}
                    renderOption={(props, option) => (
                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                            <img
                                loading="lazy"
                                width="20"
                                src={option.image_thumb}
                                srcSet={option.image_thumb}
                                alt=""
                            />
                            {option.name + ' (' + option.symbol.toUpperCase() + ')'}
                        </Box>
                    )}
                    onInputChange={onInputChange}
                    onOpen={() => {
                        formik.setStatus({message: null});
                        fetchDropDownData()
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            name="coin"
                            label="Coin"
                            error={formik.touched.coin && Boolean(formik.errors.coin)}
                            helperText={formik.touched.coin && formik.errors.coin}
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password', // disable autocomplete and autofill
                            }}
                        />
                    )}
                />

                <TextField
                    fullWidth
                    sx={{marginTop: '20px'}}
                    id="quantity"
                    name="quantity"
                    label="Quantity"
                    variant="standard"
                    value={formik.values.quantity}
                    onChange={formik.handleChange}
                    error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                    helperText={formik.touched.quantity && formik.errors.quantity}
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

export default AddCryptoCurrency;
