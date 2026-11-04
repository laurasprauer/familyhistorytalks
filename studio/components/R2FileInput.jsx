import {useRef, useState} from 'react'
import {set, unset, useClient} from 'sanity'
import {Button, Card, Flex, Stack, Text} from '@sanity/ui'
import {DocumentPdfIcon, LaunchIcon, UploadIcon} from '@sanity/icons'

// "PDF" field on Assets: uploads straight from the browser to Cloudflare R2.
//   1. POST /api/r2-upload-url (Netlify Function) with the editor's Sanity token →
//      the function checks the token and returns a short-lived signed upload URL.
//   2. PUT the file to that URL (R2 bucket CORS allows the Studio origins).
//   3. Save { sid, key, fileName, size, contentType } on the document.
// The PDF never passes through Netlify, so large scans (90MB+) are fine.
const UPLOAD_URL =
  process.env.SANITY_STUDIO_UPLOAD_URL || 'https://familyhistorytalks.com/api/r2-upload-url'
const FILES_URL =
  process.env.SANITY_STUDIO_FILES_URL ||
  'https://familyhistorytalks-files.familyhistorytalks.workers.dev'

const formatSize = (bytes) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`

// fetch() can't report upload progress, XMLHttpRequest can.
const putWithProgress = (url, file, contentType, onProgress) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', url)
    xhr.setRequestHeader('Content-Type', contentType)
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total)
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error(`Upload failed (${xhr.status})`))
    xhr.onerror = () => reject(new Error('Upload failed — check your connection and try again.'))
    xhr.send(file)
  })

export function R2FileInput({value, onChange, readOnly}) {
  const client = useClient({apiVersion: '2024-01-01'})
  const fileInput = useRef(null)
  const [progress, setProgress] = useState(null)
  const [error, setError] = useState(null)

  const upload = async (file) => {
    setError(null)
    const token = client.config().token
    if (!token) {
      setError('Your Studio session has no token. Log out of the Studio and back in, then retry.')
      return
    }
    const contentType = file.type || 'application/pdf'
    // Keep the existing folder when replacing a file; new assets get a timestamp
    // id, the same format as the original archive folders.
    const sid = value?.sid || String(Date.now())

    try {
      setProgress(0)
      const res = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
        body: JSON.stringify({sid, fileName: file.name, contentType}),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || `Could not start upload (${res.status})`)

      await putWithProgress(data.uploadUrl, file, contentType, setProgress)
      onChange(set({sid, key: data.key, fileName: data.fileName, size: file.size, contentType}))
    } catch (err) {
      setError(err.message)
    } finally {
      setProgress(null)
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  const uploading = progress !== null

  return (
    <Stack space={3}>
      {value?.key ? (
        <Card padding={3} radius={2} border>
          <Flex align="center" gap={3}>
            <Text size={3}>
              <DocumentPdfIcon />
            </Text>
            <Stack space={2} flex={1}>
              <Text weight="semibold">{value.fileName}</Text>
              <Text size={1} muted>
                {value.size ? formatSize(value.size) : ''} · {value.key}
              </Text>
            </Stack>
            <Button
              as="a"
              href={`${FILES_URL}/${value.key}`}
              target="_blank"
              rel="noopener noreferrer"
              icon={LaunchIcon}
              mode="ghost"
              text="Open"
            />
          </Flex>
        </Card>
      ) : null}

      {!readOnly && (
        <Flex gap={2}>
          <Button
            icon={UploadIcon}
            mode={value?.key ? 'ghost' : 'default'}
            tone="primary"
            text={
              uploading
                ? `Uploading… ${Math.round(progress * 100)}%`
                : value?.key
                  ? 'Replace PDF'
                  : 'Upload PDF'
            }
            disabled={uploading}
            onClick={() => fileInput.current?.click()}
          />
          {value?.key && !uploading ? (
            <Button mode="bleed" tone="critical" text="Remove" onClick={() => onChange(unset())} />
          ) : null}
        </Flex>
      )}

      <input
        ref={fileInput}
        type="file"
        accept="application/pdf"
        style={{display: 'none'}}
        onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
      />

      {error ? (
        <Card padding={3} radius={2} tone="critical">
          <Text size={1}>{error}</Text>
        </Card>
      ) : null}
    </Stack>
  )
}
