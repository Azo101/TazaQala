import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.phone || !form.password) {
      setError('Заполните все поля');
      return;
    }

    if (form.phone.includes('111')) {
      sessionStorage.setItem('tq_role', 'driver');
      navigate('/driver');
    } else if (form.phone.includes('999')) {
      sessionStorage.setItem('tq_role', 'dispatcher');
      navigate('/dispatcher');
    } else {
      sessionStorage.setItem('tq_role', 'resident');
      sessionStorage.setItem('tq_user', JSON.stringify({ name: 'Пользователь', phone: form.phone }));
      navigate('/resident');
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <svg viewBox="0 0 800 600" className="login-bg__svg" xmlns="http://www.w3.org/2000/svg">
          <rect width="800" height="600" fill="#f0f0fa" />
          <rect x="0" y="400" width="800" height="200" fill="#e8e7f4" />
          <rect x="0" y="400" width="800" height="4" fill="#d4d3e8" />
          <rect x="280" y="180" width="240" height="220" rx="4" fill="#4338ca" />
          <polygon points="260,180 400,100 540,180" fill="#6366f1" />
          <text x="400" y="155" textAnchor="middle" fill="#e0e7ff" fontSize="16" fontWeight="bold" fontFamily="Inter, sans-serif">TazaQala</text>
          {[0, 1, 2, 3].map(row =>
            [0, 1, 2, 3, 4].map(col => (
              <rect key={`${row}-${col}`} x={298 + col * 42} y={200 + row * 45} width="24" height="30" rx="2" fill="#c7d2fe" opacity="0.7" />
            ))
          )}
          <rect x="370" y="340" width="60" height="60" rx="2" fill="#312e81" />
          <rect x="375" y="345" width="50" height="50" rx="2" fill="#818cf8" opacity="0.4" />
          <g transform="translate(120, 370)">
            <rect x="0" y="5" width="60" height="30" rx="3" fill="#4338ca" />
            <rect x="60" y="12" width="25" height="23" rx="2" fill="#6366f1" />
            <circle cx="15" cy="38" r="6" fill="#1e1b4b" />
            <circle cx="50" cy="38" r="6" fill="#1e1b4b" />
            <circle cx="75" cy="38" r="6" fill="#1e1b4b" />
          </g>
          <g transform="translate(580, 375)">
            <rect x="0" y="5" width="50" height="25" rx="3" fill="#4338ca" />
            <rect x="50" y="10" width="20" height="20" rx="2" fill="#6366f1" />
            <circle cx="12" cy="33" r="5" fill="#1e1b4b" />
            <circle cx="40" cy="33" r="5" fill="#1e1b4b" />
            <circle cx="62" cy="33" r="5" fill="#1e1b4b" />
          </g>
        </svg>
      </div>

      <div className="login-card">
        <div className="login-card__logo">TazaQala</div>
        <h1 className="login-card__title">Вход в систему</h1>
        <p className="login-card__subtitle">Введите ваши данные для входа</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label>Номер телефона</label>
            <input
              type="tel"
              placeholder="+7 (7XX) XXX-XX-XX"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>
          <div className="login-field">
            <label>Пароль</label>
            <input
              type="password"
              placeholder="Введите пароль"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="login-btn">Войти</button>
        </form>

        <div className="login-card__footer">
          <span>Нет аккаунта?</span>
          <Link to="/register">Зарегистрироваться</Link>
        </div>
        <Link to="/" className="login-card__back">На главную</Link>

        <div className="login-card__internal">
          <span>Служебный вход:</span>
          <Link to="/driver">Водитель</Link>
          <Link to="/dispatcher">Диспетчер</Link>
        </div>
      </div>
    </div>
  );
}
