/**
 * Every route in the root stack and its params.
 * Add a route here only together with its implemented screen.
 */
export type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
};

declare global {
  namespace ReactNavigation {
    // Types `useNavigation()` app-wide without passing generics.
    interface RootParamList extends RootStackParamList {}
  }
}
