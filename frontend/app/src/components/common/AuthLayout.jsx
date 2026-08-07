import { useNavigate } from "react-router-dom";

const AuthLayout = ({ eyebrow, title, subtitle, children }) => {
  const navigate = useNavigate();

  return (
    <div className="auth-shell">
      <aside className="auth-brand">
        <div
          className="auth-brand__mark"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Auction<span>Mart</span>
        </div>

        <svg
          className="auth-brand__art"
          viewBox="0 0 220 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="110" cy="132" rx="86" ry="10" fill="rgba(214,168,75,0.12)" />
          <path
            d="M34 108 L52 66 Q58 56 70 56 L150 56 Q162 56 168 66 L186 108 Z"
            fill="none"
            stroke="#D6A84B"
            strokeWidth="2.5"
          />
          <rect x="34" y="108" width="152" height="18" rx="6" fill="none" stroke="#D6A84B" strokeWidth="2.5" />
          <circle cx="66" cy="128" r="12" fill="#12213A" stroke="#D6A84B" strokeWidth="2.5" />
          <circle cx="154" cy="128" r="12" fill="#12213A" stroke="#D6A84B" strokeWidth="2.5" />
          <line x1="76" y1="66" x2="70" y2="90" stroke="#D6A84B" strokeWidth="2" />
          <line x1="144" y1="66" x2="150" y2="90" stroke="#D6A84B" strokeWidth="2" />
        </svg>

        {eyebrow && <span className="auth-brand__eyebrow">{eyebrow}</span>}
        <h1 className="auth-brand__title">{title}</h1>
        {subtitle && <p className="auth-brand__subtitle">{subtitle}</p>}

        <div className="auth-brand__rule" />
        <p className="auth-brand__foot">Bid smarter. Sell faster.</p>
      </aside>

      <main className="auth-panel">
        <div className="auth-card">{children}</div>
      </main>
    </div>
  );
};

export default AuthLayout;