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

const validationSchema = yup.object({
    email: yup
        .string()
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string()
        .required('Password is required'),
});

const Login = () => {
    const [formErrors, setFormErrors] = useState('');

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values, {setSubmitting}) => {
            // @ts-ignore
            Inertia.post(route("login"), values, {
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
                Log In
            </Typography>

            <ServerValidationErrors errors={formErrors} />

            <form onSubmit={formik.handleSubmit} >
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
                />

                <TextField
                    fullWidth
                    sx={{marginTop: '20px'}}
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    variant="standard"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />

                <LoadingButton
                    type="submit"
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 3, mb: 2 }}
                    loading={formik.isSubmitting && !formik.isValidating}
                >
                    Log In
                </LoadingButton>
            </form>
        </Box>
    );
}

export default Login;
