import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const goMember = () => {
    localStorage.setItem("role", "member");
    localStorage.setItem("userId", "karthik");
    navigate("/member/milestones");
  };

  const goAdmin = () => {
    localStorage.setItem("role", "admin");
    localStorage.setItem("userId", "admin1");
    navigate("/admin/milestones");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Select Role</h2>
      <button onClick={goMember} style={{ marginRight: 10 }}>
        Member
      </button>
      <button onClick={goAdmin}>Admin</button>
    </div>
  );
}
