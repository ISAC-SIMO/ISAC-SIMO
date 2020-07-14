import React from 'react'

const LocalizationContext = React.createContext({});

export const LocalizationProvider = LocalizationContext.Provider;
export const LocalizationConsumer = LocalizationContext.Consumer;
export default LocalizationContext;