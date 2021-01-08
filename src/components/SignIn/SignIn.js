// import React, { useState, useEffect } from 'react'
// import { connect } from 'react-redux'
// import { withRouter, Link } from 'react-router-dom'
// import { useForm } from "react-hook-form"
// // Material-UI
// import Avatar from '@material-ui/core/Avatar'
// import Button from '@material-ui/core/Button'
// import CssBaseline from '@material-ui/core/CssBaseline'
// import Box from '@material-ui/core/Box'
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
// import Typography from '@material-ui/core/Typography'
// import TextField from '@material-ui/core/TextField'
// import FormControlLabel from '@material-ui/core/FormControlLabel'
// import Checkbox from '@material-ui/core/Checkbox'
// import Grid from '@material-ui/core/Grid'
// import CircularProgress from '@material-ui/core/CircularProgress'

// import { makeStyles } from '@material-ui/core/styles'
// import Container from '@material-ui/core/Container'
// // import { useForm } from 'react-hook-form'

// //axios
// //app components
// import GoogleIcon from '../../assets/google.svg'
// import FacebookIcon from '../../assets/facebook.svg'
// import Creators from '../../redux/user'

// function Copyright() {
//   return (
//     <Typography variant="body2" color="textSecondary" align="center">
//       {'Copyright © '}
//       <Link color="inherit" to="https://material-ui.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   )
// }

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     marginTop: theme.spacing(8),
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
//   button: {
//     marginBottom: "15px",
//     fontWeight: "400",
//     fontSize: "16px",
//   },
//   googleIcon: {
//     height: "32px",
//     float: "left",
//   },
//   avatar: {
//     margin: theme.spacing(1),
//     backgroundColor: theme.palette.secondary.main,
//   }
// }))

// function SignIn(props) {
//   const [loading, setLoading] = useState(false)
//   const { register, handleSubmit, watch, errors } = useForm();
//   const classes = useStyles()

//   const onSubmit = (values) => {
//     setLoading(true)
//     props.emailSignInStart(values)
//   }


//   return (
//     <Container component="main" maxWidth="xs">
//       <CssBaseline />
//       <div className={classes.paper}>
//         <Avatar className={classes.avatar}>
//           <LockOutlinedIcon />
//         </Avatar>
//         <Typography component="h1" variant="h5">
//           Sign in
//         </Typography>
//       </div>
//       <Container fixed>
//       <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
//         <TextField
//           variant="outlined"
//           margin="normal"
//           required
//           fullWidth
//           id="email"
//           label="Email Address"
//           name="email"
//           autoComplete="email"
//           autoFocus
//           inputRef={register({
//             required: 'Email is required',
//             pattern: {
//               value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//               message: 'Invalid email address',
//             },
//           })}
//           error={!!errors.email}
//           helperText={errors.email?.message}
//           value={"quanhui123@gmail.com"}
//         />
//         <TextField
//           variant="outlined"
//           margin="normal"
//           required
//           fullWidth
//           name="password"
//           label="Password"
//           type="password"
//           id="password"
//           autoComplete="current-password"
//           inputRef={register({
//             required: 'Password is required',
//           })}
//           error={!!errors.password}
//           helperText={errors.password?.message}
//           value={"huy81299"}
//         />
//         <Button
//           type="submit"
//           fullWidth
//           variant="contained"
//           color="primary"
//           className={classes.submit}
//           disabled={loading}
//         >
//           { loading && <CircularProgress />} Sign In
//         </Button>
//         <br/>
//         <br/>
//         <Grid container>
//           <Grid item xs>
//             <Link to="/forgot-password" variant="body2">
//               Forgot password?
//             </Link>
//           </Grid>
//           <Grid item>
//             <Link to="/register" variant="body2">
//               {"Don't have an account? Sign Up"}
//             </Link>
//           </Grid>
//         </Grid>
//       </form>
//       <br/>
//       <Button
//         type="button"
//         fullWidth
//         variant="outlined"
//         className={classes.button}
//         disabled={loading}
//         onClick={props.googleSignInStart}
//       >
//         <img src={GoogleIcon} className={classes.googleIcon}/>&nbsp;Sign in with Google
//       </Button>
//       <Button
//           type="button"
//           fullWidth
//           variant="outlined"
//           className={classes.button}
//           disabled={loading}
//           onClick={props.facebookSignInStart}
//         >
//           <img src={FacebookIcon} className={classes.googleIcon}/>&nbsp;Sign in with Facebook
//         </Button>
//       </Container>
//       <Box mt={8}>
//         <Copyright />
//       </Box>
//     </Container>
//   )
// }

// export default connect(
//   (state) => ({
//     auth: state.auth.toJS(),
//   }),
//   (dispatch) => ({
//     emailSignInStart: (payload) => dispatch(Creators.emailSignInStart(payload)),
//     facebookSignInStart: () => dispatch(Creators.facebookSignInStart()),
//     googleSignInStart: () => dispatch(Creators.googleSignInStart()),
//   }),
// )(withRouter(SignIn))

import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Button, Row, Col, Typography, Avatar, message } from 'antd';
import { UserOutlined } from '@ant-design/icons'

import Creators from '../../redux/user'

const SignIn = (props) => {
  const onFinish = async values => {
    try {
      props.emailSignInStart(values)
    } catch (e) {
      console.log(e)
    }
  };
  
  React.useEffect(() => {
    if(props.auth.error?.message) {
      setLoading(false)
    }
  },[props.auth.error])

  useEffect(() => {
    console.log(props)
    if (props.isLogin) {
      props.history.push('/')
    }
  }, [props.isLogin])

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Row type="flex" justify="center" style={{ minHeight: '100vh' }}>
      <Col span={6} justify="center" align="middle" style={{ padding: '16px 24px', minHeight: '640px', borderRadius: '30px', marginTop: '64px' }}>
        <Avatar size={48} icon={<UserOutlined />} justify="center" style={{ color: '#fff', backgroundColor: 'rgb(220, 0, 78)' }} />
        <Typography align="middle" style={{ fontSize: '28px', marginBottom: '24px' }}>Sign in</Typography>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input size="large" style={{ padding: '18.5px 14px' }} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password size="large" style={{ padding: '18.5px 14px' }} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" style={{ borderRadius: '4px', boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)" }} block>
              Submit
            </Button>
          </Form.Item>
        </Form>
        <Button onClick={() => props.reset()} size="large" style={{ borderRadius: '4px', boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)" }} block>
            Reset
        </Button>
      </Col>
    </Row>
  );
};


export default connect(state => ({
  auth: state.auth.toJS(),
}), dispatch => ({
  reset: () => dispatch(Creators.reset()),
  emailSignInStart: (payload) => dispatch(Creators.emailSignInStart(payload)),
  facebookSignInStart: () => dispatch(Creators.facebookSignInStart()),
  googleSignInStart: () => dispatch(Creators.googleSignInStart()),
}))(withRouter(SignIn));
