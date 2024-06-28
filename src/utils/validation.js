import * as Yup from 'yup';

export const ValidationSignUp = Yup.object().shape({
	email: Yup.string().email('Invalid email').required('Required'),
	full_name: Yup.string().required('Required'),
	password: Yup.string()
		.min(8, 'Too Short!')
		.max(50, 'Too Long!')
		.matches(/[a-z]/, 'Password must contain at least one lowercase letter')
		.matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.matches(/\d/, 'Password must contain at least one number')
		.matches(/[@$!%*?&:#]/, 'Password must contain at least one special character')
		.required('Required'),
	phone_number: Yup.string()
		.matches(/^\+998\d{9}$/, 'Phone number must start with +998 and be followed by 9 digits')
		.required('Required'),
});

export const ValidationSignIn = Yup.object().shape({
	email: Yup.string().email('Invalid email').required('Required'),
	password: Yup.string()
		.min(8, 'Too Short!')
		.max(50, 'Too Long!')
		.matches(/[a-z]/, 'Password must contain at least one lowercase letter')
		.matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.matches(/\d/, 'Password must contain at least one number')
		.matches(/[@$!%*?&:#]/, 'Password must contain at least one special character')
		.required('Required'),
})

export const ValidationForgotPassword = Yup.object().shape({
	email: Yup.string().email('Invalid email').required('Required'),
})

export const updatePassValidationSchema = Yup.object().shape({
	code: Yup.string().required().trim()
});