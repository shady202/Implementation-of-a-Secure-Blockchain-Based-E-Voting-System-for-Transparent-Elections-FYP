import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  Shield,
  Lock,
  CheckCircle2,
  Users,
  BarChart3,
  Globe,
  Smartphone,
  Clock,
  Award,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { UserNav } from "./UserNav";
import { isLoggedIn } from "../lib/session";
import apuLogo from "../assets/apu-logo.png";

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const currentUser = isLoggedIn();
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl flex h-16 items-center px-6 md:px-8">
          <div className="flex items-center gap-2 w-48">
            <img src={apuLogo} alt="APU Logo" className="h-8 w-8" />
            <span className="font-semibold text-slate-900">About</span>
          </div>
          <nav className="hidden md:flex gap-6 flex-1 justify-center">
            <button
              onClick={() => onNavigate("home")}
              className="text-sm transition-colors hover:text-primary"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate("vote")}
              className="text-sm font-normal text-slate-600 hover:text-slate-900 transition-colors"
            >
              Elections
            </button>
            <button
              onClick={() => onNavigate("results")}
              className="text-sm font-normal text-slate-600 hover:text-slate-900 transition-colors"
            >
              Results
            </button>
            <button
              onClick={() => onNavigate("my-votes")}
              className="text-sm font-normal text-slate-600 hover:text-slate-900 transition-colors"
            >
              My Votes
            </button>
            <button className="text-sm font-normal text-primary">About</button>
            <button
              onClick={() => onNavigate("contact")}
              className="text-sm font-normal text-slate-600 hover:text-slate-900 transition-colors"
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
        <div className="container mx-auto max-w-7xl px-6 md:px-8 py-12">
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

          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={apuLogo}
                alt="Asia Pacific University Logo"
                className="h-16 w-auto"
              />
              <div>
                <h1 className="text-slate-900">About APU VOTE</h1>
                <p className="text-slate-600 mt-2">
                  Revolutionizing University Elections with Blockchain
                  Technology
                </p>
              </div>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What is APU VOTE?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-900">
                APU VOTE is a cutting-edge blockchain-based voting system
                designed specifically for Asia Pacific University elections. Our
                platform ensures transparent, secure, and tamper-proof elections
                while maintaining voter privacy and providing real-time results.
              </p>
              <p className="text-slate-600">
                Built on Ethereum blockchain technology, APU VOTE eliminates
                traditional voting concerns such as ballot tampering, vote
                manipulation, and result disputes. Every vote is
                cryptographically secured and permanently recorded on the
                blockchain, creating an immutable record of the democratic
                process.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
              <CardDescription>
                What makes APU VOTE the future of university elections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-emerald-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-slate-900 mb-2">Blockchain Security</h3>
                    <p className="text-slate-600">
                      Every vote is cryptographically secured and stored on the
                      Ethereum blockchain, making it impossible to tamper with
                      or manipulate results.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="h-6 w-6 text-emerald-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-slate-900 mb-2">Voter Privacy</h3>
                    <p className="text-slate-600">
                      Advanced cryptographic techniques ensure voter anonymity
                      while maintaining the ability to verify that votes were
                      counted correctly.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-slate-900 mb-2">Transparent Process</h3>
                    <p className="text-slate-600">
                      All election processes are transparent and auditable.
                      Anyone can verify the integrity of the election through
                      blockchain explorers.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-6 w-6 text-emerald-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-slate-900 mb-2">Real-time Results</h3>
                    <p className="text-slate-600">
                      Vote counts are updated in real-time as ballots are cast,
                      providing immediate and accurate election results.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-6 w-6 text-emerald-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-slate-900 mb-2">
                      Student Verification
                    </h3>
                    <p className="text-slate-600">
                      Integrated with university systems to verify student
                      eligibility and prevent unauthorized voting.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Smartphone className="h-6 w-6 text-emerald-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-slate-900 mb-2">Mobile Friendly</h3>
                    <p className="text-slate-600">
                      Fully responsive design allows students to vote securely
                      from any device, anywhere on campus or remotely.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>The voting process simplified</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-emerald-100 p-2 text-emerald-600 text-sm min-w-[2rem] h-8 flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-slate-900 mb-1">
                      Eligibility Verification
                    </h3>
                    <p className="text-slate-600">
                      Students verify their eligibility using their student ID
                      and matriculation number against the university database.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-emerald-100 p-2 text-emerald-600 text-sm min-w-[2rem] h-8 flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-slate-900 mb-1">Wallet Registration</h3>
                    <p className="text-slate-600">
                      Connect your Ethereum wallet (MetaMask) and register as a
                      voter. Your wallet address becomes your unique voting
                      identifier.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-emerald-100 p-2 text-emerald-600 text-sm min-w-[2rem] h-8 flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-slate-900 mb-1">Cast Your Vote</h3>
                    <p className="text-slate-600">
                      Select your preferred candidates for each position during
                      the active voting period. Your vote is encrypted and
                      submitted to the blockchain.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-emerald-100 p-2 text-emerald-600 text-sm min-w-[2rem] h-8 flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-slate-900 mb-1">
                      Blockchain Confirmation
                    </h3>
                    <p className="text-slate-600">
                      Your vote is permanently recorded on the Ethereum
                      blockchain with a unique transaction hash for verification
                      purposes.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-emerald-100 p-2 text-emerald-600 text-sm min-w-[2rem] h-8 flex items-center justify-center flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h3 className="text-slate-900 mb-1">View Results</h3>
                    <p className="text-slate-600">
                      Monitor real-time election results and verify the
                      integrity of the voting process through blockchain
                      explorers.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Technology Stack</CardTitle>
              <CardDescription>
                Built with cutting-edge technologies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="bg-blue-100 p-3 rounded-lg mb-2">
                    <Globe className="h-8 w-8 text-blue-600 mx-auto" />
                  </div>
                  <h3 className="text-slate-900">Ethereum</h3>
                  <p className="text-slate-600">Blockchain Platform</p>
                </div>
                <div className="text-center">
                  <div className="bg-gray-100 p-3 rounded-lg mb-2">
                    <BarChart3 className="h-8 w-8 text-gray-600 mx-auto" />
                  </div>
                  <h3 className="text-slate-900">Solidity</h3>
                  <p className="text-slate-600">Smart Contracts</p>
                </div>
                <div className="text-center">
                  <div className="bg-cyan-400 p-3 rounded-lg mb-2 flex items-center justify-center">
                    <span className="text-white">React</span>
                  </div>
                  <h3 className="text-slate-900">React</h3>
                  <p className="text-slate-600">Frontend Framework</p>
                </div>
                <div className="text-center">
                  <div className="bg-cyan-100 p-3 rounded-lg mb-2">
                    <div className="h-8 w-8 bg-cyan-500 rounded mx-auto"></div>
                  </div>
                  <h3 className="text-slate-900">Tailwind CSS</h3>
                  <p className="text-slate-600">Styling</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">ethers.js</Badge>
                <Badge variant="secondary">MetaMask</Badge>
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">shadcn/ui</Badge>
                <Badge variant="secondary">Vite</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Security & Privacy</CardTitle>
              <CardDescription>
                Your vote, your privacy, our commitment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-slate-900 mb-2 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  Cryptographic Security
                </h3>
                <p className="text-slate-600">
                  All votes are protected using advanced cryptographic
                  algorithms. Once a vote is cast, it becomes mathematically
                  impossible to alter or delete.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-slate-900 mb-2 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-600" />
                  Voter Anonymity
                </h3>
                <p className="text-slate-600">
                  While votes are publicly verifiable on the blockchain, voter
                  identities remain completely anonymous through zero-knowledge
                  proof techniques.
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="text-slate-900 mb-2 flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-600" />
                  Audit Trail
                </h3>
                <p className="text-slate-600">
                  Every action in the voting process is recorded with timestamps
                  and cryptographic proofs, creating a complete audit trail for
                  election verification.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>About Asia Pacific University</CardTitle>
              <CardDescription>
                Leading the way in technology education
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-900">
                Asia Pacific University (APU) is among Malaysia's premier
                private universities, and is where a unique fusion of
                technology, innovation and creativity works effectively towards
                preparing professional graduates for significant roles in
                business and society globally.
              </p>
              <p className="text-slate-600">
                APU has earned an enviable reputation as an award-winning
                university through its achievements in winning a host of
                prestigious awards at national and international levels. The
                university is committed to providing excellent educational
                opportunities and maintaining high standards of academic
                excellence.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <Users className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <h3 className="text-slate-900">12,000+</h3>
                  <p className="text-slate-600">Students</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <Globe className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <h3 className="text-slate-900">130+</h3>
                  <p className="text-slate-600">Countries</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <Award className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <h3 className="text-slate-900">25+</h3>
                  <p className="text-slate-600">Years of Excellence</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact & Support</CardTitle>
              <CardDescription>Get in touch with our team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-slate-900 mb-4">Technical Support</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-slate-600" />
                      <span className="text-slate-900">
                        support@apuvote.edu.my
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-slate-600" />
                      <span className="text-slate-900">+60 3-8996 1000</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-slate-600 mt-0.5" />
                      <span className="text-slate-900">
                        Technology Park Malaysia
                        <br />
                        57000 Kuala Lumpur
                        <br />
                        Malaysia
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-slate-900 mb-4">Election Committee</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-slate-600" />
                      <span className="text-slate-900">
                        elections@apu.edu.my
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-slate-600" />
                      <span className="text-slate-900">+60 3-8996 1234</span>
                    </div>
                    <p className="text-slate-600">
                      For election-related inquiries, candidate registration,
                      and voting assistance.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t">
                <p className="text-slate-600 text-center">
                  APU VOTE is developed and maintained by the Computer Science
                  Department in collaboration with the Student Affairs Office.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="w-full border-t py-6 mt-12">
        <div className="container mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 md:flex-row px-6 md:px-8">
          <p className="text-center text-slate-600 md:text-left">
            &copy; {new Date().getFullYear()} APU Vote Chain. All rights
            reserved.
          </p>
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
