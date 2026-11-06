import { defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import os from 'os'

// 全自动脱壳网关侦测器：规避虚拟网卡，锁定主机核心 IP
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    if (name.toLowerCase().includes('vmware') || name.toLowerCase().includes('virtual') || name.toLowerCase().includes('mihomo')) continue;
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

function normalizeApiBase(apiBase) {
  return apiBase ? apiBase.replace(/\/+$/, '') : ''
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const devFallbackApiBase = `http://${getLocalIP()}:8080/api`
  const buildFallbackApiBase = 'http://localhost:8080/api'
  const apiBase =
    normalizeApiBase(env.VITE_API_BASE) ||
    (command === 'serve' ? devFallbackApiBase : buildFallbackApiBase)

  return {
    define: {
      '__API_BASE__': JSON.stringify(apiBase)
    },
    plugins: [
      uni(),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`
        }
      }
    }
  }
})
