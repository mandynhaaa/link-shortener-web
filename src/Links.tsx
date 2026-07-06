import { enableMapSet } from 'immer';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { api } from './http/link-shortener'

export type Link = {
  id: string
  originalUrl: string
  code: string
  createdAt: string
  clicks: number
}

type LinkState = {
  links: Map<string, Link>
  addLink: (link: Link) => void
  deleteLink: (linkId: string) => void
  setLinks: (linksArray: Link[]) => void
  fetchLinks: () => Promise<void>
  isLoading: boolean
}

enableMapSet()

export const useLinks = create<LinkState, [['zustand/immer', never]]>(
  immer((set) => {
    function addLink(link: Link) {
      set((state) => {
        state.links.set(link.id, link)
      })
    }

    function setLinks(linksArray: Link[]) {
      set((state) => {
        state.links = new Map(linksArray.map((link) => [link.id, link]))
      })
    }

    async function deleteLink(linkId: string) {
      try {
        await api.delete(`/${linkId}`)

        set((state) => {
          state.links.delete(linkId)
        })
      } catch (error: any) {
        console.error('Erro ao deletar link no backend:', error.message)
        throw error; 
      }
    }

    async function fetchLinks() {
      set((state) => { state.isLoading = true })
      try {
        const response = await api.get('/list-links')
        if (response.data.links && Array.isArray(response.data.links)) {
          setLinks(response.data.links)
        }
      } catch (error) {
        console.error('Erro ao buscar links:', error)
      } finally {
        set((state) => { state.isLoading = false })
      }
    }

    return {
      links: new Map<string, Link>(),
      isLoading: false,
      addLink,
      deleteLink,
      setLinks,
      fetchLinks,
    }
  }),
)