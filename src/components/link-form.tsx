import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { api } from '../http/link-shortener'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { Header } from './ui/Header'
import { useLinks } from '../Links'
import axios from 'axios'

const validCodeRegex = /^[a-z0-9-_]+$/

const formSchema = z.object({
  originalUrl: z.string().min(1, 'Informe uma url válida.').url('URL inválida'),
  shortUrl: z
    .string()
    .min(1, 'Informe a URL encurtada.')
    .superRefine((val, ctx) => {
      const cleanCode = val.replace('brev.ly/', '')

      if (cleanCode.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Informe um código para o link após a barra.',
        })
        return
      }

      if (!validCodeRegex.test(cleanCode)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Use apenas letras minúsculas, números, hifens (-) ou underscores (_).',
        })
      }
    }),
})

type FormData = z.infer<typeof formSchema>

export function LinkForm() {
  const { addLink } = useLinks()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    const finalOriginalUrl = data.originalUrl.startsWith('https://') || data.originalUrl.startsWith('http://')
      ? data.originalUrl
      : `https://${data.originalUrl}`

    try {
      const cleanCode = data.shortUrl.replace('brev.ly/', '');
      const response = await api.post('/create-link', {
        originalUrl: finalOriginalUrl,
        code: cleanCode, 
      });

      if (response.status === 201) {
        addLink({
          id: response.data.id,
          originalUrl: response.data.originalUrl,
          code: response.data.code,
          createdAt: response.data.createdAt,
          clicks: 0,
        })

        toast('URL salva com sucesso', { type: 'success' })
        reset()
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message

        if (errorMessage === 'This shortened code is already in use') {
          toast('Esse link personalizado já existe. Tente outro nome.', {
            type: 'warning',
          })
        } else if (errorMessage === 'Invalid URL format') {
          toast('URL inválida', { type: 'warning' })
        } else if (errorMessage === 'Invalid shortened URL format. Use only lowercase letters, numbers, hyphens or underscores without spaces.') {
          toast('Formato do link encurtado inválido.', { type: 'warning' })
        } else {
          toast(errorMessage || 'Erro ao salvar URL', { type: 'error' })
        }
      } else {
        toast('Erro desconhecido ao salvar URL', { type: 'error' })
      }
    }
  }

  return (
    <div className="flex flex-col flex-start p-6 md:p-8 gap-6 top-32 bg-gray-100 rounded-lg">
      <Header title="Novo link" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-start gap-4"
      >
        <Input
          label="link original"
          type="url"
          placeholder="https://exemplo.com"
          {...register('originalUrl')}
          error={errors.originalUrl?.message}
        />
        <Input
          label="link encurtado"
          type="text"
          prefix="brev.ly/" 
          {...register('shortUrl')}
          error={errors.shortUrl?.message}
        />
        <Button
          type="submit"
          variant="primary"
          size="large"
          label="Salvar link"
          disabled={isSubmitting}
        />
      </form>
    </div>
  )
}