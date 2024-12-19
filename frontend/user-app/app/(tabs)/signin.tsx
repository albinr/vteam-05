import React from 'react';
import { WebView } from 'react-native-webview';

const LoginScreen = () => {
    return (
        <WebView
            source={{ uri: 'http://10.0.2.2:1337/auth/google' }}
            onNavigationStateChange={(navState) => {
                if (navState.url.startsWith('http://10.0.2.2:1337/auth/google/callback')) {
                    // Här kan du hantera token från callback-url, t.ex. genom att extrahera dem från URL:en
                    console.log('URL:', navState.url);
                    // Exempelvis, redirect till en annan skärm eller spara token i state
                }
            }}
        />
    );
};

export default LoginScreen;
