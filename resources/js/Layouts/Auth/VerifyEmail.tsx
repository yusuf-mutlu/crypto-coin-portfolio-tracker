import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {useForm} from "@inertiajs/inertia-react";
import {LoadingButton} from "@mui/lab";

const VerifyEmail = (props) => {
    // @ts-ignore
    const { post, processing } = useForm();

    const submit = (e) => {
        e.preventDefault();
        // @ts-ignore
        post(route("verification.send"));
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography component="h1" variant="h5">
                Verify email address
            </Typography>

            <form onSubmit={submit} >
                {props.flash.message === 'verification-link-sent' && (
                    <Box
                        sx = {{
                            marginTop: '15px',
                            color: 'green'
                        }}
                    >
                        A new verification link has been sent to the email address
                        you provided during registration.
                    </Box>
                )}

                <Box
                    sx = {{
                        marginTop: '15px',
                    }}
                >
                    Thanks for signing up! Before getting started, could you verify
                    your email address by clicking on the link we just emailed to
                    you? If you didn't receive the email, we will gladly send you
                    another.
                </Box>

                <LoadingButton
                    type="submit"
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 3, mb: 2 }}
                    loading={processing}
                >
                    Resend Verification Email
                </LoadingButton>
            </form>
        </Box>
    );
}

export default VerifyEmail;
