import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', surname: '', phone: '', iin: '',
    address: '', email: '', password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    if (form.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }
    if (form.iin.length !== 12) {
      setError('ИИН должен содержать 12 цифр');
      return;
    }

    sessionStorage.setItem('tq_role', 'resident');
    sessionStorage.setItem('tq_user', JSON.stringify({
      name: `${form.name} ${form.surname}`,
      phone: form.phone,
      email: form.email,
      address: form.address,
    }));
    navigate('/resident');
  };

  return (
    <div className="register-page">
      <div className="register-bg">
        <svg viewBox="0 0 1200 700" className="register-bg__svg" xmlns="http://www.w3.org/2000/svg">
          <rect width="1200" height="700" fill="#f0f0fa" />
          <rect x="0" y="450" width="1200" height="250" fill="#e8e7f4" />
          <rect x="0" y="450" width="1200" height="4" fill="#d4d3e8" />
          <rect x="420" y="180" width="360" height="270" rx="4" fill="#4338ca" />
          <polygon points="390,180 600,80 810,180" fill="#6366f1" />
          <text x="600" y="148" textAnchor="middle" fill="#e0e7ff" fontSize="22" fontWeight="bold" fontFamily="Inter, sans-serif">TazaQala HQ</text>
          {[0, 1, 2, 3, 4].map(row =>
            [0, 1, 2, 3, 4, 5, 6].map(col => (
              <rect key={`${row}-${col}`} x={438 + col * 46} y={200 + row * 48} width="28" height="34" rx="2" fill="#c7d2fe" opacity="0.6" />
            ))
          )}
          <rect x="560" y="380" width="80" height="70" rx="3" fill="#312e81" />
          <rect x="567" y="387" width="66" height="56" rx="2" fill="#818cf8" opacity="0.3" />
          <g transform="translate(100, 410)">
            <rect x="0" y="5" width="70" height="35" rx="3" fill="#4338ca" />
            <rect x="70" y="12" width="30" height="28" rx="2" fill="#6366f1" />
            <circle cx="18" cy="44" r="7" fill="#1e1b4b" />
            <circle cx="55" cy="44" r="7" fill="#1e1b4b" />
            <circle cx="88" cy="44" r="7" fill="#1e1b4b" />
          </g>
          <g transform="translate(880, 415)">
            <rect x="0" y="5" width="65" height="30" rx="3" fill="#4338ca" />
            <rect x="65" y="10" width="25" height="25" rx="2" fill="#6366f1" />
            <circle cx="15" cy="39" r="6" fill="#1e1b4b" />
            <circle cx="50" cy="39" r="6" fill="#1e1b4b" />
            <circle cx="80" cy="39" r="6" fill="#1e1b4b" />
          </g>
          <g transform="translate(300, 420)">
            <rect x="0" y="5" width="55" height="28" rx="3" fill="#6366f1" opacity="0.6" />
            <rect x="55" y="10" width="22" height="23" rx="2" fill="#818cf8" opacity="0.5" />
            <circle cx="12" cy="36" r="5" fill="#1e1b4b" opacity="0.5" />
            <circle cx="45" cy="36" r="5" fill="#1e1b4b" opacity="0.5" />
          </g>
        </svg>
      </div>

      <div className="register-card">
        <div className="register-card__logo">TazaQala</div>
        <h1 className="register-card__title">Регистрация</h1>
        <p className="register-card__subtitle">Создайте аккаунт жителя</p>

        {error && <div className="register-error">{error}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-field">
              <label>Имя</label>
              <input type="text" placeholder="Айгүл" value={form.name} onChange={update('name')} required />
            </div>
            <div className="form-field">
              <label>Фамилия</label>
              <input type="text" placeholder="Нурланова" value={form.surname} onChange={update('surname')} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Номер телефона</label>
              <input type="tel" placeholder="+7 (7XX) XXX-XX-XX" value={form.phone} onChange={update('phone')} required />
            </div>
            <div className="form-field">
              <label>ИИН</label>
              <input type="text" placeholder="XXXXXXXXXXXX" maxLength={12} value={form.iin} onChange={update('iin')} required />
            </div>
          </div>

          <div className="form-field">
            <label>Домашний адрес</label>
            <input type="text" placeholder="ул. Ауэзова, д.15, кв.42" value={form.address} onChange={update('address')} required />
          </div>

          <div className="form-field">
            <label>Email</label>
            <input type="email" placeholder="example@mail.kz" value={form.email} onChange={update('email')} required />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Пароль</label>
              <input type="password" placeholder="Минимум 6 символов" value={form.password} onChange={update('password')} required />
            </div>
            <div className="form-field">
              <label>Подтвердите пароль</label>
              <input type="password" placeholder="Повторите пароль" value={form.confirmPassword} onChange={update('confirmPassword')} required />
            </div>
          </div>

          <button type="submit" className="register-btn">Зарегистрироваться</button>
        </form>

        <div className="register-card__footer">
          <span>Уже есть аккаунт?</span>
          <Link to="/login">Войти</Link>
        </div>
        <Link to="/" className="register-card__back">На главную</Link>
      </div>
    </div>
  );
}
