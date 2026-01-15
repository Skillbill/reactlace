interface DateCellProps {
  data?: unknown
  field?: string
}

export const DateCell = ({ data, field }: DateCellProps) => {
  if (!data || !field) {
    return <div />
  }

  const typedData = data as { [key: string]: unknown }
  const dateValue = typedData[field] as Date | undefined

  if (!dateValue || !(dateValue instanceof Date)) {
    return <div />
  }

  const formattedDate = `${dateValue.getFullYear()}-${('0' + (dateValue.getMonth() + 1)).slice(-2)}-${('0' + dateValue.getDate()).slice(-2)}`

  return <div>{formattedDate}</div>
}

DateCell.displayName = 'DateCell'
