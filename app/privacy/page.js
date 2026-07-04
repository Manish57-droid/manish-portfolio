export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-void text-ink px-6 py-16 max-w-3xl mx-auto font-mono">
      <h1 className="text-3xl font-bold text-accent-green mb-2">Privacy Policy</h1>
      <p className="text-ink-muted text-sm mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="space-y-6 text-sm leading-relaxed text-ink/80">
        <div>
          <h2 className="text-accent-cyan text-lg font-bold mb-2">1. Information We Collect</h2>
          <p>This website collects visitor location data (country, city, coordinates) via IP geolocation for the purpose of displaying an anonymous visitor map. No personally identifiable information is stored.</p>
        </div>

        <div>
          <h2 className="text-accent-cyan text-lg font-bold mb-2">2. Cookies & Analytics</h2>
          <p>This site uses Vercel Analytics to collect anonymous usage statistics including page views, device types and general location. This data is aggregated and cannot identify individual users. Google AdSense may use cookies to serve relevant advertisements.</p>
        </div>

        <div>
          <h2 className="text-accent-cyan text-lg font-bold mb-2">3. Third Party Services</h2>
          <p>We use the following third party services:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-ink-muted">
            <li>Supabase — database for blog posts and messages</li>
            <li>Vercel Analytics — anonymous traffic analytics</li>
            <li>Google AdSense — advertising (if approved)</li>
            <li>ipapi.co — IP geolocation for visitor map</li>
          </ul>
        </div>

        <div>
          <h2 className="text-accent-cyan text-lg font-bold mb-2">4. Data Storage</h2>
          <p>Messages posted on the visitor wall are stored in Supabase. These are publicly visible. Do not post sensitive information. Blog posts are stored and managed by the site owner only.</p>
        </div>

        <div>
          <h2 className="text-accent-cyan text-lg font-bold mb-2">5. Your Rights</h2>
          <p>You may request deletion of any message you posted by contacting us at manishkushwaha572000@gmail.com</p>
        </div>

        <div>
          <h2 className="text-accent-cyan text-lg font-bold mb-2">6. Contact</h2>
          <p>For any privacy related questions contact:<br />
          <span className="text-accent-green">manishkushwaha572000@gmail.com</span></p>
        </div>
      </section>

      <div className="mt-12 border-t border-border pt-6">
        <a href="/" className="text-accent-green hover:text-accent-cyan transition-colors text-sm">
          ← Back to Portfolio
        </a>
      </div>
    </main>
  );
}