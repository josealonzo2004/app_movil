import { Platform, StatusBar as NativeStatusBar, StyleSheet } from 'react-native';

const androidTopInset = Platform.OS === 'android' ? NativeStatusBar.currentHeight || 0 : 0;
const androidBottomInset = Platform.OS === 'android' ? 24 : 0;

export const styles = StyleSheet.create({
  loginSafeArea: {
    backgroundColor: '#102019',
    flex: 1
  },
  loginKeyboard: {
    flex: 1
  },
  loginContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 22 + androidBottomInset,
    paddingHorizontal: 22,
    paddingTop: 22 + androidTopInset
  },
  loginHero: {
    alignItems: 'center',
    marginBottom: 24
  },
  loginBadge: {
    alignItems: 'center',
    backgroundColor: '#2E7D5B',
    borderColor: '#78B36A',
    borderRadius: 8,
    borderWidth: 1,
    height: 86,
    justifyContent: 'center',
    marginBottom: 16,
    width: 86
  },
  loginBrand: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '900'
  },
  loginSubtitle: {
    color: '#CFE0D1',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center'
  },
  loginCard: {
    backgroundColor: '#F5F8F1',
    borderColor: '#DDE8D7',
    borderRadius: 8,
    borderWidth: 1,
    padding: 18
  },
  loginTitle: {
    color: '#102019',
    fontSize: 26,
    fontWeight: '900'
  },
  loginText: {
    color: '#63736A',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
    marginTop: 6
  },
  authSwitch: {
    backgroundColor: '#E7F2E1',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
    padding: 5
  },
  authSwitchButton: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    paddingVertical: 10
  },
  authSwitchButtonActive: {
    backgroundColor: '#2E7D5B'
  },
  authSwitchText: {
    color: '#63736A',
    fontSize: 13,
    fontWeight: '900'
  },
  authSwitchTextActive: {
    color: '#FFFFFF'
  },
  loginInputWrap: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE8D7',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
    paddingHorizontal: 13
  },
  loginInput: {
    color: '#102019',
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    minHeight: 52
  },
  loginError: {
    color: '#B94A48',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12
  },
  registerSuccess: {
    color: '#2E7D5B',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
    marginBottom: 12
  },
  loginButton: {
    alignItems: 'center',
    backgroundColor: '#2E7D5B',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 4,
    paddingVertical: 15
  },
  loginButtonDisabled: {
    backgroundColor: '#7A8D80'
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900'
  },
  safeArea: {
    backgroundColor: '#F5F8F1',
    flex: 1
  },
  appShell: {
    flex: 1,
    paddingBottom: androidBottomInset,
    paddingHorizontal: 18,
    paddingTop: 12 + androidTopInset
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18
  },
  headerActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8
  },
  brand: {
    color: '#102019',
    fontSize: 28,
    fontWeight: '900'
  },
  subtitle: {
    color: '#63736A',
    fontSize: 13,
    fontWeight: '600'
  },
  scorePill: {
    alignItems: 'center',
    backgroundColor: '#2E7D5B',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE8D7',
    borderRadius: 8,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    width: 38
  },
  content: {
    flex: 1
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22
  },
  dashboardCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE8D7',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 14,
    padding: 15
  },
  dashboardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  dashboardTitle: {
    color: '#102019',
    fontSize: 16,
    fontWeight: '900'
  },
  dashboardText: {
    color: '#63736A',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 3
  },
  dashboardPercent: {
    color: '#2E7D5B',
    fontSize: 24,
    fontWeight: '900'
  },
  progressTrack: {
    backgroundColor: '#E7F2E1',
    borderRadius: 8,
    height: 14,
    overflow: 'hidden'
  },
  progressFill: {
    backgroundColor: '#2E7D5B',
    borderRadius: 8,
    height: '100%'
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  goalText: {
    color: '#45554B',
    fontSize: 12,
    fontWeight: '800'
  },
  barChart: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 9,
    height: 150,
    justifyContent: 'space-between'
  },
  barItem: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end'
  },
  barColumn: {
    backgroundColor: '#E7F2E1',
    borderRadius: 8,
    height: 118,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    width: '100%'
  },
  barFill: {
    backgroundColor: '#2E7D5B',
    borderRadius: 8,
    minHeight: 8
  },
  barLabel: {
    color: '#63736A',
    fontSize: 11,
    fontWeight: '900',
    marginTop: 8
  },
  rankingTable: {
    gap: 8
  },
  rankingHeaderRow: {
    alignItems: 'center',
    borderBottomColor: '#EDF0EA',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingBottom: 8
  },
  rankingHeaderPosition: {
    color: '#63736A',
    fontSize: 11,
    fontWeight: '900',
    width: 38
  },
  rankingHeaderUser: {
    color: '#63736A',
    flex: 1,
    fontSize: 11,
    fontWeight: '900'
  },
  rankingHeaderPoints: {
    color: '#63736A',
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'right',
    width: 70
  },
  rankingRow: {
    alignItems: 'center',
    backgroundColor: '#F8FBF5',
    borderColor: '#EDF0EA',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 10
  },
  rankingPositionBadge: {
    alignItems: 'center',
    backgroundColor: '#2E7D5B',
    borderRadius: 8,
    height: 30,
    justifyContent: 'center',
    width: 30
  },
  rankingPositionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900'
  },
  rankingUserCell: {
    flex: 1
  },
  rankingUserName: {
    color: '#102019',
    fontSize: 14,
    fontWeight: '900'
  },
  rankingPoints: {
    color: '#2E7D5B',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'right',
    width: 70
  },
  rankingStatusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 8
  },
  materialBadge: {
    alignItems: 'center',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    width: 44
  },
  materialStatRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12
  },
  materialStatLabel: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    width: 86
  },
  materialStatText: {
    color: '#102019',
    fontSize: 12,
    fontWeight: '900'
  },
  materialStatTrack: {
    backgroundColor: '#EDF0EA',
    borderRadius: 8,
    flex: 1,
    height: 10,
    overflow: 'hidden'
  },
  materialStatFill: {
    borderRadius: 8,
    height: '100%'
  },
  materialPercent: {
    color: '#63736A',
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'right',
    width: 38
  },
  listItem: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE8D7',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
    padding: 14
  },
  listIcon: {
    alignItems: 'center',
    backgroundColor: '#E7F2E1',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    width: 40
  },
  listBody: {
    flex: 1
  },
  listTitle: {
    color: '#102019',
    fontSize: 15,
    fontWeight: '800'
  },
  listText: {
    color: '#63736A',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3
  },
  pointsText: {
    color: '#2E7D5B',
    fontSize: 15,
    fontWeight: '900'
  },
  scannerTitle: {
    color: '#102019',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 10
  },
  scannerText: {
    color: '#63736A',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
    textAlign: 'center'
  },
  qrScannerBox: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE8D7',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    marginBottom: 14,
    minHeight: 260,
    overflow: 'hidden',
    padding: 24,
    position: 'relative'
  },
  qrScannerBoxActive: {
    backgroundColor: '#102019',
    borderColor: '#2E7D5B'
  },
  cameraPreview: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  cameraShade: {
    backgroundColor: 'rgba(16, 32, 25, 0.38)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  scannerTitleActive: {
    color: '#FFFFFF'
  },
  scannerTextActive: {
    color: '#CFE0D1'
  },
  scanCornerTopLeft: {
    borderColor: '#2E7D5B',
    borderLeftWidth: 4,
    borderTopWidth: 4,
    height: 44,
    left: 18,
    position: 'absolute',
    top: 18,
    width: 44
  },
  scanCornerTopRight: {
    borderColor: '#2E7D5B',
    borderRightWidth: 4,
    borderTopWidth: 4,
    height: 44,
    position: 'absolute',
    right: 18,
    top: 18,
    width: 44
  },
  scanCornerBottomLeft: {
    borderBottomWidth: 4,
    borderColor: '#2E7D5B',
    borderLeftWidth: 4,
    bottom: 18,
    height: 44,
    left: 18,
    position: 'absolute',
    width: 44
  },
  scanCornerBottomRight: {
    borderBottomWidth: 4,
    borderColor: '#2E7D5B',
    borderRightWidth: 4,
    bottom: 18,
    height: 44,
    position: 'absolute',
    right: 18,
    width: 44
  },
  scanLine: {
    backgroundColor: '#78B36A',
    borderRadius: 8,
    height: 4,
    marginTop: 24,
    width: '78%'
  },
  fieldLabel: {
    color: '#102019',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
    marginTop: 4
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#2E7D5B',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 15
  },
  primaryButtonDisabled: {
    backgroundColor: '#7A8D80'
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900'
  },
  scanInfoCard: {
    alignItems: 'center',
    backgroundColor: '#FFF8E8',
    borderColor: '#E9D9AD',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
    marginTop: 14,
    padding: 14
  },
  scanErrorCard: {
    alignItems: 'center',
    backgroundColor: '#FFF0EF',
    borderColor: '#E8C1BE',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    padding: 14
  },
  scanSuccessCard: {
    alignItems: 'center',
    backgroundColor: '#F3FAEF',
    borderColor: '#BBD7AD',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    padding: 14
  },
  cameraPermissionCard: {
    alignItems: 'center',
    backgroundColor: '#FFF8E8',
    borderColor: '#E9D9AD',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
    padding: 14
  },
  receiptCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE8D7',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 14,
    padding: 15
  },
  receiptHeader: {
    alignItems: 'center',
    borderBottomColor: '#EDF0EA',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12
  },
  receiptTitle: {
    color: '#102019',
    fontSize: 17,
    fontWeight: '900'
  },
  receiptText: {
    color: '#63736A',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3
  },
  receiptPoints: {
    alignItems: 'center',
    backgroundColor: '#E7F2E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  receiptPointsText: {
    color: '#2E7D5B',
    fontSize: 20,
    fontWeight: '900'
  },
  receiptPointsLabel: {
    color: '#2E7D5B',
    fontSize: 11,
    fontWeight: '900'
  },
  receiptItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 11
  },
  receiptIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 38,
    justifyContent: 'center',
    width: 38
  },
  receiptSummary: {
    borderTopColor: '#EDF0EA',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    paddingTop: 12
  },
  placeCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE8D7',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14
  },
  locationStatusCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE8D7',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    padding: 14
  },
  placeHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12
  },
  mapPin: {
    alignItems: 'center',
    backgroundColor: '#D8902A',
    borderRadius: 8,
    height: 42,
    justifyContent: 'center',
    width: 42
  },
  distance: {
    color: '#2E7D5B',
    fontSize: 13,
    fontWeight: '900'
  },
  accepts: {
    color: '#45554B',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 12
  },
  mapButton: {
    alignItems: 'center',
    borderColor: '#BBD7AD',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 12
  },
  mapButtonText: {
    color: '#2E7D5B',
    fontSize: 13,
    fontWeight: '900'
  },
  rewardCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE8D7',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    overflow: 'hidden',
    padding: 14
  },
  rewardCardClaimed: {
    backgroundColor: '#F3FAEF',
    borderColor: '#BBD7AD'
  },
  rewardStatusCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE8D7',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    padding: 14
  },
  rewardCelebration: {
    alignItems: 'center',
    backgroundColor: '#2E7D5B',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    left: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    position: 'absolute',
    right: 14,
    top: 12,
    zIndex: 5
  },
  rewardCelebrationText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900'
  },
  rewardIcon: {
    alignItems: 'center',
    backgroundColor: '#EDF0EA',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    width: 44
  },
  rewardIconUnlocked: {
    backgroundColor: '#2E7D5B'
  },
  rewardIconClaimed: {
    backgroundColor: '#D8902A'
  },
  rewardAction: {
    alignItems: 'flex-end',
    gap: 7
  },
  rewardCost: {
    color: '#6C756E',
    fontSize: 13,
    fontWeight: '900'
  },
  rewardCostUnlocked: {
    color: '#2E7D5B'
  },
  claimButton: {
    backgroundColor: '#2E7D5B',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  claimButtonLocked: {
    backgroundColor: '#EDF0EA'
  },
  claimButtonClaimed: {
    backgroundColor: '#FFF8E8',
    borderColor: '#E9D9AD',
    borderWidth: 1
  },
  claimButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900'
  },
  claimButtonTextLocked: {
    color: '#6C756E'
  },
  claimButtonTextClaimed: {
    color: '#9B6A3D'
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE8D7',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
    marginTop: 10,
    padding: 7
  },
  tabButton: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    gap: 3,
    minHeight: 56,
    justifyContent: 'center'
  },
  tabButtonActive: {
    backgroundColor: '#2E7D5B'
  },
  tabLabel: {
    color: '#6B776F',
    fontSize: 11,
    fontWeight: '800'
  },
  tabLabelActive: {
    color: '#FFFFFF'
  }
});
