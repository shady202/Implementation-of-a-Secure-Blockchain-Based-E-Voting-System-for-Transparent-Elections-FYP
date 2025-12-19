import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { UserNav } from "./UserNav";
import { Shield, FileText, AlertCircle, Scale } from "lucide-react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

const apuLogo = "/apu-logo.png";

interface TermsPageProps {
  onNavigate: (page: string) => void;
}

export function TermsPage({ onNavigate }: TermsPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl flex h-16 items-center px-6 md:px-8">
          <div className="flex items-center gap-2 w-48">
            <img src={apuLogo} alt="APU Logo" className="h-8 w-8" />
            <span className="text-slate-900">Terms</span>
          </div>
          <nav className="hidden md:flex gap-6 flex-1 justify-center">
            <button
              onClick={() => onNavigate("home")}
              className="text-sm font-normal transition-colors hover:text-primary"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate("vote")}
              className="text-sm font-normal transition-colors hover:text-primary"
            >
              Elections
            </button>
            <button
              onClick={() => onNavigate("results")}
              className="text-sm font-normal transition-colors hover:text-primary"
            >
              Results
            </button>
            <button
              onClick={() => onNavigate("about")}
              className="text-sm font-normal transition-colors hover:text-primary"
            >
              About
            </button>
            <button
              onClick={() => onNavigate("contact")}
              className="text-sm font-normal transition-colors hover:text-primary"
            >
              Contact
            </button>
          </nav>
          <div className="flex items-center gap-3 w-48 justify-end">
            <UserNav onNavigate={onNavigate} />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto max-w-4xl py-16 px-6 md:px-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => onNavigate("home")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
          <div className="mb-8">
            <h1 className="text-slate-900 mb-2">Terms of Service</h1>
            <p className="text-slate-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-emerald-500" />
                  <CardTitle>1. Acceptance of Terms</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed">
                  By accessing and using the APU VOTE blockchain voting system,
                  you accept and agree to be bound by the terms and provision of
                  this agreement. If you do not agree to these terms, please do
                  not use this service.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-emerald-500" />
                  <CardTitle>2. Eligibility</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed space-y-2">
                  <div>
                    To use the APU VOTE system, you must be a currently enrolled
                    student at Asia Pacific University (APU) with a valid
                    student ID and university email address (@apu.edu.my).
                  </div>
                  <div>
                    <strong className="text-slate-900">Requirements:</strong>
                  </div>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Valid APU student ID</li>
                    <li>Active @apu.edu.my email address</li>
                    <li>Current enrollment status</li>
                    <li>Agreement to abide by university regulations</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Scale className="h-6 w-6 text-emerald-500" />
                  <CardTitle>3. Voting Procedures</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed space-y-2">
                  <div>
                    <strong className="text-slate-900">Voting Rules:</strong>
                  </div>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>
                      Each eligible voter may cast one vote per election
                      category
                    </li>
                    <li>
                      Votes are final and cannot be changed once submitted to
                      the blockchain
                    </li>
                    <li>All votes are anonymous and encrypted</li>
                    <li>
                      Vote tampering or fraud will result in disciplinary action
                    </li>
                    <li>
                      Voting is only allowed during the official election period
                    </li>
                  </ul>
                  <div className="mt-3">
                    The system records all voting activity on the Ethereum
                    blockchain for transparency and auditability while
                    maintaining voter anonymity.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-emerald-500" />
                  <CardTitle>4. User Responsibilities</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed space-y-2">
                  <div>
                    <strong className="text-slate-900">You agree to:</strong>
                  </div>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>
                      Provide accurate and truthful information during
                      registration
                    </li>
                    <li>
                      Keep your account credentials secure and confidential
                    </li>
                    <li>Not share your account with others</li>
                    <li>
                      Not attempt to manipulate or interfere with the voting
                      system
                    </li>
                    <li>
                      Report any security vulnerabilities or suspicious activity
                    </li>
                    <li>
                      Comply with all applicable university policies and
                      Malaysian laws
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. System Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed">
                  While we strive to maintain continuous service, the APU VOTE
                  system may be temporarily unavailable due to maintenance,
                  updates, or unforeseen technical issues. We are not liable for
                  any loss or inconvenience caused by system downtime.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Blockchain Technology</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed">
                  The voting system utilizes Ethereum blockchain technology. By
                  using this service, you acknowledge that:
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>
                      Votes recorded on the blockchain are permanent and
                      immutable
                    </li>
                    <li>
                      Blockchain transactions may incur network fees (gas fees)
                    </li>
                    <li>
                      Transaction processing times may vary based on network
                      congestion
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Privacy and Data Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed">
                  Your privacy is important to us. Please review our{" "}
                  <button
                    onClick={() => onNavigate("privacy")}
                    className="text-emerald-600 hover:underline"
                  >
                    Privacy Policy
                  </button>{" "}
                  to understand how we collect, use, and protect your personal
                  information. All data handling complies with Malaysian
                  Personal Data Protection Act (PDPA) 2010.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Prohibited Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed">
                  <strong className="text-slate-900">
                    The following activities are strictly prohibited:
                  </strong>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Vote buying, selling, or coercion</li>
                    <li>Creating multiple accounts</li>
                    <li>Attempting to hack or compromise the system</li>
                    <li>
                      Spreading false information about candidates or the voting
                      process
                    </li>
                    <li>Any form of election fraud or manipulation</li>
                  </ul>
                  <div className="mt-3">
                    Violations may result in account suspension, reporting to
                    university authorities, and potential legal action.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed">
                  All content, features, and functionality of the APU VOTE
                  system are owned by Asia Pacific University and are protected
                  by international copyright, trademark, and other intellectual
                  property laws.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Disclaimer of Warranties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed">
                  The service is provided "as is" and "as available" without any
                  warranties of any kind, either express or implied. We do not
                  warrant that the service will be uninterrupted, secure, or
                  error-free.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>11. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed">
                  To the maximum extent permitted by law, APU and its affiliates
                  shall not be liable for any indirect, incidental, special,
                  consequential, or punitive damages resulting from your use of
                  or inability to use the service.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>12. Modifications to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed">
                  We reserve the right to modify these terms at any time. Users
                  will be notified of significant changes via email or through
                  the platform. Continued use of the service after changes
                  constitutes acceptance of the modified terms.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>13. Governing Law</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed">
                  These terms shall be governed by and construed in accordance
                  with the laws of Malaysia. Any disputes arising from these
                  terms shall be subject to the exclusive jurisdiction of the
                  Malaysian courts.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>14. Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed">
                  If you have any questions about these Terms of Service, please
                  contact us:
                  <div className="mt-3 space-y-1">
                    <div>
                      <strong className="text-slate-900">Email:</strong>{" "}
                      vote@apu.edu.my
                    </div>
                    <div>
                      <strong className="text-slate-900">Phone:</strong> +60
                      3-8996 1000
                    </div>
                    <div>
                      <strong className="text-slate-900">Address:</strong>{" "}
                      Technology Park Malaysia, Bukit Jalil, 57000 Kuala Lumpur,
                      Malaysia
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 p-4 bg-slate-100 rounded-lg">
            <div className="text-slate-600 text-center">
              By using APU VOTE, you acknowledge that you have read, understood,
              and agree to be bound by these Terms of Service.
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full border-t py-6 mt-12">
        <div className="container mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 md:flex-row px-6 md:px-8">
          <div className="text-center text-slate-600 md:text-left">
            &copy; {new Date().getFullYear()} APU Vote Chain. All rights
            reserved.
          </div>
          <div className="flex gap-6">
            <button
              onClick={() => onNavigate("terms")}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Terms
            </button>
            <button
              onClick={() => onNavigate("privacy")}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Privacy
            </button>
            <button
              onClick={() => onNavigate("contact")}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Contact
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
