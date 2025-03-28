import React from 'react'
import GenRemove from './image/GenRemove'
import BGRemove from './image/BGRemove'
import BGReplace from './image/BGReplace'
import GenFill from './image/GenFill'
import ExtractPart from './image/ExtractPart'
import GenRestore from './image/GenRestore'
import Enhance from './image/Enhance'

export default function ImageToolBar() {
    return (
        <>
            <GenRemove />
            <BGRemove />
            <BGReplace />
            <GenFill />
            <ExtractPart />
            <GenRestore />
            <Enhance />
        </>
    )
}
