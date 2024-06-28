import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import { auth } from "@service";
import { SignUpModal } from '@modal';
import { ValidationSignUp } from "@validation";
import { ErrorMessage, Field, Form, Formik } from 'formik';


const Index = () => {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await auth.sign_up(values);
      if (response.status === 200) {
        setOpen(true);
        localStorage.setItem("email", values.email);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SignUpModal open={open} handleClose={() => setOpen(false)} />
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-full sm:w-[600px] p-5">
          <h1 className="text-center my-6 text-[50px]">Register</h1>
          <Formik
            initialValues={{ email: '', full_name: '', password: '', phone_number: '' }}
            validationSchema={ValidationSignUp}
            onSubmit={handleSubmit}
            id="submit"
          >
            {({ isSubmitting}) => (
              <Form className="flex flex-col gap-2">
                <Field
                  as={TextField}
                  fullWidth
                  id="email"
                  label="Email"
                  variant="outlined"
                  type="email"
                  name="email"
                 
                />
                <ErrorMessage name="email" component="div" style={{ color: 'red' }} />

                <Field
                  as={TextField}
                  fullWidth
                  id="full_name"
                  label="Full Name"
                  variant="outlined"
                  type="text"
                  name="full_name"
                  
                />
                <ErrorMessage name="full_name" component="div" style={{ color: 'red' }} />

                <Field
                  as={TextField}
                  fullWidth
                  id="password"
                  label="Password"
                  variant="outlined"
                  type="password"
                  name="password"
                
                />
                <ErrorMessage name="password" component="div" style={{ color: 'red' }} />

                <Field
                  as={TextField}
                  fullWidth
                  id="phone_number"
                  label="Phone Number"
                  variant="outlined"
                  type="text"
                  name="phone_number"
                 
                />
                <ErrorMessage name="phone_number" component="div" style={{ color: 'red' }} />

                <Button variant="contained" disableElevation type="submit" fullWidth disabled={isSubmitting}>
                  Sign Up
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default Index;