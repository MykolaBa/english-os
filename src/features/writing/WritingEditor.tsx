import { useDeferredValue, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { ConfirmDialog } from '@/components/ui'
import { getWritingPrompt } from '@/content/writing'
import { useT } from '@/i18n'
import { WRITING_MAX } from '@/lib/db/limits'
import type { Writing, WritingVersion } from '@/lib/db/types'
import { toast } from '@/stores/toastStore'
import { useVocabularyIndex } from '@/features/vocabulary/hooks'
import { analyzeText, vocabularyUsed } from './analysis'
import { EditorCard } from './components/EditorCard'
import { FeedbackPanel } from './components/FeedbackPanel'
import { SampleAnswer } from './components/SampleAnswer'
import { TaskPanel } from './components/TaskPanel'
import { VersionsPanel } from './components/VersionsPanel'
import { insertAt } from './insert'
import { activitySubject } from './titles'
import { useAutosave } from './useAutosave'
import {
  completeWriting,
  deleteWriting,
  restoreVersion,
  saveDraft,
  saveVersion,
} from './writingRepo'
import styles from './Writing.module.scss'

/**
 * The editor keeps the text in local state (typing never waits for IndexedDB) and the
 * autosave hook writes it behind the scenes. Mount it keyed by the writing's id.
 */
export function WritingEditor({ writing }: { writing: Writing }) {
  const t = useT()
  const w = t.writing
  const navigate = useNavigate()
  const prompt = writing.promptId ? getWritingPrompt(writing.promptId) : undefined
  const [text, setText] = useState(writing.text)
  const [title, setTitle] = useState(writing.title)
  // Local, so a tick shows at once (the database write follows in the background).
  const [checked, setChecked] = useState(writing.checked)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const autosave = useAutosave(writing.id, { text, title })
  const vocabulary = useVocabularyIndex()

  // Feedback follows the text without slowing typing down.
  const deferred = useDeferredValue(text)
  const analysis = useMemo(() => analyzeText(deferred), [deferred])
  const used = useMemo(
    () => (vocabulary ? vocabularyUsed(deferred, vocabulary) : []),
    [deferred, vocabulary],
  )

  const edit = (next: { text?: string; title?: string }) => {
    const draft = { text: next.text ?? text, title: next.title ?? title }
    if (next.text !== undefined) setText(next.text)
    if (next.title !== undefined) setTitle(next.title)
    autosave.change(draft)
  }
  const fail = (err: unknown) => toast.error(t.errors.title, String(err))

  const insert = (phrase: string) => {
    const el = textareaRef.current
    const result = insertAt(text, phrase, el?.selectionStart ?? text.length, el?.selectionEnd)
    if (result.text.length > WRITING_MAX) return
    edit({ text: result.text })
    // After React writes the new value: focus and select the "…" placeholder to type over.
    requestAnimationFrame(() => {
      el?.focus()
      el?.setSelectionRange(result.selection[0], result.selection[1])
    })
  }

  const run = (action: () => Promise<void>) => () => void autosave.flush().then(action).catch(fail)
  const onDone = run(async () => {
    const xp = await completeWriting(writing.id, activitySubject({ ...writing, title, text }))
    toast.success(xp > 0 ? w.doneToast(xp) : w.doneAgain)
  })
  const onSaveVersion = run(async () => {
    const saved = await saveVersion(writing.id)
    toast[saved ? 'success' : 'info'](saved ? w.versionSaved : w.nothingNew)
  })
  const onRestore = (version: WritingVersion) =>
    run(async () => {
      await restoreVersion(writing.id, version.at)
      setText(version.text)
      toast.success(w.versions.restored)
    })()
  const toggleCheck = (id: string) => {
    const next = checked.includes(id) ? checked.filter((c) => c !== id) : [...checked, id]
    setChecked(next)
    void saveDraft(writing.id, { checked: next }).catch(fail)
  }

  return (
    <div className={styles.editorLayout}>
      {prompt && (
        <TaskPanel prompt={prompt} checked={checked} onToggle={toggleCheck} onInsert={insert} />
      )}
      <div className={styles.editorMain}>
        <EditorCard
          title={title}
          text={text}
          titlePlaceholder={prompt?.title ?? w.untitled}
          words={analysis.words}
          range={prompt ? { min: prompt.minWords, max: prompt.maxWords } : null}
          saveState={autosave.state}
          completedAt={writing.completedAt}
          textareaRef={textareaRef}
          onTitle={(value) => edit({ title: value })}
          onText={(value) => edit({ text: value })}
          onSaveVersion={onSaveVersion}
          onDone={onDone}
          onDelete={() => setConfirmDelete(true)}
        />
        <FeedbackPanel analysis={analysis} used={used} />
        <VersionsPanel versions={writing.versions} current={deferred} onRestore={onRestore} />
        {prompt && <SampleAnswer prompt={prompt} />}
      </div>
      <ConfirmDialog
        open={confirmDelete}
        title={w.deleteTitle}
        description={w.deleteText}
        confirmLabel={w.delete}
        danger
        onCancel={() => setConfirmDelete(false)}
        onConfirm={async () => {
          await deleteWriting(writing.id)
          toast.success(w.deleted)
          navigate('/writing', { replace: true })
        }}
      />
    </div>
  )
}
