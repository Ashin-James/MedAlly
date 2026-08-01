export type BottomTabParamList = {
  HomeTab: undefined;
  HistoryTab: undefined;
  RemindersTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  MainTabs: { screen?: keyof BottomTabParamList } | undefined;
  Scan: undefined;
  Results: { data?: any; imageBase64?: string } | undefined;
  Hospitals: undefined;
  Translation: { data?: any } | undefined;
  VoiceAI: undefined;
};
