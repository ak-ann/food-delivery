
import { useEffect, useState } from 'react';
import Orders from './Orders';
import {
  loginUser,
  registerUser,
  fetchProfile,
} from './api';

function App() {
  const [user, setUser] = useState(null);
  const [showOrders, setShowOrders] = useState(true);
  const [checking, setChecking] = useState(true);
  const [mode, setMode] = useState('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Проверяем сохранённый токен при открытии сайта
  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response = await fetchProfile();
          setUser(response.data);
        } catch {
          localStorage.removeItem('token');
        }
      }

      setChecking(false);
    }

    checkAuth();
  }, []);

  // Вход или регистрация
  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const response = await loginUser({
          email,
          password,
        });

        localStorage.setItem('token', response.data.token);

        const profile = await fetchProfile();
        setUser(profile.data);
      } else {
        await registerUser({
          email,
          password,
        });

        setMode('login');
        setMessage('Регистрация успешна. Теперь войдите в систему.');
        setPassword('');
      }
    } catch (err) {
      localStorage.removeItem('token');

      setError(
        err.response?.data?.error ||
        'Не удалось выполнить запрос. Проверьте соединение с сервером.'
      );
    } finally {
      setLoading(false);
    }
  }

  // Выход
  function handleLogout() {
    localStorage.removeItem('token');
    setUser(null);
    setEmail('');
    setPassword('');
    setError('');
    setMessage('');
  }

  if (checking) {
    return <div style={styles.center}>Проверка авторизации...</div>;
  }

  // Если пользователь вошёл
  if (user) {
    if (user.role !== 'admin') {
      return (
        <div style={styles.center}>
          <h2>Доступ ограничен</h2>
          <p>У вас нет прав администратора для просмотра заказов.</p>
          <button style={styles.button} onClick={handleLogout}>
            Выйти
          </button>
        </div>
      );
    }

    return (
      <>
        <div style={styles.topbar}>
          <span>Вы вошли: {user.email}</span>

          <button
            style={styles.logout}
            onClick={() => setShowOrders(!showOrders)}
          >
            {showOrders ? 'Скрыть заказы' : 'Показать заказы'}
          </button>

          <button style={styles.logout} onClick={handleLogout}>
            Выйти
          </button>
        </div>

        {showOrders && <Orders />}
      </>
    );
  }

  // Страница входа и регистрации
  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <div style={styles.logo}>FD</div>

        <h1 style={styles.title}>Food Delivery</h1>

        <p style={styles.subtitle}>
          {mode === 'login'
            ? 'Войдите в систему управления заказами'
            : 'Создайте новый аккаунт'}
        </p>

        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="anna@example.com"
          required
        />

        <label style={styles.label}>Пароль</label>
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Введите пароль"
          required
        />

        {error && <p style={styles.error}>{error}</p>}
        {message && <p style={styles.success}>{message}</p>}

        <button
          style={styles.button}
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Подождите...'
            : mode === 'login'
              ? 'Войти'
              : 'Зарегистрироваться'}
        </button>

        <p style={styles.switch}>
          {mode === 'login'
            ? 'Нет аккаунта?'
            : 'Уже есть аккаунт?'}
          {' '}
          <span
            style={styles.link}
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
              setMessage('');
            }}
          >
            {mode === 'login' ? 'Регистрация' : 'Войти'}
          </span>
        </p>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#FAFAFA',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '380px',
    padding: '40px',
    background: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
    boxSizing: 'border-box',
  },
  logo: {
    width: '55px',
    height: '55px',
    borderRadius: '14px',
    background: '#800020',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    fontWeight: 'bold',
    margin: '0 auto 20px',
  },
  title: {
    textAlign: 'center',
    color: '#222222',
    marginBottom: '8px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#777777',
    fontSize: '14px',
    marginBottom: '28px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    marginTop: '16px',
    color: '#333333',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #DDDDDD',
    borderRadius: '8px',
    boxSizing: 'border-box',
    fontSize: '14px',
  },
  button: {
    width: '100%',
    padding: '13px',
    marginTop: '24px',
    background: '#800020',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
  },
  switch: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#666666',
    marginTop: '22px',
  },
  link: {
    color: '#800020',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  error: {
    color: '#C62828',
    fontSize: '13px',
  },
  success: {
    color: '#23834A',
    fontSize: '13px',
  },
  center: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  topbar: {
    padding: '14px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#FFFFFF',
    borderBottom: '1px solid #EEEEEE',
    color: '#333333',
  },
  logout: {
    padding: '9px 18px',
    background: '#800020',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '7px',
    cursor: 'pointer',
  },
};

export default App;
