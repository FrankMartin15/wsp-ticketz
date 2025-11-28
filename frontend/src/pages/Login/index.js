import React, { useState, useContext, useEffect, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid"; 
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import EmailIcon from "@material-ui/icons/Email";
import LockIcon from "@material-ui/icons/Lock";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Turnstile from "react-turnstile";
import { toast } from "react-toastify";

import { i18n } from "../../translate/i18n";

import { AuthContext } from "../../context/Auth/AuthContext";
import useSettings from "../../hooks/useSettings";

const useStyles = makeStyles(theme => ({
	root: {
		margin: 0,
		fontFamily: "'Segoe UI', sans-serif",
		background: "#f5f5f5",
		display: "flex",
		height: "100vh",
		width: "100vw",
		overflow: "hidden",
	},
	container: {
		display: "flex",
		width: "100%",
	},
	loginPanel: {
		width: "100%",
		maxWidth: "480px",
		background: "#fff",
		padding: "50px",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		boxShadow: "0 0 20px rgba(0,0,0,0.1)",
		overflowY: "auto",
	},
	logoContainer: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		marginBottom: "30px",
	},
	logoImg: {
		width: "220px",
		marginBottom: "25px",
		display: "block",
		maxWidth: "100%",
		height: "auto",
	},
	title: {
		marginBottom: "0",
		fontWeight: 600,
		color: "#222",
		fontSize: "24px",
		textAlign: "center",
	},
	form: {
		width: "100%",
	},
	inputGroup: {
		marginBottom: "20px",
	},
	inputLabel: {
		fontWeight: 500,
		fontSize: "14px",
		marginBottom: "5px",
		display: "block",
		color: "#333",
	},
	textField: {
		"& .MuiOutlinedInput-root": {
			borderRadius: "6px",
			backgroundColor: "#ffffff",
			transition: "all 0.2s ease",
			"& fieldset": {
				borderColor: "#ccc",
				borderWidth: "1px",
			},
			"&:hover fieldset": {
				borderColor: "#00548ba8",
			},
			"&.Mui-focused fieldset": {
				borderColor: "#00548ba8",
				borderWidth: "1px",
				boxShadow: "0 0 8px rgba(0,123,255,0.2)",
			},
		},
		"& .MuiOutlinedInput-input": {
			padding: "14px 12px",
			color: "#222",
			fontSize: "15px",
			fontFamily: "'Segoe UI', sans-serif",
			"&::placeholder": {
				color: "#999",
				opacity: 1,
			},
		},
		"& .MuiInputLabel-outlined": {
			display: "none",
		},
		"& .MuiInputAdornment-root": {
			color: "#666",
		},
	},
	iconButton: {
		padding: "8px",
		color: "#666",
		"&:hover": {
			color: "#00548ba8",
			backgroundColor: "transparent",
		},
	},
	captchaCheck: {
		display: "flex",
		alignItems: "center",
		gap: "10px",
		marginBottom: "20px",
		marginTop: "10px",
	},
	turnstileContainer: {
		marginBottom: "20px",
		display: "flex",
		justifyContent: "center",
		"& > div": {
			width: "100% !important",
			maxWidth: "300px",
		},
	},
	submit: {
		background: "linear-gradient(135deg, #005d81, #0082b6)",
		color: "#fff",
		width: "100%",
		padding: "14px",
		fontSize: "16px",
		border: "none",
		borderRadius: "8px",
		cursor: "pointer",
		transition: "0.3s",
		fontWeight: 600,
		textTransform: "none",
		"&:hover": {
			transform: "translateY(-2px)",
			background: "linear-gradient(135deg, #004d6d, #006d95)",
			boxShadow: "0 4px 12px rgba(0,123,255,0.3)",
		},
	},
	imagePanel: {
		flex: 1,
		backgroundImage: "url('https://edybs.com/wp-content/uploads/2025/11/familia.jpeg')",
		backgroundSize: "cover",
		backgroundPosition: "center",
		display: "block",
		"@media(max-width: 900px)": {
			display: "none",
		},
	},
	"@media(max-width: 900px)": {
		loginPanel: {
			maxWidth: "100%",
			width: "100%",
			height: "100vh",
		},
	},
	forgotPassword: {
		marginTop: "20px",
		textAlign: "center",
		"& a": {
			color: "#025da8a8",
			cursor: "pointer",
			fontSize: "14px",
			textDecoration: "none",
			"&:hover": {
				textDecoration: "underline",
			},
		},
	},
	modal: {
		position: "fixed",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		background: "rgba(0,0,0,0.5)",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		backdropFilter: "blur(3px)",
		zIndex: 9999,
	},
	modalContent: {
		background: "#fff",
		padding: "30px",
		borderRadius: "10px",
		maxWidth: "400px",
		width: "90%",
		textAlign: "center",
		boxShadow: "0 0 20px rgba(0,0,0,0.15)",
		animation: "$shake 0.5s ease",
	},
	"@keyframes shake": {
		"0%, 100%": {
			transform: "translateX(0) scale(0.9)",
			opacity: 0,
		},
		"10%": {
			transform: "translateX(-10px) scale(0.95)",
			opacity: 0.5,
		},
		"20%": {
			transform: "translateX(10px) scale(0.98)",
			opacity: 0.8,
		},
		"30%": {
			transform: "translateX(-10px) scale(1)",
			opacity: 1,
		},
		"40%": {
			transform: "translateX(10px) scale(1)",
		},
		"50%": {
			transform: "translateX(-5px) scale(1)",
		},
		"60%": {
			transform: "translateX(5px) scale(1)",
		},
		"70%": {
			transform: "translateX(-2px) scale(1)",
		},
		"80%": {
			transform: "translateX(2px) scale(1)",
		},
		"90%": {
			transform: "translateX(0) scale(1)",
			opacity: 1,
		},
	},
	modalText: {
		fontSize: "15px",
		marginBottom: "25px",
		color: "#333",
		lineHeight: 1.6,
		"& strong": {
			color: "#025374",
			fontWeight: 600,
		},
	},
	btnAceptar: {
		background: "#025374",
		color: "#fff",
		padding: "10px 25px",
		border: "none",
		borderRadius: "6px",
		cursor: "pointer",
		fontSize: "15px",
		fontWeight: 500,
		transition: "all 0.3s ease",
		"&:hover": {
			background: "#013a52",
			transform: "translateY(-2px)",
			boxShadow: "0 4px 12px rgba(2,83,116,0.3)",
		},
	},
}));

