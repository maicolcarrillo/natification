<template>
  <div
    class="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-100/60 backdrop-blur-md p-6 space-y-6 md:space-y-0 md:space-x-6">

    <!-- Formulario -->
    <div
      class="w-full max-w-md bg-white shadow-2xl rounded-2xl p-6 space-y-6 border border-orange-200 transition-all duration-300">

      <!-- Selector SHA -->
      <div class="flex justify-center">
        <nav class="flex overflow-x-auto items-center p-1 space-x-1 text-sm text-gray-600 bg-gray-100 rounded-xl">
          <button
            role="tab"
            type="button"
            :class="[
              'flex whitespace-nowrap items-center h-8 px-5 font-medium rounded-lg outline-none transition-all duration-300',
              selectedSHA === 'SHA-1'
                ? 'text-[#FF8000] bg-white shadow focus:ring-2 focus:ring-[#FF8000] focus:ring-inset'
                : 'hover:text-gray-800 focus:text-[#FF8000]'
            ]"
            @click="selectedSHA = 'SHA-1'"
          >
            SHA-1
          </button>

          <button
            role="tab"
            type="button"
            :class="[
              'flex whitespace-nowrap items-center h-8 px-5 font-medium rounded-lg outline-none transition-all duration-300',
              selectedSHA === 'SHA-256'
                ? 'text-[#FF8000] bg-white shadow focus:ring-2 focus:ring-[#FF8000] focus:ring-inset'
                : 'hover:text-gray-800 focus:text-[#FF8000]'
            ]"
            @click="selectedSHA = 'SHA-256'"
          >
            SHA-256
          </button>
        </nav>
      </div>

      <!-- Autenticación -->
      <div>
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Autenticación</h2>
        <div class="space-y-4">
          <div>
            <label for="login" class="block text-sm font-medium text-gray-700 mb-1">Login</label>
            <input
              v-model="login"
              type="text"
              id="login"
              class="py-2 px-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FF8000] focus:border-[#FF8000]"
              placeholder="Ingresa tu login"
            />
          </div>

          <div>
            <label for="secretkey" class="block text-sm font-medium text-gray-700 mb-1">SecretKey</label>
            <input
              v-model="secretKey"
              type="password"
              id="secretkey"
              class="py-2 px-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FF8000] focus:border-[#FF8000]"
              placeholder="Ingresa tu clave secreta"
            />
          </div>
        </div>
      </div>

      <!-- Datos a Notificar -->
      <div>
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Datos a Notificar</h2>
        <div class="space-y-4">
          <div>
            <label for="referencia" class="block text-sm font-medium text-gray-700 mb-1">Referencia</label>
            <input
              v-model="referencia"
              type="text"
              id="referencia"
              class="py-2 px-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FF8000] focus:border-[#FF8000]"
              placeholder="Ej: 12345"
            />
          </div>

          <div>
            <label for="sesion" class="block text-sm font-medium text-gray-700 mb-1">Sesión (RequestId)</label>
            <input
              v-model="sesion"
              type="text"
              id="sesion"
              class="py-2 px-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FF8000] focus:border-[#FF8000]"
              placeholder="ID de sesión"
            />
          </div>

          <div>
            <label for="url" class="block text-sm font-medium text-gray-700 mb-1">URL de Notificación</label>
            <input
              v-model="url"
              type="url"
              id="url"
              class="py-2 px-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FF8000] focus:border-[#FF8000]"
              placeholder="https://tuservidor.com/notificacion"
            />
          </div>

          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              v-model="status"
              id="status"
              class="py-2 px-3 block w-full border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-[#FF8000] focus:border-[#FF8000]"
            >
              <option value="" disabled selected>Seleccione una opción</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECT">Reject</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Botones -->
      <div class="flex flex-wrap gap-3">
        <button
          @click="enviarDatos"
          class="flex-1 bg-[#FF8000] hover:bg-[#e67200] text-white font-medium py-2 px-4 rounded-lg shadow-lg transition-all duration-300"
        >
          Enviar
        </button>

        <button
          @click="autenticar"
          class="flex-1 bg-[#FF8000] hover:bg-[#e67200] text-white font-medium py-2 px-4 rounded-lg shadow-lg transition-all duration-300"
        >
          Generar TranKey
        </button>

        <button
          @click="mostrarConsulta = !mostrarConsulta"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-lg transition-all duration-300"
        >
          Consulta de sesión
        </button>
      </div>

      <!-- Campo dinámico de consulta -->
      <div v-if="mostrarConsulta" class="mt-4 border-t border-gray-200 pt-4 space-y-4">
        <label for="consultaRequest" class="block text-sm font-medium text-gray-700 mb-1">
          Ingresar RequestId que deseas consultar
        </label>
        <input
          v-model="consultaRequestId"
          id="consultaRequest"
          type="text"
          class="py-2 px-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ej: 654321"
        />
      </div>
    </div>

    <!-- JSON Output -->
    <div
      v-if="jsonResultado"
      class="w-full max-w-md bg-white shadow-2xl rounded-2xl p-6 border border-orange-200 transition-all duration-300 relative"
    >
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Resultado JSON</h3>

      <pre
        class="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm text-gray-700 border border-gray-200 whitespace-pre-wrap"
      >
{{ jsonResultado }}
      </pre>

      <button
        @click="copiarJSON"
        class="absolute top-4 right-4 bg-[#FF8000] hover:bg-[#e67200] text-white text-sm px-3 py-1 rounded-md shadow transition"
      >
        Copiar
      </button>

      <div v-if="respuestaServidor && mostrarRespuesta" class="mt-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Respuesta del Servidor</h3>
        <pre
          class="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm text-gray-700 border border-gray-200 whitespace-pre-wrap"
        >
{{ respuestaServidor }}
        </pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import moment from 'moment'
