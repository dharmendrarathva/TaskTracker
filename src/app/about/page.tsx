export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 px-6">
      
      <div className="max-w-6xl mx-auto">

        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About Task Tracker
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Task Tracker is a productivity-focused web application designed
            to help users plan, track, and analyze their daily goals with clarity and efficiency.
          </p>
        </section>

        {/* Mission Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-20">
          
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-md hover:border-amber-100/25 ">
            <h2 className="text-2xl font-semibold mb-4 text-amber-400 ">
              Our Mission
            </h2>
            <p className="text-gray-400 leading-relaxed">
              We aim to simplify goal tracking by providing intuitive dashboards,
              meaningful analytics, and seamless task management — all in one place.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-md hover:border-amber-100/25 ">
            <h3 className="text-xl font-semibold mb-4">
              Why Task Tracker?
            </h3>
            <ul className="space-y-3 text-gray-400">
              <li>✔ Clean & distraction-free interface</li>
              <li>✔ Real-time task monitoring</li>
              <li>✔ Performance analysis tools</li>
              <li>✔ Secure Google authentication</li>
            </ul>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-center mb-12 text-amber-400">
            Core Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:border-amber-100/25 transition">
              <h3 className="text-lg font-semibold mb-3">Dashboard</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Track all your tasks in one centralized dashboard with clear
                visibility of progress.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:border-amber-100/25  transition">
              <h3 className="text-lg font-semibold mb-3">Analytics</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Gain insights into productivity trends and task completion patterns.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:border-amber-100/25  transition">
              <h3 className="text-lg font-semibold mb-3">Secure Access</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Sign in securely with Google authentication powered by NextAuth.
              </p>
            </div>

          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center pb-16">
          <h2 className="text-2xl font-semibold mb-6">
            Ready to boost your productivity?
          </h2>
          <a
            href="/"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-3 rounded-lg transition"
          >
            Get Started
          </a>
        </section>

      </div>
    </div>
  );
}