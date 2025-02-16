import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, Alert } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/auth.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { login, isLoading, error } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'メールアドレスは必須です';
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }
    if (!password) newErrors.password = 'パスワードは必須です';
    if (password.length < 8) {
      newErrors.password = 'パスワードは8文字以上必要です';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await login(email, password);
    } catch (err) {
      setErrors({ submit: err.message });
    }
  };

  return (
    <Box className={styles.container}>
      <Paper elevation={3} className={styles.loginForm}>
        <Typography variant="h4" component="h1" gutterBottom>
          ログイン
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="メールアドレス"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="パスワード"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />

          {error && (
            <Alert severity="error" className={styles.alert}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? 'ログイン中...' : 'ログイン'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;