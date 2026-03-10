# 📡 Módulo Service Bus - iFraseg Engine

Este módulo permite enviar dados de tags para o Azure Service Bus através do backend NestJS.

## 🔧 Configuração

### Endpoint do Service Bus
- **Namespace**: `ingesttagsmart.servicebus.windows.net`
- **Fila**: `tags_ingest`
- **SharedAccessKeyName**: `sendData`
- **SharedAccessKey**: configurar apenas via variável de ambiente

## 🚀 Como Usar

### 1. Iniciar o Servidor
```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run start:prod
```

### 2. Testar Conectividade
```bash
curl http://localhost:30100/service-bus/test
```

### 3. Enviar Dados de Teste
```bash
curl -X POST http://localhost:30100/service-bus/test
```

### 4. Enviar Tag Específica
```bash
curl -X POST http://localhost:30100/service-bus/enviar-tag \
  -H "Content-Type: application/json" \
  -d '{
    "tagId": "TAG_001",
    "location": {
      "latitude": -23.5505,
      "longitude": -46.6333
    },
    "sensorData": {
      "temperature": 25.5,
      "humidity": 60.2,
      "batteryLevel": 85
    }
  }'
```

### 5. Enviar Múltiplas Tags
```bash
curl -X POST http://localhost:30100/service-bus/enviar-multiplas-tags \
  -H "Content-Type: application/json" \
  -d '{
    "tags": [
      {
        "tagId": "TAG_001",
        "location": {"latitude": -23.5505, "longitude": -46.6333},
        "sensorData": {"temperature": 25.0, "humidity": 60.0, "batteryLevel": 90}
      },
      {
        "tagId": "TAG_002",
        "location": {"latitude": -23.5510, "longitude": -46.6340},
        "sensorData": {"temperature": 26.0, "humidity": 58.0, "batteryLevel": 75}
      }
    ]
  }'
```

## 📊 Estrutura da Mensagem

```typescript
interface TagData {
  tagId: string;                    // ID único da tag
  timestamp?: string;               // Timestamp (opcional, usa atual se não informado)
  location?: {                      // Localização (opcional)
    latitude: number;
    longitude: number;
  };
  sensorData?: {                    // Dados do sensor (opcional)
    temperature: number;
    humidity: number;
    batteryLevel: number;
  };
  metadata?: Record<string, any>;   // Metadados adicionais (opcional)
}
```

## 🔗 Endpoints Disponíveis

### GET `/service-bus/test`
Testa a conectividade com o Azure Service Bus.

**Resposta:**
```json
{
  "success": true,
  "message": "Conectividade com Service Bus OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### POST `/service-bus/test`
Envia dados de teste para o Service Bus.

**Resposta:**
```json
{
  "success": true,
  "message": "Dados de teste enviados com sucesso",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### POST `/service-bus/enviar-tag`
Envia dados de uma tag específica.

**Body:**
```json
{
  "tagId": "TAG_001",
  "location": {
    "latitude": -23.5505,
    "longitude": -46.6333
  },
  "sensorData": {
    "temperature": 25.5,
    "humidity": 60.2,
    "batteryLevel": 85
  },
  "metadata": {
    "origem": "sensor-iot",
    "prioridade": "alta"
  }
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Dados da tag TAG_001 enviados com sucesso",
  "tagId": "TAG_001",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### POST `/service-bus/enviar-multiplas-tags`
Envia dados de múltiplas tags.

**Body:**
```json
{
  "tags": [
    {
      "tagId": "TAG_001",
      "location": {"latitude": -23.5505, "longitude": -46.6333},
      "sensorData": {"temperature": 25.0, "humidity": 60.0, "batteryLevel": 90}
    },
    {
      "tagId": "TAG_002",
      "location": {"latitude": -23.5510, "longitude": -46.6340},
      "sensorData": {"temperature": 26.0, "humidity": 58.0, "batteryLevel": 75}
    }
  ]
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Enviadas 2 tags com sucesso, 0 falharam",
  "total": 2,
  "sucessos": 2,
  "falhas": 0,
  "resultados": [
    {"tagId": "TAG_001", "success": true},
    {"tagId": "TAG_002", "success": true}
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🧪 Testando

### Script de Teste Automatizado
```bash
node scripts/test-service-bus.js
```

Este script testa todos os endpoints automaticamente.

### Teste Manual com curl
```bash
# Teste de conectividade
curl http://localhost:30100/service-bus/test

# Envio de dados de teste
curl -X POST http://localhost:30100/service-bus/test
```

## 🔒 Segurança

⚠️ **IMPORTANTE**: Nunca deixe credenciais hardcoded no código. Use variáveis de ambiente em qualquer ambiente:

1. Use variáveis de ambiente:
```typescript
private readonly connectionString = process.env.SERVICEBUS_CONNECTION_STRING;
```

2. Configure no arquivo `.env`:
```env
SERVICEBUS_CONNECTION_STRING=Endpoint=sb://ingesttagsmart.servicebus.windows.net/;SharedAccessKeyName=sendData;SharedAccessKey=xxx;EntityPath=tags_ingest
```

## 🔄 Integração com Frontend

### Serviço Angular
```typescript
// tag-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TagDataService {
  constructor(private http: HttpClient) {}

  enviarDadosTag(dados: any) {
    return this.http.post('/service-bus/enviar-tag', dados);
  }

  enviarMultiplasTags(tags: any[]) {
    return this.http.post('/service-bus/enviar-multiplas-tags', { tags });
  }

  testarConectividade() {
    return this.http.get('/service-bus/test');
  }
}
```

## 🐛 Troubleshooting

### Erro de Conexão
- Verifique se o servidor está rodando
- Confirme se a connection string está correta
- Teste a conectividade de rede

### Erro de Autenticação
- Verifique as credenciais do Service Bus
- Confirme se a chave não expirou

### Erro de Fila
- Confirme se a fila `tags_ingest` existe
- Verifique se há espaço suficiente na fila

## 📝 Logs

O módulo inclui logs detalhados:
- ✅ Sucesso: Mensagem enviada
- ❌ Erro: Detalhes do erro
- 📤 Status: Progresso do envio

Os logs aparecem no console do servidor NestJS.

## 📞 Suporte

Em caso de problemas:
1. Verifique os logs do servidor
2. Teste a conectividade com o endpoint `/service-bus/test`
3. Confirme as credenciais do Service Bus
4. Consulte a documentação do Azure Service Bus
