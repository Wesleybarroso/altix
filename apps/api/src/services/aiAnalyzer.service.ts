export interface IncidentAnalysis {
  incidentId: string;
  rootCause: string;
  impactSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  suggestedAction: string;
  aiConfidenceScore: number;
}

export function analyzeIncidentWithAI(incident: {
  id: string;
  monitorName: string;
  protocol: string;
  statusCode?: number;
  errorMessage?: string;
  latencyMs?: number;
}): IncidentAnalysis {
  const err = (incident.errorMessage || '').toLowerCase();
  
  if (err.includes('ssl') || err.includes('certificate') || err.includes('notafter')) {
    return {
      incidentId: incident.id,
      rootCause: `O certificado SSL/TLS do serviço ${incident.monitorName} expirou ou possui uma cadeia de confiança inválida.`,
      impactSeverity: 'CRITICAL',
      suggestedAction: 'Renove o certificado TLS via Let\'s Encrypt / Certbot ou atualize a chave no seu provedor CDN/Proxy.',
      aiConfidenceScore: 0.98,
    };
  }

  if (err.includes('dns') || err.includes('lookup') || err.includes('getaddrinfo')) {
    return {
      incidentId: incident.id,
      rootCause: `Falha na resolução de nomes DNS para o host de ${incident.monitorName}.`,
      impactSeverity: 'HIGH',
      suggestedAction: 'Verifique a propagação dos registros A/AAAA no Cloudflare/Route53 ou cheque o vencimento do domínio.',
      aiConfidenceScore: 0.94,
    };
  }

  if (incident.statusCode === 502 || incident.statusCode === 503 || incident.statusCode === 504) {
    return {
      incidentId: incident.id,
      rootCause: `O servidor proxy/load balancer retornou o código HTTP ${incident.statusCode} (Upstream Error).`,
      impactSeverity: 'CRITICAL',
      suggestedAction: 'Verifique a execução dos processos da sua aplicação backend, Nginx ou pods Kubernetes.',
      aiConfidenceScore: 0.96,
    };
  }

  return {
    incidentId: incident.id,
    rootCause: `Queda de conectividade detectada no monitor ${incident.monitorName}. Latência reportada: ${incident.latencyMs || 0}ms.`,
    impactSeverity: 'MEDIUM',
    suggestedAction: 'Inspecione os logs de rede do servidor e a utilização de CPU/Memória da instância.',
    aiConfidenceScore: 0.89,
  };
}
