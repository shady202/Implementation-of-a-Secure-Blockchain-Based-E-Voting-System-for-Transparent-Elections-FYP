import { useState } from "react";
import { HomePage } from "./components/HomePage";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { AboutPage } from "./components/AboutPage";
import { ContactPage } from "./components/ContactPage";
import { ResultsPage } from "./components/ResultsPage";

import { VoterRegistrationPage } from "./components/VoterRegistrationPage";
import { NewResultsPage } from "./components/NewResultsPage";
import { VerifyEligibilityPage } from "./components/VerifyEligibilityPage";
import { TermsPage } from "./components/TermsPage";
import { PrivacyPage } from "./components/PrivacyPage";
import { VotePage } from "./components/VotePage";
import { SettingsPage } from "./components/SettingsPage";
import { ForgotPasswordPage } from "./components/ForgotPasswordPage";
import { StudentDashboard } from "./components/StudentDashboard";
import { ManageCategoriesPage } from "./components/ManageCategoriesPage";
import { SystemSettingsPage } from "./components/SystemSettingsPage";

import { MyVotesPage } from "./components/MyVotesPage";
import { VoteSuccessPage } from "./components/VoteSuccessPage";
import { Toaster } from "sonner";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [transactionHash, setTransactionHash] = useState<string>("");

  const handleNavigate = (page: string, txHash?: string) => {
    if (txHash) {
      setTransactionHash(txHash);
    }
    setCurrentPage(page);
  };

  return (
    <>
      {currentPage === "home" && <HomePage onNavigate={handleNavigate} />}
      {currentPage === "admin" && (
        <AdminDashboard onNavigate={handleNavigate} />
      )}
      {currentPage === "results" && <ResultsPage onNavigate={handleNavigate} />}
      {currentPage === "new-results" && (
        <NewResultsPage onNavigate={handleNavigate} />
      )}
      {currentPage === "about" && <AboutPage onNavigate={handleNavigate} />}
      {currentPage === "manage-categories" && (
        <ManageCategoriesPage onNavigate={handleNavigate} />
      )}
      {currentPage === "register" && (
        <RegisterPage onNavigate={handleNavigate} />
      )}
      {currentPage === "voter-registration" && (
        <VoterRegistrationPage onNavigate={handleNavigate} />
      )}
      {currentPage === "verify-eligibility" && (
        <VerifyEligibilityPage onNavigate={handleNavigate} />
      )}
      {currentPage === "vote" && <VotePage onNavigate={handleNavigate} />}
      {currentPage === "contact" && <ContactPage onNavigate={handleNavigate} />}
      {currentPage === "login" && <LoginPage onNavigate={handleNavigate} />}
      {currentPage === "privacy" && <PrivacyPage onNavigate={handleNavigate} />}
      {currentPage === "terms" && <TermsPage onNavigate={handleNavigate} />}
      {currentPage === "settings" && (
        <SettingsPage onNavigate={handleNavigate} />
      )}
      {currentPage === "system-settings" && (
        <SystemSettingsPage onNavigate={handleNavigate} />
      )}
      {currentPage === "forgot-password" && (
        <ForgotPasswordPage onNavigate={handleNavigate} />
      )}
      {currentPage === "elections" && <VotePage onNavigate={handleNavigate} />}
      {currentPage === "voter" && <SettingsPage onNavigate={handleNavigate} />}
      {currentPage === "my-votes" && (
        <MyVotesPage onNavigate={handleNavigate} />
      )}
      {currentPage === "vote-success" && (
        <VoteSuccessPage
          onNavigate={handleNavigate}
          transactionHash={transactionHash}
        />
      )}
      <Toaster richColors position="top-right" />
    </>
  );
}
