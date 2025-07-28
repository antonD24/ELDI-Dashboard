import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import outputs from "../../amplify_outputs.json";
import { signOut } from '@aws-amplify/auth'; 
import { generateClient } from "aws-amplify/data";
import { useState, useEffect } from "react";

import { data, type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

Amplify.configure(outputs);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [emergencies, setEmergencies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        setIsLoading(true);
        const { data: emergencyData, errors } = await client.models.Emergency.list();
        
        if (errors) {
          console.error('Errors fetching emergencies:', errors);
          setError('Failed to fetch emergencies');
        } else {
          setEmergencies(emergencyData || []);
        }
      } catch (err) {
        console.error('Error fetching emergencies:', err);
        setError('Failed to fetch emergencies');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmergencies();
  }, []);

  return (
    <div className={`${geistSans.className} ${geistMono.className} font-sans min-h-screen`}>
      {/* Navigation Bar */}
      <nav className="bg-black shadow-2xl border-gray-200 rounded-[50px] mt-2 mx-2">
        <div className="w-full mx-auto px-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <Image
                alt="ELDI Logo"
                src="/e-logo.png"
                width={50}
                height={50}
                className="rounded-full"
              />
              <h1 className="text-xl font-semibold text-white">
                ELDI Dashboard
              </h1>
            </div>

            {/* Navigation Links
            <div className="hidden md:block">
              <div className="ml-0 flex items-baseline space-x-4">
                <a
                  href="#"
                  className="text-white hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </a>
                
              </div>
            </div> */}

            {/* Sign Out Button */}
            <div className="flex items-center">
              <button
                onClick={() => signOut()}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-sm font-semibold transition-colors duration-200 ease-in-out focus:outline-none rounded-[50px]"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full mx-auto py-4 sm:px-4 lg:px-4 flex-1 h-full">
        <div className="px-4 py-6 sm:px-0 h-full">
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[calc(100vh-200px)]">
            {/* Left Section */}
            <div className="flex flex-col w-full h-full sticky top-0">
              {/* Fixed Header */}
              <div className="w-full h-16 mx-auto px-6 flex items-center justify-center rounded-[50px] bg-white shadow-lg mb-4 sticky top-4 z-20">
                <h2 className="text-xl font-semibold text-red-600">CASES</h2>
              </div>
              
              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto px-4 max-h-[calc(100vh-250px)]">
                <div className="space-y-3">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Loading cases...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8">
                      <p className="text-red-500">{error}</p>
                    </div>
                  ) : emergencies.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No cases found</p>
                    </div>
                  ) : (
                    emergencies.map((emergency, index) => (
                      <div 
                        key={emergency.id || index}
                        className="bg-white rounded-[20px] p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {emergency.name ? `${emergency.name.firstname} ${emergency.name.lastname}` : `Case #${(index + 1).toString().padStart(3, '0')}`}
                            </h3>
                            <p className="text-sm text-gray-600">{emergency.content || 'Emergency Alert'}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                              emergency.isDone 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {emergency.isDone ? 'Resolved' : 'Critical'}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              {emergency.updatedAt ? new Date(emergency.updatedAt).toLocaleString() : 'Recently'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            
            {/* Vertical Separator Line */}
            <div className="hidden lg:block absolute left-1/2 py-100 top-0 bottom-0 w-1 h-full rounded-full bg-gray-400 opacity-25 transform -translate-x-1/2 z-10"></div>
            
            {/* Right Section */}
            <div className="flex items-center justify-center w-full h-full">
              <div className="text-center h-16 w-[50%] bg-white">
                <h2 className="text-xl font-semibold text-black mb-2">Case View</h2>
                <p className="text-black">Open a case from the list on the left.</p>
                {isLoading ? (
                  <p className="text-gray-500 mt-2">Loading cases...</p>
                ) : error ? (
                  <p className="text-red-500 mt-2">{error}</p>
                ) : (
                  <p className="text-gray-500 mt-2">{emergencies.length} cases available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
