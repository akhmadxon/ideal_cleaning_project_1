import { Button, Typography, Box, Modal } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { auth } from "@service";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

const codeValidationSchema = Yup.object().shape({
    code: Yup.string()
        .required("Code is required"),
    newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New password is required"),
});

const Index = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [codeModalOpen, setCodeModalOpen] = useState(false);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await auth.sign_in(values);
            if (response.status === 200) {
                localStorage.setItem(
                    "access_token",
                    response?.data?.access_token
                );
                toast.success("WELCOME to OUR PROJECT!");
                navigate("/main");
            } else {
                toast.error("FAILED");
            }
        } catch (error) {
            toast.error("FAILED");
        } finally {
            setSubmitting(false);
        }
    };

    const moveSignUp = () => {
        navigate("sign-up");
    };

    const handleForgotPassword = async () => {
        setCodeModalOpen(true);
        try {
            const response = await auth.forgot_password({ email });
            if (response.status === 200) {
                toast.success("Reset code sent to email");
            }
        } catch (error) {
            toast.error("Failed to send password reset code");
            console.log(error);
        }
    };

    const handleCodeSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await auth.reset_password(values);
            if (response.status === 200) {
                toast.success("Password reset successfully");
                setCodeModalOpen(false);
            } else {
                toast.error("Failed to reset password");
            }
        } catch (error) {
            toast.error("Failed to reset password");
            console.log(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="w-full h-screen flex items-center justify-center">
                <div className="w-[500px]">
                    <h1 className="text-center my-3 font-medium text-[40px]">
                        Login
                    </h1>

                    <Formik
                        initialValues={{ email: "", password: "" }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}>
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            isSubmitting,
                        }) => (
                            <Form className="flex flex-col gap-4">
                                <TextField
                                    type="email"
                                    onChange={(e) => {
                                        handleChange(e);
                                        setEmail(e.target.value);
                                    }}
                                    onBlur={handleBlur}
                                    fullWidth
                                    label="Email"
                                    id="email"
                                    name="email"
                                    value={values.email}
                                    error={
                                        touched.email && Boolean(errors.email)
                                    }
                                    helperText={touched.email && errors.email}
                                />
                                <TextField
                                    type="password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    fullWidth
                                    label="Password"
                                    id="password"
                                    name="password"
                                    value={values.password}
                                    error={
                                        touched.password &&
                                        Boolean(errors.password)
                                    }
                                    helperText={
                                        touched.password && errors.password
                                    }
                                />

                                <Button
                                    variant="contained"
                                    type="submit"
                                    disabled={isSubmitting}>
                                    Sign In
                                </Button>
                                <div className="flex justify-between">
                                    <Typography
                                        sx={{
                                            cursor: "pointer",
                                            textDecoration: "underline",
                                        }}
                                        onClick={moveSignUp}>
                                        Register
                                    </Typography>
                                    <Typography
                                        sx={{
                                            cursor: "pointer",
                                            textDecoration: "underline",
                                        }}
                                        onClick={handleForgotPassword}>
                                        Forgot password?
                                    </Typography>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>

            <Modal open={codeModalOpen} onClose={() => setCodeModalOpen(false)}>
                <Box sx={{ ...modalStyle }}>
                    <h2>Enter Verification Code</h2>
                    <Formik
                        initialValues={{ code: "", newPassword: "" }}
                        validationSchema={codeValidationSchema}
                        onSubmit={handleCodeSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form id="code-reset">
                                <div className="form-group my-2">
                                    <Field
                                        as={TextField}
                                        type="text"
                                        label="Verification Code"
                                        placeholder="Enter the code"
                                        name="code"
                                        fullWidth
                                    />
                                    <ErrorMessage name="code" component="div" className="text-danger" />
                                </div>
                                <div className="form-group my-2">
                                    <Field
                                        as={TextField}
                                        type="password"
                                        label="New Password"
                                        placeholder="Enter new password"
                                        name="newPassword"
                                        fullWidth
                                    />
                                    <ErrorMessage name="newPassword" component="div" className="text-danger" />
                                </div>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting}
                                >
                                    Reset Password
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Modal>
        </>
    );
};

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export default Index;
