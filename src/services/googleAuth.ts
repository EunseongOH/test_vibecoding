import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { supabase } from './supabase';

export async function nativeGoogleSignIn() {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

  const isWebIdValid = webClientId && !webClientId.includes('your-google-web-client-id');
  const isIosIdValid = iosClientId && !iosClientId.includes('your-google-ios-client-id');

  if (!isWebIdValid) {
    throw new Error('Google OAuth Web Client ID가 설정되지 않았습니다. .env 파일을 확인해 주세요.');
  }

  GoogleSignin.configure({
    webClientId: webClientId,
    iosClientId: isIosIdValid ? iosClientId : undefined,
    offlineAccess: true,
  });

  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const userInfo = await GoogleSignin.signIn();
  const idToken = userInfo.data?.idToken;

  if (!idToken) {
    throw new Error('Google 로그인 실패: ID Token이 반환되지 않았습니다.');
  }

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: idToken,
  });

  if (error) throw error;
  return data.session;
}