import CryptoJS from 'crypto-js'

const selectedSHA = ref('SHA-1')
const login = ref('')
const secretKey = ref('')
const referencia = ref('')
const sesion = ref('')
const url = ref('')
const status = ref('')
const jsonResultado = ref(null)
const respuestaServidor = ref(null)
const tranKey = ref('')
const mostrarRespuesta = ref(false)
const mostrarConsulta = ref(false)
const consultaRequestId = ref('')

// === FUNCIÓN PARA GENERAR TRANKEY ===
function autenticar() {
  if (!login.value || !secretKey.value) {
    alert('Por favor ingresa login y SecretKey primero.')
    return
  }

  const nonce = Math.random().toString(36).substring(2)
  const seed = moment().format()
  const hash = CryptoJS.SHA256(nonce + seed + secretKey.value)
  tranKey.value = hash.toString(CryptoJS.enc.Base64)

  const auth = { login: login.value, tranKey: tranKey.value, nonce: btoa(nonce), seed }
  jsonResultado.value = JSON.stringify(auth, null, 2)
  mostrarRespuesta.value = false
}

// === FUNCIÓN PARA ENVIAR DATOS ===
async function enviarDatos() {
  if (!url.value) {
    alert('Por favor ingresa la URL de notificación.')
    return
  }

  mostrarRespuesta.value = true
  const date = new Date().toISOString()
  let firma =
    selectedSHA.value === 'SHA-1'
      ? CryptoJS.SHA1(sesion.value + status.value + date + secretKey.value).toString(CryptoJS.enc.Hex)
      : CryptoJS.SHA256(sesion.value + status.value + date + secretKey.value).toString(CryptoJS.enc.Hex)

  const data = {
    status: {
      status: (status.value || 'APPROVED').toUpperCase(),
      reason: status.value === 'REJECT' ? '99' : '00',
      message: status.value === 'REJECT' ? 'Transacción rechazada' : 'Transacción aprobada',
      date
    },
    requestId: sesion.value || '0000',
    reference: referencia.value || 'TEST_' + Math.floor(Math.random() * 100000),
    signature: firma
  }

  jsonResultado.value = JSON.stringify(data, null, 2)
  respuestaServidor.value = '⏳ Enviando notificación...'

  try {
    const workerUrl = `https://cold-tooth-8a32.maicolpruebas4.workers.dev/?url=${encodeURIComponent(url.value)}`
    const response = await fetch(workerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    const contentType = response.headers.get('content-type')
    let respuesta

    if (contentType && contentType.includes('application/json')) {
      respuesta = await response.json()
      respuestaServidor.value = JSON.stringify(respuesta, null, 2)
    } else {
      const text = await response.text()
      respuestaServidor.value = text?.trim() || '(Sin contenido de respuesta)'
    }
  } catch (error) {
    respuestaServidor.value = `❌ Error al enviar notificación: ${error.message}`
  }
}

// === COPIAR JSON ===
async function copiarJSON() {
  if (jsonResultado.value) {
    await navigator.clipboard.writeText(jsonResultado.value)
    alert('JSON copiado al portapapeles 📋')
  }
}
</script>
