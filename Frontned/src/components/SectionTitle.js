import { StyleSheet, Text, View } from 'react-native';

export default function SectionTitle({ eyebrow, title }) {
  return (
    <View style={styles.container}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14
  },
  eyebrow: {
    color: '#5E7463',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase'
  },
  title: {
    color: '#102019',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 3
  }
});
