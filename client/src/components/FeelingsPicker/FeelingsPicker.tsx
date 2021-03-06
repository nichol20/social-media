import Image from 'next/image'
import React, { Dispatch, RefObject, SetStateAction, useState } from 'react'

import searchIcon from '../../../public/search.svg'
import arrowBackIcon from '../../../public/arrow-back.svg'

interface FeelingsPickerProps {
  setFeeling: Dispatch<SetStateAction<string>>
  feelingPickerRef: RefObject<HTMLDivElement>
}

const feelings = [
  'none',
  'ð happy', 
  'ðĄ angry',
  'ð sad',
  'ðĻ scared',
  'ðī tired',
  'ðĪŠ crazy',
  'ðĪ sick',
  'ð cool',
  'ð in love',
  'ð blessed',
  'ðĨķ cold',
  'ðĨĩ hot',
  'ð bored',
  'ðĪ rich',
  'ðŪ surprised',
  'ð  annoyed',
  'ðĪ smart',
  'ðĨģ festive'
]

export const FeelingsPicker = ({ setFeeling, feelingPickerRef }: FeelingsPickerProps) => {
  const [ query, setQuery ] = useState('')

  const selectFeeling = (index: number) => {
    const newFeeling = feelings[index]
    setFeeling(newFeeling)
    closeFeelingsPicker()
  }

  const closeFeelingsPicker = () => {
    if(feelingPickerRef.current !== null) feelingPickerRef.current.style.display = 'none'
  }

  return (
    <div className='feelings_picker-component' ref={feelingPickerRef}>
      <div className="feelings_picker-modal">
        <div className="header">
          <div className="image-box" onClick={closeFeelingsPicker}>
            <Image src={arrowBackIcon} alt='arrow back icon'/>
          </div>
          <h2>How are you feeling?</h2>
        </div>
        <div className="feeling-search_bar">
          <input type="text" placeholder='Search' onChange={e => setQuery(e.target.value)}/>
          <div className="image-box">
            <Image src={searchIcon} alt='search icon' />
          </div>
        </div>
        <div className="feelings-list">
          {
            feelings.map((feeling, index) => {
              if(feeling.includes(query)) {
                return (
                  <div
                   className="feeling" 
                   onClick={() => selectFeeling(index)}
                   key={index}
                  >
                    {feeling}
                  </div>
                )
              }
            })
          }
        </div>
      </div>
    </div>
  )
}