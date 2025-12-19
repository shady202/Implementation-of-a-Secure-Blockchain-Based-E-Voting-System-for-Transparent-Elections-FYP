import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { UserNav } from "./UserNav";
import { Shield, Lock, Eye, Database, UserCheck, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
const apuLogo = "/apu-logo.png";

interface PrivacyPageProps {
  onNavigate: (page: string) => void;
}

export function PrivacyPage({ onNavigate }: PrivacyPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl flex h-16 items-center px-6 md:px-8">
          <div className="flex items-center gap-2 w-48">
            <img src={apuLogo} alt="APU Logo" className="h-8 w-8" />
            <span className="text-slate-900">Privacy</span>
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
        <div className="container mx-auto max-w-5xl px-6 md:px-8 py-12">
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
            <h1 className="text-slate-900 mb-2">Privacy Policy</h1>
            <p className="text-slate-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="mb-8 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <p className="text-slate-900 leading-relaxed">
              At APU VOTE, we are committed to protecting your privacy and
              ensuring the security of your personal information. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your
              data in compliance with the Malaysian Personal Data Protection Act
              (PDPA) 2010.
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Database className="h-6 w-6 text-emerald-500" />
                  <CardTitle>1. Information We Collect</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed space-y-3">
                  <div>
                    <div className="text-slate-900 mb-2">
                      Personal Information:
                    </div>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Full name</li>
                      <li>Student ID number</li>
                      <li>University email address (@apu.edu.my)</li>
                      <li>Date of birth</li>
                      <li>Program of study</li>
                      <li>Enrollment status</li>
                    </ul>
                  </div>
                  <div>
                    <div className="text-slate-900 mb-2">
                      Technical Information:
                    </div>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>IP address</li>
                      <li>Browser type and version</li>
                      <li>Device information</li>
                      <li>Login timestamps</li>
                      <li>
                        Blockchain wallet addresses (for voting transactions)
                      </li>
                    </ul>
                  </div>
                  <div>
                    <div className="text-slate-900 mb-2">Voting Data:</div>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Participation status (whether you voted)</li>
                      <li>Timestamp of vote submission</li>
                      <li>
                        Note: Your actual vote choices are encrypted and
                        anonymous
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Eye className="h-6 w-6 text-emerald-500" />
                  <CardTitle>2. How We Use Your Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed">
                  <div className="mb-3">
                    We use the collected information for the following purposes:
                  </div>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>
                      <strong className="text-slate-900">
                        Voter Verification:
                      </strong>{" "}
                      To confirm your eligibility to vote in university
                      elections
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Account Management:
                      </strong>{" "}
                      To create and maintain your voting account
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Election Administration:
                      </strong>{" "}
                      To conduct fair and transparent elections
                    </li>
                    <li>
                      <strong className="text-slate-900">Security:</strong> To
                      prevent fraud, unauthorized access, and ensure system
                      integrity
                    </li>
                    <li>
                      <strong className="text-slate-900">Communication:</strong>{" "}
                      To send election notifications and important updates
                    </li>
                    <li>
                      <strong className="text-slate-900">Analytics:</strong> To
                      improve system performance and user experience
                    </li>
                    <li>
                      <strong className="text-slate-900">Compliance:</strong> To
                      meet legal and regulatory requirements
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Lock className="h-6 w-6 text-emerald-500" />
                  <CardTitle>3. Vote Anonymity and Blockchain</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed space-y-2">
                  <div>
                    <strong className="text-slate-900">
                      Your vote is completely anonymous:
                    </strong>
                  </div>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>
                      Votes are encrypted before being recorded on the Ethereum
                      blockchain
                    </li>
                    <li>
                      Your identity is separated from your vote through
                      cryptographic techniques (zero-knowledge proofs)
                    </li>
                    <li>
                      No one, including system administrators, can link your
                      vote to your identity
                    </li>
                    <li>
                      The blockchain ensures votes cannot be altered or deleted
                    </li>
                    <li>
                      Only aggregated, anonymous voting results are made public
                    </li>
                  </ul>
                  <div className="mt-3">
                    The blockchain records transaction hashes and timestamps but
                    does not contain any personally identifiable information
                    about how individuals voted.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-emerald-500" />
                  <CardTitle>4. Data Security</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed space-y-2">
                  <div>
                    We implement industry-standard security measures to protect
                    your data:
                  </div>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>
                      <strong className="text-slate-900">Encryption:</strong>{" "}
                      All data is encrypted in transit (TLS/SSL) and at rest
                      (AES-256)
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Access Controls:
                      </strong>{" "}
                      Strict role-based access to personal data
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Authentication:
                      </strong>{" "}
                      Multi-factor authentication for enhanced security
                    </li>
                    <li>
                      <strong className="text-slate-900">Monitoring:</strong>{" "}
                      Continuous security monitoring and threat detection
                    </li>
                    <li>
                      <strong className="text-slate-900">Auditing:</strong>{" "}
                      Regular security audits and penetration testing
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Blockchain Security:
                      </strong>{" "}
                      Immutable records protected by Ethereum network consensus
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-emerald-500" />
                  <CardTitle>5. Data Sharing and Disclosure</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed space-y-2">
                  <div>
                    <strong className="text-slate-900">
                      We do not sell your personal information.
                    </strong>{" "}
                    We may share your data only in the following circumstances:
                  </div>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>
                      <strong className="text-slate-900">
                        University Administration:
                      </strong>{" "}
                      With authorized APU staff for election management
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Service Providers:
                      </strong>{" "}
                      With trusted third-party services that help operate our
                      platform (under strict confidentiality agreements)
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Legal Requirements:
                      </strong>{" "}
                      When required by Malaysian law or valid legal process
                    </li>
                    <li>
                      <strong className="text-slate-900">Security:</strong> To
                      protect against fraud, abuse, or security threats
                    </li>
                    <li>
                      <strong className="text-slate-900">Consent:</strong> When
                      you explicitly consent to sharing
                    </li>
                  </ul>
                  <div className="mt-3 text-slate-900">
                    Public Blockchain Data: Transaction hashes and timestamps
                    are publicly visible on the Ethereum blockchain, but these
                    contain no personally identifiable information.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <UserCheck className="h-6 w-6 text-emerald-500" />
                  <CardTitle>6. Your Rights (Under PDPA 2010)</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed space-y-2">
                  <div>
                    Under Malaysian law, you have the following rights regarding
                    your personal data:
                  </div>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>
                      <strong className="text-slate-900">Access:</strong>{" "}
                      Request a copy of your personal data we hold
                    </li>
                    <li>
                      <strong className="text-slate-900">Correction:</strong>{" "}
                      Request correction of inaccurate or incomplete data
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Data Portability:
                      </strong>{" "}
                      Request your data in a structured, commonly used format
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Withdrawal of Consent:
                      </strong>{" "}
                      Withdraw consent for data processing (subject to legal
                      requirements)
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Limit Processing:
                      </strong>{" "}
                      Request limitation of how we process your data
                    </li>
                  </ul>
                  <div className="mt-3">
                    <strong className="text-slate-900">Important Note:</strong>{" "}
                    Due to the immutable nature of blockchain technology, votes
                    recorded on the blockchain cannot be deleted or modified.
                    However, votes are anonymous and cannot be linked to your
                    identity.
                  </div>
                  <div className="mt-2">
                    To exercise your rights, please contact our Data Protection
                    Officer at{" "}
                    <a
                      href="mailto:dpo@apu.edu.my"
                      className="text-emerald-600 hover:underline"
                    >
                      dpo@apu.edu.my
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Data Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed space-y-2">
                  <div>We retain your data for the following periods:</div>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>
                      <strong className="text-slate-900">
                        Account Information:
                      </strong>{" "}
                      Duration of your enrollment plus 7 years (for audit
                      purposes)
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Voting Records:
                      </strong>{" "}
                      Permanently on the blockchain (anonymous)
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Personal Identifiers:
                      </strong>{" "}
                      Separated from voting data and retained according to
                      university policy
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Technical Logs:
                      </strong>{" "}
                      12 months for security purposes
                    </li>
                  </ul>
                  <div className="mt-3">
                    Data is securely deleted or anonymized after retention
                    periods expire, except for blockchain records which are
                    permanent but anonymous.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Cookies and Tracking Technologies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed">
                  We use essential cookies and similar technologies to:
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Maintain your login session</li>
                    <li>Remember your preferences</li>
                    <li>Analyze system usage and performance</li>
                    <li>Detect and prevent security threats</li>
                  </ul>
                  <div className="mt-3">
                    You can control cookies through your browser settings, but
                    disabling them may affect system functionality.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Third-Party Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed">
                  Our platform integrates with:
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>
                      <strong className="text-slate-900">
                        Ethereum Blockchain:
                      </strong>{" "}
                      For vote recording and verification
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Email Services:
                      </strong>{" "}
                      For sending notifications (university email system)
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Cloud Infrastructure:
                      </strong>{" "}
                      For hosting and data storage (with PDPA compliance)
                    </li>
                  </ul>
                  <div className="mt-3">
                    All third-party services are carefully selected and required
                    to maintain appropriate security and privacy standards.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed">
                  APU VOTE is designed for university students aged 18 and
                  above. We do not knowingly collect personal information from
                  individuals under 18. If you believe we have inadvertently
                  collected such information, please contact us immediately.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>11. International Data Transfers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed">
                  Your data is primarily stored and processed in Malaysia. If
                  data needs to be transferred internationally (e.g., for cloud
                  services), we ensure appropriate safeguards are in place,
                  including:
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Standard contractual clauses</li>
                    <li>Adequate data protection measures</li>
                    <li>
                      Compliance with PDPA requirements for cross-border data
                      transfers
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>12. Changes to This Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed">
                  We may update this Privacy Policy periodically to reflect
                  changes in our practices or legal requirements. We will notify
                  you of significant changes via:
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Email notification to your university address</li>
                    <li>Prominent notice on the platform</li>
                    <li>
                      Updated "Last updated" date at the top of this policy
                    </li>
                  </ul>
                  <div className="mt-3">
                    Continued use of the service after changes indicates
                    acceptance of the updated policy.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>13. Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed">
                  If you have questions, concerns, or requests regarding this
                  Privacy Policy or your personal data, please contact:
                  <div className="mt-3 space-y-2">
                    <div>
                      <strong className="text-slate-900">
                        Data Protection Officer (DPO)
                      </strong>
                    </div>
                    <div>
                      Email:{" "}
                      <a
                        href="mailto:dpo@apu.edu.my"
                        className="text-emerald-600 hover:underline"
                      >
                        dpo@apu.edu.my
                      </a>
                    </div>
                    <div>
                      General Inquiries:{" "}
                      <a
                        href="mailto:vote@apu.edu.my"
                        className="text-emerald-600 hover:underline"
                      >
                        vote@apu.edu.my
                      </a>
                    </div>
                    <div>Phone: +60 3-8996 1000</div>
                    <div>
                      Address: Asia Pacific University of Technology &
                      Innovation
                      <br />
                      Technology Park Malaysia
                      <br />
                      Bukit Jalil, 57000 Kuala Lumpur
                      <br />
                      Malaysia
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>14. Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600 leading-relaxed">
                  If you believe your privacy rights have been violated, you may
                  lodge a complaint with:
                  <div className="mt-3 space-y-2">
                    <div>
                      <strong className="text-slate-900">
                        Personal Data Protection Department
                      </strong>
                    </div>
                    <div>Ministry of Communications and Digital</div>
                    <div>
                      Website:{" "}
                      <a
                        href="https://www.pdp.gov.my"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:underline"
                      >
                        www.pdp.gov.my
                      </a>
                    </div>
                    <div>Email: pdp@kkmm.gov.my</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 p-4 bg-slate-100 rounded-lg">
            <div className="text-slate-600 text-center">
              By using APU VOTE, you acknowledge that you have read and
              understood this Privacy Policy and consent to the collection, use,
              and disclosure of your personal information as described herein.
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
