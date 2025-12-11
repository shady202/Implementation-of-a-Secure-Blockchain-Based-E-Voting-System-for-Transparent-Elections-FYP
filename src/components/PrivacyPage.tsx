import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { ArrowLeft, Shield, Lock, Eye, FileText, Server, Globe } from "lucide-react";

const apuLogo = "/apu-logo.png";

interface PrivacyPageProps {
  onNavigate: (page: string) => void;
}

export function PrivacyPage({ onNavigate }: PrivacyPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-5xl flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <img src={apuLogo} alt="APU Logo" className="h-8 w-auto" />
            <span className="font-semibold text-slate-900">APU VOTE</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </header>

      <main className="flex-1 py-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-4">
              <Shield className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We value your privacy and are committed to protecting your personal data. This policy outlines how we collect, use, and safeguard your information in the APU Vote Chain system.
            </p>
            <p className="text-sm text-slate-500 mt-4">Last Updated: October 15, 2024</p>
          </div>

          <div className="grid gap-8 md:grid-cols-[1fr_250px]">
            <div className="space-y-8">
              {/* Introduction */}
              <section className="bg-white p-8 rounded-xl border shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-slate-500" />
                  1. Information We Collect
                </h2>
                <div className="space-y-4 text-slate-600">
                  <p>
                    To provide a secure and verifiable voting experience, we collect only the necessary information:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong className="text-slate-900">Student Identity:</strong> Name, Student ID (TP Number), Faculty, and Email address for verification purposes.
                    </li>
                    <li>
                      <strong className="text-slate-900">Blockchain Wallet Address:</strong> Your public wallet address is stored to verify voting eligibility and prevent double voting.
                    </li>
                    <li>
                      <strong className="text-slate-900">Voting Activity:</strong> We record that a vote has been cast by your wallet ID, but we do NOT link your specific vote choices to your personal identity in a way that can be publicly traced.
                    </li>
                    <li>
                      <strong className="text-slate-900">Device Information:</strong> Basic information about your device and browser for security monitoring and optimization.
                    </li>
                  </ul>
                </div>
              </section>

              {/* Data Usage */}
              <section className="bg-white p-8 rounded-xl border shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-slate-500" />
                  2. How We Use Your Data
                </h2>
                <div className="space-y-4 text-slate-600">
                  <p>Your data is used strictly for:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Verifying your eligibility to vote in specific elections.</li>
                    <li>Ensuring one-person-one-vote integrity via the blockchain.</li>
                    <li>Sending important notifications regarding election dates and results.</li>
                    <li>Generating anonymous statistical reports on voter turnout.</li>
                  </ul>
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 mt-4">
                    <p className="text-sm text-emerald-800">
                      <strong>Note:</strong> We never sell your personal data to third parties or use it for marketing purposes unrelated to university elections.
                    </p>
                  </div>
                </div>
              </section>

              {/* Data Storage */}
              <section className="bg-white p-8 rounded-xl border shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Server className="h-5 w-5 text-slate-500" />
                  3. Data Storage & Security
                </h2>
                <div className="space-y-4 text-slate-600">
                  <p>
                    We employ industry-standard security measures:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong className="text-slate-900">Encryption:</strong> All personal data is encrypted in transit and at rest.
                    </li>
                    <li>
                      <strong className="text-slate-900">Blockchain Immutability:</strong> Voting records are stored on the blockchain, making them tamper-proof and transparent while preserving anonymity.
                    </li>
                    <li>
                      <strong className="text-slate-900">Access Control:</strong> strict access controls ensure only authorized election officials can access sensitive voter registries.
                    </li>
                  </ul>
                </div>
              </section>

              {/* User Rights */}
              <section className="bg-white p-8 rounded-xl border shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-slate-500" />
                  4. Your Rights
                </h2>
                <div className="space-y-4 text-slate-600">
                  <p>You have the right to:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Access the personal information we hold about you.</li>
                    <li>Request correction of inaccurate data.</li>
                    <li>Request deletion of your account (subject to election audit retention requirements).</li>
                    <li>Verify your individual vote was counted correctly on the blockchain.</li>
                  </ul>
                </div>
              </section>

              {/* Contact */}
              <section className="bg-white p-8 rounded-xl border shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Contact Us</h2>
                <p className="text-slate-600 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact the Election Committee:
                </p>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-slate-900 font-medium">APU Student Representative Council</p>
                  <p className="text-slate-600">Email: src@apu.edu.my</p>
                  <p className="text-slate-600">Location: Student Centre, Level 3</p>
                </div>
              </section>
            </div>

            {/* Quick Links Sidebar */}
            <div className="hidden md:block">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-4">Quick Navigation</h3>
                  <nav className="space-y-2">
                    <a href="#" className="block text-sm text-slate-600 hover:text-emerald-600 transition-colors">Information Collection</a>
                    <a href="#" className="block text-sm text-slate-600 hover:text-emerald-600 transition-colors">Data Usage</a>
                    <a href="#" className="block text-sm text-slate-600 hover:text-emerald-600 transition-colors">Security Measures</a>
                    <a href="#" className="block text-sm text-slate-600 hover:text-emerald-600 transition-colors">Your Rights</a>
                  </nav>
                </div>

                <div className="bg-emerald-600 p-6 rounded-xl text-white">
                  <Lock className="h-8 w-8 mb-4 opacity-80" />
                  <h3 className="font-semibold mb-2">Secure Voting</h3>
                  <p className="text-sm text-emerald-100 mb-4">
                    Our blockchain technology ensures your vote is permanent and tamper-proof.
                  </p>
                  <Button variant="secondary" size="sm" className="w-full text-emerald-700">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-8 mt-auto">
        <div className="container mx-auto max-w-5xl px-6 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} APU Vote Chain. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}