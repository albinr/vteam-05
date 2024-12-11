import { StyleSheet, Text } from "react-native";
import HomeScreen from "@/screens/HomeScreen";
// import LoginScreen from "@/screens/LoginScreen";

export default function Index() {

  const userLoggedIn: boolean = false;

  return (
    // userLoggedIn ? <HomeScreen /> : <LoginScreen />
    userLoggedIn ? <HomeScreen /> : <Text>Not logged in</Text>
  );
}

// const styles = StyleSheet.create({
// });
