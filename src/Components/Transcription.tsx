import React from 'react'

const Transcription: React.FC  =({output}) =>{
  console.log('transcitpionoutp',output)
  return (
    <div>{output.text}</div>
  )
}

export {Transcription}