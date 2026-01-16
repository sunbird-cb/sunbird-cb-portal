import { Injectable } from '@angular/core'
import { EventService, NsContent, WsEvents } from '@sunbird-cb/utils-v2'
import * as fileSaver from 'file-saver'

@Injectable({
  providedIn: 'root'
})
export class ResourceDownloadHelperService {
  downloadInProgress: { [key: string]: boolean } = {}

  constructor(
    public eventSvc: EventService,
  ) { }

  raiseDownloadAllTelemetry(subType: string, content: NsContent.IContent, pageId: string) {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata: {
          type: "click",
          id: content?.identifier || '',
          pageid: pageId,
          subType: subType,
        },
        object: {
          id: content?.identifier,
          type: content?.courseCategory,
        },
        state: WsEvents.EnumTelemetrySubType.Interact,
        eventSubType: WsEvents.EnumTelemetrySubType.Chatbot,
        mode: 'view',
      },
      pageContext: {
        pageId: `/app/toc/${content?.identifier}`,
        module: 'Player'
      },
      from: '',
      to: 'Telemetry',
    }
    this.eventSvc.dispatchChatbotEvent<WsEvents.IWsEventTelemetryInteract>(event)
  }

  downloadPDF(contentData: any, pageId: string) {
    if (!contentData?.artifactUrl) {
      console.error('No artifact URL provided')
      return
    }

    this.downloadInProgress[contentData.identifier] = true
    this.downloadFile(contentData.artifactUrl, contentData.name || 'download', contentData.identifier)
    this.raiseDownloadAllTelemetry('download', contentData, pageId)
  }

  /**
     * Download file using multiple methods to ensure compatibility across browsers
     * @returns Promise that resolves when download completes or fails
     */
  private downloadFile(url: string, fileName: string, identifier: string): Promise<void> {
    // Add file extension if missing
    const fileExtension = this.getFileExtension(url)
    if (fileExtension && !fileName.toLowerCase().endsWith(fileExtension.toLowerCase())) {
      fileName = `${fileName}.${fileExtension}`
    }

    // Return a promise to track completion
    return new Promise((resolve) => {
      // Use fetch API instead of HttpClient for better control over the download
      this.downloadInProgress[identifier] = true

      fetch(url, {
        method: 'GET',
        mode: 'cors',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.blob()
        })
        .then(blob => {
          // Create a new blob with the correct MIME type if needed
          const contentType = this.getMimeTypeFromUrl(url)
          const newBlob = new Blob([blob], { type: contentType })

          // Try to save the blob
          this.saveBlob(newBlob, fileName)
          resolve()
        })
        .catch(error => {
          console.error('Fetch download failed:', error)

          // Fallback to XHR which sometimes handles CORS better
          this.downloadWithXHR(url, fileName).finally(resolve)
        })
        .finally(() => {
          this.downloadInProgress[identifier] = false
        })
    })
  }

  /**
   * Attempt download using XMLHttpRequest as a fallback
   */
  private downloadWithXHR(url: string, fileName: string): Promise<void> {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.responseType = 'blob'

      xhr.onload = () => {
        if (xhr.status === 200) {
          const contentType = xhr.getResponseHeader('Content-Type') || this.getMimeTypeFromUrl(url)
          const blob = new Blob([xhr.response], { type: contentType })
          this.saveBlob(blob, fileName)
          resolve()
        } else {
          console.error('XHR download failed, trying direct iframe method')
          this.tryDirectDownload(url, fileName)
          resolve()
        }
      }

      xhr.onerror = () => {
        console.error('XHR download failed, trying direct iframe method')
        this.tryDirectDownload(url, fileName)
        resolve()
      }

      xhr.send()
    })
  }

  private getFileExtension(url: string): string {
    if (!url) return ''

    const urlParts = url.split('.')
    if (urlParts.length > 1) {
      return urlParts[urlParts.length - 1].split(/[?#]/)[0].toLowerCase()
    }
    return ''
  }

  private getMimeTypeFromUrl(url: string): string {
    const extension = this.getFileExtension(url)

    switch (extension) {
      case 'pdf':
        return 'application/pdf'
      case 'mp4':
        return 'video/mp4'
      case 'doc':
      case 'docx':
        return 'application/msword'
      case 'xls':
      case 'xlsx':
        return 'application/vnd.ms-excel'
      case 'ppt':
      case 'pptx':
        return 'application/vnd.ms-powerpoint'
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg'
      case 'png':
        return 'image/png'
      default:
        return 'application/octet-stream' // Default binary mime type
    }
  }

  private saveBlob(blob: Blob, fileName: string): void {
    try {
      // For modern browsers using FileSaver
      fileSaver.saveAs(blob, fileName)
    } catch (e) {
      console.error('FileSaver failed, trying manual download', e)

      // Manual download fallback
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }
  }

  private tryDirectDownload(url: string, fileName: string): void {
    // Use iframe for potentially bypassing CORS issues
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    document.body.appendChild(iframe)

    try {
      // Construct a download URL
      const downloadUrl = url + (url.indexOf('?') === -1 ? '?' : '&') + 'download=true'

      // Create a link inside the iframe and click it
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      if (doc) {
        const a = doc.createElement('a')
        a.href = downloadUrl
        a.download = fileName
        a.style.display = 'none'
        doc.body.appendChild(a)
        a.click()
        doc.body.removeChild(a)
      }
    } catch (e) {
      console.error('Iframe download approach failed:', e)

      // Last resort - try download attribute on anchor tag
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.target = '_self' // Important: use _self instead of _blank
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } finally {
      // Clean up the iframe
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe)
        }
      }, 1000)
    }
  }
}
