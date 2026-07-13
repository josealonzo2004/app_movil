import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import SectionTitle from '../components/SectionTitle';
import { rewards as fallbackRewards } from '../data/mockData';
import { claimRewardById, getRewardClaims, getRewards } from '../services/rewardService';
import { styles } from '../styles/appStyles';

export default function RewardsScreen({ onClaimComplete, totalPoints }) {
  const [rewards, setRewards] = useState([]);
  const [claimedRewards, setClaimedRewards] = useState([]);
  const [celebratingRewardId, setCelebratingRewardId] = useState(null);
  const [loadingRewards, setLoadingRewards] = useState(true);
  const [claimingRewardId, setClaimingRewardId] = useState(null);
  const [rewardError, setRewardError] = useState('');
  const celebrationScale = useRef(new Animated.Value(0)).current;
  const celebrationOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadRewards();
  }, []);

  async function loadRewards() {
    setLoadingRewards(true);
    setRewardError('');

    try {
      const [serverRewards, claims] = await Promise.all([
        getRewards(),
        getRewardClaims()
      ]);

      setRewards(serverRewards);
      setClaimedRewards(
        claims
          .filter((claim) => ['pendiente', 'aprobado', 'entregado'].includes(claim.estado))
          .map((claim) => claim.recompensa_id)
      );
    } catch (error) {
      setRewards(fallbackRewards);
      setRewardError(error.message || 'No se pudieron cargar las recompensas del servidor.');
    } finally {
      setLoadingRewards(false);
    }
  }

  async function claimReward(rewardId) {
    if (claimedRewards.includes(rewardId)) return;

    setClaimingRewardId(rewardId);
    setRewardError('');

    try {
      await claimRewardById(rewardId);
      await onClaimComplete?.();
    } catch (error) {
      setRewardError(error.message || 'No se pudo reclamar la recompensa.');
      setClaimingRewardId(null);
      return;
    }

    setClaimedRewards((current) => [...current, rewardId]);
    setClaimingRewardId(null);
    setCelebratingRewardId(rewardId);
    celebrationScale.setValue(0.4);
    celebrationOpacity.setValue(0);

    Animated.sequence([
      Animated.parallel([
        Animated.spring(celebrationScale, {
          toValue: 1,
          friction: 4,
          tension: 90,
          useNativeDriver: true
        }),
        Animated.timing(celebrationOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true
        })
      ]),
      Animated.delay(900),
      Animated.timing(celebrationOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => setCelebratingRewardId(null));
  }

  return (
    <View>
      <SectionTitle eyebrow="Beneficios" title="Recompensas disponibles" />
      {loadingRewards ? (
        <View style={styles.rewardStatusCard}>
          <MaterialCommunityIcons color="#2E7D5B" name="timer-sand" size={24} />
          <View style={styles.listBody}>
            <Text style={styles.listTitle}>Cargando recompensas</Text>
            <Text style={styles.listText}>Consultando premios disponibles en el servidor.</Text>
          </View>
        </View>
      ) : null}

      {rewardError ? (
        <View style={styles.scanErrorCard}>
          <MaterialCommunityIcons color="#B94A48" name="alert-circle-outline" size={24} />
          <View style={styles.listBody}>
            <Text style={styles.listTitle}>Aviso de recompensas</Text>
            <Text style={styles.listText}>{rewardError}</Text>
          </View>
        </View>
      ) : null}

      {rewards.map((reward) => {
        const available = reward.available === undefined || reward.available > 0;
        const active = reward.active === undefined || reward.active;
        const unlocked = totalPoints >= reward.cost && available && active;
        const claimed = claimedRewards.includes(reward.id);
        const isCelebrating = celebratingRewardId === reward.id;
        const isClaiming = claimingRewardId === reward.id;

        return (
          <View key={reward.id} style={[styles.rewardCard, claimed && styles.rewardCardClaimed]}>
            {isCelebrating ? (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.rewardCelebration,
                  {
                    opacity: celebrationOpacity,
                    transform: [{ scale: celebrationScale }]
                  }
                ]}
              >
                <MaterialCommunityIcons color="#FFFFFF" name="gift-open-outline" size={30} />
                <Text style={styles.rewardCelebrationText}>Reclamado</Text>
              </Animated.View>
            ) : null}

            <View style={[styles.rewardIcon, unlocked && styles.rewardIconUnlocked, claimed && styles.rewardIconClaimed]}>
              <MaterialCommunityIcons
                color={unlocked ? '#FFFFFF' : '#6C756E'}
                name={claimed ? 'check-circle-outline' : 'gift-outline'}
                size={24}
              />
            </View>
            <View style={styles.listBody}>
              <Text style={styles.listTitle}>{reward.title}</Text>
              <Text style={styles.listText}>
                {claimed
                  ? 'Premio reclamado correctamente.'
                  : !available
                    ? 'Sin unidades disponibles por ahora.'
                    : reward.detail}
              </Text>
            </View>
            <View style={styles.rewardAction}>
              <Text style={[styles.rewardCost, unlocked && styles.rewardCostUnlocked]}>{reward.cost} pts</Text>
              <TouchableOpacity
                disabled={!unlocked || claimed || isClaiming}
                onPress={() => claimReward(reward.id)}
                style={[
                  styles.claimButton,
                  (!unlocked || isClaiming) && styles.claimButtonLocked,
                  claimed && styles.claimButtonClaimed
                ]}
              >
                <Text
                  style={[
                    styles.claimButtonText,
                    (!unlocked || isClaiming) && styles.claimButtonTextLocked,
                    claimed && styles.claimButtonTextClaimed
                  ]}
                >
                  {claimed ? 'Reclamado' : isClaiming ? 'Enviando...' : unlocked ? 'Reclamar' : 'Bloqueado'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
}
