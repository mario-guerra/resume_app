import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CheckCircle, BarChart3, Bell, Search } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Job Tracker</h1>
          <Button>Sign in with Google</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Track Your Job Applications
          <span className="text-blue-600"> Effortlessly</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Organize your job search, track applications, set reminders, and
          analyze your progress with our intuitive job application tracker.
        </p>
        <Button size="lg" className="text-lg px-8 py-3">
          Get Started for Free
        </Button>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything you need to manage your job search
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Track Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Keep track of all your job applications in one organized place
                with status updates.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Visualize your job search progress with charts and insights
                about your applications.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Bell className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle>Smart Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Never miss a follow-up with intelligent reminders for your job
                applications.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Search className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Search & Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Quickly find specific applications with powerful search and
                filtering options.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Ready to organize your job search?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of job seekers who have streamlined their application
            process.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
            Sign in with Google
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Job Tracker. Built with Next.js and Google Sheets.</p>
        </div>
      </footer>
    </div>
  )
}
