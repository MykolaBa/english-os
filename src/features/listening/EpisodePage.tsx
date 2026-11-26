import { useCallback, useEffect, useState } from 'react'
import { ListChecks } from 'lucide-react'
import { useParams } from 'react-router'
import { BackLink, Badge, NotFoundCard } from '@/components/ui'
import { getListeningEpisode, type ListeningEpisode, type ScriptLine } from '@/content/listening'
import { useT } from '@/i18n'
import { castVoices, isSpeechSupported, loadVoices, speakLine, stopSpeaking } from '@/lib/speech'
import { PracticeSection } from '@/features/exercises/PracticeSection'
import { PlayerBar } from './components/PlayerBar'
import { Transcript } from './components/Transcript'
import { episodeExercises } from './exercises'
import { useListeningProgress } from './hooks'
import { recordListening } from './listeningRepo'
import { useScriptPlayer } from './useScriptPlayer'
import styles from './Listening.module.scss'

export default function EpisodePage() {
  const { episodeId } = useParams()
  const episode = episodeId ? getListeningEpisode(episodeId) : undefined
  const l = useT().listening
  return (
    <div className={styles.page}>
      <BackLink to="/listening">{l.back}</BackLink>
      {episode ? (
        <EpisodeView key={episode.id} episode={episode} />
      ) : (
        <NotFoundCard title={l.notFoundTitle} description={l.notFoundText} />
      )}
    </div>
  )
}

function EpisodeView({ episode }: { episode: ListeningEpisode }) {
  const t = useT()
  const l = t.listening
  const progress = useListeningProgress(episode.id)
  const speech = isSpeechSupported()
  const [cast, setCast] = useState(() => castVoices<SpeechSynthesisVoice>([]))

  // Voices load asynchronously in Chrome: cast the speakers once they're there.
  useEffect(() => {
    let alive = true
    void loadVoices().then((voices) => alive && setCast(castVoices(voices)))
    return () => {
      alive = false
    }
  }, [])

  const say = useCallback(
    (line: ScriptLine, rate: number) => speakLine(line.en, { rate, ...cast[line.speaker] }),
    [cast],
  )
  const player = useScriptPlayer(episode.lines, say, stopSpeaking)
  const exercises = episodeExercises(episode)

  return (
    <>
      <header className={styles.hero}>
        <p className={styles.heroMeta}>
          <Badge tone="accent">{episode.level}</Badge>
          {l.meta(l.topics[episode.topic], episode.lines.length)}
        </p>
        <h1 className={styles.heroTitle} lang="en">
          {episode.title}
        </h1>
        <p className={styles.summary}>{episode.summary}</p>
      </header>
      {speech ? (
        <PlayerBar
          total={episode.lines.length}
          current={player.current}
          playing={player.playing}
          rate={player.rate}
          onToggle={player.toggle}
          onPlayFrom={(i) => void player.playFrom(i)}
          onRate={player.setRate}
        />
      ) : (
        <p className={styles.notice}>{l.noSpeech}</p>
      )}
      <Transcript
        episode={episode}
        current={player.current}
        defaultOpen={!speech}
        onPlayFrom={(i) => (speech ? void player.playFrom(i) : undefined)}
      />
      <PracticeSection
        title={l.check}
        intro={
          <>
            <p>{l.checkText(episode.dictation.length, episode.questions.length)}</p>
            {progress?.lastScore !== undefined && progress.bestScore !== undefined && (
              <p>{l.lastResult(progress.lastScore, progress.bestScore)}</p>
            )}
          </>
        }
        startLabel={l.checkStart}
        startIcon={<ListChecks />}
        build={() => exercises}
        onRunningChange={(running) => running && player.pause()}
        onComplete={(result) => recordListening(episode.id, episode.title, result)}
      />
    </>
  )
}
