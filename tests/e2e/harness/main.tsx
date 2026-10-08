import { StrictMode, useEffect, useMemo, useState, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ReactlaceProvider,
  RLCrud,
  RLCrudForm,
  RLInput,
  RLNumberInput,
  RLTextArea,
  type RLCrudFormFieldType,
  type RLCrudInputValueType
} from '../../../src'

import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'

type Model = { [key: string]: RLCrudInputValueType }

window.__confirmed = []
window.__saved = []
window.__calls = { add: [], edit: [], filters: [] }

const params = new URLSearchParams(window.location.search)
const scenario = params.get('scenario') ?? 'form'
const tick = Number(params.get('tick') ?? 0)
const strict = params.get('strict') === '1'

export const REGISTER_COUNT = 16
const registerKeys = Array.from({ length: REGISTER_COUNT }, (_, i) => `reg_${String(i + 1).padStart(2, '0')}`)

// Shaped like the Efesto optical fiber form: a few descriptive fields and a
// long run of consecutive numeric registers
const formFields: Omit<RLCrudFormFieldType, 'label'>[] = [
  { i18n_key: 'Name', value: 'name', input_type: 'text', required: true },
  { i18n_key: 'Description', value: 'description', input_type: 'textarea' },
  {
    i18n_key: 'Code',
    value: 'code',
    input_type: 'text',
    side_effect: (model) => {
      const { code } = model as { code?: string }
      ;(model as { code_upper?: string }).code_upper = code?.toUpperCase() ?? ''
    }
  },
  { i18n_key: 'Code upper', value: 'code_upper', input_type: 'text' },
  ...registerKeys.map(
    (key): Omit<RLCrudFormFieldType, 'label'> => ({ i18n_key: key, value: key, input_type: 'number' })
  ),
  {
    i18n_key: 'Edge',
    value: 'edge',
    input_type: 'select',
    options: [
      { value: 'edge-1', text: 'Edge 1' },
      { value: 'edge-2', text: 'Edge 2' }
    ]
  },
  { i18n_key: 'Enabled', value: 'enabled', input_type: 'checkbox', default_value: true }
]

// One field of every kind that reports its changes to the form in its own way
const kindsFields: Omit<RLCrudFormFieldType, 'label'>[] = [
  { i18n_key: 'Name', value: 'name', input_type: 'text' },
  { i18n_key: 'Birth', value: 'birth', input_type: 'date' },
  { i18n_key: 'reg_01', value: 'reg_01', input_type: 'number' },
  {
    i18n_key: 'Group',
    value: 'group',
    input_type: 'dropdown',
    options: [
      { value: 'a', text: 'Group A' },
      { value: 'b', text: 'Group B' }
    ]
  },
  { i18n_key: 'reg_02', value: 'reg_02', input_type: 'number' },
  {
    i18n_key: 'Tag',
    value: 'tag',
    input_type: 'autocomplete',
    options: [
      { value: 'one', text: 'Tag one' },
      { value: 'two', text: 'Tag two' }
    ]
  },
  { i18n_key: 'Description', value: 'description', input_type: 'textarea' },
  { i18n_key: 'Color', value: 'color', input_type: 'color' }
]

const storedItem: Model = {
  id: 7,
  name: 'fiber-7',
  description: 'stored description',
  code: 'abc',
  code_upper: 'ABC',
  ...Object.fromEntries(registerKeys.map((key, i) => [key, 1000 + i])),
  edge: 'edge-1',
  enabled: true
}

// Re-renders its subtree on a timer: stands in for renders that do not come
// from the field being typed (validation state, late data, i18n...)
function Ticker({ children }: { children: (count: number) => ReactNode }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!tick) return
    const id = setInterval(() => setCount((c) => c + 1), tick)
    return () => clearInterval(id)
  }, [])
  return <>{children(count)}</>
}

function FormScenario() {
  const type = params.get('type') === 'edit' ? 'edit' : 'add'
  const [confirmed, setConfirmed] = useState<Model | null>(null)
  const fields = useMemo(
    () =>
      (params.get('fields') === 'kinds' ? kindsFields : formFields).map((f) => ({
        ...f,
        label: f.i18n_key
      })) as RLCrudFormFieldType[],
    []
  )
  const value = useMemo(() => (type === 'edit' ? { ...storedItem } : undefined), [type])

  return (
    <Ticker>
      {(count) => (
        <div className="p-4" data-tick={count}>
          <RLCrudForm
            type={type}
            fields={fields}
            value={value}
            title={`${type} fiber`}
            cancelLabel="Cancel"
            confirmLabel="Confirm"
            requiredRuleMessage="Required"
            primaryKey="id"
            onConfirm={(data) => {
              window.__confirmed.push(data)
              setConfirmed(data)
            }}
          />
          <pre data-testid="confirmed">{confirmed ? JSON.stringify(confirmed) : ''}</pre>
        </div>
      )}
    </Ticker>
  )
}

