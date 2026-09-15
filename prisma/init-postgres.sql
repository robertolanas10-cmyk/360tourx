-- CreateTable
CREATE TABLE "reservas" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "direccion" TEXT NOT NULL,
    "servicio" TEXT NOT NULL,
    "servicioNombre" TEXT NOT NULL,
    "conHostingWeb" BOOLEAN NOT NULL DEFAULT false,
    "precio" DECIMAL(10,2),
    "fechaVisita" TIMESTAMP(3),
    "horaVisita" TEXT,
    "estadoPago" TEXT NOT NULL DEFAULT 'pendiente',
    "metodoPago" TEXT,
    "stripeId" TEXT,
    "paypalId" TEXT,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "hostingEstado" TEXT,
    "hostingVenceEl" TIMESTAMP(3),
    "estadoTour" TEXT NOT NULL DEFAULT 'pendiente',
    "notas" TEXT,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reservas_stripeSubscriptionId_key" ON "reservas"("stripeSubscriptionId");

-- CreateTable
CREATE TABLE "contactos" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "empresa" TEXT,
    "posicion" TEXT,
    "mensaje" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'contacto',

    CONSTRAINT "contactos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitudes_agencia" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agencia" TEXT NOT NULL,
    "contacto" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "tramo" TEXT NOT NULL,
    "notas" TEXT,
    "importeEstimado" DECIMAL(10,2),
    "estado" TEXT NOT NULL DEFAULT 'nueva',
    CONSTRAINT "solicitudes_agencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inmuebles_solicitud" (
    "id" SERIAL NOT NULL,
    "solicitudId" INTEGER NOT NULL,
    "direccion" TEXT NOT NULL,
    "metros" INTEGER NOT NULL,
    "disponibleDesde" DATE NOT NULL,
    "franja" TEXT NOT NULL,
    "precioEstimado" DECIMAL(10,2),
    CONSTRAINT "inmuebles_solicitud_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "inmuebles_solicitud_solicitudId_idx" ON "inmuebles_solicitud"("solicitudId");

-- AddForeignKey
ALTER TABLE "inmuebles_solicitud" ADD CONSTRAINT "inmuebles_solicitud_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "solicitudes_agencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
