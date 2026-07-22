import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import SectionTitle from '../components/SectionTitle';
import {
  createAdminCenter,
  createAdminReward,
  deleteAdminCenter,
  deleteAdminReward,
  deleteAdminUser,
  getAdminClaims,
  getAdminCenters,
  getAdminRewards,
  getAdminSummary,
  getAdminUsers,
  updateAdminClaim,
  updateAdminCenter,
  updateAdminReward,
  updateAdminUser
} from '../services/adminService';
import { styles } from '../styles/appStyles';

const adminSections = [
  { id: 'users', label: 'Usuarios', icon: 'account-group-outline' },
  { id: 'centers', label: 'Ubicaciones', icon: 'map-marker-radius-outline' },
  { id: 'rewards', label: 'Premios', icon: 'gift-outline' },
  { id: 'claims', label: 'Canjes', icon: 'clipboard-check-outline' }
];

const emptyCenterForm = {
  nombre: '',
  direccion: '',
  latitud: '',
  longitud: '',
  materiales: '',
  horario: ''
};

const emptyRewardForm = {
  nombre: '',
  descripcion: '',
  puntos: '',
  cantidad: ''
};

function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isIntegerText(value) {
  return /^\d+$/.test(value.trim());
}

function validateUserForm(form) {
  const errors = {};

  if (!form.nombre.trim()) {
    errors.nombre = 'El nombre es obligatorio.';
  }

  if (!form.email.trim()) {
    errors.email = 'El correo es obligatorio.';
  } else if (!isValidEmail(form.email)) {
    errors.email = 'Escribe un correo valido.';
  }

  if (form.password.trim() && form.password.trim().length < 6) {
    errors.password = 'La contrasena debe tener minimo 6 caracteres.';
  }

  return errors;
}

function validateCenterForm(form) {
  const errors = {};
  const latitud = Number(form.latitud);
  const longitud = Number(form.longitud);

  if (!form.nombre.trim()) {
    errors.nombre = 'El nombre es obligatorio.';
  }

  if (!form.direccion.trim()) {
    errors.direccion = 'La direccion es obligatoria.';
  }

  if (!form.latitud.trim()) {
    errors.latitud = 'La latitud es obligatoria.';
  } else if (Number.isNaN(latitud) || latitud < -90 || latitud > 90) {
    errors.latitud = 'Debe estar entre -90 y 90.';
  }

  if (!form.longitud.trim()) {
    errors.longitud = 'La longitud es obligatoria.';
  } else if (Number.isNaN(longitud) || longitud < -180 || longitud > 180) {
    errors.longitud = 'Debe estar entre -180 y 180.';
  }

  if (!form.materiales.trim()) {
    errors.materiales = 'Agrega al menos un material.';
  }

  if (form.horario.trim().length > 120) {
    errors.horario = 'El horario no debe superar 120 caracteres.';
  }

  return errors;
}

function validateRewardForm(form) {
  const errors = {};

  if (!form.nombre.trim()) {
    errors.nombre = 'El nombre es obligatorio.';
  }

  if (form.descripcion.trim().length > 500) {
    errors.descripcion = 'La descripcion no debe superar 500 caracteres.';
  }

  if (!form.puntos.trim()) {
    errors.puntos = 'Los puntos son obligatorios.';
  } else if (!isIntegerText(form.puntos) || Number(form.puntos) < 1) {
    errors.puntos = 'Debe ser un numero mayor a 0.';
  }

  if (!form.cantidad.trim()) {
    errors.cantidad = 'La cantidad es obligatoria.';
  } else if (!isIntegerText(form.cantidad)) {
    errors.cantidad = 'Debe ser un numero entero.';
  }

  return errors;
}

