import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to the Medical Analysis Portal</h1>
      <ul>
        <li>
          <Link href="/patientDetails" passHref>
            <a>Patient Details</a>
          </Link>
        </li>
        <li>
          <Link href="/upload" passHref>
            <a>Analysis</a>
          </Link>
        </li>
        <li>
          <Link href="/doctorSummary" passHref>
            <a>Doctor Summary</a>
          </Link>
        </li>
      </ul>
    </div>
  );
}
