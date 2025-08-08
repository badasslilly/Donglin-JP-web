/** @format */

'use client'

import { Fragment } from 'react'
import Image from 'next/image'
import { Dialog, Transition } from '@headlessui/react'
import BlockRendererClient from '@/components/BlockRendererClient'
import BorderWrapper from './BorderWrapper'
import CloseButton from './CloseButton'

export interface PersonFull {
  id: number
  name: string
  portrait?: string
  body: any
}

interface Props {
  open: boolean
  onClose: () => void
  person: PersonFull
}

export default function PersonModal({ open, onClose, person }: Props) {
  console.log('portrait:', person.portrait)

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog onClose={onClose} className='relative z-[70]'>
        {/* ───── Backdrop ───── */}
        <Transition.Child
          as={Fragment}
          enter='transition-opacity duration-500 ease-out'
          enterFrom='opacity-0'
          enterTo='opacity-50'
          leave='transition-opacity duration-300 ease-in'
          leaveFrom='opacity-50'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-white/70' />
        </Transition.Child>

        {/* ───── Panel ───── */}
        <div className='fixed inset-0 flex items-center justify-center p-14'>
          <Transition.Child
            as={Fragment}
            enter='transition duration-300 ease-out'
            enterFrom='opacity-0 scale-95 translate-y-4'
            enterTo='opacity-100 scale-100 translate-y-0'
            leave='transition duration-200 ease-in'
            leaveFrom='opacity-100 scale-100 translate-y-0'
            leaveTo='opacity-0 scale-95 translate-y-4'
          >
            <Dialog.Panel className='w-full max-w-6xl max-h-[90vh] overflow-y-auto'>
              <div className='bg-black'>
                <BorderWrapper>
                  <CloseButton onClick={onClose} className='absolute top-6 right-6 z-[10]' />
                  <div className='relative bg-white px-10 py-12 max-h-[80vh] overflow-y-auto'>
                    {/* ─── Close Button Inside Box ─── */}

                    {/* ─── Image + Text ─── */}
                    <div className='grid gap-10 md:grid-cols-2'>
                      
                      {/* left – biography */}
                      <div className='prose max-w-none text-[15px] leading-7 text-gray-800'>
                        <h2 className='mb-4 text-2xl font-semibold tracking-wide'>
                          {person.name}
                        </h2>
                        <BlockRendererClient content={person.body} />
                      </div>
                      {/* right – portrait */}
                      
                      {person.portrait && (
                        <div className='relative overflow-hidden rounded-sm'>
                          <Image
                            src={person.portrait}
                            alt={person.name}
                            width={900}
                            height={900}
                            className='h-auto w-full object-cover'
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </BorderWrapper>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
