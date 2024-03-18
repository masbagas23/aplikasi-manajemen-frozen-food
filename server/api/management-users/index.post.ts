import { z } from 'zod'
import { ErrMsg } from '~/server/error-message'
import { parseFormData } from '~/utils/parseFormData'

const MAX_FILE_SIZE = 5000000
const ACCEPTED_IMAGE_TYPES = ['jpeg', 'jpg', 'png', 'webp']
const ALLOW_EMPTY = true
const MAX_TOTAL_FILE = 1

export default defineEventHandler(async (event) => {
  const form = await parseFormData(
    event.node.req,
    ACCEPTED_IMAGE_TYPES,
    MAX_FILE_SIZE,
    MAX_TOTAL_FILE,
    ALLOW_EMPTY
  )

  // Validation
  const result = z
    .object({
      email: z
        .string({
          invalid_type_error: ErrMsg.invalid_type_error,
          required_error: ErrMsg.required_error,
        })
        .email(ErrMsg.invalid_email),
      fullName: z
        .string({
          invalid_type_error: ErrMsg.invalid_type_error,
          required_error: ErrMsg.required_error,
        })
        .min(1, ErrMsg.required_error),
      roleId: z
        .string({
          invalid_type_error: ErrMsg.invalid_type_error,
          required_error: ErrMsg.required_error,
        })
        .min(1, ErrMsg.invalid_min_length),
    })
    .safeParse(form)
  // Handling error
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: JSON.stringify(result.error.format()),
    })
  }
  const { fullName, email, roleId } = result.data

  return {
    status: 'success',
    data: {
      fullName: fullName
    }
  }
})
