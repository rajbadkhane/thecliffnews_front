import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using The Cliff News website and services.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <div className="prose max-w-none">
        <p className="mb-4">
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing and using The Cliff News website, you accept and agree to be bound
          by the terms and provision of this agreement.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Use License</h2>
        <p className="mb-4">
          Permission is granted to temporarily download one copy of the materials on
          The Cliff News website for personal, non-commercial transitory viewing only.
        </p>
        <p className="mb-4">This is the grant of a license, not a transfer of title, and under this license you may not:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Modify or copy the materials</li>
          <li>Use the materials for any commercial purpose or for any public display</li>
          <li>Attempt to decompile or reverse engineer any software contained on the website</li>
          <li>Remove any copyright or other proprietary notations from the materials</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Disclaimer</h2>
        <p className="mb-4">
          The materials on The Cliff News website are provided on an &apos;as is&apos; basis.
          The Cliff News makes no warranties, expressed or implied, and hereby disclaims
          and negates all other warranties including without limitation, implied warranties
          or conditions of merchantability, fitness for a particular purpose, or
          non-infringement of intellectual property or other violation of rights.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Limitations</h2>
        <p className="mb-4">
          In no event shall The Cliff News or its suppliers be liable for any damages
          (including, without limitation, damages for loss of data or profit, or due to
          business interruption) arising out of the use or inability to use the materials
          on The Cliff News website.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Accuracy of Materials</h2>
        <p className="mb-4">
          The materials appearing on The Cliff News website could include technical,
          typographical, or photographic errors. The Cliff News does not warrant that
          any of the materials on its website are accurate, complete, or current.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Information</h2>
        <p className="mb-4">
          If you have any questions about these Terms of Service, please contact us at:
        </p>
        <p className="mb-4">
          Email: Thecliffnewspaper@gmail.com<br />
          Phone: +91 87709 67135<br />
          Address: 374, G Sector, Ayodhya Nagar, Bhopal, Madhya Pradesh, India
        </p>
      </div>
    </div>
  );
}