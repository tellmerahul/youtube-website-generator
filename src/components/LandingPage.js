import React, { useState, useEffect } from 'react';
import { Youtube, Settings, Layout, Zap, Send, Video, Palette, Globe, Menu, X, Mail, Lock, User, LogOut } from 'lucide-react';
import { auth, signInWithGoogle, signOut } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged } from 'firebase/auth';
import { fetchChannelData } from '../youtubeApi';
import { generateWebsite } from '../WebsiteTemplate';

const LandingPage = () => {
  const [channelUrl, setChannelUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedWebsite, setGeneratedWebsite] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '' });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to generate a website.');
      setIsLoginModalOpen(true);
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedWebsite(null);

    try {
      const channelData = await fetchChannelData(channelUrl);
      console.log('Channel data received:', JSON.stringify(channelData, null, 2));
      const website = generateWebsite(channelData);
      setGeneratedWebsite(website);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
      setIsLoginModalOpen(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupForm.email, signupForm.password);
      await updateProfile(userCredential.user, {
        displayName: signupForm.name
      });
      setIsSignupModalOpen(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      setIsLoginModalOpen(false);
      setIsSignupModalOpen(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 animate-gradient-x">
      <header className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg py-4 fixed w-full z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Youtube className="text-red-600 mr-2" />
            <span className="font-bold text-xl text-gray-800">WEBSITE</span>
          </div>
          <nav className="hidden md:flex items-center">
            <a href="#home" className="mx-2 text-gray-800 hover:text-red-600 transition-colors duration-300">Home</a>
            <a href="#who-we-are" className="mx-2 text-gray-800 hover:text-red-600 transition-colors duration-300">Who We Are</a>
            <a href="#how-it-works" className="mx-2 text-gray-800 hover:text-red-600 transition-colors duration-300">How It Works</a>
            <a href="#features" className="mx-2 text-gray-800 hover:text-red-600 transition-colors duration-300">Features</a>
            <a href="#contact" className="mx-2 text-gray-800 hover:text-red-600 transition-colors duration-300">Contact</a>
            {user ? (
              <>
                <span className="mx-2 text-gray-800">{user.displayName}</span>
                <button onClick={handleLogout} className="mx-2 text-gray-800 hover:text-red-600 transition-colors duration-300 flex items-center">
                  <LogOut className="mr-1" size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setIsLoginModalOpen(true)} className="mx-2 text-gray-800 hover:text-red-600 transition-colors duration-300">Login</button>
                <button onClick={() => setIsSignupModalOpen(true)} className="mx-2 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors duration-300">Sign Up</button>
              </>
            )}
          </nav>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg">
            <a href="#home" className="block py-2 px-4 text-gray-800 hover:text-red-600 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>Home</a>
            <a href="#who-we-are" className="block py-2 px-4 text-gray-800 hover:text-red-600 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>Who We Are</a>
            <a href="#how-it-works" className="block py-2 px-4 text-gray-800 hover:text-red-600 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>How It Works</a>
            <a href="#features" className="block py-2 px-4 text-gray-800 hover:text-red-600 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#contact" className="block py-2 px-4 text-gray-800 hover:text-red-600 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>Contact</a>
            {user ? (
              <>
                <span className="block py-2 px-4 text-gray-800">{user.displayName}</span>
                <button onClick={handleLogout} className="block w-full text-left py-2 px-4 text-gray-800 hover:text-red-600 transition-colors duration-300">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => { setIsLoginModalOpen(true); setIsMenuOpen(false); }} className="block w-full text-left py-2 px-4 text-gray-800 hover:text-red-600 transition-colors duration-300">Login</button>
                <button onClick={() => { setIsSignupModalOpen(true); setIsMenuOpen(false); }} className="block w-full text-left py-2 px-4 text-gray-800 hover:text-red-600 transition-colors duration-300">Sign Up</button>
              </>
            )}
            
          </div>
        )}
      </header>

      <main>
        <section id="home" className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-gray-800 animate-fade-in-down">
              Turn your YouTube Channel<br />into stunning visuals
            </h1>
            <p className="text-xl mb-8 text-gray-700 animate-fade-in-up">
              Enter your Channel ID and generate a unique design
            </p>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto animate-fade-in">
              <input
                type="text"
                value={channelUrl}
                onChange={(e) => setChannelUrl(e.target.value)}
                placeholder="Enter your YouTube channel URL"
                className="w-full px-4 py-2 rounded-full mb-4 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <button
                type="submit"
                className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-colors duration-300 transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? 'Generating...' : 'Generate visuals'}
              </button>
            </form>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </section>


        <section id="who-we-are" className="py-16">
          <div className="container mx-auto px-4 relative">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">Who We are.</h2>
              <p className="text-xl text-gray-700 mb-8">
                Bridging creativity with technology<br />to transform your YouTube presence.
              </p>
              <p className="text-gray-600">
                We're passionate about helping content creators showcase their work in the best possible light. Our innovative platform combines cutting-edge design with powerful technology to elevate your YouTube channel's visual appeal.
              </p>
            </div>
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <div className="w-12 h-12 bg-red-200 rounded-full absolute top-10 left-10 animate-float"></div>
              <div className="w-8 h-8 bg-blue-200 rounded-full absolute bottom-10 right-10 animate-float animation-delay-2000"></div>
              <Settings className="text-gray-400 absolute top-1/4 left-1/4 animate-spin-slow" size={32} />
              <Layout className="text-gray-400 absolute bottom-1/4 right-1/4 animate-pulse" size={32} />
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
            <div className="flex flex-wrap justify-center">
              <div className="w-full md:w-1/3 px-4 mb-8">
                <div className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-6 h-full transform hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold text-red-600 mb-4">1</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Enter Your Channel URL</h3>
                  <p className="text-gray-600">Simply paste your YouTube channel URL into our generator.</p>
                </div>
              </div>
              <div className="w-full md:w-1/3 px-4 mb-8">
                <div className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-6 h-full transform hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold text-red-600 mb-4">2</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Generate Design</h3>
                  <p className="text-gray-600">Our AI analyzes your channel and creates a custom website design.</p>
                </div>
              </div>
              <div className="w-full md:w-1/3 px-4 mb-8">
                <div className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-6 h-full transform hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold text-red-600 mb-4">3</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Customize and Launch</h3>
                  <p className="text-gray-600">Fine-tune your new website and share it with the world.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
                <Zap className="mx-auto text-red-600 mb-4" size={48} />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Instant Generation</h3>
                <p className="text-gray-600">Create your website in seconds with our advanced AI technology.</p>
              </div>
              <div className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
                <Layout className="mx-auto text-red-600 mb-4" size={48} />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Responsive Design</h3>
                <p className="text-gray-600">Your website looks great on all devices, from mobile to desktop.</p>
              </div>
              <div className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
                <Palette className="mx-auto text-red-600 mb-4" size={48} />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Customizable</h3>
                <p className="text-gray-600">Easily adjust colors, fonts, and layout to match your brand.</p>
              </div>
              <div className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
                <Video className="mx-auto text-red-600 mb-4" size={48} />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Video Showcase</h3>
                <p className="text-gray-600">Highlight your best content with an attractive video gallery.</p>
              </div>
              <div className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
                <Globe className="mx-auto text-red-600 mb-4" size={48} />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">SEO Optimized</h3>
                <p className="text-gray-600">Improve your online visibility with built-in SEO best practices.</p>
              </div>
              <div className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
                <Settings className="mx-auto text-red-600 mb-4" size={48} />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Easy Integration</h3>
                <p className="text-gray-600">Seamlessly integrate with your existing YouTube channel and content.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">Get in Touch</h2>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
                <textarea
                  placeholder="Your Message or Suggestion"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 h-32"
                  required
                ></textarea>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors duration-300 transform hover:scale-105"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

        {generatedWebsite && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Your Generated Website</h2>
              <div className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg p-4 rounded-lg shadow-lg">
                <iframe
                  srcDoc={generatedWebsite}
                  title="Generated Website Preview"
                  className="w-full h-96 border-none rounded-lg"
                />
                <button
                  onClick={() => {
                    const blob = new Blob([generatedWebsite], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'my-youtube-website.html';
                    a.click();
                  }}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300 transform hover:scale-105"
                >
                  Download HTML
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 YouTube Website Generator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;