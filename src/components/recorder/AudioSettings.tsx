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

interface VolumeSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
}

function VolumeSlider({ label, value, onChange }: VolumeSliderProps) {
  const percent = Math.round(value * 100)

  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={0}
        max={200}
        step={5}
        value={percent}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        aria-label={label}
        className="h-2 flex-1 cursor-pointer accent-primary"
      />
      <span className="w-12 text-right text-xs tabular-nums text-muted-foreground">
        {percent}%
      </span>
    </div>
  )
}

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
  systemVolume: number
  onSystemVolumeChange: (value: number) => void
  micVolume: number
  onMicVolumeChange: (value: number) => void
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
  systemVolume,
  onSystemVolumeChange,
  micVolume,
  onMicVolumeChange,
}: Props) {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <label htmlFor="system-audio" className="flex items-center gap-2 text-sm font-medium">
            <Volume2 className="size-4" />
            Audio del sistema
          </label>
        </div>
        <Switch
          id="system-audio"
          checked={systemAudio}
          onCheckedChange={onSystemAudioChange}
          disabled={systemAudioLocked}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {systemAudio &&
             'En el selector del navegador, dejá tildado "Compartir audio del sistema".'}
        {systemAudioLocked &&
             'Para apagar el audio del sistema, reinicia la grabación.'}
      </p>
      {systemAudio && (
      <VolumeSlider
        label="Volumen del audio del sistema"
        value={systemVolume}
        onChange={onSystemVolumeChange}
      />
      )}

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
        <VolumeSlider
            label="Volumen del micrófono"
            value={micVolume}
            onChange={onMicVolumeChange}
        />
      )}

      {microphone && (
        <Select
          value={deviceId || DEFAULT_DEVICE}
          onValueChange={(value) =>
            onDeviceChange(!value || value === DEFAULT_DEVICE ? '' : value)
          }
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