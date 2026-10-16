This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- This project uses **React Navigation** (native stack), not Expo Router. The root stack lives in `src/navigation/AppNavigator.tsx`; route params are typed in `src/types/navigation.types.ts`.
- Screens live in `src/screens/<Name>Screen/` (`.tsx`, `.styles.ts`, `.data.ts`, `index.ts`). Register a route only together with its implemented screen.
- Docs: https://reactnavigation.org/docs/native-stack-navigator

## Design system

- Figma exports (screens and backgrounds) are in `Assets/` and are the visual reference. The design frame is 360×714 dp (PNGs are 2x).
- Colors, typography, spacing, radii and shadows live in `src/theme/`. Never hard-code hex values in components; read tokens via `useAppTheme()` or `makeStyles`.
- Scale sizes with `scale()` and screen positions with `verticalScale()` from `useResponsive()`.
- Figma exports differ in pixel size and aspect ratio. Measure each screen in its own export, convert to dp with `designFrameFromExport(pxWidth, pxHeight)` (always 360 dp wide), and pass that frame to `makeStyles(..., { frame })` so `verticalScale` follows the export's height (see `SignInScreen.styles.ts`).
- Sans-serif text on the Sign In screen uses the platform UI font (SF Pro / Roboto): those text variants set `fontWeight` and no `fontFamily`.
- Images are referenced only through `src/constants/images.ts`. Note: RN's `Image` pre-fills the asset's intrinsic size, so give images explicit `width`/`height` (not `aspectRatio` or `absoluteFill` alone).

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
