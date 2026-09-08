import { NavUser } from "@/components/nav-user";

export default function UserProfileBar({ user, onLogout }) {
  return <NavUser user={user} onLogout={onLogout} />;
}
