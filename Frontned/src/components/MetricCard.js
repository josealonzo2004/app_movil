import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function MetricCard({ icon, label, value, color }) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: color }]}>
        <MaterialCommunityIcons color="#FFFFFF" name={icon} size={22} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE8D7',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 118,
    padding: 14
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 8,
    height: 38,
    justifyContent: 'center',
    width: 38
  },
  value: {
    color: '#102019',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 12
  },
  label: {
    color: '#63736A',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 3
  }
});
