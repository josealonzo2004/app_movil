import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import SectionTitle from '../components/SectionTitle';
import { updateUserProfile } from '../services/authService';
import { styles } from '../styles/appStyles';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProfileScreen({ currentUser, earnedPoints, totalItems, onProfileUpdated }) {
  const [form, setForm] = useState({ nombre: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [requestError, setRequestError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setForm({ nombre: currentUser?.nombre || '', email: currentUser?.email || '', password: '' });
  }, [currentUser]);

  function validate() {
    const nextErrors = {};
    if (!form.nombre.trim()) nextErrors.nombre = 'El nombre es obligatorio.';
    if (!form.email.trim()) nextErrors.email = 'El correo es obligatorio.';
    else if (!emailPattern.test(form.email.trim())) nextErrors.email = 'Escribe un correo valido.';
    if (form.password && form.password.length < 6) nextErrors.password = 'Debe tener minimo 6 caracteres.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function saveProfile() {
    if (!validate()) return;
    setIsSaving(true);
    setMessage('');
    setRequestError('');

    try {
      const payload = { nombre: form.nombre.trim(), email: form.email.trim() };
      if (form.password) payload.password = form.password;
      const updatedUser = await updateUserProfile(payload);
      onProfileUpdated(updatedUser);
      setForm((current) => ({ ...current, password: '' }));
      setMessage('Tu perfil se actualizo correctamente.');
    } catch (error) {
      setRequestError(error.message || 'No se pudo actualizar el perfil.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <View>
      <SectionTitle eyebrow="Mi cuenta" title="Perfil de usuario" />
      <View style={styles.profileSummary}>
        <View style={styles.profileAvatar}>
          <MaterialCommunityIcons color="#FFFFFF" name="account" size={40} />
        </View>
        <View style={styles.listBody}>
          <Text style={styles.profileName}>{currentUser?.nombre}</Text>
          <Text style={styles.listText}>{currentUser?.rol === 'admin' ? 'Administrador' : 'Usuario EcoSmart'}</Text>
        </View>
      </View>

      <View style={styles.profileStatsRow}>
        <ProfileStat icon="recycle" label="Residuos" value={totalItems} />
        <ProfileStat icon="star-circle-outline" label="Puntos ganados" value={earnedPoints} />
      </View>

      <View style={styles.dashboardCard}>
        <Text style={styles.dashboardTitle}>Informacion personal</Text>
        <Text style={styles.dashboardText}>Puedes actualizar tus datos de acceso.</Text>
        <ProfileInput error={errors.nombre} icon="account-outline" label="Nombre" onChangeText={(nombre) => setForm({ ...form, nombre })} value={form.nombre} />
        <ProfileInput error={errors.email} icon="email-outline" keyboardType="email-address" label="Correo" onChangeText={(email) => setForm({ ...form, email })} value={form.email} />

        <Text style={styles.fieldLabel}>Nueva contrasena (opcional)</Text>
        <View style={[styles.profileInputWrap, errors.password && styles.adminTextInputError]}>
          <MaterialCommunityIcons color="#63736A" name="lock-outline" size={20} />
          <TextInput autoCapitalize="none" onChangeText={(password) => setForm({ ...form, password })} secureTextEntry={!showPassword} style={styles.profileInput} value={form.password} />
          <TouchableOpacity onPress={() => setShowPassword((visible) => !visible)} style={styles.passwordEyeButton}>
            <MaterialCommunityIcons color="#63736A" name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={21} />
          </TouchableOpacity>
        </View>
        {errors.password ? <Text style={styles.adminFieldError}>{errors.password}</Text> : null}
        {requestError ? <Text style={styles.loginError}>{requestError}</Text> : null}
        {message ? <Text style={styles.registerSuccess}>{message}</Text> : null}

        <TouchableOpacity disabled={isSaving} onPress={saveProfile} style={[styles.primaryButton, isSaving && styles.primaryButtonDisabled]}>
          <MaterialCommunityIcons color="#FFFFFF" name="content-save-outline" size={21} />
          <Text style={styles.primaryButtonText}>{isSaving ? 'Guardando...' : 'Guardar cambios'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ProfileInput({ error, icon, keyboardType, label, onChangeText, value }) {
  return (
    <View>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.profileInputWrap, error && styles.adminTextInputError]}>
        <MaterialCommunityIcons color="#63736A" name={icon} size={20} />
        <TextInput autoCapitalize="none" keyboardType={keyboardType || 'default'} onChangeText={onChangeText} style={styles.profileInput} value={value} />
      </View>
      {error ? <Text style={styles.adminFieldError}>{error}</Text> : null}
    </View>
  );
}

function ProfileStat({ icon, label, value }) {
  return (
    <View style={styles.profileStat}>
      <MaterialCommunityIcons color="#2E7D5B" name={icon} size={22} />
      <Text style={styles.profileStatValue}>{value}</Text>
      <Text style={styles.profileStatLabel}>{label}</Text>
    </View>
  );
}
