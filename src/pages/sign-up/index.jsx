import React from "react";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { auth } from "@service";
import { SignUpModal } from "@modal";
import { Formik } from "formik";
import * as Yup from "yup";
import InputMask from "react-input-mask";

const Index = () => {
    const [open, setOpen] = useState(false);

    const initialValues = {
        email: "",
        full_name: "",
        password: "",
        phone_number: "",
    };

    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email address").required("Required"),
        full_name: Yup.string()
            .min(2, "Enter the name")
            .max(26, "Please enter right name")
            .required("Required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters long")
            .required("Required"),
        phone_number: Yup.string()
            .transform((value) => value.replace(/\s+/g, ""))
            .matches(/^\+\d{12}$/, "Phone number is not valid")
            .required("Required"),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await auth.sign_up(values);
            if (response.status === 200) {
                setOpen(true);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <SignUpModal
                open={open}
                handleClose={() => {
                    setOpen(false);
                }}
            />
            <div className="w-full h-screen flex items-center justify-center p-4">
                <div className="p-8  rounded-lg w-full max-w-sm sm:max-w-md lg:max-w-lg">
                    <h1 className="text-center my-3 font-medium text-2xl lg:text-4xl">
                        Register
                    </h1>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}>
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                        }) => (
                            <form
                                className="flex flex-col gap-4"
                                onSubmit={handleSubmit}>
                                <TextField
                                    type="email"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                    fullWidth
                                    label="Email"
                                    id="email"
                                    name="email"
                                    error={
                                        touched.email && Boolean(errors.email)
                                    }
                                    helperText={touched.email && errors.email}
                                />
                                <TextField
                                    type="text"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.full_name}
                                    fullWidth
                                    label="Full Name"
                                    id="full_name"
                                    name="full_name"
                                    error={
                                        touched.full_name &&
                                        Boolean(errors.full_name)
                                    }
                                    helperText={
                                        touched.full_name && errors.full_name
                                    }
                                />
                                <TextField
                                    type="password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    fullWidth
                                    label="Password"
                                    id="password"
                                    name="password"
                                    error={
                                        touched.password &&
                                        Boolean(errors.password)
                                    }
                                    helperText={
                                        touched.password && errors.password
                                    }
                                />
                                <InputMask
                                    mask="+999999999999"
                                    value={values.phone_number}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={false}
                                    maskChar="">
                                    {() => (
                                        <TextField
                                            type="text"
                                            fullWidth
                                            label="Phone Number"
                                            id="phone_number"
                                            name="phone_number"
                                            error={
                                                touched.phone_number &&
                                                Boolean(errors.phone_number)
                                            }
                                            helperText={
                                                touched.phone_number &&
                                                errors.phone_number
                                            }
                                        />
                                    )}
                                </InputMask>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    className="mt-4"
                                    disabled={isSubmitting}>
                                    Sign Up
                                </Button>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
};

export default Index;
