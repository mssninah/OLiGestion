import { useState } from "react";
import logo from "../assets/logo/logo.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isFocused, setIsFocused] = useState({ username: false, password: false });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert(`Bienvenue ${username} !`);
    setIsLoading(false);
  };

  const handleFocus = (field) => setIsFocused(prev => ({ ...prev, [field]: true }));
  const handleBlur = (field) => setIsFocused(prev => ({ ...prev, [field]: false }));

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "#FFFFFF",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Inter', sans-serif",
        position: "fixed",
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "400px",
          maxWidth: "90vw",
          padding: "50px 40px",
          borderRadius: "24px",
          background: "#FFFFFF",
          border: "1px solid #E8F5E8",
          boxShadow: `
            0 10px 40px rgba(34, 139, 34, 0.08),
            0 4px 12px rgba(34, 139, 34, 0.05)
          `,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Élément décoratif vert */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #228B22, #32CD32, #228B22)",
        }} />

        {/* LOGO */}
        <img 
          src={logo}
          alt="OLI Logo"
          style={{
            width: "120px",
            marginBottom: "20px",
            objectFit: "contain",
          }}
        />

        <h1
          style={{
            color: "#1A3C1A", // vert foncé
            fontSize: "26px",
            fontWeight: "700",
            marginBottom: "8px",
          }}
        >
          Accès OLI
        </h1>

        <p
          style={{
            color: "#4A7C4A", // vert moyen
            marginBottom: "35px",
            fontSize: "14px",
            fontWeight: "500",
            letterSpacing: "0.5px",
          }}
        >
          PRENONS SOIN DE VOUS
        </p>

        {/* USERNAME */}
        <div style={{ 
          position: "relative", 
          marginBottom: "25px",
          width: "100%",
        }}>
          <input
            type="text"
            placeholder=" "
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={() => handleFocus("username")}
            onBlur={() => handleBlur("username")}
            required
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "16px 18px",
              background: "#F8FDF8", // fond vert très pâle
              border: `2px solid ${
                isFocused.username ? "#228B22" : "#E8F5E8"
              }`,
              borderRadius: "12px",
              color: "#1A3C1A",
              fontSize: "15px",
              outline: "none",
              transition: "all 0.3s ease",
              fontFamily: "inherit",
            }}
          />
          <label
            style={{
              position: "absolute",
              left: "18px",
              top: "16px",
              color: "#7A9C7A",
              fontSize: "15px",
              transition: "all 0.3s ease",
              pointerEvents: "none",
              transform: username || isFocused.username ? "translateY(-26px) scale(0.85)" : "none",
              background: "#FFFFFF",
              padding: "0 6px",
              fontWeight: "500",
            }}
          >
            👤 Nom d'utilisateur
          </label>
        </div>

        {/* PASSWORD */}
        <div style={{ 
          position: "relative", 
          marginBottom: "35px",
          width: "100%",
        }}>
          <input
            type="password"
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => handleFocus("password")}
            onBlur={() => handleBlur("password")}
            required
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "16px 18px",
              background: "#F8FDF8",
              border: `2px solid ${
                isFocused.password ? "#228B22" : "#E8F5E8"
              }`,
              borderRadius: "12px",
              color: "#1A3C1A",
              fontSize: "15px",
              outline: "none",
              transition: "all 0.3s ease",
              fontFamily: "inherit",
            }}
          />
          <label
            style={{
              position: "absolute",
              left: "18px",
              top: "16px",
              color: "#7A9C7A",
              fontSize: "15px",
              transition: "all 0.3s ease",
              pointerEvents: "none",
              transform: password || isFocused.password ? "translateY(-26px) scale(0.85)" : "none",
              background: "#FFFFFF",
              padding: "0 6px",
              fontWeight: "500",
            }}
          >
            🔒 Mot de passe
          </label>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "16px",
            background: isLoading ? "#7A9C7A" : "#228B22", // vert forêt
            color: "#FFFFFF",
            border: "none",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "15px",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 15px rgba(34, 139, 34, 0.25)",
            fontFamily: "inherit",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background = "#1E7A1E";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(34, 139, 34, 0.35)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background = "#228B22";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(34, 139, 34, 0.25)";
            }
          }}
        >
          {isLoading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <div style={{
                width: "16px",
                height: "16px",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTop: "2px solid white",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }} />
              Connexion...
            </span>
          ) : (
            "🌱 Se connecter"
          )}
        </button>

        {/* Message écologique */}
        <div style={{
          marginTop: "25px",
          padding: "12px",
          background: "#F0F9F0",
          borderRadius: "8px",
          border: "1px solid #E8F5E8",
        }}>
          <p style={{
            color: "#4A7C4A",
            fontSize: "12px",
            margin: 0,
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}>
            ♻️ Engagement écologique OLI
          </p>
        </div>

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </form>
    </div>
  );
}