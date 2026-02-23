import React from 'react'

export default function Footer() {
  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 py-6 mt-auto z-[1000]">
      <div className="max-w-6xl mx-auto px-4 flex flex-col-reverse md:flex-row items-center justify-between text-sm gap-4 md:gap-0">
        <p className="text-center md:text-left">&copy; {new Date().getFullYear()} Disaster Report Map Platform. All Rights Reserved.</p>
        <div className="flex gap-4">
          <a href="/my-reports" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Reports</a>
          <a href="#" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Privacy</a>
          <a href="#" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  )
}
