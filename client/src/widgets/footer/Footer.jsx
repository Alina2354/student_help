import { NavLink, useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#f0f0f0",
        padding: "20px",
        display: "flex",
        // justifyContent: "center",
        borderTop: "1px solid #ccc",
        zIndex: 1000,
      }}
    >
      <button
        style={{ textDecoration: "none", marginRight: "25px" }}
        onClick={() => navigate("/")}
      >
        {" "}
        Главная
      </button>
    </footer>
  );
}
