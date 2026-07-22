import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { tabs } from '../constants/navigation';
import { styles } from '../styles/appStyles';

export default function BottomTabs({ activeTab, isAdmin, onChangeTab }) {
  const visibleTabs = isAdmin ? [...tabs, { id: 'admin', label: 'Admin', icon: 'shield-account-outline' }] : tabs;

  return (
    <View style={styles.tabBar}>
      {visibleTabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onChangeTab(tab.id)}
            style={[styles.tabButton, isActive && styles.tabButtonActive]}
          >
            <MaterialCommunityIcons color={isActive ? '#FFFFFF' : '#6B776F'} name={tab.icon} size={22} />
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
