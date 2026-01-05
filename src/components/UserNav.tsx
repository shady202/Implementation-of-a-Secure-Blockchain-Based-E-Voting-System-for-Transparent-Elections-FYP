import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { getCurrentUser, logout, isAdmin } from "../lib/auth";
import { User, Settings, LogOut, Shield, Vote, Receipt } from "lucide-react";

interface UserNavProps {
  onNavigate: (page: string) => void;
}

export function UserNav({ onNavigate }: UserNavProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    onNavigate("home");
  };

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate("register")}
        >
          Register
        </Button>
        <Button size="sm" onClick={() => onNavigate("login")}>
          Sign In
        </Button>
      </div>
    );
  }

  // Generate initials from available data
  let initials = "";
  if (user.firstName && user.lastName) {
    initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  } else if (user.studentId) {
    // Use first 2 characters of student ID (e.g., "TP" from "TP000001")
    initials = user.studentId.substring(0, 2).toUpperCase();
  } else if (user.email) {
    // Use first 2 characters of email
    initials = user.email.substring(0, 2).toUpperCase();
  } else {
    initials = "U"; // Default fallback
  }

  // Display name
  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.studentId || user.email || "User";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-slate-600">{user.email}</p>
            {user.studentId && (
              <p className="text-xs leading-none text-slate-600">
                ID: {user.studentId}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onNavigate("vote")}
          className="cursor-pointer"
        >
          <Vote className="mr-2 h-4 w-4" />
          <span>Vote Now</span>
        </DropdownMenuItem>
        {!isAdmin() && (
          <DropdownMenuItem
            onClick={() => onNavigate("my-votes")}
            className="cursor-pointer"
          >
            <Receipt className="mr-2 h-4 w-4" />
            <span>My Vote Receipts</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => onNavigate("settings")}
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        {isAdmin() && (
          <DropdownMenuItem
            onClick={() => onNavigate("admin")}
            className="cursor-pointer"
          >
            <Shield className="mr-2 h-4 w-4" />
            <span>Admin Dashboard</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
