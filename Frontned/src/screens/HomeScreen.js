import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MetricCard from '../components/MetricCard';
import SectionTitle from '../components/SectionTitle';
import { materials } from '../data/mockData';
import { getTopUsersRanking } from '../services/rankingService';
import { styles } from '../styles/appStyles';

export default function HomeScreen({
  activity,
  availablePoints,
  earnedPoints,
  isLoadingProfile,
  profileError,
  totalItems,
  usedRewardPoints
}) {
  const recordsPerPage = 5;
  const [activityPage, setActivityPage] = useState(1);
  const materialTotals = useMemo(
    () => materials.map((material) => {
      const quantity = activity
        .filter((item) => item.material === material.name)
        .reduce((sum, item) => sum + item.quantity, 0);

      return { ...material, quantity };
    }),
    [activity]
  );

  const topMaterial = useMemo(
    () => materialTotals.reduce((top, item) => (item.quantity > top.quantity ? item : top), materialTotals[0]),
    [materialTotals]
  );

  const goalProgress = Math.min(availablePoints / 360, 1);
  const [ranking, setRanking] = useState([]);
  const [rankingError, setRankingError] = useState('');
  const [isLoadingRanking, setIsLoadingRanking] = useState(true);
  const totalActivityPages = Math.max(Math.ceil(activity.length / recordsPerPage), 1);
  const visibleActivity = activity.slice(
    (activityPage - 1) * recordsPerPage,
    activityPage * recordsPerPage
  );

  useEffect(() => {
    loadRanking();
  }, []);

  useEffect(() => {
    setActivityPage((current) => Math.min(current, totalActivityPages));
  }, [totalActivityPages]);

  async function loadRanking() {
    setIsLoadingRanking(true);
    setRankingError('');

    try {
      setRanking(await getTopUsersRanking());
    } catch (error) {
      setRankingError(error.message || 'No se pudo cargar el ranking.');
    } finally {
      setIsLoadingRanking(false);
    }
  }

  return (
    <View>
      <SectionTitle eyebrow="Dashboard" title="Resumen ambiental" />

      {isLoadingProfile ? (
        <View style={styles.rewardStatusCard}>
          <MaterialCommunityIcons color="#2E7D5B" name="timer-sand" size={24} />
          <View style={styles.listBody}>
            <Text style={styles.listTitle}>Cargando estadisticas</Text>
            <Text style={styles.listText}>Consultando tus registros de reciclaje en el servidor.</Text>
          </View>
        </View>
      ) : null}

      {profileError ? (
        <View style={styles.scanErrorCard}>
          <MaterialCommunityIcons color="#B94A48" name="alert-circle-outline" size={24} />
          <View style={styles.listBody}>
            <Text style={styles.listTitle}>Aviso del perfil</Text>
            <Text style={styles.listText}>{profileError}</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.metricsRow}>
        <MetricCard color="#2E7D5B" icon="recycle" label="Residuos registrados" value={totalItems} />
        <MetricCard color="#D8902A" icon="wallet-giftcard" label="Puntos disponibles" value={availablePoints} />
      </View>

      <View style={styles.metricsRow}>
        <MetricCard color="#2F80ED" icon="trophy-outline" label="Puntos ganados" value={earnedPoints} />
        <MetricCard color="#7A7F87" icon="gift-open-outline" label="Puntos usados" value={usedRewardPoints} />
      </View>

      <View style={styles.dashboardCard}>
        <View style={styles.dashboardHeader}>
          <View>
            <Text style={styles.dashboardTitle}>Meta de recompensas</Text>
            <Text style={styles.dashboardText}>Objetivo: 360 puntos para certificado verde</Text>
          </View>
          <Text style={styles.dashboardPercent}>{Math.round(goalProgress * 100)}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${goalProgress * 100}%` }]} />
        </View>
        <View style={styles.goalFooter}>
          <Text style={styles.goalText}>{availablePoints} pts disponibles</Text>
          <Text style={styles.goalText}>{Math.max(360 - availablePoints, 0)} pts restantes</Text>
        </View>
      </View>

      <View style={styles.dashboardCard}>
        <View style={styles.dashboardHeader}>
          <View>
            <Text style={styles.dashboardTitle}>Ranking EcoSmart</Text>
            <Text style={styles.dashboardText}>Top 5 usuarios con mas puntos</Text>
          </View>
          <MaterialCommunityIcons color="#2E7D5B" name="podium" size={28} />
        </View>

        {isLoadingRanking ? (
          <View style={styles.rankingStatusRow}>
            <MaterialCommunityIcons color="#2E7D5B" name="timer-sand" size={20} />
            <Text style={styles.listText}>Cargando ranking actual...</Text>
          </View>
        ) : null}

        {rankingError ? (
          <View style={styles.rankingStatusRow}>
            <MaterialCommunityIcons color="#B94A48" name="alert-circle-outline" size={20} />
            <Text style={styles.listText}>{rankingError}</Text>
          </View>
        ) : null}

        {!isLoadingRanking && !rankingError ? (
          <View style={styles.rankingTable}>
            <View style={styles.rankingHeaderRow}>
              <Text style={styles.rankingHeaderPosition}>#</Text>
              <Text style={styles.rankingHeaderUser}>Usuario</Text>
              <Text style={styles.rankingHeaderPoints}>Puntos</Text>
            </View>

            {ranking.length ? ranking.map((user) => (
              <View key={user.id} style={styles.rankingRow}>
                <View style={styles.rankingPositionBadge}>
                  <Text style={styles.rankingPositionText}>{user.position}</Text>
                </View>
                <View style={styles.rankingUserCell}>
                  <Text style={styles.rankingUserName}>{user.name}</Text>
                  <Text style={styles.listText}>Usuario EcoSmart</Text>
                </View>
                <Text style={styles.rankingPoints}>{user.points}</Text>
              </View>
            )) : (
              <View style={styles.rankingStatusRow}>
                <MaterialCommunityIcons color="#D8902A" name="account-search-outline" size={20} />
                <Text style={styles.listText}>Aun no hay usuarios con puntos registrados.</Text>
              </View>
            )}
          </View>
        ) : null}
      </View>

      <View style={styles.dashboardCard}>
        <View style={styles.dashboardHeader}>
          <View>
            <Text style={styles.dashboardTitle}>Material mas reciclado</Text>
            <Text style={styles.dashboardText}>{topMaterial.name}: {topMaterial.quantity} unidades</Text>
          </View>
          <View style={[styles.materialBadge, { backgroundColor: topMaterial.color }]}>
            <MaterialCommunityIcons color="#FFFFFF" name={topMaterial.icon} size={24} />
          </View>
        </View>

        {materialTotals.map((material) => {
          const percent = totalItems ? Math.round((material.quantity / totalItems) * 100) : 0;

          return (
            <View key={material.id} style={styles.materialStatRow}>
              <View style={styles.materialStatLabel}>
                <MaterialCommunityIcons color={material.color} name={material.icon} size={18} />
                <Text style={styles.materialStatText}>{material.name}</Text>
              </View>
              <View style={styles.materialStatTrack}>
                <View
                  style={[
                    styles.materialStatFill,
                    { backgroundColor: material.color, width: `${percent}%` }
                  ]}
                />
              </View>
              <Text style={styles.materialPercent}>{percent}%</Text>
            </View>
          );
        })}
      </View>

      <SectionTitle eyebrow="Actividad" title="Ultimos registros" />
      {activity.length ? visibleActivity.map((item) => (
        <View key={item.id} style={styles.listItem}>
          <View style={styles.listIcon}>
            <MaterialCommunityIcons color="#2E7D5B" name="check-circle-outline" size={22} />
          </View>
          <View style={styles.listBody}>
            <Text style={styles.listTitle}>{item.quantity} x {item.material}</Text>
            <Text style={styles.listText}>Entrega registrada correctamente</Text>
          </View>
          <Text style={styles.pointsText}>+{item.points}</Text>
        </View>
      )) : (
        <View style={styles.rewardStatusCard}>
          <MaterialCommunityIcons color="#D8902A" name="clipboard-text-outline" size={24} />
          <View style={styles.listBody}>
            <Text style={styles.listTitle}>Sin registros todavia</Text>
            <Text style={styles.listText}>Escanea un comprobante QR para empezar a sumar puntos.</Text>
          </View>
        </View>
      )}

      {activity.length > recordsPerPage ? (
        <View style={styles.paginationRow}>
          <TouchableOpacity
            disabled={activityPage === 1}
            onPress={() => setActivityPage((page) => page - 1)}
            style={[styles.paginationButton, activityPage === 1 && styles.paginationButtonDisabled]}
          >
            <MaterialCommunityIcons color={activityPage === 1 ? '#9AA49D' : '#2E7D5B'} name="chevron-left" size={20} />
            <Text style={[styles.paginationButtonText, activityPage === 1 && styles.paginationButtonTextDisabled]}>Anterior</Text>
          </TouchableOpacity>
          <Text style={styles.paginationLabel}>Pagina {activityPage} de {totalActivityPages}</Text>
          <TouchableOpacity
            disabled={activityPage === totalActivityPages}
            onPress={() => setActivityPage((page) => page + 1)}
            style={[styles.paginationButton, activityPage === totalActivityPages && styles.paginationButtonDisabled]}
          >
            <Text style={[styles.paginationButtonText, activityPage === totalActivityPages && styles.paginationButtonTextDisabled]}>Siguiente</Text>
            <MaterialCommunityIcons color={activityPage === totalActivityPages ? '#9AA49D' : '#2E7D5B'} name="chevron-right" size={20} />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}
