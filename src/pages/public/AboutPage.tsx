import React from 'react';
import { BookOpen } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="flex justify-center mb-4">
            <BookOpen className="text-blue-900" size={40} />
          </div>
          <h1 className="font-serif text-4xl font-bold text-gray-800 mb-4">
            About Captured Thinkings
          </h1>
          <p className="text-gray-600">
            A bilingual sanctuary for poetic expression.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img 
            src="https://images.pexels.com/photos/5834/nature-grass-leaf-green.jpg" 
            alt="About Captured Thinkings" 
            className="w-full h-64 object-cover object-center"
          />
          
          <div className="p-8">
            <div className="prose max-w-none">
              <h2 className="font-serif">Our Story</h2>
              <p>
                Captured Thinkings was born from a profound love for poetry and a desire to create a platform where poetic expressions in both English and Kannada could flourish. Founded in 2023, our mission is to preserve and celebrate the artistry of words across languages.
              </p>
              
              <p>
                We believe that poetry transcends cultural and linguistic boundaries, speaking directly to the human experience. By featuring works in both English and Kannada, we aim to bridge worlds and share the unique perspectives each language brings to poetic expression.
              </p>
              
              <h2 className="font-serif">Our Mission</h2>
              <p>
                At Captured Thinkings, we are dedicated to:
              </p>
              
              <ul>
                <li>Creating a high-quality repository of bilingual poetry</li>
                <li>Showcasing the richness and diversity of poetic expression</li>
                <li>Providing a clean, distraction-free reading experience</li>
                <li>Preserving the cultural heritage embedded within poetry</li>
                <li>Building a community around the appreciation of poetic art</li>
              </ul>
              
              <h2 className="font-serif">The Team</h2>
              <p>
                Captured Thinkings is maintained by a small team of poetry enthusiasts with a passion for language and expression. Our diverse backgrounds in literature, design, and technology come together to create this unique platform.
              </p>
              
              <h2 className="font-serif">Join Us</h2>
              <p>
                We invite you to explore the poems featured on our site, immerse yourself in the emotions and imagery they evoke, and share your favorite pieces with others who appreciate the power of words.
              </p>
              
              <p>
                For inquiries, feedback, or to learn more about our platform, please visit our <a href="/contact" className="text-blue-900 hover:underline">Contact page</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;