export default function AdminScreen() {
  const [activeSection, setActiveSection] = useState('users');
  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [claims, setClaims] = useState([]);
  const [centerForm, setCenterForm] = useState(emptyCenterForm);
  const [rewardForm, setRewardForm] = useState(emptyRewardForm);
  const [editingCenterId, setEditingCenterId] = useState(null);
  const [editingRewardId, setEditingRewardId] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userForm, setUserForm] = useState({ nombre: '', email: '', rol: 'usuario', password: '' });
  const [userErrors, setUserErrors] = useState({});
  const [centerErrors, setCenterErrors] = useState({});
  const [rewardErrors, setRewardErrors] = useState({});
  const [adminMessage, setAdminMessage] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    setIsLoadingAdmin(true);
    setAdminError('');

    try {
      const [summaryData, usersData, centersData, rewardsData, claimsData] = await Promise.all([
        getAdminSummary(),
        getAdminUsers(),
        getAdminCenters(),
        getAdminRewards(),
        getAdminClaims()
      ]);

      setSummary(summaryData);
      setUsers(usersData);
      setCenters(centersData);
      setRewards(rewardsData);
      setClaims(claimsData);
    } catch (error) {
      setAdminError(error.message || 'No se pudo cargar el panel de administrador.');
    } finally {
      setIsLoadingAdmin(false);
    }
  }

  async function changeUserRole(user) {
    const nextRole = user.rol === 'admin' ? 'usuario' : 'admin';
    await runAdminAction(async () => {
      await updateAdminUser(user.id, { rol: nextRole });
      await loadAdminData();
      setAdminMessage(`Rol actualizado a ${nextRole}.`);
    });
  }

  function startEditingUser(user) {
    setEditingUserId(user.id);
    setUserForm({
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      password: ''
    });
  }

  function cancelEditingUser() {
    setEditingUserId(null);
    setUserForm({ nombre: '', email: '', rol: 'usuario', password: '' });
    setUserErrors({});
  }

  async function saveUserChanges(userId) {
    const errors = validateUserForm(userForm);
    setUserErrors(errors);

    if (hasErrors(errors)) {
      setAdminError('Revisa los campos marcados antes de guardar el usuario.');
      return;
    }

    await runAdminAction(async () => {
      const payload = {
        nombre: userForm.nombre.trim(),
        email: userForm.email.trim(),
        rol: userForm.rol
      };

      if (userForm.password.trim()) {
        payload.password = userForm.password;
      }

      await updateAdminUser(userId, payload);
      cancelEditingUser();
      await loadAdminData();
      setAdminMessage('Usuario actualizado.');
    });
  }

  async function removeUser(userId) {
    await runAdminAction(async () => {
      await deleteAdminUser(userId);
      await loadAdminData();
      setAdminMessage('Usuario eliminado.');
    });
  }

  async function saveCenter() {
    const errors = validateCenterForm(centerForm);
    setCenterErrors(errors);

    if (hasErrors(errors)) {
      setAdminError('Revisa los campos marcados antes de guardar la ubicacion.');
      return;
    }

    await runAdminAction(async () => {
      const payload = {
        nombre: centerForm.nombre.trim(),
        direccion: centerForm.direccion.trim(),
        latitud: Number(centerForm.latitud),
        longitud: Number(centerForm.longitud),
        materiales_aceptados: centerForm.materiales
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        horario: centerForm.horario.trim(),
        ...(editingCenterId ? {} : { activo: true })
      };

      if (editingCenterId) await updateAdminCenter(editingCenterId, payload);
      else await createAdminCenter(payload);

      cancelEditingCenter();
      await loadAdminData();
      setAdminMessage(editingCenterId ? 'Ubicacion actualizada.' : 'Ubicacion guardada.');
    });
  }

  function startEditingCenter(center) {
    setEditingCenterId(center.id);
    setCenterErrors({});
    setCenterForm({
      nombre: center.nombre || '',
      direccion: center.direccion || '',
      latitud: String(center.latitud ?? ''),
      longitud: String(center.longitud ?? ''),
      materiales: Array.isArray(center.materiales_aceptados) ? center.materiales_aceptados.join(', ') : '',
      horario: center.horario || ''
    });
  }

  function cancelEditingCenter() {
    setEditingCenterId(null);
    setCenterForm(emptyCenterForm);
    setCenterErrors({});
  }

  async function toggleCenter(center) {
    await runAdminAction(async () => {
      await updateAdminCenter(center.id, { activo: !center.activo });
      await loadAdminData();
      setAdminMessage('Ubicacion actualizada.');
    });
  }

  async function removeCenter(centerId) {
    await runAdminAction(async () => {
      await deleteAdminCenter(centerId);
      await loadAdminData();
      setAdminMessage('Ubicacion eliminada.');
    });
  }

  async function saveReward() {
    const errors = validateRewardForm(rewardForm);
    setRewardErrors(errors);

    if (hasErrors(errors)) {
      setAdminError('Revisa los campos marcados antes de guardar la recompensa.');
      return;
    }

    await runAdminAction(async () => {
      const payload = {
        nombre: rewardForm.nombre.trim(),
        descripcion: rewardForm.descripcion.trim(),
        puntos_necesarios: Number(rewardForm.puntos),
        cantidad_disponible: Number(rewardForm.cantidad),
        ...(editingRewardId ? {} : { activa: true })
      };

      if (editingRewardId) await updateAdminReward(editingRewardId, payload);
      else await createAdminReward(payload);

      cancelEditingReward();
      await loadAdminData();
      setAdminMessage(editingRewardId ? 'Recompensa actualizada.' : 'Recompensa guardada.');
    });
  }

  function startEditingReward(reward) {
    setEditingRewardId(reward.id);
    setRewardErrors({});
    setRewardForm({
      nombre: reward.nombre || '',
      descripcion: reward.descripcion || '',
      puntos: String(reward.puntos_necesarios ?? ''),
      cantidad: String(reward.cantidad_disponible ?? '')
    });
  }

  function cancelEditingReward() {
    setEditingRewardId(null);
    setRewardForm(emptyRewardForm);
    setRewardErrors({});
  }

  async function toggleReward(reward) {
    await runAdminAction(async () => {
      await updateAdminReward(reward.id, { activa: !reward.activa });
      await loadAdminData();
      setAdminMessage('Recompensa actualizada.');
    });
  }

  async function removeReward(rewardId) {
    await runAdminAction(async () => {
      await deleteAdminReward(rewardId);
      await loadAdminData();
      setAdminMessage('Recompensa eliminada.');
    });
  }

  async function changeClaimStatus(claim, estado) {
    await runAdminAction(async () => {
      await updateAdminClaim(claim.id, estado);
      await loadAdminData();
      setAdminMessage(`Canje marcado como ${estado}.`);
    });
  }

  async function runAdminAction(action) {
    setAdminError('');
    setAdminMessage('');

    try {
      await action();
    } catch (error) {
      setAdminError(error.message || 'No se pudo completar la accion.');
    }
  }

  return (
    <View>
      <SectionTitle eyebrow="Administrador" title="Panel de gestion" />

      {summary ? (
        <View style={styles.adminSummaryGrid}>
          <AdminMetric label="Usuarios" value={summary.usuarios} icon="account-group-outline" />
          <AdminMetric label="Ubicaciones" value={summary.centros} icon="map-marker-radius-outline" />
          <AdminMetric label="Premios" value={summary.recompensas} icon="gift-outline" />
          <AdminMetric label="Canjes pendientes" value={summary.canjes_pendientes} icon="clipboard-clock-outline" />
        </View>
      ) : null}

      {isLoadingAdmin ? <AdminNotice icon="timer-sand" text="Cargando informacion administrativa..." /> : null}
      {adminError ? <AdminNotice error icon="alert-circle-outline" text={adminError} /> : null}
      {adminMessage ? <AdminNotice icon="check-circle-outline" text={adminMessage} /> : null}

      <View style={styles.adminSectionTabs}>
        {adminSections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <TouchableOpacity
              key={section.id}
              onPress={() => setActiveSection(section.id)}
              style={[styles.adminSectionButton, isActive && styles.adminSectionButtonActive]}
            >
              <MaterialCommunityIcons color={isActive ? '#FFFFFF' : '#63736A'} name={section.icon} size={20} />
              <Text style={[styles.adminSectionText, isActive && styles.adminSectionTextActive]}>{section.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {activeSection === 'users' ? (
        <View>
          {users.map((user) => (
            <View key={user.id} style={styles.adminCard}>
              {editingUserId === user.id ? (
                <View style={styles.adminEditArea}>
                  <AdminInput error={userErrors.nombre} label="Nombre" value={userForm.nombre} onChangeText={(value) => setUserForm({ ...userForm, nombre: value })} />
                  <AdminInput error={userErrors.email} keyboardType="email-address" label="Correo" value={userForm.email} onChangeText={(value) => setUserForm({ ...userForm, email: value })} />
                  <AdminInput error={userErrors.password} label="Nueva contrasena opcional" value={userForm.password} onChangeText={(value) => setUserForm({ ...userForm, password: value })} />
                  <View style={styles.adminRoleSwitch}>
                    <TouchableOpacity
                      onPress={() => setUserForm({ ...userForm, rol: 'usuario' })}
                      style={[styles.adminRoleOption, userForm.rol === 'usuario' && styles.adminRoleOptionActive]}
                    >
                      <Text style={[styles.adminRoleOptionText, userForm.rol === 'usuario' && styles.adminRoleOptionTextActive]}>
                        Usuario
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setUserForm({ ...userForm, rol: 'admin' })}
                      style={[styles.adminRoleOption, userForm.rol === 'admin' && styles.adminRoleOptionActive]}
                    >
                      <Text style={[styles.adminRoleOptionText, userForm.rol === 'admin' && styles.adminRoleOptionTextActive]}>
                        Admin
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.adminEditActions}>
                    <TouchableOpacity onPress={() => saveUserChanges(user.id)} style={styles.adminSaveButton}>
                      <Text style={styles.adminSaveButtonText}>Guardar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={cancelEditingUser} style={styles.adminCancelButton}>
                      <Text style={styles.adminCancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <>
                  <View style={styles.listBody}>
                    <Text style={styles.listTitle}>{user.nombre}</Text>
                    <Text style={styles.listText}>{user.email}</Text>
                    <View style={styles.adminRoleBadge}>
                      <Text style={styles.adminRoleBadgeText}>Rol actual: {user.rol === 'admin' ? 'Admin' : 'Usuario'}</Text>
                    </View>
                    <Text style={styles.listText}>Puntos: {Number(user.puntos_totales || 0)}</Text>
                  </View>
                  <View style={styles.adminActions}>
                    <TouchableOpacity onPress={() => startEditingUser(user)} style={styles.adminSmallButton}>
                      <Text style={styles.adminSmallButtonText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => changeUserRole(user)} style={styles.adminSmallButton}>
                      <Text style={styles.adminSmallButtonText}>
                        Cambiar a {user.rol === 'admin' ? 'usuario' : 'admin'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => removeUser(user.id)} style={styles.adminDangerButton}>
                      <MaterialCommunityIcons color="#B94A48" name="trash-can-outline" size={18} />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          ))}
        </View>
      ) : null}

      {activeSection === 'centers' ? (
        <View>
          {editingCenterId ? <AdminNotice icon="pencil-outline" text="Editando ubicacion. Modifica los campos y guarda los cambios." /> : null}
          <AdminInput error={centerErrors.nombre} label="Nombre" value={centerForm.nombre} onChangeText={(value) => setCenterForm({ ...centerForm, nombre: value })} />
          <AdminInput error={centerErrors.direccion} label="Direccion" value={centerForm.direccion} onChangeText={(value) => setCenterForm({ ...centerForm, direccion: value })} />
          <View style={styles.adminInputRow}>
            <AdminInput error={centerErrors.latitud} keyboardType="numeric" label="Latitud" value={centerForm.latitud} onChangeText={(value) => setCenterForm({ ...centerForm, latitud: value })} />
            <AdminInput error={centerErrors.longitud} keyboardType="numeric" label="Longitud" value={centerForm.longitud} onChangeText={(value) => setCenterForm({ ...centerForm, longitud: value })} />
          </View>
          <AdminInput error={centerErrors.materiales} label="Materiales separados por coma" value={centerForm.materiales} onChangeText={(value) => setCenterForm({ ...centerForm, materiales: value })} />
          <AdminInput error={centerErrors.horario} label="Horario" value={centerForm.horario} onChangeText={(value) => setCenterForm({ ...centerForm, horario: value })} />
          <TouchableOpacity onPress={saveCenter} style={styles.primaryButton}>
            <MaterialCommunityIcons color="#FFFFFF" name={editingCenterId ? 'content-save-outline' : 'plus-circle-outline'} size={22} />
            <Text style={styles.primaryButtonText}>{editingCenterId ? 'Actualizar ubicacion' : 'Guardar ubicacion'}</Text>
          </TouchableOpacity>
          {editingCenterId ? (
            <TouchableOpacity onPress={cancelEditingCenter} style={styles.adminFormCancelButton}>
              <Text style={styles.adminCancelButtonText}>Cancelar edicion</Text>
            </TouchableOpacity>
          ) : null}

          {centers.map((center) => (
            <View key={center.id} style={styles.adminCard}>
              <View style={styles.listBody}>
                <Text style={styles.listTitle}>{center.nombre}</Text>
                <Text style={styles.listText}>{center.direccion}</Text>
                <Text style={styles.listText}>{center.latitud}, {center.longitud}</Text>
              </View>
              <View style={styles.adminActions}>
                <TouchableOpacity onPress={() => startEditingCenter(center)} style={styles.adminSmallButton}>
                  <Text style={styles.adminSmallButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleCenter(center)} style={styles.adminSmallButton}>
                  <Text style={styles.adminSmallButtonText}>{center.activo ? 'Activo' : 'Inactivo'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeCenter(center.id)} style={styles.adminDangerButton}>
                  <MaterialCommunityIcons color="#B94A48" name="trash-can-outline" size={18} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      {activeSection === 'rewards' ? (
        <View>
          {editingRewardId ? <AdminNotice icon="pencil-outline" text="Editando recompensa. Modifica los campos y guarda los cambios." /> : null}
          <AdminInput error={rewardErrors.nombre} label="Nombre" value={rewardForm.nombre} onChangeText={(value) => setRewardForm({ ...rewardForm, nombre: value })} />
          <AdminInput error={rewardErrors.descripcion} label="Descripcion" value={rewardForm.descripcion} onChangeText={(value) => setRewardForm({ ...rewardForm, descripcion: value })} />
          <View style={styles.adminInputRow}>
            <AdminInput error={rewardErrors.puntos} keyboardType="numeric" label="Puntos" value={rewardForm.puntos} onChangeText={(value) => setRewardForm({ ...rewardForm, puntos: value })} />
            <AdminInput error={rewardErrors.cantidad} keyboardType="numeric" label="Cantidad" value={rewardForm.cantidad} onChangeText={(value) => setRewardForm({ ...rewardForm, cantidad: value })} />
          </View>
          <TouchableOpacity onPress={saveReward} style={styles.primaryButton}>
            <MaterialCommunityIcons color="#FFFFFF" name={editingRewardId ? 'content-save-outline' : 'plus-circle-outline'} size={22} />
            <Text style={styles.primaryButtonText}>{editingRewardId ? 'Actualizar recompensa' : 'Guardar recompensa'}</Text>
          </TouchableOpacity>
          {editingRewardId ? (
            <TouchableOpacity onPress={cancelEditingReward} style={styles.adminFormCancelButton}>
              <Text style={styles.adminCancelButtonText}>Cancelar edicion</Text>
            </TouchableOpacity>
          ) : null}

          {rewards.map((reward) => (
            <View key={reward.id} style={styles.adminCard}>
              <View style={styles.listBody}>
                <Text style={styles.listTitle}>{reward.nombre}</Text>
                <Text style={styles.listText}>{reward.descripcion || 'Sin descripcion'}</Text>
                <Text style={styles.listText}>{reward.puntos_necesarios} pts - Stock: {reward.cantidad_disponible}</Text>
              </View>
              <View style={styles.adminActions}>
                <TouchableOpacity onPress={() => startEditingReward(reward)} style={styles.adminSmallButton}>
                  <Text style={styles.adminSmallButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleReward(reward)} style={styles.adminSmallButton}>
                  <Text style={styles.adminSmallButtonText}>{reward.activa ? 'Activa' : 'Inactiva'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeReward(reward.id)} style={styles.adminDangerButton}>
                  <MaterialCommunityIcons color="#B94A48" name="trash-can-outline" size={18} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      {activeSection === 'claims' ? (
        <View>
          {claims.length === 0 ? (
            <AdminNotice icon="clipboard-text-outline" text="Todavia no hay canjes registrados." />
          ) : null}

          {claims.map((claim) => (
            <View key={claim.id} style={styles.adminCard}>
              <View style={styles.listBody}>
                <Text style={styles.listTitle}>{claim.recompensa?.nombre || 'Recompensa'}</Text>
                <Text style={styles.listText}>Usuario: {claim.usuario?.nombre || 'Sin nombre'}</Text>
                <Text style={styles.listText}>{claim.usuario?.email || 'Sin correo'}</Text>
                <Text style={styles.listText}>{claim.puntos_usados} pts usados</Text>
                <ClaimStatus estado={claim.estado} />
              </View>
              <View style={styles.adminActions}>
                {claim.estado === 'pendiente' ? (
                  <>
                    <TouchableOpacity onPress={() => changeClaimStatus(claim, 'aprobado')} style={styles.adminSmallButton}>
                      <Text style={styles.adminSmallButtonText}>Aprobar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => changeClaimStatus(claim, 'cancelado')} style={styles.adminDangerTextButton}>
                      <Text style={styles.adminDangerTextButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                  </>
                ) : null}
                {claim.estado === 'aprobado' ? (
                  <>
                    <TouchableOpacity onPress={() => changeClaimStatus(claim, 'entregado')} style={styles.adminSmallButton}>
                      <Text style={styles.adminSmallButtonText}>Entregado</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => changeClaimStatus(claim, 'cancelado')} style={styles.adminDangerTextButton}>
                      <Text style={styles.adminDangerTextButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                  </>
                ) : null}
                {claim.estado === 'entregado' || claim.estado === 'cancelado' ? (
                  <MaterialCommunityIcons color="#63736A" name="check-decagram-outline" size={22} />
                ) : null}
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function ClaimStatus({ estado }) {
  const label = {
    pendiente: 'Pendiente',
    aprobado: 'Aprobado',
    entregado: 'Entregado',
    cancelado: 'Cancelado'
  }[estado] || estado;

  return (
    <View style={styles.adminClaimStatus}>
      <Text style={styles.adminClaimStatusText}>Estado: {label}</Text>
    </View>
  );
}

function AdminMetric({ icon, label, value }) {
  return (
    <View style={styles.adminMetricCard}>
      <MaterialCommunityIcons color="#2E7D5B" name={icon} size={22} />
      <Text style={styles.adminMetricValue}>{value}</Text>
      <Text style={styles.adminMetricLabel}>{label}</Text>
    </View>
  );
}

function AdminInput({ error, keyboardType, label, value, onChangeText }) {
  return (
    <View style={styles.adminInputWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        keyboardType={keyboardType || 'default'}
        onChangeText={onChangeText}
        placeholderTextColor="#8A968E"
        style={[styles.adminTextInput, error && styles.adminTextInputError]}
        value={value}
      />
      {error ? <Text style={styles.adminFieldError}>{error}</Text> : null}
    </View>
  );
}

function AdminNotice({ error, icon, text }) {
  return (
    <View style={error ? styles.scanErrorCard : styles.scanSuccessCard}>
      <MaterialCommunityIcons color={error ? '#B94A48' : '#2E7D5B'} name={icon} size={24} />
      <View style={styles.listBody}>
        <Text style={styles.listTitle}>{error ? 'Aviso' : 'Administrador'}</Text>
        <Text style={styles.listText}>{text}</Text>
      </View>
    </View>
  );
}
