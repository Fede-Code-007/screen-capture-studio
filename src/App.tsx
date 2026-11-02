import { Button } from '@/components/ui/button'
import { Video } from 'lucide-react'

function App() {
  return (
    <main className="min-h-screen flex items-center justify-center gap-4">
      <Video className="size-6" />
      <Button>Screen Recorder</Button>
    </main>
  )
}

export default App