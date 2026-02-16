# 📱 Guía para Frontend de la App - Consumir Endpoints

## 🔧 Configuración Inicial

### 1. Crear archivo `.env` en la raíz de tu proyecto Expo:

```env
EXPO_PUBLIC_API_URL=http://TU_IP_LOCAL:3003/api/scan
```

**Ejemplo:**
```env
EXPO_PUBLIC_API_URL=http://192.168.1.105:3003/api/scan
```

### 2. Instalar dependencias necesarias:

```bash
npx expo install expo-barcode-scanner
```

---

## 📡 Funciones para Consumir los Endpoints

### Crear archivo `api/scanService.ts`:

```typescript
const API_URL = process.env.EXPO_PUBLIC_API_URL;

// 1. Validar QR antes de escanear
export const validateQR = async (qrCode: string, mode: 'entrada' | 'entrega' | 'completo') => {
  try {
    const response = await fetch(`${API_URL}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        qr_code: qrCode,
        mode: mode
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error validating QR:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'No se pudo conectar con el servidor'
      }
    };
  }
};

// 2. Registrar entrada
export const registrarEntrada = async (qrCode: string) => {
  try {
    const response = await fetch(`${API_URL}/entrada`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        qr_code: qrCode,
        scanned_at: new Date().toISOString(),
        device_id: 'device-123' // Opcional
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error registering entrada:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'No se pudo conectar con el servidor'
      }
    };
  }
};

// 3. Registrar entrega de pasaporte
export const registrarEntrega = async (qrCode: string) => {
  try {
    const response = await fetch(`${API_URL}/entrega`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        qr_code: qrCode,
        scanned_at: new Date().toISOString(),
        device_id: 'device-123'
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error registering entrega:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'No se pudo conectar con el servidor'
      }
    };
  }
};

// 4. Registrar pasaporte completo
export const registrarCompleto = async (qrCode: string) => {
  try {
    const response = await fetch(`${API_URL}/completo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        qr_code: qrCode,
        scanned_at: new Date().toISOString(),
        device_id: 'device-123'
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error registering completo:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'No se pudo conectar con el servidor'
      }
    };
  }
};

// 5. Obtener historial
export const getHistory = async (mode?: string, limit: number = 50) => {
  try {
    const params = new URLSearchParams();
    if (mode) params.append('mode', mode);
    params.append('limit', limit.toString());

    const response = await fetch(`${API_URL}/history?${params.toString()}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching history:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'No se pudo conectar con el servidor'
      }
    };
  }
};

// 6. Obtener estadísticas
export const getStats = async () => {
  try {
    const response = await fetch(`${API_URL}/stats`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'No se pudo conectar con el servidor'
      }
    };
  }
};
```

---

## 🎯 Ejemplo de Uso en Componentes

### Componente de Escaneo - `screens/ScannerScreen.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { validateQR, registrarEntrada } from '../api/scanService';

