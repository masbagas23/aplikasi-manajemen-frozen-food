import formidable from 'formidable'
import type { IncomingMessage } from 'http'
import { object, z } from 'zod'

export const parseFormData = (
  req: IncomingMessage,
  fileTypes: Array<string>,
  maxSize: number,
  maxFile: number,
  allowEmptyFiles: boolean
) => {
  return new Promise<Object>((resolve, reject) => {
    const form = formidable({
      multiples: true,
      uploadDir: useAppConfig().uploadDir,
      allowEmptyFiles: allowEmptyFiles,
      maxFileSize: maxSize * 1024 * 1024,
      maxFiles: maxFile,
      filter: function ({ mimetype }) {
        return fileTypes.some((substring) => mimetype?.includes(substring))
      },
    })
    const field: Object = {}
    form.on('field', (name, value) => {
      let payload: { [key: string]: any } = {}
      payload[name] = value
      Object.assign(field, payload)
    })

    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error)
        return
      }
      let data: Array<string> = []
      if (files.file) {
        files.file?.forEach((element) => {
          const mimeType = element.mimetype?.split('/') || []
          data.push(
            '/upload/' +
              element.newFilename +
              '.' +
              mimeType[mimeType.length - 1]
          )
        })
      }
      Object.assign(field, { avaUrl: Array, data })
      resolve(field)
    })
  })
}
