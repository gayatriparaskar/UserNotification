import React, { useState } from 'react'
import { ArrowLeft, Shield, Truck, GraduationCap, Thermometer, Droplets, Home, Utensils, Heart, AlertTriangle, Lightbulb } from 'lucide-react'
import { Link } from 'react-router-dom'

const CareGuide = () => {
  const [activeSection, setActiveSection] = useState('basics')

  const sections = [
    { id: 'basics', label: 'Basics', icon: <Home className="h-5 w-5" /> },
    { id: 'housing', label: 'Housing', icon: <Home className="h-5 w-5" /> },
    { id: 'feeding', label: 'Feeding', icon: <Utensils className="h-5 w-5" /> },
    { id: 'handling', label: 'Handling', icon: <Heart className="h-5 w-5" /> },
    { id: 'health', label: 'Health', icon: <Shield className="h-5 w-5" /> },
    { id: 'emergency', label: 'Emergency', icon: <AlertTriangle className="h-5 w-5" /> }
  ]

  const difficultyLevels = [
    {
      level: 'beginner',
      title: 'Beginner',
      icon: <span className="text-2xl">🌱</span>,
      description: 'Perfect for first-time snake owners. These snakes are hardy, docile, and easy to care for.',
      color: 'bg-green-100 text-green-800 border-green-200'
    },
    {
      level: 'intermediate',
      title: 'Intermediate',
      icon: <span className="text-2xl">📈</span>,
      description: 'For those with some reptile experience. These snakes require more specific care and handling.',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    {
      level: 'expert',
      title: 'Expert',
      icon: <span className="text-2xl">👑</span>,
      description: 'Advanced level snakes that require experienced handlers and specialized care.',
      color: 'bg-red-100 text-red-800 border-red-200'
    }
  ]

  const careTips = [
    'Always wash your hands before and after handling your snake',
    'Keep a feeding log to track your snake\'s eating habits',
    'Provide a humid hide during shedding periods',
    'Never feed your snake in its main enclosure to avoid substrate ingestion',
    'Use a snake hook for defensive or nervous snakes',
    'Keep handling sessions short (10-15 minutes) for beginners',
    'Provide enrichment like branches and climbing opportunities',
    'Clean and disinfect the enclosure regularly',
    'Have a backup heat source in case of power outages',
    'Join reptile communities for support and advice'
  ]

  const equipment = [
    { name: 'Enclosure', icon: <Home className="h-6 w-6" />, description: 'Glass tank or plastic tub' },
    { name: 'Thermometer', icon: <Thermometer className="h-6 w-6" />, description: 'Digital thermometer/hygrometer' },
    { name: 'Heat Source', icon: <span className="text-xl">🔥</span>, description: 'Heat mat or ceramic heater' },
    { name: 'Thermostat', icon: <span className="text-xl">⚙️</span>, description: 'Temperature controller' },
    { name: 'Hides', icon: <span className="text-xl">🏠</span>, description: 'Multiple hiding spots' },
    { name: 'Water Bowl', icon: <Droplets className="h-6 w-6" />, description: 'Large enough for soaking' },
    { name: 'Substrate', icon: <span className="text-xl">🌿</span>, description: 'Appropriate bedding material' },
    { name: 'Spray Bottle', icon: <span className="text-xl">💧</span>, description: 'For humidity control' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="flex items-center text-primary-600 hover:text-primary-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-primary-800">
            Snake Care Guide
          </h1>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-primary-800 mb-4">
                Care Topics
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary-100 text-primary-800'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {section.icon}
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Experience Levels */}
            {activeSection === 'basics' && (
              <div className="space-y-8">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-primary-800 mb-6">
                    Experience Levels
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {difficultyLevels.map((level) => (
                      <div key={level.level} className={`p-6 rounded-xl border-2 ${level.color}`}>
                        <div className="text-center mb-4">
                          {level.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-center">
                          {level.title}
                        </h3>
                        <p className="text-sm leading-relaxed">
                          {level.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pro Tips */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-primary-800 mb-6 flex items-center gap-3">
                    <Lightbulb className="h-8 w-8 text-yellow-500" />
                    Pro Tips
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {careTips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <span className="text-xl">💡</span>
                        <p className="text-gray-700">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Housing */}
            {activeSection === 'housing' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-primary-800 mb-6">
                  Housing Requirements
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <h3 className="font-semibold text-primary-800 mb-2">Enclosure Size</h3>
                      <p className="text-gray-700">Provide an enclosure that's at least as long as your snake and half as wide. For most snakes, a 40-gallon tank is a good starting point.</p>
                    </div>
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <h3 className="font-semibold text-primary-800 mb-2">Substrate</h3>
                      <p className="text-gray-700">Use appropriate substrate like aspen shavings, cypress mulch, or paper towels. Avoid cedar and pine as they can be harmful.</p>
                    </div>
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <h3 className="font-semibold text-primary-800 mb-2">Hides</h3>
                      <p className="text-gray-700">Provide at least two hides - one on the warm side and one on the cool side. Snakes need secure hiding spots to feel safe.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <h3 className="font-semibold text-primary-800 mb-2">Water Bowl</h3>
                      <p className="text-gray-700">Always provide fresh, clean water in a bowl large enough for your snake to soak in if needed.</p>
                    </div>
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <h3 className="font-semibold text-primary-800 mb-2">Temperature Gradient</h3>
                      <p className="text-gray-700">Create a temperature gradient with a warm side (80-85°F) and cool side (75-80°F). Use heat mats or ceramic heat emitters.</p>
                    </div>
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <h3 className="font-semibold text-primary-800 mb-2">Humidity</h3>
                      <p className="text-gray-700">Most snakes need 40-60% humidity. Use a hygrometer to monitor levels and mist the enclosure as needed.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Feeding */}
            {activeSection === 'feeding' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-primary-800 mb-6">
                  Feeding Guidelines
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <h3 className="font-semibold text-primary-800 mb-2">Prey Size</h3>
                      <p className="text-gray-700">Feed prey that's no wider than the snake's body at its widest point. For most snakes, this means mice or rats.</p>
                    </div>
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <h3 className="font-semibold text-primary-800 mb-2">Feeding Schedule</h3>
                      <p className="text-gray-700">Young snakes eat weekly, adults every 1-2 weeks. Adjust based on your snake's body condition and activity level.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <h3 className="font-semibold text-primary-800 mb-2">Frozen vs Live</h3>
                      <p className="text-gray-700">Frozen/thawed prey is safer and more convenient. Always thaw completely and warm to room temperature before feeding.</p>
                    </div>
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <h3 className="font-semibold text-primary-800 mb-2">Feeding Environment</h3>
                      <p className="text-gray-700">Feed in a separate container to avoid substrate ingestion and to establish a feeding routine.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Feeding Notes</h4>
                  <p className="text-yellow-700">Never handle your snake for 24-48 hours after feeding to allow proper digestion. Disturbing a snake during digestion can cause regurgitation.</p>
                </div>
              </div>
            )}

            {/* Handling */}
            {activeSection === 'handling' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-primary-800 mb-6">
                  Handling Your Snake
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <h3 className="font-semibold text-primary-800 mb-2">Start Slowly</h3>
                      <p className="text-gray-700">Let your snake settle in for a week before handling. Start with short, gentle sessions and gradually increase duration.</p>
                    </div>
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <h3 className="font-semibold text-primary-800 mb-2">Proper Technique</h3>
                      <p className="text-gray-700">Support the snake's body fully and avoid sudden movements. Let the snake move through your hands naturally.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <h3 className="font-semibold text-primary-800 mb-2">Reading Body Language</h3>
                      <p className="text-gray-700">Learn to read your snake's body language. If it's stressed or defensive, give it space and try again later.</p>
                    </div>
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <h3 className="font-semibold text-primary-800 mb-2">Regular Handling</h3>
                      <p className="text-gray-700">Regular, gentle handling helps snakes become more docile and comfortable with human interaction.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Health */}
            {activeSection === 'health' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-primary-800 mb-6">
                  Health & Wellness
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <h3 className="font-semibold text-primary-800 mb-2">Regular Health Checks</h3>
                      <p className="text-gray-700">Monitor your snake's weight, skin condition, and behavior. Look for signs of illness like lethargy, loss of appetite, or unusual behavior.</p>
                    </div>
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <h3 className="font-semibold text-primary-800 mb-2">Shedding Process</h3>
                      <p className="text-gray-700">Snakes shed their skin regularly. Provide proper humidity and a rough surface to help with the shedding process.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <h3 className="font-semibold text-primary-800 mb-2">Veterinary Care</h3>
                      <p className="text-gray-700">Find a reptile-experienced veterinarian for regular checkups and any health concerns. Annual exams are recommended.</p>
                    </div>
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <h3 className="font-semibold text-primary-800 mb-2">Quarantine</h3>
                      <p className="text-gray-700">If you have multiple snakes, quarantine new additions for 3-6 months to prevent disease transmission.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Emergency */}
            {activeSection === 'emergency' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-primary-800 mb-6">
                  Emergency Information
                </h2>
                <div className="space-y-6">
                  <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">When to Seek Veterinary Care</h4>
                    <p className="text-red-700">Contact a reptile veterinarian immediately if you notice: refusal to eat for extended periods, difficulty breathing, unusual discharge, severe lethargy, or any signs of injury.</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <h3 className="font-semibold text-primary-800 mb-2">Emergency Kit</h3>
                      <p className="text-gray-700">Keep a reptile first aid kit with: digital thermometer, sterile saline, clean towels, and contact information for your veterinarian.</p>
                    </div>
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <h3 className="font-semibold text-primary-800 mb-2">Power Outages</h3>
                      <p className="text-gray-700">Have a backup plan for heating during power outages. Consider battery-powered heat sources or hand warmers wrapped in towels.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Essential Equipment */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-primary-800 mb-6">
                Essential Equipment
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {equipment.map((item, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2 text-primary-600">
                      {item.icon}
                    </div>
                    <h4 className="font-semibold text-primary-800 mb-1">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CareGuide
