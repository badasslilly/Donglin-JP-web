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
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-[70]">
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="transition-opacity duration-500 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-50"
          leave="transition-opacity duration-300 ease-in"
          leaveFrom="opacity-50"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white/70" />
        </Transition.Child>

        {/* Panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4 md:p-14">
          <Transition.Child
            as={Fragment}
            enter="transition duration-300 ease-out"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="transition duration-200 ease-in"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-4"
          >
            <Dialog.Panel className="w-full max-w-6xl">
              <div className="bg-black">
                <BorderWrapper>
                  <CloseButton
                    onClick={onClose}
                    className="absolute right-4 top-4 z-[10] md:right-6 md:top-6"
                  />
                  <div className="relative max-h-[85vh] overflow-y-auto bg-white px-4 py-6 md:px-10 md:py-12">
                    <div className="grid gap-8 md:grid-cols-2 md:gap-10">
                      {/* Biography */}
                      <div className="prose max-w-none text-[15px] leading-7 text-gray-800">
                        <h2 className="mb-4 text-2xl font-semibold tracking-wide">
                          {person.name}
                        </h2>
                        <BlockRendererClient content={person.body} />
                      </div>

                      {/* Portrait – keep whole image visible */}
                      {person.portrait && (
                        <div className="relative">
                          {/* Aspect box + cap height via Tailwind util */}
                          <div className="relative mx-auto w-full max-w-[640px] aspect-[3/4] max-h-[70vh]">
                            <Image
                              src={person.portrait}
                              alt={person.name}
                              fill
                              className="object-contain"
                              sizes="(max-width: 1024px) 100vw, 50vw"
                              priority={false}
                            />
                          </div>
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
