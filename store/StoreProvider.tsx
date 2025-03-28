
'use client'
import React, { useRef } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { AppStore, persistor, makeStore } from './store'

export default function StoreProvider({ children }: React.PropsWithChildren) {
    const storeRef = useRef<AppStore>(undefined)

    if (!storeRef.current) {
        storeRef.current = makeStore()
    }

    return (
        <Provider store={storeRef.current}>

            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    )
}