export default function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [mode, setMode] = useState<'entrada' | 'entrega' | 'completo'>('entrada');

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getPermissions();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    
    // 1. Primero validar el QR
    const validation = await validateQR(data, mode);
    
    if (!validation.success) {
      Alert.alert('Error', validation.error.message);
      setScanned(false);
      return;
    }

    // 2. Mostrar información del participante
    const participant = validation.data;
    
    Alert.alert(
      '✅ Participante Encontrado',
      `Nombre: ${participant.name}\n` +
      `Email: ${participant.email}\n` +
      `Estado Entrada: ${participant.status.entrada ? '✅' : '❌'}\n` +
      `Estado Entrega: ${participant.status.entrega ? '✅' : '❌'}\n` +
      `Estado Completo: ${participant.status.completo ? '✅' : '❌'}\n\n` +
      `${participant.message}`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => setScanned(false)
        },
        {
          text: participant.can_scan ? 'Registrar' : 'OK',
          onPress: async () => {
            if (participant.can_scan) {
              await handleScan(data);
            }
            setScanned(false);
          }
        }
      ]
    );
  };

  const handleScan = async (qrCode: string) => {
    let result;
    
    // Registrar según el modo seleccionado
    if (mode === 'entrada') {
      result = await registrarEntrada(qrCode);
    } else if (mode === 'entrega') {
      result = await registrarEntrega(qrCode);
    } else {
      result = await registrarCompleto(qrCode);
    }

    if (result.success) {
      Alert.alert(
        '✅ Éxito',
        result.data.message + '\n\n' +
        `Participante: ${result.data.name}\n` +
        `Hora: ${new Date(result.data.timestamp).toLocaleString()}`
      );
    } else {
      Alert.alert('❌ Error', result.error.message);
    }
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso de cámara...</Text>;
  }

  if (hasPermission === false) {
    return <Text>Sin acceso a la cámara</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Selector de modo */}
      <View style={styles.modeSelector}>
        <Button
          title="Entrada"
          onPress={() => setMode('entrada')}
          color={mode === 'entrada' ? '#4CAF50' : '#ccc'}
        />
        <Button
          title="Entrega"
          onPress={() => setMode('entrega')}
          color={mode === 'entrega' ? '#2196F3' : '#ccc'}
        />
        <Button
          title="Completo"
          onPress={() => setMode('completo')}
          color={mode === 'completo' ? '#FF9800' : '#ccc'}
        />
      </View>

      {/* Escáner */}
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.scanner}
      />

      {/* Botón para escanear de nuevo */}
      {scanned && (
        <Button
          title="Escanear de nuevo"
          onPress={() => setScanned(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
  },
  scanner: {
    flex: 1,
  },
});
```

---

## 📊 Componente de Estadísticas - `screens/StatsScreen.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { getStats } from '../api/scanService';

export default function StatsScreen() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    const result = await getStats();
    if (result.success) {
      setStats(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return <Text>Cargando estadísticas...</Text>;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadStats} />
      }
    >
      <Text style={styles.title}>📊 Estadísticas del Evento</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total de Escaneos</Text>
        <Text style={styles.cardValue}>{stats?.total_scans || 0}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Por Modo</Text>
        <Text>🚪 Entradas: {stats?.by_mode.entrada || 0}</Text>
        <Text>📋 Entregas: {stats?.by_mode.entrega || 0}</Text>
        <Text>✅ Completos: {stats?.by_mode.completo || 0}</Text>
      </View>

      <Text style={styles.lastUpdate}>
        Última actualización: {new Date(stats?.last_updated).toLocaleString()}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  lastUpdate: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});
```

---

## 🔄 Flujo Completo de Uso:

### 1. Usuario escanea QR
```typescript
const { data } = scannedQR; // "clxxx123456789"
```

### 2. Validar QR
```typescript
const validation = await validateQR(data, 'entrada');
// Retorna: nombre, email, estado actual, si puede escanear
```

### 3. Mostrar info al usuario
```typescript
Alert.alert('Participante', validation.data.name);
```

### 4. Registrar escaneo
```typescript
const result = await registrarEntrada(data);
// Retorna: confirmación, timestamp, mensaje
```

---

## ✅ Checklist para tu Frontend:

- [ ] Crear archivo `.env` con tu IP local
- [ ] Crear carpeta `api/` con `scanService.ts`
- [ ] Instalar `expo-barcode-scanner`
- [ ] Crear componente `ScannerScreen`
- [ ] Crear componente `StatsScreen` (opcional)
- [ ] Probar conexión con el backend
- [ ] Probar escaneo de QR

---

## 🧪 Probar Conexión:

Agrega esto en tu App.tsx para probar:

```typescript
import { useEffect } from 'react';
import { getStats } from './api/scanService';

useEffect(() => {
  const testConnection = async () => {
    const result = await getStats();
    console.log('Conexión con backend:', result.success ? '✅' : '❌');
  };
  testConnection();
}, []);
```

---

## 📝 Resumen de Endpoints:

| Función | Endpoint | Uso |
|---------|----------|-----|
| `validateQR()` | `POST /validate` | Validar antes de escanear |
| `registrarEntrada()` | `POST /entrada` | Registrar entrada |
| `registrarEntrega()` | `POST /entrega` | Entregar pasaporte |
| `registrarCompleto()` | `POST /completo` | Marcar completo |
| `getHistory()` | `GET /history` | Ver historial |
| `getStats()` | `GET /stats` | Ver estadísticas |

---

¿Necesitas ayuda con alguna parte específica del código?
