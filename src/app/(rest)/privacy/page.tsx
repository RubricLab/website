import { formatDate } from '~/lib/utils/date'

export default function PrivacyPolicy() {
	return (
		<article className="mx-auto max-w-2xl space-y-12 px-6 py-20">
			<h1>Privacy Policy</h1>

			<section>
				<h2>Introduction</h2>
				<p>
					This Privacy Policy explains how we collect, use, and protect your personal information. We
					take your privacy seriously and are committed to being transparent about our data practices.
				</p>
			</section>

			<section>
				<h2>Information We Collect</h2>
				<p>We collect information that you voluntarily provide to us through:</p>
				<ul>
					<li>Our newsletter signup form</li>
					<li>Contact forms</li>
					<li>Account registration (if applicable)</li>
					<li>Website usage data</li>
				</ul>
			</section>

			<section>
				<h2>How We Use Your Information</h2>
				<p>We use your information to:</p>
				<ul>
					<li>Provide and improve our services</li>
					<li>Send you important updates about our products and services</li>
					<li>Respond to your inquiries and support requests</li>
					<li>Send our newsletter (only if you've explicitly signed up)</li>
				</ul>
			</section>

			<section>
				<h2>Data Protection</h2>
				<p>
					We implement appropriate security measures to protect your personal information. Your data is
					stored securely and is only accessible to authorized personnel who need it to perform their
					duties.
				</p>
			</section>

			<section>
				<h2>Email Communications</h2>
				<p>We respect your inbox. If you subscribe to our newsletter:</p>
				<ul>
					<li>We will never sell your email address to third parties</li>
					<li>We only send relevant content related to our services</li>
					<li>You can unsubscribe at any time using the link in our emails</li>
					<li>We limit our email frequency to avoid overwhelming you</li>
				</ul>
			</section>

			<section>
				<h2>Third-Party Services</h2>
				<p>We may use third-party services for:</p>
				<ul>
					<li>Analytics (e.g., Google Analytics)</li>
					<li>Email newsletter management</li>
					<li>Customer support tools</li>
				</ul>
				<p>
					These services may collect basic usage data to help us improve our services. They are bound by
					their own privacy policies and our data processing agreements.
				</p>
			</section>

			<section>
				<h2>Your Rights</h2>
				<p>You have the right to:</p>
				<ul>
					<li>Access your personal data</li>
					<li>Correct inaccurate data</li>
					<li>Request deletion of your data</li>
					<li>Opt-out of communications</li>
					<li>Request a copy of your data</li>
				</ul>
			</section>

			<section>
				<h2>Contact Us</h2>
				<p>
					If you have any questions about this Privacy Policy or how we handle your data, please contact
					us through our contact form or email us at [your contact email].
				</p>
			</section>

			<section>
				<h2>Updates to This Policy</h2>
				<p>
					We may update this Privacy Policy from time to time. We will notify you of any significant
					changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
				</p>
			</section>

			<p className="text-sm">Last Updated: {formatDate(new Date().toLocaleDateString())}</p>
		</article>
	)
}
