import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import BottomTabs from './src/components/BottomTabs';
import AdminScreen from './src/screens/AdminScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import PointsScreen from './src/screens/PointsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RewardsScreen from './src/screens/RewardsScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import { clearAuthToken } from './src/services/api';
import { logoutUser } from './src/services/authService';
import { getRecyclingRecords } from './src/services/recyclingService';
import { getUsedRewardPoints } from './src/services/rewardService';
import { styles } from './src/styles/appStyles';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthTokenState] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [activity, setActivity] = useState([]);
  const [usedRewardPoints, setUsedRewardPoints] = useState(0);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');

  const earnedPoints = useMemo(
    () => activity.reduce((sum, item) => sum + item.points, 0),
    [activity]
  );

  const availablePoints = Math.max(earnedPoints - usedRewardPoints, 0);

  const totalItems = useMemo(
    () => activity.reduce((sum, item) => sum + item.quantity, 0),
    [activity]
  );

  function handleScanComplete(scannedActivity) {
    setActivity((current) => [...scannedActivity, ...current]);
    loadUserSummary();
  }

  function handleLoginSuccess(session) {
    setCurrentUser(session.user);
    setAuthTokenState(session.token);
    setIsLoggedIn(true);
    loadUserSummary();
  }

  async function loadUserSummary() {
    setIsLoadingProfile(true);
    setProfileError('');

    try {
      const [records, usedPoints] = await Promise.all([
        getRecyclingRecords(),
        getUsedRewardPoints()
      ]);

      setActivity(records);
      setUsedRewardPoints(usedPoints);
    } catch (error) {
      setProfileError(error.message || 'No se pudieron cargar tus estadisticas.');
    } finally {
      setIsLoadingProfile(false);
    }
  }

  async function handleLogout() {
    if (authToken) {
      await logoutUser().catch(() => clearAuthToken());
    } else {
      clearAuthToken();
    }

    setCurrentUser(null);
    setAuthTokenState(null);
    setActivity([]);
    setUsedRewardPoints(0);
    setProfileError('');
    setIsLoggedIn(false);
    setActiveTab('home');
  }

  function renderActiveScreen() {
    if (activeTab === 'admin') {
      return <AdminScreen />;
    }

    if (activeTab === 'home') {
      return (
        <HomeScreen
          activity={activity}
          availablePoints={availablePoints}
          earnedPoints={earnedPoints}
          isLoadingProfile={isLoadingProfile}
          profileError={profileError}
          totalItems={totalItems}
          usedRewardPoints={usedRewardPoints}
        />
      );
    }

    if (activeTab === 'profile') {
      return (
        <ProfileScreen
          currentUser={currentUser}
          earnedPoints={earnedPoints}
          onProfileUpdated={setCurrentUser}
          totalItems={totalItems}
        />
      );
    }

    if (activeTab === 'scan') {
      return <ScannerScreen onScanComplete={handleScanComplete} />;
    }

    if (activeTab === 'points') {
      return <PointsScreen />;
    }

    return <RewardsScreen onClaimComplete={loadUserSummary} totalPoints={availablePoints} />;
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLoginSuccess} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#F5F8F1" style="dark" translucent={false} />
      <View style={styles.appShell}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>EcoSmart</Text>
            <Text style={styles.subtitle}>
              {currentUser?.nombre ? `Hola, ${currentUser.nombre}` : 'Sistema de reciclaje inteligente'}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <View style={styles.scorePill}>
              <MaterialCommunityIcons color="#EFF8EA" name="star-circle" size={18} />
              <Text style={styles.scoreText}>{availablePoints} pts</Text>
            </View>
            <TouchableOpacity onPress={() => setActiveTab('profile')} style={styles.logoutButton}>
              <MaterialCommunityIcons color="#2E7D5B" name="account-outline" size={20} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <MaterialCommunityIcons color="#2E7D5B" name="logout" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
          {renderActiveScreen()}
        </ScrollView>

        <BottomTabs activeTab={activeTab} isAdmin={currentUser?.rol === 'admin'} onChangeTab={setActiveTab} />
      </View>
    </SafeAreaView>
  );
}
