import http from '@/axios/index.js';

// noMsg: the /mcp page shows its own inline status instead of the
// global message popups.
export function getMcpKey() {
    return http.get('/mcp/key', { noMsg: true })
}
