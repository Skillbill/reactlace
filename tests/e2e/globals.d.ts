// State shared between the harness page and the tests that drive it
interface Window {
  /** Delay added by the tests to every React Scheduler task, in ms */
  __schedulerLag?: number
  /** Writes over the text of a focused field, recorded by the tests */
  __clobbers: { name: string; shown: string; written: string }[]
  /** Data confirmed by the RLCrudForm of the form scenario */
  __confirmed: Record<string, unknown>[]
  /** Models saved by the save button of the inputs scenario */
  __saved: Record<string, unknown>[]
  /** Calls received by the store of the crud scenario */
  __calls: {
    add: Record<string, unknown>[]
    edit: Record<string, unknown>[]
    filters: Record<string, unknown>[]
  }
}
