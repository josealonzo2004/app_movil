import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import SectionTitle from '../components/SectionTitle';
import { saveScanResult } from '../services/recyclingService';
import { styles } from '../styles/appStyles';
import { createQrScanResult, scanResultToActivity } from '../utils/scannerSimulator';

export default function ScannerScreen({ onScanComplete }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [isSavingScan, setIsSavingScan] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState('');
  const [scanSuccess, setScanSuccess] = useState('');

  async function simulateQrScan() {
    if (isScanning) return;

    if (!permission?.granted) {
      const permissionResponse = await requestPermission();
      if (!permissionResponse.granted) return;
    }

    setIsScanning(true);
    setScanError('');
    setScanSuccess('');
    setScanResult(null);

    setTimeout(async () => {
      const result = createQrScanResult();
      setIsScanning(false);
      setIsSavingScan(true);

      try {
        await saveScanResult(result);
        setScanResult(result);
        setScanSuccess('Reciclaje guardado correctamente en el servidor.');
        onScanComplete(scanResultToActivity(result));
      } catch (error) {
        setScanError(error.message || 'No se pudo guardar el reciclaje en el servidor.');
      } finally {
        setIsSavingScan(false);
      }
    }, 3000);
  }

  return (
    <View>
      <SectionTitle eyebrow="Scanner" title="Escanear comprobante QR" />
      <View style={[styles.qrScannerBox, isScanning && styles.qrScannerBoxActive]}>
        {isScanning ? (
          <CameraView facing="back" style={styles.cameraPreview} />
        ) : null}
        {isScanning ? <View style={styles.cameraShade} /> : null}
        <View style={styles.scanCornerTopLeft} />
        <View style={styles.scanCornerTopRight} />
        <View style={styles.scanCornerBottomLeft} />
        <View style={styles.scanCornerBottomRight} />
        <MaterialCommunityIcons
          color={isScanning ? '#FFFFFF' : '#2E7D5B'}
          name={isScanning ? 'camera' : 'qrcode-scan'}
          size={58}
        />
        <Text style={[styles.scannerTitle, isScanning && styles.scannerTitleActive]}>
          {isScanning ? 'Escaneando QR...' : 'Listo para escanear'}
        </Text>
        <Text style={[styles.scannerText, isScanning && styles.scannerTextActive]}>
          {isScanning
            ? 'Leyendo comprobante del punto de reciclaje'
            : 'Simula el QR que entrega el punto verde despues de reciclar.'}
        </Text>
        {isScanning ? <View style={styles.scanLine} /> : null}
      </View>

      {!permission?.granted ? (
        <View style={styles.cameraPermissionCard}>
          <MaterialCommunityIcons color="#D8902A" name="camera-lock-outline" size={24} />
          <View style={styles.listBody}>
            <Text style={styles.listTitle}>Permiso de camara</Text>
            <Text style={styles.listText}>
              La app necesita acceso a la camara para simular el escaneo del QR.
            </Text>
          </View>
        </View>
      ) : null}

      <TouchableOpacity
        disabled={isScanning || isSavingScan}
        onPress={simulateQrScan}
        style={[styles.primaryButton, (isScanning || isSavingScan) && styles.primaryButtonDisabled]}
      >
        <MaterialCommunityIcons
          color="#FFFFFF"
          name={isScanning || isSavingScan ? 'timer-sand' : permission?.granted ? 'qrcode-scan' : 'camera-outline'}
          size={22}
        />
        <Text style={styles.primaryButtonText}>
          {isScanning
            ? 'Escaneando...'
            : isSavingScan
              ? 'Guardando...'
              : permission?.granted
                ? 'Escanear QR'
                : 'Permitir camara'}
        </Text>
      </TouchableOpacity>

      {scanError ? (
        <View style={styles.scanErrorCard}>
          <MaterialCommunityIcons color="#B94A48" name="alert-circle-outline" size={24} />
          <View style={styles.listBody}>
            <Text style={styles.listTitle}>No se guardo el reciclaje</Text>
            <Text style={styles.listText}>{scanError}</Text>
          </View>
        </View>
      ) : null}

      {scanSuccess ? (
        <View style={styles.scanSuccessCard}>
          <MaterialCommunityIcons color="#2E7D5B" name="cloud-check-outline" size={24} />
          <View style={styles.listBody}>
            <Text style={styles.listTitle}>Sincronizado</Text>
            <Text style={styles.listText}>{scanSuccess}</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.scanInfoCard}>
        <MaterialCommunityIcons color="#D8902A" name="information-outline" size={24} />
        <View style={styles.listBody}>
          <Text style={styles.listTitle}>Como funciona</Text>
          <Text style={styles.listText}>
            El punto de reciclaje genera un QR con los materiales entregados. Al escanearlo, la app suma los puntos al perfil.
          </Text>
        </View>
      </View>

      {scanResult ? (
        <View style={styles.receiptCard}>
          <View style={styles.receiptHeader}>
            <View>
              <Text style={styles.receiptTitle}>Comprobante escaneado</Text>
              <Text style={styles.receiptText}>{scanResult.id} - {scanResult.point}</Text>
            </View>
            <View style={styles.receiptPoints}>
              <Text style={styles.receiptPointsText}>+{scanResult.totalPoints}</Text>
              <Text style={styles.receiptPointsLabel}>pts</Text>
            </View>
          </View>

          {scanResult.items.map((item) => (
            <View key={`${scanResult.id}-${item.material}`} style={styles.receiptItem}>
              <View style={[styles.receiptIcon, { backgroundColor: item.color }]}>
                <MaterialCommunityIcons color="#FFFFFF" name={item.icon} size={20} />
              </View>
              <View style={styles.listBody}>
                <Text style={styles.listTitle}>{item.material}</Text>
                <Text style={styles.listText}>{item.quantity} unidades recicladas</Text>
              </View>
              <Text style={styles.pointsText}>+{item.points}</Text>
            </View>
          ))}

          <View style={styles.receiptSummary}>
            <Text style={styles.goalText}>{scanResult.totalQuantity} residuos registrados</Text>
            <Text style={styles.goalText}>{scanResult.date}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}
