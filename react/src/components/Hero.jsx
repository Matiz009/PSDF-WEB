const Hero = () => {
  return (
    <div className="relative bg-white dark:bg-slate-900 overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-7 text-center lg:text-left z-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 mb-6">
              ✨ Introducing New Analytics Features
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Manage your team like a{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Digital Native
              </span>
            </h1>
            
            <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0">
              Streamline production, track core metrics in real-time, and collaborate seamlessly with global teams using our intuitive workspace platform.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#get-started"
                className="inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Get Started Free
              </a>
              <a
                href="#demo"
                className="inline-flex items-center justify-center px-6 py-3.5 border border-slate-200 dark:border-slate-700 text-base font-medium rounded-xl text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Watch Live Demo
              </a>
            </div>

            {/* Micro Stats */}
            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">99.9%</p>
                <p className="text-xs text-slate-500">Uptime SLA</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">45k+</p>
                <p className="text-xs text-slate-500">Active Users</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">12M+</p>
                <p className="text-xs text-slate-500">Tasks Solved</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Element */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              {/* Decorative Frame */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl rotate-3 scale-105 opacity-10 blur-sm dark:opacity-20" />
              
              {/* Main Image Container */}
              <div className="relative bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-3xl shadow-2xl p-4 overflow-hidden aspect-[4/3] flex items-center justify-center">
                <div className="text-center p-6">
                  {/* Placeholder SVG Graph Graphic */}
                  <svg className="w-32 h-32 mx-auto text-blue-500/80 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                  <p className="mt-4 font-semibold text-slate-800 dark:text-slate-200">Interactive Workspace Preview</p>
                  <p className="text-sm text-slate-400 mt-1">Replace with your product dashboard screenshot</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
