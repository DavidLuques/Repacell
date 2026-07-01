# 📱 Repacell App - Repair Management System

Bienvenido al repositorio de **Repacell App**,Un proyecto generado para gestionar turno de reparaciones de celularesy documentarlos.

## 🎯 ¿De qué trata el proyecto?
**Repacell** es un sistema web completo ("End-to-End") diseñado para la gestión eficiente de un taller de reparación de dispositivos móviles. El sistema soluciona el problema de la trazabilidad en las reparaciones, permitiendo:
1. **Recepción (Ingreso)**: Registro de clientes, dispositivos dañados, fallas reportadas y asignación de turnos para reparaciones.
2. **Taller (Bitácora Técnica)**: Un panel donde los técnicos pueden actualizar el estado de la reparación (En fila, En reparación, Listo, Entregado), añadir notas técnicas, detallar costos y subir evidencia fotográfica del dispositivo.
3. **Gestión Administrativa**: Panel de administración para dar de alta o eliminar usuarios/técnicos del sistema.

El objetivo fue crear una aplicación altamente funcional, de gran fidelidad visual (UI/UX tecnológica con Glassmorphism) y robusta, priorizando la calidad sobre la cantidad de funcionalidades.

---

## 🏗️ Tecnologías y Arquitectura

Para garantizar un desarrollo ágil, moderno y de alta calidad, se eligió el siguiente Stack:

- **Frontend & Framework**: [Next.js 16 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/).
  - *¿Por qué?* Permite utilizar **Server Components** y **Server Actions**, reduciendo drásticamente el JavaScript enviado al cliente, mejorando la seguridad (las llamadas a la DB ocurren en el backend integrado) y simplificando el ruteo.
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/).
  - *¿Por qué?* Flexibilidad absoluta para construir un sistema de diseño consistente (Tema Oscuro/Cyberpunk) de forma muy rápida y adaptable (100% Responsive).
- **Backend as a Service (BaaS)**: [Supabase](https://supabase.com/).
  - *¿Por qué?* Proporciona de caja PostgreSQL (Base de datos), Autenticación y Storage (para las fotos). Elimina la necesidad de construir infraestructura desde cero, permitiendo centrarse en la lógica de negocio.
- **Validación de Datos**: [Zod](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/).
- **Testing**: [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/).

### Diagrama de Arquitectura
```mermaid
graph TD
    Client[Cliente Web / Browser] -->|Next.js App Router| UI[Interfaz de Usuario React]
    UI -->|Server Actions| NextServer[Next.js Backend Node]
    NextServer -->|Supabase SDK| DB[(PostgreSQL Supabase)]
    NextServer -->|Supabase Auth| Auth[Autenticación]
    UI -->|Upload Directo| Storage[Supabase Storage]
    
    subgraph Testing y CI
        Git[GitHub Push] --> CI[GitHub Actions]
        CI --> Lint[ESLint]
        CI --> Build[Next Build]
        CI --> Jest[Tests Unitarios]
    \end
```

---

## 🤖 Uso de Inteligencia Artificial (Orquestación)

Para comenzar este proyecto lo que hice fue elegir opencode como orquestador de Agentes, y cree agentes de la siguiente manera:
**Agentes:**
1. **Architect y Filosofía YAGNI**: Se instruyó a la IA (OpenCode / Modelos LLM avanzados) para adoptar el rol de *Lead Architect* basándose en la filosofía de mantener la complejidad al mínimo (YAGNI). el repositorio de este agente es https://github.com/DietrichGebert/ponytail/ lo utilize veces anteriores y me funciono bien para no tener una sobreingenieria, ademas lo segui personalizando con instrucciones de prompt para que se adaptara a mi estilo de programacion.
2. **Backend**: El agente que utilice para el backend el cual no crea codigo repetitivo, es especialista en las tecnologias descritas
3. **Front-end**: Este agente es especialista en front-end y se encarga de la interfaz de usuario, ademas no modificara codigo backend que pudiera haber creado el otro agente.

**Memoria Persistente (MCP + Engram)**
Descubri que un consumo excesivo de tokens se producia con los tokens de input y output, para solucionarlo implemente una memoria persistente 
https://github.com/Gentleman-Programming/engram para que al agotar el contexto, la compactacion no fuera solamente por parte de la IA sino se persistiera en una memoria de ENGRAM, asi obtendria una compactacion propia y podria seguir trabajando con la IA sin perder el contexto del proyecto.

Mi flujo de trabajo fue el de utilizar el modo planificador en opencode, el cual me genero un plan de accion, discutimos sobre arquitectura y teniendo el plan de accion seguimos con la implementacion, el agente arquitecto de la IA hacia revisiones de los cambios realizados por los agentes de front-end y back-end para asegurar que la arquitectura se mantuviera consistente.
mi concepto de utilizar la IA para acelerar el proyecto fue bajo la filosofia de HOL (Human on the Loop).
pasado desde el modo plan pase al Build y comenze con el agente @backend para crear el proyecto , por mi parte estuve configurando la base de datos supabase. 
Utiliza la IA para modelar la base de datos y crear las querys aunque podria hacerla manualmente con DER y decidiendo, la IA podria optimizar el tiempo asi que me limite a configurar BAAS de supabase y correr las querys posterior a su modificacion.


**Conclusión del uso de IA**: Aceleró el desarrollopermitiendo tener Auth, Base de Datos, Storage, UI Responsiva y CI/CD completo en menos de 7 días. El diferencial estuvo en **guiar** a la IA, no en obedecerla.
ademas de pedir que me explique el codigo generado para entender lo que hacia , exigirle los tests que omitio, ademas en el CI no se verificaba para que github actions corriera los tests asi que tuve que agregar esa modificacion ya que en modificaciones posteriores podrian romper la aplicacion y eso debe ser controlado.

---

## 🚀 Cómo instalar y correr localmente

### 1. Requisitos previos
- Node.js (versión 20 o superior).
- Git.
- Una cuenta gratuita en [Supabase](https://supabase.com/).

### 2. Clonar el repositorio
```bash
git clone https://github.com/DavidLuques/Repacell.git
cd Repacell
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Configurar Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto. Deberás crear un proyecto en Supabase y copiar las siguientes claves desde `Project Settings > API`:
```env
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-de-supabase
```
*(Nota: Además, en Supabase debes crear las tablas correspondientes y un Bucket público llamado `repairs` en Storage).*

### 5. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### 6. Correr los Tests (QA)
El proyecto cuenta con una suite de pruebas para garantizar el correcto funcionamiento de los formularios críticos y el enrutado.
```bash
npm run test
```





This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

