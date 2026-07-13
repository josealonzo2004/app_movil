import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { loginUser, registerUser } from '../services/authService';
import { styles } from '../styles/appStyles';
import { isValidEmail } from '../utils/validators';

export default function LoginScreen({ onLogin }) {
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirm, setRegisterConfirm] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    if (!isValidEmail(email.trim()) || password.length < 4) {
      setLoginError('Ingresa un correo valido y una clave de al menos 4 caracteres.');
      return;
    }

    setLoginError('');
    setIsSubmitting(true);

    try {
      const session = await loginUser(email.trim(), password);
      onLogin(session);
    } catch (error) {
      setLoginError(error.message || 'No se pudo iniciar sesion.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRegisterPreview() {
    if (registerName.trim().length < 3) {
      setRegisterError('El nombre debe tener al menos 3 caracteres.');
      setRegisterSuccess('');
      return;
    }

    if (!isValidEmail(registerEmail.trim())) {
      setRegisterError('Ingresa un correo valido para el registro.');
      setRegisterSuccess('');
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterError('La contrasena debe tener al menos 6 caracteres.');
      setRegisterSuccess('');
      return;
    }

    if (registerPassword !== registerConfirm) {
      setRegisterError('Las contrasenas no coinciden.');
      setRegisterSuccess('');
      return;
    }

    setRegisterError('');
    setRegisterSuccess('');
    setIsSubmitting(true);

    try {
      const session = await registerUser({
        name: registerName.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
        passwordConfirmation: registerConfirm
      });
      setRegisterSuccess('Usuario registrado correctamente.');
      onLogin(session);
    } catch (error) {
      setRegisterError(error.message || 'No se pudo registrar el usuario.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.loginSafeArea}>
      <StatusBar backgroundColor="#102019" style="light" translucent={false} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.loginKeyboard}
      >
        <ScrollView
          contentContainerStyle={styles.loginContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.loginHero}>
            <View style={styles.loginBadge}>
              <MaterialCommunityIcons color="#FFFFFF" name="recycle" size={44} />
            </View>
            <Text style={styles.loginBrand}>EcoSmart</Text>
            <Text style={styles.loginSubtitle}>Sistema de reciclaje inteligente</Text>
          </View>

          <View style={styles.loginCard}>
            <View style={styles.authSwitch}>
              <TouchableOpacity
                onPress={() => setAuthMode('login')}
                style={[styles.authSwitchButton, authMode === 'login' && styles.authSwitchButtonActive]}
              >
                <Text style={[styles.authSwitchText, authMode === 'login' && styles.authSwitchTextActive]}>
                  Ingresar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAuthMode('register')}
                style={[styles.authSwitchButton, authMode === 'register' && styles.authSwitchButtonActive]}
              >
                <Text style={[styles.authSwitchText, authMode === 'register' && styles.authSwitchTextActive]}>
                  Registrarse
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.loginTitle}>{authMode === 'login' ? 'Iniciar sesion' : 'Crear cuenta'}</Text>
            <Text style={styles.loginText}>
              {authMode === 'login'
                ? 'Accede para registrar tus reciclajes, acumular puntos y consultar puntos verdes.'
                : 'Completa tus datos para validar el formulario. La cuenta aun no se guarda.'}
            </Text>

            {authMode === 'login' ? (
              <View>
                <Text style={styles.fieldLabel}>Correo</Text>
                <View style={styles.loginInputWrap}>
                  <MaterialCommunityIcons color="#63736A" name="email-outline" size={22} />
                  <TextInput
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    placeholder="estudiante@correo.com"
                    placeholderTextColor="#8A968E"
                    style={styles.loginInput}
                    value={email}
                  />
                </View>

                <Text style={styles.fieldLabel}>Contrasena</Text>
                <View style={styles.loginInputWrap}>
                  <MaterialCommunityIcons color="#63736A" name="lock-outline" size={22} />
                  <TextInput
                    onChangeText={setPassword}
                    placeholder="Minimo 4 caracteres"
                    placeholderTextColor="#8A968E"
                    secureTextEntry
                    style={styles.loginInput}
                    value={password}
                  />
                </View>

                {loginError ? <Text style={styles.loginError}>{loginError}</Text> : null}

                <TouchableOpacity
                  disabled={isSubmitting}
                  onPress={handleLogin}
                  style={[styles.loginButton, isSubmitting && styles.loginButtonDisabled]}
                >
                  <Text style={styles.loginButtonText}>{isSubmitting ? 'Ingresando...' : 'Ingresar'}</Text>
                  <MaterialCommunityIcons color="#FFFFFF" name={isSubmitting ? 'timer-sand' : 'arrow-right'} size={22} />
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={styles.fieldLabel}>Nombre completo</Text>
                <View style={styles.loginInputWrap}>
                  <MaterialCommunityIcons color="#63736A" name="account-outline" size={22} />
                  <TextInput
                    onChangeText={setRegisterName}
                    placeholder="Ej. Jose Alvarez"
                    placeholderTextColor="#8A968E"
                    style={styles.loginInput}
                    value={registerName}
                  />
                </View>

                <Text style={styles.fieldLabel}>Correo</Text>
                <View style={styles.loginInputWrap}>
                  <MaterialCommunityIcons color="#63736A" name="email-outline" size={22} />
                  <TextInput
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onChangeText={setRegisterEmail}
                    placeholder="nuevo@correo.com"
                    placeholderTextColor="#8A968E"
                    style={styles.loginInput}
                    value={registerEmail}
                  />
                </View>

                <Text style={styles.fieldLabel}>Contrasena</Text>
                <View style={styles.loginInputWrap}>
                  <MaterialCommunityIcons color="#63736A" name="lock-outline" size={22} />
                  <TextInput
                    onChangeText={setRegisterPassword}
                    placeholder="Minimo 6 caracteres"
                    placeholderTextColor="#8A968E"
                    secureTextEntry
                    style={styles.loginInput}
                    value={registerPassword}
                  />
                </View>

                <Text style={styles.fieldLabel}>Confirmar contrasena</Text>
                <View style={styles.loginInputWrap}>
                  <MaterialCommunityIcons color="#63736A" name="lock-check-outline" size={22} />
                  <TextInput
                    onChangeText={setRegisterConfirm}
                    placeholder="Repite tu contrasena"
                    placeholderTextColor="#8A968E"
                    secureTextEntry
                    style={styles.loginInput}
                    value={registerConfirm}
                  />
                </View>

                {registerError ? <Text style={styles.loginError}>{registerError}</Text> : null}
                {registerSuccess ? <Text style={styles.registerSuccess}>{registerSuccess}</Text> : null}

                <TouchableOpacity
                  disabled={isSubmitting}
                  onPress={handleRegisterPreview}
                  style={[styles.loginButton, isSubmitting && styles.loginButtonDisabled]}
                >
                  <Text style={styles.loginButtonText}>
                    {isSubmitting ? 'Registrando...' : 'Crear cuenta'}
                  </Text>
                  <MaterialCommunityIcons
                    color="#FFFFFF"
                    name={isSubmitting ? 'timer-sand' : 'check-circle-outline'}
                    size={22}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
