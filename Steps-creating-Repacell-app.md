# 📱 Repacell App - Diario de Desarrollo

## 1. Configuración del Entorno y Orquestación de IA
Para garantizar un flujo de desarrollo rápido, robusto y estructurado, el proyecto se inicializó configurando un entorno de trabajo avanzado en **OpenCode**. Se diseñó un sistema compuesto por tres agentes especializados para dividir las cargas cognitivas y mantener la calidad del código:

*   **Lead Architect:** Configurado bajo la estricta filosofía **YAGNI** (You Aren't Gonna Need It) y el principio del "Lazy Senior Dev", basado en las directrices del repositorio [Ponytail](https://github.com/DietrichGebert/ponytail/). Su función principal es auditar cada decisión técnica, evitar la sobre-ingeniería, priorizar el uso de herramientas nativas y mantener la complejidad al mínimo.
*   **Frontend & Backend Experts:** Agentes especialistas delegados para ejecutar la arquitectura, enfocándose en las mejores prácticas de sus respectivos ecosistemas.

### Memoria Persistente e Integración de Contexto
Uno de los mayores desafíos al desarrollar con LLMs es la pérdida de contexto. Para resolver esto, se implementó [Engram](https://github.com/Gentleman-Programming/engram), conectado a OpenCode a través del protocolo **MCP** (Model Context Protocol). Esto permitió crear una "compactación" persistente de la estructura del proyecto y la base de datos, garantizando que los agentes mantengan un historial coherente de las decisiones arquitectónicas a lo largo de todo el ciclo de vida del desarrollo.

## 2. Definición del Stack y Creación del Proyecto
Las tecnologías se seleccionaron priorizando la velocidad de entrega y la mantenibilidad de la aplicación, requisitos fundamentales del MVP:

*   **Framework:** Next.js (App Router) para manejar tanto la UI como las rutas de API de forma centralizada.
*   **Backend as a Service (BaaS):** Supabase (PostgreSQL + Auth + Storage), eliminando la necesidad de gestionar infraestructura compleja desde cero.

Con el entorno de IA y el modelo mental ya definidos, el desarrollo técnico arrancó de forma oficial con la generación del esqueleto base del proyecto mediante el CLI de Next.js:

```bash
npx create-next-app@latest my-app --yes
```
verificamos que 
```
npm run dev
``` funcione y continuamos... 

Conectamos nuestro sistema de supabase via api key y con la url , y lo metemos en un .env.local 

luego creo la base de datos esperada ! 

