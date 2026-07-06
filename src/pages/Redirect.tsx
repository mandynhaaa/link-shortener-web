import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../http/link-shortener'
import logoIcon from '../assets/Logo_Icon.svg'
import { NotFound } from './NotFound'
import type { AxiosError } from 'axios'

function isValidUrl(url: string) {
  try {
    const newURL = new URL(url)
    return newURL
  } catch {
    return false
  }
}

export function Redirect() {
  const { code } = useParams()
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  
  const isFetched = useRef(false)

  useEffect(() => {
    if (isFetched.current) return
    isFetched.current = true

    async function handleRedirect() {
      try {
        const response = await api.get(`/${code}`)
        const { originalUrl } = response.data

        if (originalUrl && isValidUrl(originalUrl)) {
          setOriginalUrl(originalUrl)
          setTimeout(() => {
            window.location.href = originalUrl
          }, 1500)
        } else {
          setNotFound(true)
        }
      } catch (error) {
        setNotFound(true)
      }
    }

    handleRedirect()
  }, [code])

  if (notFound) return <NotFound />

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center max-h-[329px] max-w-[580px] bg-gray-100 px-12 py-16 gap-6 rounded-lg">
        <img src={logoIcon} alt="Logo Brev.lyv" className="w-12 h-12" />
        <h1 className="text-2xl font-bold text-center text-gray-600 flex-none self-stretch flex-grow-0">
          Redirecionando...
        </h1>
        <p className="text-sm font-semibold text-gray-500 text-center flex-none self-stretch flex-grow-0">
          O link será aberto automaticamente em alguns instantes.
          <br />
          Não foi redirecionado?&nbsp;
          <a
            href={originalUrl ?? undefined}
            className="text-blue-base hover:underline"
          >
            Acesse aqui
          </a>
        </p>
      </div>
    </div>
  )
}