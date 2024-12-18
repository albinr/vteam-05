// import React, { useState, useEffect } from 'react';
// import { Button, Text, View } from 'react-native';
// import { useAuthRequest, DiscoveryDocument, makeRedirectUri } from 'expo-auth-session';

// const GoogleOAuth = () => {
//   const [userInfo, setUserInfo] = useState<any>(null); // You can replace 'any' with the actual user info type if known
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null); // To handle errors

//   // Google OAuth Configuration
//   const googleOAuthConfig = {
//     clientId: '',
//     scopes: ['openid', 'profile', 'email'],
//   };

//   const discovery: DiscoveryDocument = {
//     authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
//     tokenEndpoint: 'https://oauth2.googleapis.com/token',
//     revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
//   };

//   // Create the AuthRequest
//   const [request, response, promptAsync] = useAuthRequest(
//     {
//       clientId: googleOAuthConfig.clientId,
//       // redirectUri: makeRedirectUri({ useProxy: true }),
//       redirectUri: 'https://auth.expo.io/@mackeeee/user-app',
//       scopes: googleOAuthConfig.scopes,
//     },
//     discovery
//   );

//   // Handle OAuth response
//   useEffect(() => {
//     if (response?.type === 'success') {
//       fetchUserInfo(response.params.access_token);
//     } else if (response?.type === 'error') {
//       console.error('OAuth error:', response.error); // Add detailed error logging
//       setError(`OAuth error: ${response.error}`);
//     }
//   }, [response]);


//   // Fetch user info using the received access token
//   const fetchUserInfo = async (access_token: string) => {
//     try {
//       setLoading(true);
//       const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
//         headers: {
//           Authorization: `Bearer ${access_token}`,
//         },
//       });
//       const userInfo = await userInfoResponse.json();
//       setUserInfo(userInfo);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching Google user info:', error);
//       setError('Failed to fetch user info.');
//       setLoading(false);
//     }
//   };

//   // Handle login
//   const handleLogin = async () => {
//     try {
//       setError(null); // Reset any previous errors
//       const result = await promptAsync(); // Prompt for authentication
//       if (result.type !== 'success') {
//         setError('Authentication canceled or failed.');
//       }
//     } catch (err) {
//       console.error('Login failed:', err);
//       setError('Login failed.');
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Button title="Login with Google" onPress={handleLogin} />
//       {loading && <Text>Loading...</Text>}
//       {userInfo && (
//         <View>
//           <Text>Name: {userInfo.name}</Text>
//           <Text>Email: {userInfo.email}</Text>
//         </View>
//       )}
//       {error && <Text style={{ color: 'red' }}>Error: {error}</Text>}
//     </View>
//   );
// };

// export default GoogleOAuth;
