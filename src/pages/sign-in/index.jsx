import { Button, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { auth } from "@service";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
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

const Index = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

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
        </>
    );
};

export default Index;