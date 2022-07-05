import * as React from 'react';
import { Inertia } from '@inertiajs/inertia';
import {LoadingButton} from "@mui/lab";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {useFormik} from 'formik';
import * as yup from 'yup';
import ServerValidationErrors from '../../Components/Forms/ValidationErrors';
import {useState} from "react";

const validationSchema = yup.object({
    name: yup
        .string()
        .required('Name Surname is required'),
    email: yup
        .string()
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string()
        .min(6, 'Must be minimum 6 characters')
        .required('Password is required'),
    passwordConfirmation: yup
        .string()
        .required('Password confirmation is required')
        .oneOf([yup.ref("password")], "Passwords do not match"),
});

const Register = () => {
    const [formErrors, setFormErrors] = useState('');

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            name: '',
            passwordConfirmation: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values, {setSubmitting}) => {
            // @ts-ignore
            Inertia.post(route("register"), values, {
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
                Create an account
            </Typography>

            <ServerValidationErrors errors={formErrors} />

            <form onSubmit={formik.handleSubmit} >
                <TextField
                    fullWidth
                    sx={{marginTop: '20px'}}
                    id="name"
                    name="name"
                    label="Name Surname"
                    type="text"
                    variant="standard"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                />

                <TextField
                    fullWidth
                    sx={{marginTop: '20px'}}
                    id="email"
                    name="email"
                    label="Email"
                    type="text"
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
                    autoComplete="new-password"
                />

                <TextField
                    fullWidth
                    sx={{marginTop: '20px'}}
                    id="passwordConfirmation"
                    name="passwordConfirmation"
                    label="Confirm Password"
                    type="password"
                    variant="standard"
                    value={formik.values.passwordConfirmation}
                    onChange={formik.handleChange}
                    error={formik.touched.passwordConfirmation && Boolean(formik.errors.passwordConfirmation)}
                    helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
                    autoComplete="new-password"
                />

                <LoadingButton
                    type="submit"
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 3, mb: 2 }}
                    loading={formik.isSubmitting && !formik.isValidating}
                >
                    Create an account
                </LoadingButton>
            </form>
        </Box>
    );
}

export default Register;