const crudRows: Model[] = [1, 2, 3].map((id) => ({
  ...storedItem,
  id,
  name: `fiber-${id}`,
  ...Object.fromEntries(registerKeys.map((key, i) => [key, id * 1000 + i]))
}))

const crudHeaders = [
  { i18n_key: 'Name', value: 'name' },
  { i18n_key: 'reg_01', value: 'reg_01' }
]

const crudFilters = [
  { i18n_key: 'Name', value: 'name', input_type: 'text' as const },
  { i18n_key: 'Description', value: 'description', input_type: 'text' as const },
  { i18n_key: 'Register from', value: 'reg_from', input_type: 'number' as const },
  { i18n_key: 'Register to', value: 'reg_to', input_type: 'number' as const }
]

async function getItems(_page: number, _rows: number, filters: unknown) {
  window.__calls.filters.push(filters as Model)
  return {
    result: crudRows,
    page: { currentPage: 0, pageRows: crudRows.length, totalRows: crudRows.length }
  }
}

async function addItem(item: unknown) {
  window.__calls.add.push(item as Model)
  return { id: 99 }
}

async function editItem(item: unknown) {
  window.__calls.edit.push(item as Model)
  return item
}

function CrudScenario() {
  return (
    <div className="p-4">
      <RLCrud
        id="fibers"
        primary_key="id"
        singular_label="fiber"
        headers={crudHeaders}
        filters={crudFilters}
        form_fields={formFields}
        actions={[]}
        getItems={getItems}
        addItem={addItem}
        editItem={editItem}
      />
    </div>
  )
}

function InputsScenario() {
  const [text, setText] = useState('')
  const [upper, setUpper] = useState('')
  const [rejected] = useState('locked')
  const [number, setNumber] = useState<number | null>(null)
  const [clamped, setClamped] = useState<number | null>(50)
  const [area, setArea] = useState('')

  return (
    <Ticker>
      {(count) => (
        <div className="flex flex-col gap-4 p-4" data-tick={count}>
          <RLInput name="text" label="Text" value={text} onChange={setText} clearable />
          <RLInput name="upper" label="Upper" value={upper} onChange={(v) => setUpper(v.toUpperCase())} />
          <RLInput name="rejected" label="Rejected" value={rejected} onChange={() => {}} />
          <RLInput name="uncontrolled" label="Uncontrolled" />
          <RLNumberInput name="number" label="Number" value={number} onChange={setNumber} clearable />
          <RLNumberInput name="clamped" label="Clamped" value={clamped} onChange={setClamped} min={0} max={100} />
          <RLTextArea name="area" label="Area" value={area} onChange={setArea} />
          <div className="flex gap-2">
            <button
              type="button"
              data-testid="set"
              onClick={() => {
                setText('preset')
                setUpper('PRESET')
                setNumber(42)
                setClamped(7)
                setArea('preset area')
              }}
            >
              set
            </button>
            <button
              type="button"
              data-testid="reset"
              onClick={() => {
                setText('')
                setUpper('')
                setNumber(null)
                setClamped(null)
                setArea('')
              }}
            >
              reset
            </button>
            <button
              type="button"
              data-testid="save"
              // Reads the state of its render, as a save button of an application
              onClick={() => window.__saved.push({ text, number, area })}
            >
              save
            </button>
          </div>
          <pre data-testid="model">{JSON.stringify({ text, upper, rejected, number, clamped, area })}</pre>
        </div>
      )}
    </Ticker>
  )
}

const scenarios: { [key: string]: () => ReactNode } = {
  form: () => <FormScenario />,
  crud: () => <CrudScenario />,
  inputs: () => <InputsScenario />
}

const app = <ReactlaceProvider>{(scenarios[scenario] ?? scenarios.form)()}</ReactlaceProvider>

createRoot(document.getElementById('app')!).render(strict ? <StrictMode>{app}</StrictMode> : app)
