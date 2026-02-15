import React from 'react';
import { useNavigate } from 'react-router-dom';
import YandexMap from '../components/YandexMap';
import { TRASH_BINS, TRUCKS, TAZAQALA_BASE, LANDFILL, CITY_CENTER, STATS } from '../data/kyzylorda';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <nav className="l-nav">
        <div className="l-nav__logo">TazaQala</div>
        <div className="l-nav__links">
          <a href="#about">О проекте</a>
          <a href="#features">Возможности</a>
          <a href="#map">Карта</a>
          <a href="#contacts">Контакты</a>
        </div>
        <div className="l-nav__actions">
          <button className="l-btn l-btn--outline" onClick={() => navigate('/login')}>Вход</button>
          <button className="l-btn l-btn--solid" onClick={() => navigate('/register')}>Регистрация</button>
        </div>
      </nav>

      <header className="l-hero">
        <div className="l-hero__decor l-hero__decor--left">
          <svg width="80" height="40" viewBox="0 0 80 40">{[0,1,2,3,4].map(i => <path key={i} d={`M ${i*15} 20 L ${i*15+10} 10 L ${i*15+10} 30 Z`} fill="none" stroke="white" strokeWidth="2"/>)}</svg>
        </div>
        <div className="l-hero__decor l-hero__decor--right">
          <svg width="80" height="80" viewBox="0 0 80 80">{[0,1,2].map(i => <circle key={i} cx="40" cy="40" r={15+i*10} fill="none" stroke="white" strokeWidth="2"/>)}</svg>
        </div>
        <h1 className="l-hero__title">TazaQala</h1>
        <div className="l-hero__line" />
        <p className="l-hero__sub">Современная система сбора и переработки отходов в Кызылорде</p>
        <div className="l-hero__stats">
          <div className="l-hero-stat"><span className="l-hero-stat__num">{STATS.totalBins}</span><span className="l-hero-stat__label">Баков</span></div>
          <div className="l-hero-stat"><span className="l-hero-stat__num">{STATS.activeTrucks}/{STATS.totalTrucks}</span><span className="l-hero-stat__label">Мусоровозов</span></div>
          <div className="l-hero-stat"><span className="l-hero-stat__num">{(STATS.wasteCollectedTotal/1000).toFixed(0)}т</span><span className="l-hero-stat__label">Собрано</span></div>
        </div>
      </header>

      <section className="l-strip">
        {[
          { label: 'Переработка', d: 'M20 5 L25 15 L35 15 L27 22 L30 32 L20 26 L10 32 L13 22 L5 15 L15 15 Z' },
          { label: 'Сбор отходов', d: 'M12 15 L12 10 L25 10 L25 15 M10 15 L10 35 L28 35 L28 15 Z' },
          { label: 'Экология', d: 'M20 8 Q15 15 20 20 Q25 15 20 8 M20 20 L20 32 M14 32 L26 32' },
          { label: 'Статистика', d: 'M8 8 L8 32 L32 32 M12 25 L15 20 L18 22 L22 15 L28 18' },
        ].map((f, i) => (
          <div key={i} className="l-strip__item">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d={f.d} stroke="#6366f1" strokeWidth="2" fill="none" />
            </svg>
            <span>{f.label}</span>
          </div>
        ))}
      </section>

      <section id="about" className="l-about">
        <h2 className="l-section-title">О проекте TazaQala</h2>
        <p className="l-about__text">
          Мы создаём современную систему сбора и переработки отходов для экологически чистого будущего Кызылорды.
          Присоединяйтесь к нам в заботе об окружающей среде.
        </p>
        <div id="features" className="l-about__cards">
          {[
            { title: 'Простота', text: 'Удобная система регистрации и отслеживания сбора отходов для каждого жителя', icon: 'M15 9 L15 21 M9 15 L21 15' },
            { title: 'Надёжность', text: 'Проверенная система с гарантией качества обслуживания и своевременного вывоза', icon: 'M8 15 L13 20 L22 10' },
            { title: 'Экология', text: 'Забота об окружающей среде и будущем поколении через умную переработку', icon: 'M15 5 L20 12 L15 19 L10 12 Z' },
          ].map((c, i) => (
            <div key={i} className="l-card">
              <div className="l-card__icon">
                <svg width="28" height="28" viewBox="0 0 30 30" fill="none">
                  <circle cx="15" cy="15" r="12" stroke="#6366f1" strokeWidth="1.5" fill="none" />
                  <path d={c.icon} stroke="#6366f1" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contacts" className="l-contacts">
        <div className="l-contact l-contact--accent">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M12 7 L16 7 L17 12 L15 14 Q12 17 14 20 Q16 23 20 25 Q23 27 25 24 L27 21 L32 23 L32 27 Q32 32 25 34 Q18 36 11 29 Q4 22 6 16 Q8 8 12 7" fill="white" stroke="white" strokeWidth="1.5"/></svg>
          <h4>+7 (724) 233-45-67</h4>
          <p>Свяжитесь с нами для получения дополнительной информации о программе сбора отходов</p>
        </div>
        <div className="l-contact">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect x="6" y="10" width="28" height="20" rx="2" stroke="#24316B" strokeWidth="1.5"/><path d="M6 10 L20 20 L34 10" stroke="#24316B" strokeWidth="1.5"/></svg>
          <h4>info@tazaqala.kz</h4>
          <p>Напишите нам для консультации по вопросам переработки и утилизации отходов</p>
        </div>
        <div className="l-contact">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M20 7 Q15 7 12 10 Q9 14 9 19 Q9 25 20 35 Q31 25 31 19 Q31 14 28 10 Q25 7 20 7Z" stroke="#24316B" strokeWidth="1.5" fill="none"/><circle cx="20" cy="19" r="3.5" fill="#24316B"/></svg>
          <h4>Кызылорда, Казахстан</h4>
          <p>Наш офис открыт для посетителей с понедельника по пятницу с 9:00 до 18:00</p>
        </div>
      </section>

      <section id="map" className="l-map-section">
        <h2 className="l-section-title">Карта пунктов сбора отходов</h2>
        <p className="l-map-section__sub">Все мусорные баки Кызылорды в реальном времени</p>
        <div className="l-map-legend">
          <span><span className="ldot ldot--green" /> Пустой</span>
          <span><span className="ldot ldot--yellow" /> Наполовину</span>
          <span><span className="ldot ldot--red" /> Заполнен</span>
          <span><span className="ldot ldot--purple" /> Мусоровоз</span>
        </div>
        <YandexMap
          center={CITY_CENTER} zoom={13}
          bins={TRASH_BINS}
          trucks={TRUCKS.filter(t => t.status === 'active')}
          base={TAZAQALA_BASE} landfill={LANDFILL}
          showBins showTrucks showBase showLandfill
          style={{ height: '450px' }}
        />
      </section>

      <footer className="l-footer">
        <div className="l-footer__logo">TazaQala</div>
        <p>Современная система сбора и переработки отходов для экологически чистой Кызылорды</p>
        <div className="l-footer__line" />
        <div className="l-footer__copy">&copy; 2026 TazaQala. Все права защищены.</div>
      </footer>
    </div>
  );
}
