// Print utility functions

export const printElement = (element: HTMLElement) => {
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    throw new Error('Could not open print window. Please allow popups.')
  }

  const styles = Array.from(document.styleSheets)
    .map((styleSheet) => {
      try {
        return Array.from(styleSheet.cssRules)
          .map((rule) => rule.cssText)
          .join('\n')
      } catch {
        return ''
      }
    })
    .join('\n')

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Receipt</title>
        <style>
          ${styles}
          @media print {
            body { margin: 0; padding: 20px; }
            @page { size: auto; margin: 10mm; }
          }
        </style>
      </head>
      <body>
        ${element.outerHTML}
      </body>
    </html>
  `)

  printWindow.document.close()
  
  // Wait for styles to load, then print
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 250)
}

export const downloadAsPDF = async (element: HTMLElement, filename: string) => {
  // Dynamic import to reduce bundle size
  const html2canvas = (await import('html2canvas')).default
  const jsPDF = (await import('jspdf')).default

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#ffffff',
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const imgWidth = 210 // A4 width in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
  pdf.save(filename)
}
