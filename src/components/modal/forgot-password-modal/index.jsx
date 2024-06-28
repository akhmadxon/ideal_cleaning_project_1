import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { updatePassValidationSchema } from "@validation";
import { ErrorMessage, Field, Form, Formik } from "formik";
import {
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { auth } from "@service";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #fff",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function Index({ open, handleClose, email }) {
  const [showPassword, setShowPassword] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const initialValues = {
    code: "",
  };

  useEffect(() => {
    let timer = null;
    if (open) {
      timer = setInterval(() => {
        setSecondsLeft((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [open]);

  useEffect(() => {
    if (secondsLeft === 0) {
      handleClose();
    }
  }, [secondsLeft, handleClose]);

  const handleSubmit = async (values) => {
		const payload = { ...values, email };
    try {
      const verifyResponse = await auth.verify_forgot_password(payload);
      if (verifyResponse.status === 200 || verifyResponse.status === 201) {
        const updatePayload = {
          email,
          new_password: values.new_password,
        };
        const updateResponse = await auth.update_password(updatePayload);
        if (updateResponse.status === 200 || updateResponse.status === 201) {
					localStorage.setItem("access_token", updateResponse?.data?.access_token);
          console.log("Password updated successfully");
          handleClose();
        } else {
          console.log("Failed to update password", updateResponse);
        }
      } else {
        console.log("Verification failed", verifyResponse);
      }
    } catch (error) {
      console.log("Error in handleSubmit", error);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 500 }}>
          <Typography
            id="keep-mounted-modal-title"
            className="text-center"
            variant="h6"
            component="h2"
          >
            Verify
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={updatePassValidationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <Field
                name="code"
                type="text"
                as={TextField}
                label="Code"
                fullWidth
                margin="normal"
                variant="outlined"
                helperText={
                  <ErrorMessage
                    name="code"
                    component="p"
                    className="text-[red] text-[15px]"
                  />
                }
              />
              <Field
                name="new_password"
                type={showPassword ? "text" : "password"}
                as={TextField}
                label="New Password"
                fullWidth
                margin="normal"
                variant="outlined"
                helperText={
                  <ErrorMessage
                    name="new_password"
                    component="p"
                    className="text-[red] text-[15px]"
                  />
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="body1" component="p" className="my-4">
                {`Time left: ${secondsLeft} seconds`}
              </Typography>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                submit
              </Button>
            </Form>
          </Formik>
        </Box>
      </Modal>
    </>
  );
}