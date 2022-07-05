import * as React from 'react';
import { Inertia } from '@inertiajs/inertia';
import {LoadingButton} from '@mui/lab';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {useFormik} from 'formik';
import * as yup from 'yup';
import ServerValidationErrors from '../../Components/Forms/ValidationErrors';
import {useState} from 'react';
import Grid from '@mui/material/Grid';

const validationSchema = yup.object({
    email: yup
        .string()
        .email('Enter a valid email')
        .required('Email is required'),
});

const ForgotPassword = (props) => {
    const [formErrors, setFormErrors] = useState('');

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values, {setSubmitting}) => {
            // @ts-ignore
            Inertia.post(route('password.email'), values, {
                onError: (errors) => {
                    // @ts-ignore
                    setFormErrors(errors);
                    setSubmitting(false);
                },
                onSuccess: (page) => {
                    setFormErrors('');
                    setSubmitting(false);
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
            <Typography component="h1" variant="h5">
                Forgot password
            </Typography>

            {props.flash.message && (
                <Box
                    sx = {{
                        marginTop: '15px',
                        color: 'green'
                    }}
                >
                    {props.flash.message}
                </Box>
            )}

            <Grid
                sx = {{
                    marginTop: '15px',
                    marginBottom: '10px',
                }}
            >
                Forgot your password? No problem. Just let us know your
                email address and we will email you a password reset
                link that will allow you to choose a new one.
            </Grid>

            <ServerValidationErrors errors={formErrors} />

            <form onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email"
                    variant="standard"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    autoComplete='off'
                />

                <LoadingButton
                    type="submit"
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 5, mb: 2 }}
                    loading={formik.isSubmitting && !formik.isValidating}
                >
                    Send Password Reset Link
                </LoadingButton>
            </form>
        </Box>
    );
}

export default ForgotPassword;
