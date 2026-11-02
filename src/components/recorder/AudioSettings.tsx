import { Mic, Volume2 } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Select no admite value="" en sus items, usamos un valor centinela
const DEFAULT_DEVICE = '__default__'

interface Props {
  systemAudio: boolean
  onSystemAudioChange: (value: boolean) => void
  systemAudioLocked: boolean
  microphone: boolean
  onMicrophoneChange: (value: boolean) => void
  microphoneLocked: boolean
  devices: MediaDeviceInfo[]
  deviceId: string
  onDeviceChange: (deviceId: string) => void
}

export function AudioSettings({
  systemAudio,
  onSystemAudioChange,
  systemAudioLocked,
  microphone,
  onMicrophoneChange,
  microphoneLocked,
  devices,
  deviceId,
  onDeviceChange,
}: Props) {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <label htmlFor="system-audio" className="flex items-center gap-2 text-sm font-medium">
            <Volume2 className="size-4" />
            Audio del sistema
          </label>
          <p className="text-xs text-muted-foreground">
            {systemAudioLocked
              ? 'Para cambiarlo, dejá de compartir y volvé a compartir.'
              : 'También hay que marcarlo en el selector del navegador.'}
          </p>
        </div>
        <Switch
          id="system-audio"
          checked={systemAudio}
          onCheckedChange={onSystemAudioChange}
          disabled={systemAudioLocked}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <label htmlFor="microphone" className="flex items-center gap-2 text-sm font-medium">
          <Mic className="size-4" />
          Micrófono
        </label>
        <Switch
          id="microphone"
          checked={microphone}
          onCheckedChange={onMicrophoneChange}
          disabled={microphoneLocked}
        />
      </div>

      {microphone && (
        <Select
          value={deviceId || DEFAULT_DEVICE}
          onValueChange={(value) => onDeviceChange(value === DEFAULT_DEVICE ? '' : value)}
          disabled={microphoneLocked}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Elegí un micrófono" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={DEFAULT_DEVICE}>Predeterminado del sistema</SelectItem>
            {devices.map((device, index) => (
              <SelectItem key={device.deviceId} value={device.deviceId}>
                {device.label || `Micrófono ${index + 1}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}