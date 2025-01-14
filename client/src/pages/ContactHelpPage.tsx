// import { useState } from 'react';
// import { MapPin, Phone, Mail, Clock, Send, Building } from 'lucide-react';

// const ContactHelpPage = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     subject: '',
//     message: ''
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Handle form submission logic here
//     console.log('Form submitted:', formData);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       {/* Header */}
//       <div className="max-w-7xl mx-auto mb-12 text-center">
//         <h1 className="text-4xl font-bold text-blue-900 mb-4">Contactez-nous</h1>
//         <p className="text-gray-600 max-w-2xl mx-auto">
//           Notre équipe est là pour vous aider. N'hésitez pas à nous contacter pour toute question ou demande d'information.
//         </p>
//       </div>

//       <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
//         {/* Contact Information */}
//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
//             <div className="flex items-start gap-4">
//               <div className="bg-blue-50 rounded-lg p-3">
//                 <Building className="w-6 h-6 text-blue-600" />
//               </div>
//               <div>
//                 <h3 className="font-semibold text-lg mb-1">LEONI Tunisie</h3>
//                 <p className="text-gray-600">Siège Social</p>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <ContactInfo 
//                 icon={MapPin} 
//                 title="Adresse"
//                 content="Zone Industrielle Messadine, 4013 Sousse, Tunisie"
//               />
              
//               <ContactInfo 
//                 icon={Phone} 
//                 title="Téléphone"
//                 content="+216 73 325 355"
//               />
              
//               <ContactInfo 
//                 icon={Mail} 
//                 title="Email"
//                 content="contact@leoni.com.tn"
//               />
              
//               <ContactInfo 
//                 icon={Clock} 
//                 title="Heures d'ouverture"
//                 content="Lun - Ven: 8:00 - 17:00"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Contact Form */}
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                     Nom complet
//                   </label>
//                   <input
//                     type="text"
//                     id="name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     required
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
//                   Sujet
//                 </label>
//                 <input
//                   type="text"
//                   id="subject"
//                   name="subject"
//                   value={formData.subject}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   required
//                 />
//               </div>

//               <div>
//                 <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
//                   Message
//                 </label>
//                 <textarea
//                   id="message"
//                   name="message"
//                   value={formData.message}
//                   onChange={handleChange}
//                   rows={6}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   required
//                 ></textarea>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
//               >
//                 <Send className="w-5 h-5" />
//                 Envoyer le message
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>

//       {/* Map */}
//       <div className="max-w-7xl mx-auto mt-8">
//         <div className="bg-white rounded-xl shadow-sm p-6">
//           <div className="aspect-video rounded-lg overflow-hidden">
//             <iframe
//               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3234.8887890183136!2d10.5818!3d35.7289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQzJzQ0LjAiTiAxMMKwMzQnNTQuNiJF!5e0!3m2!1sen!2stn!4v1620000000000!5m2!1sen!2stn"
//               width="100%"
//               height="100%"
//               style={{ border: 0 }}
//               allowFullScreen
//               loading="lazy"
//               referrerPolicy="no-referrer-when-downgrade"
//             ></iframe>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const ContactInfo = ({ icon: Icon, title, content }: { icon: any, title: string, content: string }) => (
//   <div className="flex items-start gap-4">
//     <Icon className="w-5 h-5 text-blue-600 mt-1" />
//     <div>
//       <h4 className="font-medium text-gray-900">{title}</h4>
//       <p className="text-gray-600">{content}</p>
//     </div>
//   </div>
// );



// export default ContactHelpPage


import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Building } from 'lucide-react';

const ContactHelpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Contactez-nous</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Notre équipe est là pour vous aider. N'hésitez pas à nous contacter pour toute question ou demande d'information.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">LEONI Maroc</h3>
                <p className="text-gray-600">Site d'Agadir</p>
              </div>
            </div>

            <div className="space-y-4">
              <ContactInfo 
                icon={MapPin} 
                title="Adresse"
                content="Zone Industrielle Tassila III, 80000 Agadir, Maroc"
              />
              
              <ContactInfo 
                icon={Phone} 
                title="Téléphone"
                content="+212 528 335 555"
              />
              
              <ContactInfo 
                icon={Mail} 
                title="Email"
                content="contact.agadir@leoni.com"
              />
              
              <ContactInfo 
                icon={Clock} 
                title="Heures d'ouverture"
                content="Lun - Ven: 8:30 - 17:30"
              />
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3441.0374286671387!2d-9.5961!3d30.4033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDI0JzExLjkiTiAwOcKwMzUnNDUuOSJX!5e0!3m2!1sfr!2sma!4v1620000000000!5m2!1sfr!2sma"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ContactInfo = ({ icon: Icon, title, content }: { icon: any, title: string, content: string }) => (
  <div className="flex items-start gap-4">
    <Icon className="w-5 h-5 text-blue-600 mt-1" />
    <div>
      <h4 className="font-medium text-gray-900">{title}</h4>
      <p className="text-gray-600">{content}</p>
    </div>
  </div>
);

export default ContactHelpPage;


