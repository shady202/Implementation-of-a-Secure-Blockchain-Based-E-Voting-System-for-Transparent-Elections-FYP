import { useState, useEffect } from "react";
import { VoterRegistrationPage } from "./VoterRegistrationPage";
import { VotePage } from "./VotePage";
import { isLoggedIn } from "../lib/session";

interface ElectionsWrapperProps {
  onNavigate: (page: string) => void;
}

export function ElectionsWrapper({ onNavigate }: ElectionsWrapperProps) {
  const [hasRegistered, setHasRegistered] = useState<boolean | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn()) {
      onNavigate('login');
      return;
    }

    // Check if user has completed voter registration
    const registrationCompleted = localStorage.getItem("voterRegistrationCompleted");
    setHasRegistered(registrationCompleted === "true");
  }, [onNavigate, refreshKey]);

  // Callback to refresh the component after registration
  const handleRegistrationComplete = () => {
    setHasRegistered(true);
    setRefreshKey(prev => prev + 1);
  };

  // Loading state
  if (hasRegistered === null) {
    return null;
  }

  // Show registration page if not registered yet
  if (!hasRegistered) {
    return <VoterRegistrationPage onNavigate={onNavigate} onRegistrationComplete={handleRegistrationComplete} />;
  }

  // Show voting page if registered
  return <VotePage onNavigate={onNavigate} />;
}