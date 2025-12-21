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
import { User, Settings, LogOut, Shield, Vote } from "lucide-react";

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

  const initials = `${user.firstName?.[0] || ""}${
    user.lastName?.[0] || ""
  }`.toUpperCase();

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
            <p className="text-sm leading-none">
              {user.firstName} {user.lastName}
            </p>
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
          onClick={() => onNavigate("elections")}
          className="cursor-pointer"
        >
          <Vote className="mr-2 h-4 w-4" />
          <span>Vote Now</span>
        </DropdownMenuItem>
        {!isAdmin() && (
          <>
            <DropdownMenuItem
              onClick={() => onNavigate("voter")}
              className="cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onNavigate("my-votes")}
              className="cursor-pointer"
            >
              <Vote className="mr-2 h-4 w-4" />
              <span>My Vote Receipts</span>
            </DropdownMenuItem>
          </>
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