const Login = () => {
	const classes = useStyles();
  const { getPublicSetting } = useSettings();

	const [user, setUser] = useState({ email: "", password: "" });
	const [allowSignup, setAllowSignup] = useState(false);
	const [captchaChecked, setCaptchaChecked] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [turnstileToken, setTurnstileToken] = useState("");
	const [config, setConfig] = useState({});
	const [modalOpen, setModalOpen] = useState(false);
	const turnstileRef = useRef(null);

	const { handleLogin } = useContext(AuthContext);
	
	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};
	
	const handleTurnstileVerify = (token) => {
		setTurnstileToken(token);
	};
	
	const openModal = () => {
		setModalOpen(true);
	};
	
	const closeModal = () => {
		setModalOpen(false);
	};

	const handleChangeInput = e => {
		setUser({ ...user, [e.target.name]: e.target.value.trim() });
	};

	const handlSubmit = async (e) => {
		e.preventDefault();
		
		if (config.TURNSTILE_SITE_KEY && !turnstileToken) {
			toast.error("Por favor completa la verificación de seguridad");
			return;
		}
		
		const loginData = { ...user };
		if (config.TURNSTILE_SITE_KEY) {
			loginData.turnstileToken = turnstileToken;
		}
		
		handleLogin(loginData);
	};

  useEffect(() => {
    getPublicSetting("allowSignup").then(
      (data) => {
        setAllowSignup(data === "enabled");
      }
    ).catch((error) => {
      console.log("Error reading setting",error);
    });
    
    // Cargar configuración de Turnstile
    fetch("/config.json")
      .then((response) => response.json())
      .then((data) => {
        setConfig(data);
      })
      .catch((error) => {
        console.log("Error loading config", error);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

	return (
		<div className={classes.root}>
			<CssBaseline/>
			<div className={classes.container}>
				<div className={classes.loginPanel}>
					<div className={classes.logoContainer}>
						<img 
							src="https://edybs.com/wp-content/uploads/2025/11/LOGO_EDY_SANCHEZ__1_-removebg-preview.png" 
							className={classes.logoImg} 
							alt="Logo" 
						/>
						<h2 className={classes.title}>Acceder a Ticketz</h2>
					</div>
					
					<form className={classes.form} noValidate onSubmit={handlSubmit}>
						<div className={classes.inputGroup}>
							<label className={classes.inputLabel}>Correo electrónico</label>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="email"
								placeholder="Ingresa tu correo"
								name="email"
								value={user.email}
								onChange={handleChangeInput}
								autoComplete="email"
								autoFocus
								className={classes.textField}
								InputLabelProps={{ shrink: false }}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<EmailIcon />
										</InputAdornment>
									),
								}}
							/>
						</div>
						
						<div className={classes.inputGroup}>
							<label className={classes.inputLabel}>Contraseña</label>
							<TextField
								variant="outlined"
								required
								fullWidth
								name="password"
								placeholder="Ingresa tu contraseña"
								type={showPassword ? "text" : "password"}
								id="password"
								value={user.password}
								onChange={handleChangeInput}
								autoComplete="current-password"
								className={classes.textField}
								InputLabelProps={{ shrink: false }}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<LockIcon />
										</InputAdornment>
									),
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={handleClickShowPassword}
												onMouseDown={handleMouseDownPassword}
												edge="end"
												className={classes.iconButton}
											>
												{showPassword ? <Visibility /> : <VisibilityOff />}
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
						</div>
						
					{config.TURNSTILE_SITE_KEY && (
						<div className={classes.turnstileContainer}>
							<Turnstile
								ref={turnstileRef}
								sitekey={config.TURNSTILE_SITE_KEY}
								onVerify={handleTurnstileVerify}
								theme="light"
								language="es"
							/>
						</div>
					)}
					
						<Button
							type="submit"
							fullWidth
							variant="contained"
							className={classes.submit}
						>
							Iniciar sesión
						</Button>
						
						<div className={classes.forgotPassword}>
							<a onClick={openModal}>¿Olvidaste tu contraseña?</a>
						</div>
						
						{ allowSignup && 
						  <Grid container style={{ marginTop: "10px", justifyContent: "center" }}>
							<Grid item>
								<Link
									href="#"
									variant="body2"
									component={RouterLink}
									to="/signup"
									style={{ color: "#025da8a8", fontSize: "14px" }}
								>
									{i18n.t("login.buttons.register")}
								</Link>
							</Grid>
						</Grid> }
					</form>
				</div>
				
				<div className={classes.imagePanel}></div>
			</div>
			
			{modalOpen && (
				<div className={classes.modal} onClick={closeModal}>
					<div className={classes.modalContent} onClick={(e) => e.stopPropagation()}>
						<p className={classes.modalText}>
							Para restablecer su contraseña debes comunicarte con el área técnica a través de correo electrónico:
							<br /><strong>soporte-tkz@edybs.com</strong>
						</p>
						<Button onClick={closeModal} className={classes.btnAceptar}>
							Aceptar
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Login;
