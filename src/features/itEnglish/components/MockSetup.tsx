import { Mic } from 'lucide-react'
import { Button, Segmented, Switch } from '@/components/ui'
import { useT } from '@/i18n'
import { isSpeechSupported } from '@/lib/speech'
import { MOCK_KINDS, MOCK_SIZES, type MockKind, type MockSize } from '../mock'
import styles from '../ItEnglish.module.scss'

export interface MockSettings {
  kind: MockKind
  size: MockSize
  readAloud: boolean
}

interface MockSetupProps {
  settings: MockSettings
  onChange: (settings: MockSettings) => void
  onStart: () => void
}

export function MockSetup({ settings, onChange, onStart }: MockSetupProps) {
  const m = useT().itEnglish.mock
  const set = (change: Partial<MockSettings>) => onChange({ ...settings, ...change })

  return (
    <section className={styles.panel} aria-labelledby="mock-setup">
      <h2 id="mock-setup" className="visually-hidden">
        {m.title}
      </h2>
      <p className={styles.muted}>{m.intro}</p>
      <div className={styles.setup}>
        <Segmented<MockKind>
          label={m.kindLabel}
          value={settings.kind}
          options={MOCK_KINDS.map((k) => ({ value: k, label: m.kinds[k] }))}
          onChange={(kind) => set({ kind })}
        />
        <Segmented<`${MockSize}`>
          label={m.sizeLabel}
          value={`${settings.size}`}
          options={MOCK_SIZES.map((n) => ({ value: `${n}`, label: m.size(n) }))}
          onChange={(v) => set({ size: v === '3' ? 3 : 5 })}
        />
        {isSpeechSupported() && (
          <Switch
            label={m.readAloud}
            description={m.readAloudHint}
            checked={settings.readAloud}
            onChange={(readAloud) => set({ readAloud })}
          />
        )}
      </div>
      <Button variant="primary" size="lg" icon={<Mic />} onClick={onStart}>
        {m.start}
      </Button>
    </section>
  )
}
