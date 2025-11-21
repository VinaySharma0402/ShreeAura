import React from "react";
import COO from '../assets/COO.jpeg';
import CTO from '../assets/CTO.jpeg';
import CEO from '../assets/CEO.jpeg';
import { FaLinkedin, FaTwitter } from 'react-icons/fa';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin?: string;
  twitter?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Priya Kumari",
    role: "Founder & CEO",
    image: CEO,
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Amar Kumar",
    role: "COO",
    image: COO,
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Ayushman Kumar Jha",
    role: "CTO",
    image: CTO,
    linkedin: "#",
    twitter: "#",
  },
];

const Team: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-yellow-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
          Meet Our Team
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          The people behind our vision and innovation.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-2xl"
            >
              <div className="relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-72 object-cover rounded-t-3xl"
                />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="p-8 pt-16 text-center">
                <h3 className="text-2xl font-semibold text-gray-800">
                  {member.name}
                </h3>
                <p className="text-gray-500 mt-2">{member.role}</p>
                <div className="flex justify-center mt-4 space-x-4">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      className="text-gray-600 hover:text-blue-600 transition duration-300"
                    >
                      <FaLinkedin size={24} />
                    </a>
                  )}
                  {member.twitter && (
                    <a
                      href={member.twitter}
                      className="text-gray-600 hover:text-blue-400 transition duration-300"
                    >
                      <FaTwitter size={24} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
