# 🚀 E-Commerce Full-Stack Ecosystem

Este proyecto es una solución integral de comercio electrónico que conecta una **App Móvil nativa** con un potente **Core Backend** y dos **Paneles de Control Web** especializados.

---

## 🛠️ Stack Tecnológico

| **Componente** | **Tecnologías Clave** | **Estado** |
| :--- | :--- | :--- |
| **📱 Mobile App** | ![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![Expo](https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo&logoColor=white) ![Zustand](https://img.shields.io/badge/Zustand-443E38?style=flat-square) | `Functional` |
| **⚙️ Backend API** | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white) ![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=flat-square&logo=clerk&logoColor=white) | `Active` |
| **🔐 Admin Web** | ![React 19](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![Tailwind](https://img.shields.io/badge/Tailwind_4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | `Development` |
| **👥 Employees** | ![DaisyUI](https://img.shields.io/badge/DaisyUI-553C7B?style=flat-square&logo=daisyui&logoColor=white) ![TanStack](https://img.shields.io/badge/TanStack_Query-FF4154?style=flat-square&logo=react-query&logoColor=white) | `Development` |

---

## 🏗️ Arquitectura del Sistema

El ecosistema está diseñado para separar responsabilidades y escalar de forma independiente:

### 1. Mobile (Cliente Final)
* **Auth:** Login social y biométrico con **Clerk**.
* **Store Management:** Carrito de compras reactivo con **Zustand**.
* **UX:** Navegación fluida con **Expo Router** y animaciones de **Reanimated**.

### 2. Backend (El Cerebro)
* **DB:** Persistencia de datos en **MongoDB Atlas**.
* **Media:** Procesamiento de imágenes con **Multer** y hosting en **Cloudinary**.
* **Webhooks:** Sincronización de eventos de usuario mediante **Svix**.

### 3. Dashboards (Gestión)
* **Admin:** Visión 360° del negocio, gestión de roles y analíticas.
* **Employee:** Foco en la logística, stock y actualización de estados de pedidos.

---

## 🔐 Configuración de Seguridad

> [!IMPORTANT]
> El proyecto utiliza **Clerk** para el manejo de sesiones. Asegúrate de configurar los Webhooks en el Dashboard de Clerk apuntando a la ruta `/api/webhooks` del backend para mantener la sincronización de usuarios.

---


### 🚀 Dashboard Admin 
---
<img width="1349" height="540" alt="Captura de pantalla 2026-03-18 173950" src="https://github.com/user-attachments/assets/677dd802-3baf-45f8-9ac2-9e1c92756841" />

---

### 🚀 Dashboard Employes

---

<img width="1358" height="597" alt="Captura de pantalla 2026-03-18 173710" src="https://github.com/user-attachments/assets/15743bc5-1b4d-4679-9af3-45ec2f1463ca" />

## 🚀 Guía de Inicio Rápido

Para levantar todo el ecosistema localmente:

### Paso 1: Variables de Entorno
Crea archivos `.env` en cada carpeta siguiendo el ejemplo:
```env
# Backend / Admin / Employees         
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
MONGO_URI=mongodb+srv://...
CLOUDINARY_URL=cloudinary://...


