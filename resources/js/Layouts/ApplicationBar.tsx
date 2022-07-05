// @ts-nocheck
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import {InertiaLink} from "@inertiajs/inertia-react";
import Login from '../Layouts/Auth/Login';
import Register from '../Layouts/Auth/Register';
import VerifyEmail from '../Layouts/Auth/VerifyEmail';
import ForgotPassword from '../Layouts/Auth/ForgotPassword';
import ResetPassword from '../Layouts/Auth/ResetPassword';
import Grid from "@mui/material/Grid";
import DialogModal from '../Layouts/DialogModal';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Link} from "@mui/material";

const pages = ['Home', 'Crypto Alarm'];

const ApplicationBar = (props: JSX.IntrinsicAttributes) => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [openLogin, setOpenLogin] = React.useState(false);
    const [openRegister, setOpenRegister] = React.useState(false);
    const [openVerifyEmail, setOpenVerifyEmail] = React.useState(true);
    const [openForgotPassword, setOpenForgotPassword] = React.useState(false);
    const [openResetPassword, setOpenResetPassword] = React.useState(true);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleOpenLogin = () => {
        setOpenLogin(true);
        handleCloseUserMenu();
    }

    const handleOpenRegister = () => {
        setOpenRegister(true);
        handleCloseUserMenu();
    }

    const getHrefForMenu = (page) => {
        if (page === 'Crypto Alarm') {
            return '/crypto-alarm';
        }

        if (page === 'Home') {
            return '/';
        }

        return '#';
    }

    // @ts-ignore
    return (
        <>
            <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid #eff2f5' }}>
                <Container fixed>
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                        >
                            <InertiaLink href="/">
                                <img style={{ marginTop: "9px" }} src="https://awesomebucket12.s3.us-east-2.amazonaws.com/logo.png" height="45" alt="Crypto Track" />
                            </InertiaLink>
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>

                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                            >
                                {pages.map((page) => (
                                    <InertiaLink
                                        key={ page }
                                        href={getHrefForMenu(page)}
                                    >
                                        <MenuItem onClick={handleCloseNavMenu}>
                                            <Typography textAlign="center">
                                                {page}
                                            </Typography>
                                        </MenuItem>
                                    </InertiaLink>
                                ))}
                            </Menu>
                        </Box>

                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{  flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                        >
                            <InertiaLink
                                href="/"

                            >
                                <img style={{ marginTop: "5px" }} src="https://awesomebucket12.s3.us-east-2.amazonaws.com/logo.png" height="45" alt="Crypto Track" />
                            </InertiaLink>
                        </Typography>

                        <Box sx={{  marginLeft: "32px", flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {pages.map((page) => (
                                <InertiaLink
                                    key={ page }
                                    href={ getHrefForMenu(page) }
                                    style={{ color: "#000", marginRight: "15px", textDecoration: "none"}}
                                >
                                    {page}
                                </InertiaLink>
                            ))}
                        </Box>

                        {props.auth.user ? (
                            <Box sx={{ flexGrow: 0 }}>
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="Remy Sharp" src="" />
                                </IconButton>

                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <InertiaLink href={route("logout")}  as="div" method="post">
                                        <MenuItem onClick={() => [
                                            handleCloseNavMenu,
                                            setOpenLogin(false)
                                        ]}>
                                            <Typography textAlign="center">
                                                Logout
                                            </Typography>
                                        </MenuItem>
                                    </InertiaLink>
                                </Menu>
                            </Box>
                        ) : (
                            <>
                                <Button
                                    onClick={handleOpenLogin}
                                    sx={{
                                        color: 'inherit', display: 'block', border: 'none', textTransform: 'none',
                                        "&:hover": {
                                            border: 'none',
                                        },
                                    }}
                                >
                                    Log in
                                </Button>

                                <Button
                                    onClick={handleOpenRegister}
                                    variant='standard'
                                    size="small"
                                    sx={{
                                        textTransform: 'none',
                                        padding: '5px 8px'
                                    }}
                                >
                                    Sign up
                                </Button>
                            </>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            {!props.auth.user && openLogin && (
                <DialogModal open={openLogin} onClose={() => setOpenLogin(false)} disableClose={false}>
                    <Login />

                    <Grid container>
                        <Grid item xs>
                            <Button
                                onClick={() => [setOpenLogin(false), setOpenForgotPassword(true)]}
                                sx={{
                                    color: 'inherit', display: 'block', border: 'none', textTransform: 'none', fontWeight: 400,
                                    "&:hover": {
                                        border: 'none',
                                    },
                                }}
                            >
                                Forgot password?
                            </Button>
                        </Grid>

                        <Grid item>
                            <Button
                                onClick={() => [setOpenLogin(false), setOpenRegister(true)]}
                                sx={{
                                    color: 'inherit', display: 'block', border: 'none', textTransform: 'none', fontWeight: 400,
                                    "&:hover": {
                                        border: 'none',
                                    },
                                }}
                            >
                                Not registered yet?
                            </Button>
                        </Grid>
                    </Grid>
                </DialogModal>
            )}

            {!props.auth.user && openRegister && (
                <DialogModal open={openRegister} onClose={() => setOpenRegister(false)} disableClose={false}>
                    <Register  />

                    <Grid
                        container
                        display="flex"
                        alignItems="end"
                        flexDirection="column"
                    >
                        <Grid item>
                            <Button
                                onClick={() => [setOpenLogin(true), setOpenRegister(false)]}
                                sx={{
                                    color: 'inherit', display: 'block', border: 'none', textTransform: 'none', fontWeight: 400,
                                    "&:hover": {
                                        border: 'none',
                                    },
                                }}
                            >
                                Already registered?
                            </Button>
                        </Grid>
                    </Grid>
                </DialogModal>
            )}

            {props.auth.user && props.auth.user.email_verified_at === null && openVerifyEmail && (
                //Uncomment below code if you want to force email verification
                /*
                <DialogModal open={openVerifyEmail} disableClose={true} onClose={false}>
                    <VerifyEmail {...props} />
                </DialogModal>
                 */
                <></>
            )}

            {!props.auth.user && openForgotPassword && (
                <DialogModal open={openForgotPassword} onClose={() => setOpenForgotPassword(false)} disableClose={false}>
                    <Grid
                        sx = {{
                            marginBottom: '10px',
                        }}
                        container
                        display="flex"
                        alignItems="left"
                        flexDirection="column"
                    >
                        <Grid
                            sx = {{
                                marginBottom: '15px',
                                justifyContent: 'flex-start',
                            }}
                            container
                            display='flex'
                        >
                            <Button
                                onClick={() => [setOpenLogin(true), setOpenForgotPassword(false)]}
                                sx={{
                                    color: 'inherit', display: 'block', border: 'none', textTransform: 'none', fontWeight: 400,
                                    padding: '0px',
                                    "&:hover": {
                                        border: 'none',
                                    },
                                }}
                            >
                                <ArrowBackIcon
                                    sx={{
                                        stroke: 'whitesmoke',
                                    }}
                                /> Go to Login Page
                            </Button>
                        </Grid>
                    </Grid>
                    <ForgotPassword {...props} />
                </DialogModal>
            )}

            {!props.auth.user && props.resetToken && openResetPassword && (
                <DialogModal open={openResetPassword} onClose={() => setOpenResetPassword(false)} disableClose={false}>
                    <Grid
                        sx = {{
                            marginBottom: '30px',
                            justifyContent: 'flex-start',
                        }}
                        container
                        display='flex'
                    >
                        <Button
                            onClick={() => [setOpenLogin(true), setOpenResetPassword(false)]}
                            sx={{
                                color: 'inherit', display: 'block', border: 'none', textTransform: 'none', fontWeight: 400,
                                padding: '0px',
                                "&:hover": {
                                    border: 'none',
                                },
                            }}
                        >
                            <ArrowBackIcon
                                sx={{
                                    stroke: 'whitesmoke',
                                }}
                            /> Go to Login Page
                        </Button>
                    </Grid>
                    <ResetPassword {...props} />
                </DialogModal>
            )}
        </>
    );
};

export default ApplicationBar;
