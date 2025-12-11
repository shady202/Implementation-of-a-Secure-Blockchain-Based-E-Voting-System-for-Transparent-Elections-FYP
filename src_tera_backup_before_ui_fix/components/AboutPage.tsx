import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Shield, Users, Lock, CheckCircle2, Globe, Award, ChevronRight, ArrowLeft } from "lucide-react";
import { UserNav } from "./UserNav";
import { isLoggedIn } from "../lib/session";

const apuLogo = "/apu-logo.png";

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const currentUser = isLoggedIn();

  const handleNavigate = (page: string) => {
    onNavigate(page);
  };

  const stats = [
    { label: "Active Voters", value: "12,000+" },
    { label: "Elections Conducted", value: "50+" },
    { label: "Votes Secured", value: "45,000+" },
    { label: "Uptime", value: "99.9%" },
  ];

  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Project Lead",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
    },
    {
      name: "James Wilson",
      role: "Blockchain Architect",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
    },
    {
      name: "Maria Garcia",
      role: "Security Specialist",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200",
    },
    {
      name: "David Kim",
      role: "Frontend Developer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigate('home')}>
            <img src={apuLogo} alt="APU Logo" className="h-8 w-8" />
            <span className="text-slate-900 font-bold text-xl">APU VOTE</span>
          </div>

          <nav className="hidden md:flex gap-6">
            <button onClick={() => handleNavigate('home')} className="text-sm font-medium text-slate-600 hover:text-slate-900">Home</button>
            <button onClick={() => handleNavigate('vote')} className="text-sm font-medium text-slate-600 hover:text-slate-900">Elections</button>
            <button onClick={() => handleNavigate('results')} className="text-sm font-medium text-slate-600 hover:text-slate-900">Results</button>
            <button className="text-sm font-medium text-blue-600">About</button>
            <button onClick={() => handleNavigate('contact')} className="text-sm font-medium text-slate-600 hover:text-slate-900">Contact</button>
          </nav>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <UserNav onNavigate={handleNavigate} />
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => handleNavigate('login')}>Sign In</Button>
                <Button onClick={() => handleNavigate('register')} className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-white py-20 border-b">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                Revolutionizing Campus Democracy with Blockchain
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                APU VOTE is a state-of-the-art decentralized voting platform designed to ensure transparency, security, and integrity in university elections.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-slate-900 text-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="text-3xl font-bold text-emerald-400">{stat.value}</div>
                  <div className="text-sm text-slate-400 uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                  <Globe className="h-4 w-4" />
                  Our Mission
                </div>
                <h2 className="text-3xl font-bold text-slate-900">To Empower Every Student Voice</h2>
                <p className="text-slate-600 leading-relaxed">
                  We believe that every vote counts and that the integrity of the election process is paramount. By leveraging blockchain technology, we provide a platform where students can vote with confidence, knowing their voice is heard and their vote is secure.
                </p>
                <div className="space-y-4">
                  {[
                    "Eliminate voter fraud and manipulation",
                    "Ensure complete transparency in results",
                    "Protect voter privacy and anonymity",
                    "Make voting accessible to all students"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-emerald-400 rounded-2xl transform rotate-3 opacity-20"></div>
                <Card className="relative border-0 shadow-xl">
                  <CardContent className="p-8 space-y-6">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Award className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Why We Built This</h3>
                    <p className="text-slate-600">
                      Traditional voting systems are often opaque and prone to errors. We recognized the need for a modern solution that aligns with the technological advancement of our institution.
                    </p>
                    <p className="text-slate-600">
                      APU VOTE represents the convergence of academic excellence and technological innovation, setting a new standard for student governance.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="py-20 bg-white border-y">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl font-bold text-slate-900">Built on Secure Technology</h2>
              <p className="text-slate-600">
                We use industry-standard protocols and cutting-edge blockchain technology to ensure the highest level of security.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Shield className="h-8 w-8 text-blue-600" />,
                  title: "End-to-End Encryption",
                  description: "All data is encrypted in transit and at rest, ensuring that sensitive voter information remains private."
                },
                {
                  icon: <Lock className="h-8 w-8 text-emerald-600" />,
                  title: "Smart Contracts",
                  description: "Voting logic is governed by immutable smart contracts on the Ethereum blockchain, preventing tampering."
                },
                {
                  icon: <Users className="h-8 w-8 text-purple-600" />,
                  title: "Decentralized Verification",
                  description: "Multiple nodes verify each transaction, making the system resilient to single points of failure."
                }
              ].map((feature, i) => (
                <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-slate-50">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">The Team Behind APU VOTE</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Built by a dedicated team of students and faculty members committed to improving campus democracy.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {teamMembers.map((member, i) => (
                <div key={i} className="text-center space-y-4">
                  <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{member.name}</h3>
                    <p className="text-sm text-slate-500">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* CTA Section */}
        <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center"></div>
          <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to make your voice heard?</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Join thousands of students who are already using APU VOTE to shape the future of our university.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!currentUser && (
                <Button
                  size="lg"
                  onClick={() => handleNavigate('register')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8"
                >
                  Register Now
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleNavigate('contact')}
                className="border-white text-white hover:bg-white/10 px-8"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <img src={apuLogo} alt="APU Logo" className="h-8 w-8" />
                <span className="text-slate-900 font-bold text-xl">APU VOTE</span>
              </div>
              <p className="text-slate-600 max-w-xs">
                A secure, transparent, and decentralized voting platform for Asia Pacific University.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><button onClick={() => handleNavigate('home')} className="text-slate-600 hover:text-emerald-600">Home</button></li>
                <li><button onClick={() => handleNavigate('vote')} className="text-slate-600 hover:text-emerald-600">Elections</button></li>
                <li><button onClick={() => handleNavigate('results')} className="text-slate-600 hover:text-emerald-600">Results</button></li>
                <li><button onClick={() => handleNavigate('about')} className="text-slate-600 hover:text-emerald-600">About Us</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><button onClick={() => handleNavigate('privacy')} className="text-slate-600 hover:text-emerald-600">Privacy Policy</button></li>
                <li><button onClick={() => handleNavigate('terms')} className="text-slate-600 hover:text-emerald-600">Terms of Service</button></li>
                <li><button onClick={() => handleNavigate('contact')} className="text-slate-600 hover:text-emerald-600">Contact Support</button></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} APU VOTE. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}