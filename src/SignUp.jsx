import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './assets/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import text from './assets/json/text.json';
import paths from './assets/json/svg-paths.json';
import { motion } from 'framer-motion';

function SignUp({ settings }) {

    const { authState } = useContext(AuthContext);

    const [fieldType, setFieldType] = useState("password");
    
    const [loadSignUp, setLoadSignUp] = useState(false);

    useEffect(() => {
        document.title = text[settings.language].auth[1];
    }, []);

    const navigate = useNavigate();

    const initialValues = {
        username: "",
        password: ""
    };

    const validationSchema = Yup.object().shape({
        email: Yup
            .string()
            .required(text[settings.language].authErrors[7])
            .email(text[settings.language].authErrors[6]),
        username: Yup
            .string()
            .min(3, text[settings.language].authErrors[0])
            .max(15, text[settings.language].authErrors[0])
            .required(text[settings.language].authErrors[1]),
        password: Yup
            .string()
            .min(4, text[settings.language].authErrors[2])
            .max(30, text[settings.language].authErrors[2])
            .required(text[settings.language].authErrors[3]),
    });

    function createUser(data) {
        setLoadSignUp(true);
        axios.post(`${import.meta.env.VITE_API_KEY}/users`, data)
        .then(() => {
            navigate("/login");
            setLoadSignUp(false);
        });
    }

    return (
        <motion.div
            className='auth'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >
            {!authState.status ?
            <>
                <div style={{height: "3rem"}}/>
                <Formik
                    initialValues={initialValues}
                    onSubmit={createUser}
                    validationSchema={validationSchema}
                >
                    <Form className="signup-form">
                        <label>{text[settings.language].signup[0]}:</label>
                        <Field
                            className="signup-input"
                            name="email"
                            placeholder={text[settings.language].signup[1]}
                        />
                        <ErrorMessage name="email" component="span" />
                        <label>{text[settings.language].signup[2]}:</label>
                        <Field
                            className="signup-input"
                            name="username"
                            placeholder={text[settings.language].signup[3]}
                        />
                        <ErrorMessage name="username" component="span" />
                        <div>
                            <label style={{margin: "0"}}>{text[settings.language].signup[4]}:</label>
                            <svg onClick={() => setFieldType(fieldType === "password" ? "text" : "password")} fill={`var(--intermediate-${fieldType === "password" ? "green" : "red"})`} viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d={paths.hide[0]}/><path d={paths.hide[1]}/></svg>
                        </div>
                        <Field
                            className="signup-input"
                            type={fieldType}
                            name="password"
                            placeholder={text[settings.language].signup[5]}
                        />
                        <ErrorMessage name="password" component="span" />
                        <button type="submit" disabled={loadSignUp || validationSchema.validate(initialValues).then(() => false).catch(() => true)}>{
                            loadSignUp ? <span className="loader" style={{ width: "1.6rem", height: "1.6rem" }} />
                            : text[settings.language].auth[1]
                        }</button>
                    </Form>
                </Formik>
            </>
            : <div className="loggedIn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d={paths.loggedIn}/></svg>
                <h2 style={{width: "100%"}}>{text[settings.language].authErrors[5]}</h2>
            </div>}
        </motion.div>
    )
}

export default SignUp