import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import MyMilestones from "../pages/member/MyMilestones";
import AdminMilestones from "../pages/admin/AdminMilestones";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/member/milestones" element={<MyMilestones />} />
        <Route path="/admin/milestones" element={<AdminMilestones />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
