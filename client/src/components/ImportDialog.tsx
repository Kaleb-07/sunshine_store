import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, FileText, X } from 'lucide-react'
import { toast } from 'sonner'
import { importData } from '@/lib/api'

type Props = {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function ImportDialog({ open, onClose, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<any[] | null>(null)
  const [importing, setImporting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  if (!open) return null

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return

    setFile(f)
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target?.result as string)
        const records = json.data || json
        if (!Array.isArray(records) || records.length === 0) {
          toast.error('File must contain an array of deposit records under a "data" key')
          setParsedData(null)
          return
        }
        setParsedData(records)
        toast.success(`Found ${records.length} records`)
      } catch {
        toast.error('Invalid JSON file')
        setParsedData(null)
      }
    }
    reader.readAsText(f)
  }

  const handleImport = async () => {
    if (!parsedData || parsedData.length === 0) return
    setImporting(true)
    try {
      const result = await importData({ data: parsedData })
      toast.success(`Successfully imported ${result.imported} records`)
      onSuccess()
      handleClose()
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to import data')
    } finally {
      setImporting(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setParsedData(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Import Data</h2>
          <Button variant="ghost" size="icon-sm" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload a JSON backup file exported from this system. The file should contain
            an array of deposit records.
          </p>

          <div
            className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileSelect}
            />
            {file ? (
              <div className="flex items-center justify-center gap-2 text-sm">
                <FileText className="w-5 h-5 text-primary" />
                <span className="font-medium">{file.name}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm font-medium">Click to select backup file</span>
                <span className="text-xs text-muted-foreground">JSON format only</span>
              </div>
            )}
          </div>

          {parsedData && (
            <div className="bg-blue-50 rounded-xl p-3 flex items-start gap-2 text-sm">
              <FileText className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-blue-800">
                  {parsedData.length} record{parsedData.length !== 1 ? 's' : ''} ready
                </p>
                <p className="text-blue-600 text-xs mt-0.5">
                  First record: {parsedData[0]?.fullName || 'N/A'} —{' '}
                  {parsedData[0]?.itemType || 'N/A'}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={!parsedData || importing}
            >
              {importing ? 'Importing...' : 'Import Data'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
